# Adapter Pattern

## What is it? (One sentence)

**Adapter lets you use a class with an incompatible interface by wrapping it in a translator.**

---

## Before You Read This

Make sure you understand basic interfaces and classes in TypeScript first!

- **Adapter** is a Structural pattern (about how objects connect together)
- Previous Structural pattern: Decorator was about **adding features by wrapping**
- Adapter is about **making incompatible interfaces work together**

---

## The Problem (Why do we need this?)

Imagine you're building an online store.

You built a payment system with a simple interface:

```typescript
interface PaymentProcessor {
  pay(amount: number): string; // Pay in dollars, get a receipt ID
}

class CreditCardProcessor implements PaymentProcessor {
  pay(amount: number): string {
    console.log(`Credit card: charged $${amount}`);
    return `cc-${Date.now()}`;
  }
}

// Your store uses this everywhere
function checkout(processor: PaymentProcessor, amount: number): void {
  const receipt = processor.pay(amount);
  console.log(`Receipt: ${receipt}`);
}

const processor = new CreditCardProcessor();
checkout(processor, 29.99);
// Credit card: charged $29.99
// Receipt: cc-1234567890
```

Then your boss says: "Add Stripe payments!"

You install the Stripe library. But its API looks completely different:

```typescript
class StripeApi {
  createCharge(
    amountInCents: number,
    currency: string
  ): { chargeId: string; status: string } {
    console.log(`Stripe: charged ${amountInCents} cents (${currency})`);
    return { chargeId: `stripe-${Date.now()}`, status: "succeeded" };
  }
}
```

**The problem: Stripe doesn't fit your `PaymentProcessor` interface.**

| Difference | Your interface | Stripe's API |
|------------|----------------|--------------|
| Method name | `pay()` | `createCharge()` |
| Amount | dollars (29.99) | cents (2999) |
| Parameters | 1 (amount) | 2 (amount, currency) |
| Return type | string | object with chargeId and status |

You can't change Stripe — it's a third-party library.
You can't change `PaymentProcessor` — your whole app uses it.

How do you connect them?

---

## The Solution (How Adapter helps)

Think of a **power plug adapter**.

- Your laptop has a Japanese plug (two flat prongs)
- The wall has a US socket (two flat + one round)
- The shapes don't match — but a small adapter makes them work together
- The plug doesn't change. The socket doesn't change. Only the adapter sits between them.

The Adapter pattern works the same way.

### Step 1: Identify the Target (what your app expects)

This is the interface your app already uses. Don't change it.

```typescript
interface PaymentProcessor {
  pay(amount: number): string;
}
```

### Step 2: Identify the Adaptee (the external API)

This is the class you want to use but can't — because it has a different interface.

```typescript
class StripeApi {
  createCharge(
    amountInCents: number,
    currency: string
  ): { chargeId: string; status: string } {
    console.log(`Stripe: charged ${amountInCents} cents (${currency})`);
    return { chargeId: `stripe-${Date.now()}`, status: "succeeded" };
  }
}
```

### Step 3: Create the Adapter

The adapter implements your interface and translates calls to the external API.

```typescript
class StripeAdapter implements PaymentProcessor {
  private stripe: StripeApi;

  constructor(stripe: StripeApi) {
    this.stripe = stripe;
  }

  pay(amount: number): string {
    // Translate: dollars → cents
    const cents = Math.round(amount * 100);
    // Call Stripe's API with the right format
    const result = this.stripe.createCharge(cents, "usd");
    // Translate: extract the receipt ID from Stripe's response
    return result.chargeId;
  }
}

// --- Use it ---
const stripeApi = new StripeApi();
const processor: PaymentProcessor = new StripeAdapter(stripeApi);
processor.pay(29.99);
// Stripe: charged 2999 cents (usd)
```

The key: your app doesn't know about Stripe. It just calls `pay()`.

### Step 4: Add another adapter

Now your boss says: "Add PayPal too!"

PayPal has yet another different API:

```typescript
class PayPalSdk {
  sendPayment(amountStr: string): { transactionId: string; completed: boolean } {
    console.log(`PayPal: sent $${amountStr}`);
    return { transactionId: `pp-${Date.now()}`, completed: true };
  }
}
```

| Difference | Your interface | PayPal's API |
|------------|----------------|--------------|
| Method name | `pay()` | `sendPayment()` |
| Amount type | number (29.99) | string ("29.99") |
| Return type | string | object with transactionId and completed |

Just create another adapter:

```typescript
class PayPalAdapter implements PaymentProcessor {
  private paypal: PayPalSdk;

  constructor(paypal: PayPalSdk) {
    this.paypal = paypal;
  }

  pay(amount: number): string {
    // Translate: number → string
    const result = this.paypal.sendPayment(amount.toFixed(2));
    // Translate: extract the receipt ID from PayPal's response
    return result.transactionId;
  }
}

// --- Use it ---
const paypalSdk = new PayPalSdk();
const paypalProcessor: PaymentProcessor = new PayPalAdapter(paypalSdk);
paypalProcessor.pay(29.99);
// PayPal: sent $29.99
```

Now your store works with three payment methods — all through the same `PaymentProcessor` interface. No existing code changes!

---

## Visual Explanation

```
REAL WORLD:

  Japanese Plug ──→ [ Adapter ] ──→ US Socket
  (2 flat prongs)   (translates)   (2 flat + 1 round)

  The plug doesn't change.
  The socket doesn't change.
  The adapter makes them work together.

IN CODE:

  Your App ──→ [ StripeAdapter ] ──→ StripeApi
  pay(29.99)    (translates)        createCharge(2999, "usd")


HOW IT CONNECTS:

  ┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
  │   Your App   │     │  StripeAdapter   │     │    StripeApi     │
  │              │     │                  │     │                  │
  │  Calls:      │     │  Translates:     │     │  Actual work:    │
  │  pay(29.99) ─┼────►│  29.99 → 2999   ├────►│  createCharge(   │
  │              │     │  adds "usd"      │     │    2999, "usd")  │
  │              │     │                  │     │                  │
  │  Receives:   │     │  Translates:     │     │  Returns:        │
  │  "stripe-123"│◄────┤  extracts id     │◄────┤  { chargeId,    │
  │              │     │  from result     │     │    status }      │
  └──────────────┘     └──────────────────┘     └──────────────────┘

KEY INSIGHT:
- Your app only knows about PaymentProcessor
- The adapter handles ALL the translation
- Adding a new payment method = adding one new adapter class
- No existing code changes!
```

---

## Complete Example

```typescript
// ============================================
// TARGET INTERFACE
// ============================================

interface PaymentProcessor {
  pay(amount: number): string; // Pay in dollars, get a receipt ID
}

// ============================================
// EXISTING IMPLEMENTATION
// ============================================

class CreditCardProcessor implements PaymentProcessor {
  pay(amount: number): string {
    console.log(`  Credit card: charged $${amount}`);
    return `cc-${Date.now()}`;
  }
}

// ============================================
// EXTERNAL APIS (Adaptees — you can't change these)
// ============================================

class StripeApi {
  createCharge(
    amountInCents: number,
    currency: string
  ): { chargeId: string; status: string } {
    console.log(`  Stripe: charged ${amountInCents} cents (${currency})`);
    return { chargeId: `stripe-${Date.now()}`, status: "succeeded" };
  }
}

class PayPalSdk {
  sendPayment(amountStr: string): { transactionId: string; completed: boolean } {
    console.log(`  PayPal: sent $${amountStr}`);
    return { transactionId: `pp-${Date.now()}`, completed: true };
  }
}

// ============================================
// ADAPTERS
// ============================================

class StripeAdapter implements PaymentProcessor {
  private stripe: StripeApi;

  constructor(stripe: StripeApi) {
    this.stripe = stripe;
  }

  pay(amount: number): string {
    const cents = Math.round(amount * 100);
    const result = this.stripe.createCharge(cents, "usd");
    return result.chargeId;
  }
}

class PayPalAdapter implements PaymentProcessor {
  private paypal: PayPalSdk;

  constructor(paypal: PayPalSdk) {
    this.paypal = paypal;
  }

  pay(amount: number): string {
    const result = this.paypal.sendPayment(amount.toFixed(2));
    return result.transactionId;
  }
}

// ============================================
// USAGE — All three work through the same interface
// ============================================

function checkout(processor: PaymentProcessor, amount: number): void {
  const receipt = processor.pay(amount);
  console.log(`  Receipt: ${receipt}`);
}

// Credit card (original — no adapter needed)
checkout(new CreditCardProcessor(), 29.99);
// Credit card: charged $29.99
// Receipt: cc-1234567890

// Stripe (through adapter)
checkout(new StripeAdapter(new StripeApi()), 29.99);
// Stripe: charged 2999 cents (usd)
// Receipt: stripe-1234567890

// PayPal (through adapter)
checkout(new PayPalAdapter(new PayPalSdk()), 29.99);
// PayPal: sent $29.99
// Receipt: pp-1234567890
```

---

## Real-World Use Cases

### 1. Database Drivers

Your app uses one interface to talk to any database. Each database driver is an adapter.

```typescript
// Your app uses this interface
interface Database {
  query(sql: string): Row[];
}

// MySQL driver: adapts MySQL's protocol to your interface
// PostgreSQL driver: adapts PostgreSQL's protocol to your interface
// Each driver is an adapter!
```

### 2. Logging Libraries

Different logging libraries have different APIs. An adapter gives them a common interface.

```
Your app          Winston adapter      Winston library
log("hello") ──→  translate()    ────→ winston.info("hello")

Your app          Pino adapter         Pino library
log("hello") ──→  translate()    ────→ pino.info({ msg: "hello" })
```

### 3. API Response Normalization

Different APIs return data in different formats. Adapters normalize them.

```typescript
// Google Maps returns: { lat: 35.6, lng: 139.7 }
// Mapbox returns:      { latitude: 35.6, longitude: 139.7 }
// Your app expects:    { x: 35.6, y: 139.7 }

// Each adapter converts the external format to your format
```

### 4. Legacy Code Integration

When old code has a different interface from new code, an adapter bridges the gap.

```typescript
// Old system: getUser(id) returns { first_name, last_name }
// New system: getUser(id) returns { fullName }

// Adapter: combines first_name + last_name into fullName
```

---

## Adapter vs Other Patterns

| Aspect | Adapter | Decorator | Facade |
|--------|---------|-----------|--------|
| **Purpose** | Make incompatible interfaces work together | Add features by wrapping | Simplify a complex system |
| **Changes interface?** | Yes — converts one to another | No — keeps the same interface | Yes — creates a simpler one |
| **Wraps** | One object with a DIFFERENT interface | One object with the SAME interface | Multiple objects |
| **Pattern type** | Structural | Structural | Structural |

### Easy Explanation

**Adapter** is like a power plug converter:
```
Japanese plug → adapter → US socket
Makes two different shapes fit together.
```

**Decorator** is like gift wrapping:
```
Box → wrap in paper → add ribbon
Each layer adds something. Same shape throughout.
```

**Facade** is like a hotel front desk:
```
Guest → front desk → (housekeeping, room service, maintenance)
One simple contact point for many complex services.
```

**The #1 insight:**
- **Adapter** → **TRANSLATE** between different interfaces
- **Decorator** → **ADD** behavior (stack layers, same interface)
- **Facade** → **SIMPLIFY** a complex system (new simple interface)

---

## Anti-patterns

### 1. Fat Adapter — Adding business logic to the adapter

An adapter should ONLY translate between interfaces. It should not add validation, discounts, or extra features. Put business logic somewhere else.

**Bad — adapter does more than translating:**
```typescript
class FatStripeAdapter implements PaymentProcessor {
  private stripe: StripeApi;

  constructor(stripe: StripeApi) {
    this.stripe = stripe;
  }

  pay(amount: number): string {
    // Business logic doesn't belong here!
    if (amount > 10000) {
      throw new Error("Amount too large");
    }
    const discount = amount > 100 ? amount * 0.95 : amount;

    const cents = Math.round(discount * 100);
    const result = this.stripe.createCharge(cents, "usd");
    return result.chargeId;
  }
}
```

**Better — adapter only translates:**
```typescript
class CleanStripeAdapter implements PaymentProcessor {
  private stripe: StripeApi;

  constructor(stripe: StripeApi) {
    this.stripe = stripe;
  }

  pay(amount: number): string {
    // Only translation logic here
    const cents = Math.round(amount * 100);
    const result = this.stripe.createCharge(cents, "usd");
    return result.chargeId;
  }
}
```

### 2. Unnecessary Adapter — Using Adapter when the interfaces already match

If two interfaces are almost the same, don't create an adapter. Just implement the interface directly. Adapter is for interfaces you CANNOT change (external libraries, legacy systems).

**Bad — the adapter does nothing useful:**
```typescript
interface Logger {
  log(message: string): void;
}

class MyLogger {
  log(message: string): void {
    console.log(message);
  }
}

// This adapter just passes through — pointless!
class UselessAdapter implements Logger {
  private myLogger: MyLogger;

  constructor(myLogger: MyLogger) {
    this.myLogger = myLogger;
  }

  log(message: string): void {
    this.myLogger.log(message); // Same name, same parameters!
  }
}
```

**Better — just implement the interface directly:**
```typescript
interface Logger {
  log(message: string): void;
}

class MyLogger implements Logger {
  log(message: string): void {
    console.log(message);
  }
}
```

### 3. Modifying the Adaptee — Changing the external API to fit

The whole point of Adapter is that you CAN'T change the external API. If you change it, you'll lose your changes when the library updates.

**Bad — changed Stripe's API directly:**
```typescript
// DON'T modify the external library!
class StripeApi {
  // Added pay() method to Stripe's code... bad idea
  pay(amount: number): string {
    const cents = Math.round(amount * 100);
    const result = this.createCharge(cents, "usd");
    return result.chargeId;
  }

  createCharge(amountInCents: number, currency: string) {
    /* ... original Stripe code ... */
  }
}
```

Why this is bad:
- You'll lose your changes when Stripe updates
- Other code that uses Stripe expects the original API
- It breaks the "don't modify what you don't own" rule

**Better — use an adapter (Stripe stays untouched):**
```typescript
class StripeAdapter implements PaymentProcessor {
  constructor(private stripe: StripeApi) {}

  pay(amount: number): string {
    const cents = Math.round(amount * 100);
    const result = this.stripe.createCharge(cents, "usd");
    return result.chargeId;
  }
}
```

### 4. Leaking Adaptee Details — Exposing the external API through the adapter

The adapter should completely hide the adaptee. If outside code can access Stripe directly, the adapter isn't doing its job.

**Bad — Stripe details leak out:**
```typescript
class LeakyAdapter implements PaymentProcessor {
  stripe: StripeApi; // Public! Anyone can access Stripe directly

  constructor(stripe: StripeApi) {
    this.stripe = stripe;
  }

  pay(amount: number): string {
    const cents = Math.round(amount * 100);
    const result = this.stripe.createCharge(cents, "usd");
    return result.chargeId;
  }

  // Exposes Stripe-specific method — defeats the purpose!
  getChargeStatus(chargeId: string): string {
    return "succeeded";
  }
}
```

**Better — hide the adaptee completely:**
```typescript
class CleanAdapter implements PaymentProcessor {
  private stripe: StripeApi; // Private — hidden from outside

  constructor(stripe: StripeApi) {
    this.stripe = stripe;
  }

  pay(amount: number): string {
    const cents = Math.round(amount * 100);
    const result = this.stripe.createCharge(cents, "usd");
    return result.chargeId;
  }
  // No Stripe-specific methods exposed
}
```

---

## When to Use Adapter?

### Use Adapter When...

| Situation | Why |
|-----------|-----|
| **You need to use a library with a different interface** | The adapter translates between your code and the library |
| **You're integrating a legacy system** | Old code has old interfaces — adapt them to new ones |
| **You want to swap external services easily** | Each service gets its own adapter behind one interface |
| **You can't change the external code** | Adapter is the only option when you don't own the code |

### Don't Use Adapter When...

| Situation | Why |
|-----------|-----|
| **The interfaces are already similar** | Just implement the interface directly |
| **You can change the external code** | Change it directly — simpler than adding an adapter |
| **You need to add behavior, not translate** | Use Decorator instead |
| **You need to simplify many classes** | Use Facade instead |

---

## Key Vocabulary

| Word | Meaning |
|------|---------|
| **Target** | The interface your app expects (e.g., PaymentProcessor) |
| **Adaptee** | The external class with an incompatible interface (e.g., StripeApi) |
| **Adapter** | The wrapper that translates between Target and Adaptee (e.g., StripeAdapter) |
| **Client** | The code that uses the Target interface (e.g., checkout function) |
| **Incompatible interface** | When two classes have different method names, parameters, or return types |
| **Wrapping** | Putting one object inside another to translate its interface |

---

## Quick Quiz

1. What is the difference between Adapter and Decorator?
2. Should you put business logic in an adapter? Why or why not?
3. What are the three roles in the Adapter pattern?
4. When should you NOT use an adapter?
5. Why does the adapter implement the Target interface, not extend the Adaptee?

<details>
<summary>Answers</summary>

1. Adapter translates between different interfaces. Decorator adds behavior while keeping the same interface.
2. No. An adapter should only translate. Business logic belongs elsewhere.
3. Target (the interface your app expects), Adaptee (the external class), Adapter (the translator).
4. When the interfaces are already compatible, or when you can change the external code directly.
5. Because the adapter needs to look like the Target to the rest of the code. The whole point is that client code calls Target methods, and the adapter translates those into Adaptee calls.

</details>

---

## Summary

**Adapter Pattern in 30 seconds:**
- You have code that expects interface A
- You want to use a class that has interface B
- You can't change either one
- Create an adapter: implements A, wraps B, translates between them
- Use when: integrating external libraries, legacy systems, or third-party APIs

---

## Try It Yourself

1. Read the code in `code/` folder
2. Create a `SquareAdapter` that makes a `Square` class (with `setSide()`) work as a `Rectangle` interface (with `setWidth()` and `setHeight()`)
3. Create an adapter for a fictional `TwilioApi` that has `sendSms(phoneNumber: string, body: string): { sid: string }`
4. What happens if two external APIs need different constructor arguments? How does the adapter handle this?
5. Can you create an adapter that works with TWO adaptees at the same time? When would this be useful?
