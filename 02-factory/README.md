# Factory Pattern

## What is it? (One sentence)

**Factory Pattern lets you create objects without specifying the exact class to create.**

---

## The Problem (Why do we need this?)

Imagine you're building a notification system for an app.

You need to send notifications via Email, SMS, and Push. The naive approach:

```typescript
// In your code, scattered everywhere...
function notifyUser(user: User, type: string, message: string) {
  if (type === "email") {
    const notification = new EmailNotification();
    notification.setRecipient(user.email);
    notification.setMessage(message);
    notification.send();
  } else if (type === "sms") {
    const notification = new SMSNotification();
    notification.setRecipient(user.phone);
    notification.setMessage(message);
    notification.send();
  } else if (type === "push") {
    const notification = new PushNotification();
    notification.setRecipient(user.deviceId);
    notification.setMessage(message);
    notification.send();
  }
}
```

**Problems with this approach:**

1. **Code duplication** - This if/else logic repeats everywhere you create notifications
2. **Hard to change** - Adding a new type (e.g., Slack) means changing EVERY place that creates notifications
3. **Tight coupling** - Your code knows about ALL notification types
4. **Hard to test** - Can't easily swap real notifications with fake ones

---

## The Solution (How Factory helps)

Move object creation logic to a **single place** — the Factory.

```typescript
// Factory handles ALL the creation logic
class NotificationFactory {
  create(type: string, recipient: string): Notification {
    if (type === "email") return new EmailNotification(recipient);
    if (type === "sms")   return new SMSNotification(recipient);
    if (type === "push")  return new PushNotification(recipient);
    throw new Error(`Unknown notification type: ${type}`);
  }
}

// Your code becomes simple:
function notifyUser(user: User, type: string, message: string) {
  const factory = new NotificationFactory();
  const notification = factory.create(type, user.getContact(type));
  notification.setMessage(message);
  notification.send();
}
```

**Benefits:**

1. **Single place to change** - Adding Slack? Just update the Factory
2. **Loose coupling** - Your code only knows about the `Notification` interface
3. **Easy to test** - Swap the Factory with a TestFactory that creates mock notifications

---

## How to Make a Factory (3 Steps)

### Step 1: Define a common interface

All products must share the same interface.

```typescript
// All notifications can do these things
interface Notification {
  setMessage(message: string): void;
  send(): void;
}
```

### Step 2: Create concrete classes

Each class implements the interface.

```typescript
class EmailNotification implements Notification {
  constructor(private email: string) {}

  setMessage(message: string): void {
    this.message = message;
  }

  send(): void {
    console.log(`Sending EMAIL to ${this.email}: ${this.message}`);
  }
}

class SMSNotification implements Notification {
  constructor(private phone: string) {}

  setMessage(message: string): void {
    this.message = message;
  }

  send(): void {
    console.log(`Sending SMS to ${this.phone}: ${this.message}`);
  }
}
```

### Step 3: Create the Factory

The Factory decides which class to instantiate.

```typescript
class NotificationFactory {
  create(type: string, recipient: string): Notification {
    switch (type) {
      case "email": return new EmailNotification(recipient);
      case "sms":   return new SMSNotification(recipient);
      case "push":  return new PushNotification(recipient);
      default:      throw new Error(`Unknown type: ${type}`);
    }
  }
}
```

---

## Complete Example

```typescript
// ============================================
// Step 1: Common interface
// ============================================
interface Notification {
  send(message: string): void;
}

// ============================================
// Step 2: Concrete implementations
// ============================================
class EmailNotification implements Notification {
  constructor(private email: string) {}

  send(message: string): void {
    console.log(`EMAIL to ${this.email}: ${message}`);
  }
}

class SMSNotification implements Notification {
  constructor(private phone: string) {}

  send(message: string): void {
    console.log(`SMS to ${this.phone}: ${message}`);
  }
}

class PushNotification implements Notification {
  constructor(private deviceId: string) {}

  send(message: string): void {
    console.log(`PUSH to device ${this.deviceId}: ${message}`);
  }
}

// ============================================
// Step 3: Factory
// ============================================
class NotificationFactory {
  create(type: string, recipient: string): Notification {
    switch (type) {
      case "email": return new EmailNotification(recipient);
      case "sms":   return new SMSNotification(recipient);
      case "push":  return new PushNotification(recipient);
      default:      throw new Error(`Unknown notification type: ${type}`);
    }
  }
}

// ============================================
// Usage
// ============================================
const factory = new NotificationFactory();

const email = factory.create("email", "user@example.com");
email.send("Welcome to our app!");

const sms = factory.create("sms", "+1-234-567-8900");
sms.send("Your code is 123456");

const push = factory.create("push", "device-abc-123");
push.send("You have a new message!");
```

---

## Visual Explanation

```
WITHOUT Factory:
┌─────────────────────────────────────────────────────────┐
│  Your Code                                              │
│                                                         │
│  if (type === "email") new EmailNotification()         │
│  if (type === "sms")   new SMSNotification()           │
│  if (type === "push")  new PushNotification()          │
│                                                         │
│  → Your code knows about ALL classes                    │
│  → This logic is duplicated everywhere                  │
└─────────────────────────────────────────────────────────┘

WITH Factory:
┌─────────────────────────────────────────────────────────┐
│  Your Code                                              │
│                                                         │
│  factory.create(type, recipient)                        │
│      │                                                  │
│      ▼                                                  │
│  ┌──────────────────────────────────┐                   │
│  │  NotificationFactory             │                   │
│  │                                  │                   │
│  │  "email" → EmailNotification     │                   │
│  │  "sms"   → SMSNotification       │                   │
│  │  "push"  → PushNotification      │                   │
│  └──────────────────────────────────┘                   │
│                                                         │
│  → Your code only knows about the Factory               │
│  → Creation logic is in ONE place                       │
└─────────────────────────────────────────────────────────┘
```

---

## Real-World Use Cases

### 1. Document Creator

```typescript
interface Document {
  open(): void;
  save(): void;
}

class PDFDocument implements Document { /* ... */ }
class WordDocument implements Document { /* ... */ }
class ExcelDocument implements Document { /* ... */ }

class DocumentFactory {
  create(extension: string): Document {
    switch (extension) {
      case ".pdf":  return new PDFDocument();
      case ".docx": return new WordDocument();
      case ".xlsx": return new ExcelDocument();
      default:      throw new Error(`Unsupported format: ${extension}`);
    }
  }
}

// Usage
const factory = new DocumentFactory();
const doc = factory.create(".pdf");
doc.open();
```

### 2. Payment Processor

```typescript
interface PaymentProcessor {
  process(amount: number): boolean;
}

class CreditCardProcessor implements PaymentProcessor { /* ... */ }
class PayPalProcessor implements PaymentProcessor { /* ... */ }
class BankTransferProcessor implements PaymentProcessor { /* ... */ }

class PaymentFactory {
  create(method: string): PaymentProcessor {
    switch (method) {
      case "credit":   return new CreditCardProcessor();
      case "paypal":   return new PayPalProcessor();
      case "transfer": return new BankTransferProcessor();
      default:         throw new Error(`Unknown payment method: ${method}`);
    }
  }
}
```

### 3. Logger (with different outputs)

```typescript
interface Logger {
  log(message: string): void;
}

class ConsoleLogger implements Logger {
  log(message: string) { console.log(message); }
}

class FileLogger implements Logger {
  log(message: string) { fs.appendFileSync("app.log", message + "\n"); }
}

class RemoteLogger implements Logger {
  log(message: string) { http.post("https://logs.example.com", { message }); }
}

class LoggerFactory {
  create(type: string): Logger {
    switch (type) {
      case "console": return new ConsoleLogger();
      case "file":    return new FileLogger();
      case "remote":  return new RemoteLogger();
      default:        return new ConsoleLogger(); // fallback
    }
  }
}
```

---

## Factory Pattern Variations

### Variation 1: Simple Factory (what we've learned)

A single factory class with a creation method.

```typescript
class NotificationFactory {
  create(type: string): Notification { /* ... */ }
}
```

### Variation 2: Factory Method Pattern

Each subclass decides what to create.

```typescript
abstract class NotificationSender {
  // Factory Method - subclasses implement this
  abstract createNotification(): Notification;

  // Template method that uses the factory method
  send(message: string): void {
    const notification = this.createNotification();
    notification.send(message);
  }
}

class EmailSender extends NotificationSender {
  createNotification(): Notification {
    return new EmailNotification();
  }
}

class SMSSender extends NotificationSender {
  createNotification(): Notification {
    return new SMSNotification();
  }
}
```

### Variation 3: Static Factory Method

A static method on the product class itself.

```typescript
class Notification {
  static createEmail(email: string): Notification {
    return new EmailNotification(email);
  }

  static createSMS(phone: string): Notification {
    return new SMSNotification(phone);
  }
}

// Usage
const notification = Notification.createEmail("user@example.com");
```

---

## Anti-patterns

### 1. Factory with Side Effects — Factory does more than create

A factory should **only create** objects. It should not save to a database, send emails, or write logs. Those are side effects (actions that change things outside the function). When a factory has side effects, you cannot create objects for testing without triggering real actions.

**Bad — factory creates AND does other things:**
```typescript
class NotificationFactory {
  create(type: string, recipient: string, message: string): void {
    const notification = this.build(type, recipient);
    notification.send(message);           // Side effect: sends!
    database.save(notification);          // Side effect: writes to DB!
    logger.info("Notification created");  // Side effect: logs!
  }
}
```

**Better — factory only creates:**
```typescript
class NotificationFactory {
  create(type: NotificationType, recipient: string): Notification {
    switch (type) {
      case "email": return new EmailNotification(recipient);
      case "sms":   return new SMSNotification(recipient);
    }
  }
}

// The caller decides what to do with the object
const notification = factory.create("email", "user@example.com");
notification.send(message);
```

### 2. Stringly-Typed Factory — Using raw strings for type selection

When a factory uses `string` to choose which class to create, typos are not caught until the program runs. The word "stringly-typed" is a joke on "strongly-typed" — it means using strings where types should be used.

**Bad — typo compiles fine, crashes at runtime:**
```typescript
class NotificationFactory {
  create(type: string): Notification {
    if (type === "email") return new EmailNotification();
    if (type === "sms")   return new SMSNotification();
    throw new Error(`Unknown type: ${type}`);
  }
}

const n = factory.create("emial"); // Typo! No error until runtime
```

**Better — use a union type or enum:**
```typescript
type NotificationType = "email" | "sms" | "push";

class NotificationFactory {
  create(type: NotificationType): Notification {
    switch (type) {
      case "email": return new EmailNotification();
      case "sms":   return new SMSNotification();
      case "push":  return new PushNotification();
    }
  }
}

const n = factory.create("emial"); // Compile error! TypeScript catches it
```

### 3. Null-Returning Factory — Returning null on failure

When a factory cannot create an object, returning `null` hides the error. The caller must check for `null` every time. When they forget, the error appears far from the real problem. This is called the **Null-Returning Factory** anti-pattern.

**Bad — returns null silently:**
```typescript
class NotificationFactory {
  create(type: string): Notification | null {
    if (type === "email") return new EmailNotification();
    if (type === "sms")   return new SMSNotification();
    return null; // Unknown type? Silent null.
  }
}

const notification = factory.create(config.type);
notification.send("Hello"); // TypeError: Cannot read properties of null
```

**Better — throw a clear error:**
```typescript
class NotificationFactory {
  create(type: NotificationType): Notification {
    switch (type) {
      case "email": return new EmailNotification();
      case "sms":   return new SMSNotification();
    }
    throw new Error(
      `Unknown notification type: "${type}". Valid types: email, sms`
    );
  }
}
```

### 4. God Factory — One factory creates everything

A factory should create objects from **one domain** (one related group). When a single factory creates objects from many unrelated domains, it becomes a "God Factory." It grows without limit and everyone must edit the same file.

**Bad — creates everything:**
```typescript
class AppFactory {
  createUser(name: string): User { return new User(name); }
  createInvoice(amount: number): Invoice { return new Invoice(amount); }
  createLogger(level: string): Logger { return new ConsoleLogger(level); }
  createPdfReport(data: ReportData): PdfReport { return new PdfReport(data); }
  // ... 20 more unrelated methods
}
```

**Better — one factory per domain:**
```typescript
class NotificationFactory {
  create(type: NotificationType): Notification { /* ... */ }
}

class ReportFactory {
  create(format: ReportFormat): Report { /* ... */ }
}
```

### 5. Speculative Factory — Factory for a single type

Don't create a factory when you only have **one** class. This is called **Speculative Generality** — adding complexity for a future that may never come. Use a factory when you have **multiple classes** that share an interface.

**Bad — factory for one class:**
```typescript
class UserFactory {
  create(name: string): User {
    return new User(name); // Only one type. Why the factory?
  }
}

const user = new UserFactory().create("Alice");
```

**Better — just use `new`:**
```typescript
const user = new User("Alice");

// Add a factory LATER, when you actually need multiple types.
```
---

## Factory vs Constructor

| Aspect | Constructor (`new`) | Factory |
|--------|---------------------|---------|
| **Coupling** | Tightly coupled to specific class | Loosely coupled to interface |
| **Flexibility** | Fixed to one class | Can return different types |
| **Naming** | Always called "constructor" | Method name describes intent |
| **Caching** | Always creates new | Can return cached instance |

**Example of Factory benefits:**

```typescript
// Constructor: name doesn't tell you what it creates
const thing = new SomeLongClassName(params);

// Factory: method name is descriptive
const notification = NotificationFactory.createUrgent(recipient);
const notification = NotificationFactory.createScheduled(recipient, time);
const notification = NotificationFactory.createBulk(recipients);
```

---

## When to Use Factory Pattern?

### Use Factory When...

| Situation | Why Factory Helps |
|-----------|-------------------|
| **Multiple related classes** | Factory decides which one to create |
| **Complex creation logic** | Encapsulate complexity in one place |
| **Class might change** | Only update the Factory |
| **Testing needs mocks** | Swap Factory to return test doubles |
| **Configuration-based creation** | Factory reads config and creates appropriate class |

### Don't Use Factory When...

| Situation | Why |
|-----------|-----|
| **Only one class to create** | Overkill - just use `new` |
| **No shared interface** | Factory assumes polymorphism |
| **Simple constructors** | Don't add unnecessary abstraction |

---

## Comparison: Factory vs Abstract Factory

| Aspect | Factory | Abstract Factory |
|--------|---------|------------------|
| **Creates** | One type of object | Families of related objects |
| **Example** | NotificationFactory creates notifications | UIFactory creates buttons, checkboxes, inputs that match |
| **Complexity** | Simpler | More complex |
| **Use when** | You have multiple classes of ONE type | You have multiple classes of MULTIPLE related types |

See [Abstract Factory Pattern](../abstract-factory/README.md) for details.

---

## Key Vocabulary

| Word | Meaning |
|------|---------|
| **Factory** | A class/method that creates objects |
| **Product** | The object being created (e.g., Notification) |
| **Concrete Product** | Specific implementation (e.g., EmailNotification) |
| **Interface** | Contract that all products follow |
| **Coupling** | How much one class depends on another |

---

## Quick Quiz

1. What is the main purpose of the Factory Pattern?
2. What's the difference between using `new` directly vs using a Factory?
3. Where does the "which class to create" logic live?
4. What happens when you need to add a new type?
5. Why is string-based type selection fragile?

<details>
<summary>Answers</summary>

1. To create objects without specifying the exact class, delegating creation to a factory
2. `new` couples you to one class; Factory lets you create different classes through one interface
3. Inside the Factory, in one centralized place
4. You only update the Factory; client code stays unchanged
5. Typos aren't caught until runtime; enums/constants are checked at compile time

</details>

---

## Summary

**Factory Pattern in 30 seconds:**
- Creates objects without exposing creation logic
- Client only knows the interface, not concrete classes
- Adding new types = changing only the Factory
- Good for: Multiple related classes, complex creation, testability
- Remember: Factory ONLY creates — don't add other responsibilities

---

## Try It Yourself

1. Read the code in `code/` folder
2. Copy the code by hand (don't copy-paste!)
3. Add a new notification type (e.g., SlackNotification)
4. Try creating a DocumentFactory for PDF, Word, Excel
5. Refactor the Factory to use enums instead of strings
