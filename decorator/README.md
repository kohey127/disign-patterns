# Decorator Pattern

## What is it? (One sentence)

**Decorator lets you add new behavior to an object by wrapping it, without changing the original object or creating many subclasses.**

---

## Before You Read This

Make sure you understand basic interfaces and classes in TypeScript first!

- **Decorator** is a Structural pattern (about how objects are composed together)
- This is the first Structural pattern in this repository
- Previous patterns: Strategy was about **choosing an algorithm**, Observer was about **reacting to changes**
- Decorator is about **adding features by wrapping objects**

---

## The Problem (Why do we need this?)

Imagine you're building a notification system.

You start with a simple notifier that sends plain text messages.

```typescript
class SimpleNotifier {
  send(message: string): void {
    console.log(`[Send] ${message}`);
  }
}

const notifier = new SimpleNotifier();
notifier.send("Server is running.");
// [Send] Server is running.
```

Then your team asks for more features:
- **Timestamp** — add the date and time before the message
- **Urgent** — make the message UPPERCASE with an "URGENT:" prefix
- **Emoji** — add an emoji like "🔔" before the message

**The naive approach — one subclass for each combination:**

```typescript
class TimestampNotifier { /* ... */ }
class UrgentNotifier { /* ... */ }
class EmojiNotifier { /* ... */ }
class TimestampUrgentNotifier { /* ... */ }
class TimestampEmojiNotifier { /* ... */ }
class UrgentEmojiNotifier { /* ... */ }
class TimestampUrgentEmojiNotifier { /* ... */ }
```

**Problems:**

1. **Subclass explosion** — 3 features need 7 subclasses (2^3 - 1). Add a 4th feature? 15 subclasses!
2. **Hard to extend** — Every new feature doubles the number of classes
3. **Can't combine at runtime** — You must decide the combination when you write the code
4. **Lots of duplicated code** — Each subclass repeats similar logic

---

## The Solution (How Decorator helps)

Think of **gift wrapping**.

- You have a **box** (the original object)
- You wrap it in **paper** (first decorator)
- You add a **ribbon** (second decorator)
- You attach a **tag** (third decorator)
- At every step, it's still a "gift" — it has the same shape

The Decorator pattern works the same way. Each decorator wraps the original object and adds one feature.

### Step 1: Define a common interface

All notifiers — plain or decorated — share the same interface.

```typescript
interface Notifier {
  send(message: string): void;
  getDescription(): string;
}
```

### Step 2: Create the plain notifier

This is the "box" — the starting point with no decoration.

```typescript
class SimpleNotifier implements Notifier {
  send(message: string): void {
    console.log(`[Send] ${message}`);
  }

  getDescription(): string {
    return "SimpleNotifier";
  }
}
```

### Step 3: Create a base decorator

The base decorator wraps a `Notifier` and delegates all calls to it. On its own, it changes nothing. Concrete decorators extend it.

```typescript
abstract class NotifierDecorator implements Notifier {
  constructor(protected wrapped: Notifier) {}

  send(message: string): void {
    this.wrapped.send(message);
  }

  getDescription(): string {
    return this.wrapped.getDescription();
  }
}
```

### Step 4: Create your first decorator

`TimestampDecorator` changes the message, then passes it to the wrapped notifier.

```typescript
class TimestampDecorator extends NotifierDecorator {
  send(message: string): void {
    const now = new Date().toLocaleString();
    const decorated = `[${now}] ${message}`;
    // Pass the decorated message to the wrapped notifier
    this.wrapped.send(decorated);
  }

  getDescription(): string {
    return `TimestampDecorator(${this.wrapped.getDescription()})`;
  }
}

// --- Use it ---
const notifier: Notifier = new TimestampDecorator(new SimpleNotifier());
notifier.send("Server is running.");
// [Send] [1/15/2024, 10:30:00 AM] Server is running.
```

### Step 5: Stack decorators

Each decorator wraps the previous one. Build from inside out.

```typescript
class UrgentDecorator extends NotifierDecorator {
  send(message: string): void {
    const decorated = `URGENT: ${message.toUpperCase()}`;
    this.wrapped.send(decorated);
  }

  getDescription(): string {
    return `UrgentDecorator(${this.wrapped.getDescription()})`;
  }
}

// --- Stack: SimpleNotifier → Timestamp → Urgent ---
const stacked: Notifier = new UrgentDecorator(
  new TimestampDecorator(
    new SimpleNotifier()
  )
);

stacked.send("Deploy failed.");
// [Send] [1/15/2024, 10:30:00 AM] URGENT: DEPLOY FAILED.
```

What happens step by step:
1. `UrgentDecorator.send("Deploy failed.")` — makes it `"URGENT: DEPLOY FAILED."` and passes inward
2. `TimestampDecorator.send("URGENT: DEPLOY FAILED.")` — adds timestamp before it and passes inward
3. `SimpleNotifier.send("[1/15/2024, 10:30:00 AM] URGENT: DEPLOY FAILED.")` — prints it

---

## Visual Explanation

```
HOW DECORATION WORKS:

  You call send("Hello") on the outermost decorator.
  Each layer changes the message, then passes it inward.

  ┌──────────────────────────────────────────────┐
  │  EmojiDecorator                              │
  │  send("Hello")                               │
  │  → adds "🔔 " → passes "🔔 Hello" inward    │
  │                                              │
  │  ┌──────────────────────────────────────┐    │
  │  │  UrgentDecorator                     │    │
  │  │  send("🔔 Hello")                    │    │
  │  │  → uppercase + prefix                │    │
  │  │  → passes "URGENT: 🔔 HELLO" inward  │    │
  │  │                                      │    │
  │  │  ┌──────────────────────────────┐    │    │
  │  │  │  TimestampDecorator          │    │    │
  │  │  │  send("URGENT: 🔔 HELLO")    │    │    │
  │  │  │  → adds "[10:30]" prefix     │    │    │
  │  │  │                              │    │    │
  │  │  │  ┌──────────────────────┐    │    │    │
  │  │  │  │  SimpleNotifier      │    │    │    │
  │  │  │  │  send(final message) │    │    │    │
  │  │  │  │  → prints it!        │    │    │    │
  │  │  │  └──────────────────────┘    │    │    │
  │  │  └──────────────────────────────┘    │    │
  │  └──────────────────────────────────────┘    │
  └──────────────────────────────────────────────┘

KEY INSIGHT:
- Every layer has the same interface (Notifier)
- Each layer adds ONE feature
- You can wrap as many layers as you want
- Code that calls send() doesn't know about the layers
```

---

## Complete Example

```typescript
// ============================================
// INTERFACE
// ============================================

interface Notifier {
  send(message: string): void;
  getDescription(): string;
}

// ============================================
// CONCRETE COMPONENT
// ============================================

class SimpleNotifier implements Notifier {
  send(message: string): void {
    console.log(`[Send] ${message}`);
  }

  getDescription(): string {
    return "SimpleNotifier";
  }
}

// ============================================
// BASE DECORATOR
// ============================================

abstract class NotifierDecorator implements Notifier {
  constructor(protected wrapped: Notifier) {}

  send(message: string): void {
    this.wrapped.send(message);
  }

  getDescription(): string {
    return this.wrapped.getDescription();
  }
}

// ============================================
// CONCRETE DECORATORS
// ============================================

class TimestampDecorator extends NotifierDecorator {
  send(message: string): void {
    const now = new Date().toLocaleString();
    const decorated = `[${now}] ${message}`;
    this.wrapped.send(decorated);
  }

  getDescription(): string {
    return `TimestampDecorator(${this.wrapped.getDescription()})`;
  }
}

class UrgentDecorator extends NotifierDecorator {
  send(message: string): void {
    const decorated = `URGENT: ${message.toUpperCase()}`;
    this.wrapped.send(decorated);
  }

  getDescription(): string {
    return `UrgentDecorator(${this.wrapped.getDescription()})`;
  }
}

class EmojiDecorator extends NotifierDecorator {
  private emoji: string;

  constructor(wrapped: Notifier, emoji: string = "🔔") {
    super(wrapped);
    this.emoji = emoji;
  }

  send(message: string): void {
    const decorated = `${this.emoji} ${message}`;
    this.wrapped.send(decorated);
  }

  getDescription(): string {
    return `EmojiDecorator(${this.wrapped.getDescription()})`;
  }
}

// ============================================
// USAGE
// ============================================

// Plain — no decoration
const plain: Notifier = new SimpleNotifier();
plain.send("Server is running.");
// [Send] Server is running.

// One layer — add timestamp
const stamped: Notifier = new TimestampDecorator(new SimpleNotifier());
stamped.send("Server is running.");
// [Send] [1/15/2024, 10:30:00 AM] Server is running.

// Three layers — stack decorators
const full: Notifier = new EmojiDecorator(
  new UrgentDecorator(
    new TimestampDecorator(
      new SimpleNotifier()
    )
  ),
  "🚨"
);
full.send("Database connection lost!");
// [Send] [1/15/2024, 10:30:00 AM] URGENT: 🚨 DATABASE CONNECTION LOST!

// Check the decoration chain
console.log(full.getDescription());
// EmojiDecorator(UrgentDecorator(TimestampDecorator(SimpleNotifier)))
```

---

## Real-World Use Cases

### 1. Express Middleware (You Probably Use This!)

Express middleware works like decorators. Each middleware wraps the request handling and adds one feature.

```typescript
// Each middleware adds one layer of behavior
app.use(logging);        // → logs the request
app.use(authentication); // → checks the token
app.use(compression);    // → compresses the response
app.use(router);         // → handles the actual request (the "core")
```

### 2. Java I/O Streams

Java's I/O library is a classic example of Decorator pattern.

```
new BufferedReader(        // Decorator: adds buffering
  new InputStreamReader(   // Decorator: converts bytes to characters
    new FileInputStream()  // Core: reads raw bytes from a file
  )
)
```

### 3. React Higher-Order Components (HOC)

HOCs wrap a component and add extra behavior.

```typescript
// Each HOC adds one feature to the base component
const EnhancedComponent = withAuth(   // Decorator: adds login check
  withLogging(                         // Decorator: adds logging
    withTheme(                         // Decorator: adds theme
      BaseComponent                    // Core component
    )
  )
);
```

### 4. Logging and Metrics

```typescript
// Wrap an API client with logging and retry logic
const client = new LoggingDecorator(
  new RetryDecorator(
    new HttpClient()
  )
);
// LoggingDecorator logs every request
// RetryDecorator retries on failure
// HttpClient makes the actual HTTP call
```

---

## Decorator vs Other Patterns

| Aspect | Decorator | Strategy | Adapter |
|--------|-----------|----------|---------|
| **Purpose** | Add features by wrapping | Choose one algorithm | Make incompatible interfaces work together |
| **How it works** | Same interface, wraps object | Same interface, swaps behavior | Different interface, translates calls |
| **Number of layers** | Many (stackable) | One at a time | One |
| **Changes what?** | Adds behavior | Replaces behavior | Translates behavior |
| **Pattern type** | Structural | Behavioral | Structural |

### Easy Explanation

**Decorator** is like gift wrapping:
```
Box → wrap in paper → add ribbon → attach tag
Each layer adds something. The box is still inside.
```

**Strategy** is like choosing a chef:
```
Restaurant gets an order → delegates to ONE chef
You swap the chef, not add layers.
```

**Adapter** is like a power plug converter:
```
US plug → adapter → EU socket
Makes two different shapes fit together.
```

**The #1 insight:**
- **Decorator** → **ADD** behavior (stack layers)
- **Strategy** → **SWAP** behavior (one at a time)
- **Adapter** → **TRANSLATE** between different interfaces

---

## Anti-patterns

### 1. Broken Chain — Forgetting to delegate to the wrapped object

A decorator must call `this.wrapped.send()` to pass the message to the next layer. If it skips this call, the chain breaks. Inner decorators and the original component never run. There is no compile error — the code just silently produces wrong behavior.

**Bad — chain is broken:**
```typescript
class BrokenDecorator extends NotifierDecorator {
  send(message: string): void {
    const decorated = `[LOG] ${message}`;
    console.log(decorated); // Sends directly — inner layers never run!
  }

  getDescription(): string {
    return "BrokenDecorator";
  }
}
```

**Better — delegate to the wrapped object:**
```typescript
class FixedDecorator extends NotifierDecorator {
  send(message: string): void {
    const decorated = `[LOG] ${message}`;
    this.wrapped.send(decorated); // Pass to the next layer
  }

  getDescription(): string {
    return `FixedDecorator(${this.wrapped.getDescription()})`;
  }
}
```

### 2. Concrete Coupling — Depending on a specific class, not the interface

A decorator must depend on the **interface** (`Notifier`), not a specific class (`SimpleNotifier`). If it depends on a concrete class, it cannot wrap other decorators. This defeats the entire purpose of the pattern.

**Bad — only works with SimpleNotifier:**
```typescript
class BadDecorator {
  constructor(private wrapped: SimpleNotifier) {} // Too specific!

  send(message: string): void {
    console.log(`[LOG] ${message}`);
    this.wrapped.send(message);
  }
}

// Cannot stack:
// new BadDecorator(new TimestampDecorator(...)) // Type error!
```

**Better — depends on the interface:**
```typescript
class GoodDecorator extends NotifierDecorator {
  constructor(wrapped: Notifier) { // Works with ANY Notifier
    super(wrapped);
  }

  send(message: string): void {
    console.log(`[LOG] ${message}`);
    this.wrapped.send(message);
  }

  getDescription(): string {
    return `GoodDecorator(${this.wrapped.getDescription()})`;
  }
}
```

### 3. Subclass Explosion — Using inheritance instead of Decorator

If you add features by creating subclasses, the number of classes grows very fast. With N features, you need up to 2^N subclasses. This is called **Subclass Explosion** — the exact problem the Decorator pattern solves.

**Bad — 7 classes for 3 features (2^3 - 1):**
```typescript
class TimestampNotifier extends SimpleNotifier { /* ... */ }
class UrgentNotifier extends SimpleNotifier { /* ... */ }
class EmojiNotifier extends SimpleNotifier { /* ... */ }
class TimestampUrgentNotifier extends SimpleNotifier { /* ... */ }
class TimestampEmojiNotifier extends SimpleNotifier { /* ... */ }
class UrgentEmojiNotifier extends SimpleNotifier { /* ... */ }
class TimestampUrgentEmojiNotifier extends SimpleNotifier { /* ... */ }
```

**Better — 3 decorator classes, combine freely:**
```typescript
const notifier: Notifier = new EmojiDecorator(
  new UrgentDecorator(
    new TimestampDecorator(
      new SimpleNotifier()
    )
  )
);
// 3 classes cover ALL combinations.
```

### 4. Undocumented Order Sensitivity — Order matters but is not documented

The order of decorators changes the result. The outermost decorator runs first. If the code does not document or enforce the correct order, developers will stack them wrong and get silent bugs.

**Example — order changes the output:**
```typescript
// Order A: UrgentDecorator(TimestampDecorator(SimpleNotifier))
// Urgent runs first → "URGENT: DEPLOY FAILED."
// Timestamp runs next → "[10:30] URGENT: DEPLOY FAILED."

// Order B: TimestampDecorator(UrgentDecorator(SimpleNotifier))
// Timestamp runs first → "[10:30] Deploy failed."
// Urgent runs next → "URGENT: [10:30] DEPLOY FAILED."
// The timestamp itself gets uppercased!
```

**Better — use a builder to enforce order:**
```typescript
class NotifierBuilder {
  private notifier: Notifier = new SimpleNotifier();

  withTimestamp(): this {
    this.notifier = new TimestampDecorator(this.notifier);
    return this;
  }

  withUrgent(): this {
    this.notifier = new UrgentDecorator(this.notifier);
    return this;
  }

  build(): Notifier {
    return this.notifier;
  }
}

// Builder documents and enforces the intended order
const notifier = new NotifierBuilder().withTimestamp().withUrgent().build();
```

### 5. Decorator Explosion — Too many tiny decorators

Splitting behavior too finely creates deep chains that are hard to read and debug. Each decorator adds a layer to the stack trace (the error message list when something fails). The GoF book warns: "Decorator often results in systems composed of lots of little objects that all look alike."

**Bad — 6 decorators for simple formatting:**
```typescript
const notifier = new NewlineDecorator(
  new TrimDecorator(
    new LowercaseDecorator(
      new PrefixDecorator(
        new SuffixDecorator(
          new PaddingDecorator(
            new SimpleNotifier()
          )
        )
      )
    )
  )
);
```

**Better — group related behavior into one decorator:**
```typescript
class FormattingDecorator extends NotifierDecorator {
  send(message: string): void {
    const formatted = message.trim().toLowerCase();
    this.wrapped.send(formatted);
  }

  getDescription(): string {
    return `FormattingDecorator(${this.wrapped.getDescription()})`;
  }
}
```

Each decorator should be one **meaningful feature**, not one string operation.
---

## When to Use Decorator?

### Use Decorator When...

| Situation | Why |
|-----------|-----|
| **You need to combine features freely** | Stack decorators in any order |
| **New features should not change existing code** | Just add a new decorator class |
| **You want to add/remove behavior at runtime** | Wrap or unwrap dynamically |
| **Inheritance would cause too many subclasses** | Decorator avoids subclass explosion |

### Don't Use Decorator When...

| Situation | Why |
|-----------|-----|
| **Only one fixed combination is needed** | A simple subclass is enough |
| **The order of operations must be strict** | Decorator order is easy to get wrong |
| **The object's interface is very large** | Every decorator must implement all methods |
| **You need to remove a decorator from the middle** | Decorator chains are hard to modify after creation |

---

## Key Vocabulary

| Word | Meaning |
|------|---------|
| **Component** | The interface that both the original and decorators share |
| **Concrete Component** | The original object (e.g., SimpleNotifier) |
| **Decorator** | A wrapper that adds behavior and delegates to the wrapped object |
| **Wrapping** | Putting one object inside another that has the same interface |
| **Delegation** | When a decorator calls the wrapped object's method |
| **Composition** | Building complex behavior by combining simple objects (instead of inheritance) |

---

## Quick Quiz

1. How is Decorator different from creating a subclass?
2. What happens if a decorator forgets to call `this.wrapped.send()`?
3. Why does the order of decorators matter?
4. Can you use the same decorator type twice in one chain?
5. What is "subclass explosion" and how does Decorator solve it?

<details>
<summary>Answers</summary>

1. Subclasses add behavior at compile time and can't be combined freely. Decorators wrap at runtime and can be stacked in any order.
2. The chain breaks — the inner layers never get called, so their behavior is lost.
3. Each decorator changes the message before passing it inward. Different order means different transformations happen first.
4. Yes! For example, you can wrap with EmojiDecorator twice to add two different emojis.
5. With N features, subclasses need up to 2^N combinations. Decorator needs only N extra classes — one per feature.

</details>

---

## Summary

**Decorator Pattern in 30 seconds:**
- Define a common interface for the original object and all decorators
- Create a base decorator that wraps a component and delegates all calls
- Each concrete decorator adds ONE feature, then delegates to the wrapped object
- Stack decorators like layers of gift wrapping — any order, any combination
- Use when: you need flexible combinations of features without subclass explosion

---

## Try It Yourself

1. Read the code in `code/` folder
2. Create a `FilterDecorator` that blocks messages containing certain words (e.g., "spam")
3. Create a `RepeatDecorator` that calls `send()` N times
4. Build a chain of 5 decorators and use `getDescription()` to visualize the order
5. Try removing a decorator from the middle — why is this hard?
