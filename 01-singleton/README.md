# Singleton Pattern

## What is it? (One sentence)

**Singleton makes sure a class has only ONE instance in your entire program.**

---

## The Problem (Why do we need this?)

> **⚠️ Note:** This document uses a "shopping cart" as an example because it's easy to understand.
> However, **a shopping cart is NOT a good real-world use case for Singleton**.
> In real applications, each user needs their own cart — a Singleton cart would be shared by ALL users!
> For proper Singleton use cases, see [Real-World Use Cases](#real-world-use-cases-with-code-examples) (Logger, Config, Database Pool).

Imagine you're building a shopping website.

You have a shopping cart. But what if your code accidentally creates multiple carts?

```typescript
// 😱 Problem: Multiple carts!
const cart1 = new Cart();  // Cart #1
const cart2 = new Cart();  // Cart #2 (different object!)

cart1.add("Apple");
cart2.add("Banana");

// User sees only Banana! Where did Apple go?!
```

Each `new Cart()` creates a **separate** cart. Items added to `cart1` don't appear in `cart2`.

This is confusing and causes bugs.

---

## The Solution (How Singleton helps)

Singleton guarantees that **no matter how many times** you ask for a cart, you always get the **same one**.

```typescript
// ✅ Solution: Always the same cart!
const cart1 = Cart.getInstance();
const cart2 = Cart.getInstance();

cart1.add("Apple");
cart2.add("Banana");

// User sees Apple AND Banana! Perfect!
console.log(cart1 === cart2);  // true (same object)
```

---

## How to Make a Singleton (3 Steps)

### Step 1: Hide the constructor

Make the constructor `private`. This prevents `new ClassName()` from outside.

```typescript
class UserCart {
  private constructor() {
    // Cannot call "new UserCart()" from outside!
  }
}
```

### Step 2: Store the instance

Create a private static variable to hold the ONE instance.

```typescript
class UserCart {
  private static instance: UserCart;  // ← stores the one instance

  private constructor() {}
}
```

### Step 3: Create getInstance() method

This method:
- Creates the instance on **first call**
- Returns the **same instance** on all future calls

```typescript
class UserCart {
  private static instance: UserCart;

  private constructor() {}

  static getInstance(): UserCart {
    // First time? Create it!
    if (!UserCart.instance) {
      UserCart.instance = new UserCart();
    }
    // Always return the same one
    return UserCart.instance;
  }
}
```

---

## Complete Example

> **⚠️ Reminder:** UserCart is for learning only. In production, use Singleton for Logger, Config, etc. — not shopping carts.

```typescript
class UserCart {
  // 1. Store the single instance
  private static instance: UserCart;

  // 2. Private constructor (blocks "new")
  private constructor() {}

  // 3. Public method to get instance
  static getInstance(): UserCart {
    if (!UserCart.instance) {
      UserCart.instance = new UserCart();
    }
    return UserCart.instance;
  }

  // Normal methods below...
  private items: string[] = [];

  add(item: string): void {
    this.items.push(item);
  }

  getItems(): string[] {
    return this.items;
  }
}

// Usage:
const cart = UserCart.getInstance();
cart.add("Apple");
```

---

## Visual Explanation

> **⚠️ Reminder:** Cart is used here for simplicity. See [Real-World Use Cases](#real-world-use-cases-with-code-examples) for proper examples.

```
WITHOUT Singleton:
┌─────────────────────────────────────────┐
│  new Cart()  →  Cart Instance #1 📦     │
│  new Cart()  →  Cart Instance #2 📦     │
│  new Cart()  →  Cart Instance #3 📦     │
│                                         │
│  Three different carts! 😱              │
└─────────────────────────────────────────┘

WITH Singleton:
┌─────────────────────────────────────────┐
│  Cart.getInstance()  ──┐                │
│  Cart.getInstance()  ──┼──→  Cart 📦    │
│  Cart.getInstance()  ──┘     (only 1!)  │
│                                         │
│  Always the same cart! ✅               │
└─────────────────────────────────────────┘
```

---

## Real-World Use Cases (With Code Examples)

### 1. Logger - One log file for entire app

**Problem without Singleton:**
```typescript
// 😱 Multiple loggers = multiple files = chaos!
const logger1 = new Logger("app.log");
const logger2 = new Logger("app.log");

logger1.log("User logged in");   // writes to file handle #1
logger2.log("User clicked buy"); // writes to file handle #2
// File corruption! Race conditions! Missing logs!
```

**Solution with Singleton:**
```typescript
class Logger {
  private static instance: Logger;
  private logFile: FileHandle;

  private constructor() {
    this.logFile = openFile("app.log");
  }

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  log(message: string): void {
    this.logFile.write(`[${new Date().toISOString()}] ${message}\n`);
  }
}

// Anywhere in your app:
Logger.getInstance().log("User logged in");
Logger.getInstance().log("User clicked buy");
// ✅ All logs go to the same file, in order!
```

### 2. Database Connection Pool

**Problem without Singleton:**
```typescript
// 😱 Each request creates new connections!
app.get("/users", () => {
  const db = new DatabasePool(10); // 10 connections
  return db.query("SELECT * FROM users");
});

// 1000 requests = 10,000 connections = database crashes!
```

**Solution with Singleton:**
```typescript
class DatabasePool {
  private static instance: DatabasePool;
  private connections: Connection[] = [];

  private constructor(size: number) {
    // Create pool once
    for (let i = 0; i < size; i++) {
      this.connections.push(new Connection());
    }
  }

  static getInstance(): DatabasePool {
    if (!DatabasePool.instance) {
      DatabasePool.instance = new DatabasePool(10);
    }
    return DatabasePool.instance;
  }

  query(sql: string): Result {
    const conn = this.getAvailableConnection();
    return conn.execute(sql);
  }
}

// 1000 requests = still only 10 connections ✅
app.get("/users", () => {
  return DatabasePool.getInstance().query("SELECT * FROM users");
});
```

### 3. App Configuration / Settings

**Problem without Singleton:**
```typescript
// 😱 Loading config file multiple times = slow + inconsistent
function sendEmail() {
  const config = new Config("settings.json"); // reads file
  smtp.send(config.get("smtp.host"));
}

function saveToCloud() {
  const config = new Config("settings.json"); // reads file AGAIN
  cloud.upload(config.get("cloud.bucket"));
}
// If file changes between calls, different parts of app use different settings!
```

**Solution with Singleton:**
```typescript
class Config {
  private static instance: Config;
  private settings: Record<string, any>;

  private constructor() {
    // Load once at startup
    this.settings = JSON.parse(readFile("settings.json"));
  }

  static getInstance(): Config {
    if (!Config.instance) {
      Config.instance = new Config();
    }
    return Config.instance;
  }

  get(key: string): any {
    return this.settings[key];
  }
}

// All parts of app use the same settings ✅
// File is read only once ✅
```

### 4. Cache Manager

**Problem without Singleton:**
```typescript
// 😱 Multiple caches = no sharing = useless cache!
function getUser(id: string) {
  const cache = new Cache();
  if (cache.has(id)) return cache.get(id); // never hits!
  const user = database.findUser(id);
  cache.set(id, user);
  return user;
}
// Each function call creates new empty cache!
```

**Solution with Singleton:**
```typescript
class Cache {
  private static instance: Cache;
  private data: Map<string, any> = new Map();

  private constructor() {}

  static getInstance(): Cache {
    if (!Cache.instance) {
      Cache.instance = new Cache();
    }
    return Cache.instance;
  }

  get(key: string): any { return this.data.get(key); }
  set(key: string, value: any): void { this.data.set(key, value); }
  has(key: string): boolean { return this.data.has(key); }
}

// Now cache is shared across entire app ✅
function getUser(id: string) {
  const cache = Cache.getInstance();
  if (cache.has(id)) return cache.get(id); // actually works!
  const user = database.findUser(id);
  cache.set(id, user);
  return user;
}
```

### 5. Redux Store (Frontend State Management)

```typescript
// Redux is essentially a Singleton!
// There's only ONE store for your entire React app

import { createStore } from 'redux';

// This is created ONCE
const store = createStore(rootReducer);

// Every component gets the SAME store
// Component A:
store.dispatch({ type: 'ADD_TO_CART', item: 'Apple' });

// Component B (different file, different place):
store.getState().cart; // sees the Apple! ✅
```

---

## Anti-Patterns: When Singleton Goes Wrong

### Anti-Pattern 1: Hidden Dependencies (Hardest to Test)

**Bad - Singleton hides what a class needs:**
```typescript
class OrderService {
  processOrder(order: Order) {
    // 😱 Where does this dependency come from?!
    // You can't tell by looking at the constructor
    const db = DatabasePool.getInstance();
    const logger = Logger.getInstance();
    const config = Config.getInstance();

    db.save(order);
    logger.log("Order saved");
  }
}

// Testing is NIGHTMARE:
// How do you replace the database with a fake one?
// You can't! It's hardcoded inside.
```

**Good - Dependencies are explicit:**
```typescript
class OrderService {
  // ✅ Clear: this class needs db, logger, and config
  constructor(
    private db: Database,
    private logger: Logger,
    private config: Config
  ) {}

  processOrder(order: Order) {
    this.db.save(order);
    this.logger.log("Order saved");
  }
}

// Testing is EASY:
const fakeDb = new FakeDatabase();
const fakeLogger = new FakeLogger();
const service = new OrderService(fakeDb, fakeLogger, config);
service.processOrder(order);
expect(fakeDb.savedOrders).toContain(order); // ✅
```

### Anti-Pattern 2: Global State Nightmare

> **⚠️ Note:** This example uses a Cart, but remember: a shopping cart should NOT be a Singleton in real apps (each user needs their own cart). This is just to illustrate the "global state" problem.

**The Problem: Anyone can modify the Singleton from anywhere**

```typescript
// File: checkout.ts
function checkout() {
  const cart = Cart.getInstance();
  processPayment(cart.items);
  cart.clear(); // Clears the cart
}

// File: analytics.ts
function trackCart() {
  const cart = Cart.getInstance();
  sendAnalytics(cart.items); // What's in here? Depends on timing!
}
```

When you read `analytics.ts` alone, you can't know what `cart.items` contains.
You have to read ALL files that use `Cart.getInstance()` to understand the state.

```
checkout.ts  ──→ Cart.getInstance() ──→ clear()
analytics.ts ──→ Cart.getInstance() ──→ items???
display.ts   ──→ Cart.getInstance() ──→ items???
                      ↑
              Who changed it last?
              What's the current state?
              You can't tell without reading everything!
```

**The Solution: Pass dependencies explicitly**

```typescript
// File: main.ts - The ONLY place that manages cart
const cart = new Cart();
cart.add(apple);
cart.add(banana);

trackCart(cart);   // Pass cart to analytics
checkout(cart);    // Pass cart to checkout

// Now you can see: trackCart runs first, then checkout
```

```typescript
// File: checkout.ts
function checkout(cart: Cart) {  // Receives cart as parameter
  processPayment(cart.items);
  cart.clear();
}

// File: analytics.ts
function trackCart(cart: Cart) {  // Receives cart as parameter
  sendAnalytics(cart.items);
}
```

**Why is this better?**

| Singleton | Explicit passing |
|-----------|------------------|
| Any file can call `getInstance()` | Only main.ts has the cart |
| Order of operations is hidden | Order is visible in main.ts |
| Must read all files to understand state | Read main.ts to see the flow |

### Anti-Pattern 3: Testing Pollution

> **⚠️ Note:** Again, Cart is used here for illustration only. In real apps, use Singleton for things like Logger or Config, not shopping carts.

**Bad - Tests affect each other:**
```typescript
// Test 1
test("add item to cart", () => {
  const cart = Cart.getInstance();
  cart.add({ name: "Apple", price: 100 });
  expect(cart.items.length).toBe(1); // ✅ passes
});

// Test 2
test("cart starts empty", () => {
  const cart = Cart.getInstance();
  // 😱 FAILS! Cart still has Apple from Test 1!
  expect(cart.items.length).toBe(0); // ❌ fails - length is 1
});

// Singleton state leaks between tests!
```

**Fix - Add reset method for testing:**
```typescript
class Cart {
  private static instance: Cart;

  // Only use in tests!
  static resetInstance(): void {
    Cart.instance = undefined as any;
  }
}

// In test setup:
beforeEach(() => {
  Cart.resetInstance();
});
```

### Anti-Pattern 4: Tight Coupling

**Bad - Code only works with THE singleton:**
```typescript
class EmailService {
  sendWelcomeEmail(user: User) {
    // 😱 Tightly coupled to specific Config singleton
    const config = Config.getInstance();
    const template = config.get("email.welcomeTemplate");
    // What if you want different config for different environments?
    // What if you want to test with different settings?
  }
}
```

**Good - Accept config as a parameter:**
```typescript
class EmailService {
  constructor(private config: Config) {}  // ✅ Inject dependency

  sendWelcomeEmail(user: User) {
    const template = this.config.get("email.welcomeTemplate");
    // Now you can pass different configs!
  }
}

// Production:
const emailService = new EmailService(Config.getInstance());

// Testing:
const testConfig = new MockConfig({ "email.welcomeTemplate": "test.html" });
const emailService = new EmailService(testConfig);  // ✅ Easy to test!

// Different environment:
const stagingConfig = new Config("staging-settings.json");
const emailService = new EmailService(stagingConfig);  // ✅ Flexible!
```

### Anti-Pattern 5: Lazy Initialization Race Condition

**Bad - Not thread-safe (in multi-threaded languages):**
```typescript
class DatabasePool {
  private static instance: DatabasePool;

  static getInstance(): DatabasePool {
    // 😱 In multi-threaded environment:
    // Thread A checks: instance is null ✓
    // Thread B checks: instance is null ✓
    // Thread A creates instance
    // Thread B creates ANOTHER instance
    // Now we have TWO instances!
    if (!DatabasePool.instance) {
      DatabasePool.instance = new DatabasePool();
    }
    return DatabasePool.instance;
  }
}
```

**Good - Eager initialization (create at load time):**
```typescript
class DatabasePool {
  // ✅ Instance is created when class is loaded
  // No race condition possible!
  private static instance: DatabasePool = new DatabasePool();

  private constructor() {}

  static getInstance(): DatabasePool {
    return DatabasePool.instance;  // Just return, no check needed
  }
}
```

**Good - Thread-safe in other languages (Java example):**
```java
class DatabasePool {
    private static volatile DatabasePool instance;

    static DatabasePool getInstance() {
        if (instance == null) {
            synchronized (DatabasePool.class) {  // ✅ Lock
                if (instance == null) {          // ✅ Double-check
                    instance = new DatabasePool();
                }
            }
        }
        return instance;
    }
}
```

> **Note:** JavaScript is single-threaded, so race conditions are rare. But this matters in Java, C#, Go, Rust, etc.

---

## Better Alternatives to Singleton

### Alternative 1: Dependency Injection

Instead of hiding dependencies, pass them explicitly:

```typescript
// ❌ Singleton way
class UserService {
  getUser(id: string) {
    const db = Database.getInstance(); // hidden dependency
    return db.find(id);
  }
}

// ✅ Dependency Injection way
class UserService {
  constructor(private db: Database) {} // explicit dependency

  getUser(id: string) {
    return this.db.find(id);
  }
}

// Create once at app startup:
const db = new Database();
const userService = new UserService(db);
const orderService = new OrderService(db); // same db instance, but explicit
```

### Alternative 2: Module Pattern (ES Modules)

JavaScript modules are naturally singletons:

```typescript
// logger.ts
// This code runs ONCE when first imported
const logFile = openFile("app.log");

export function log(message: string) {
  logFile.write(message);
}

// Any file that imports this gets the SAME logFile
// No class needed! No getInstance() needed!

// userService.ts
import { log } from "./logger";
log("User logged in"); // uses the single logFile

// orderService.ts
import { log } from "./logger";
log("Order created"); // same logFile!
```

### Alternative 3: Factory + Closure

```typescript
// Create a factory that closes over a single instance
function createDatabasePool(size: number) {
  const connections: Connection[] = [];
  for (let i = 0; i < size; i++) {
    connections.push(new Connection());
  }

  return {
    query(sql: string) {
      const conn = connections.find(c => c.isAvailable());
      return conn.execute(sql);
    }
  };
}

// Create once
const db = createDatabasePool(10);
export { db };

// Now 'db' is effectively a singleton, but testable!
```

---

## When to Use Singleton?

### ✅ Good Uses (Use Singleton When...)

| Situation | Why Singleton Works |
|-----------|-------------------|
| **Logger** | One log file, consistent formatting |
| **Config** | Load once, use everywhere |
| **Database Pool** | Limited connections, share them |
| **Cache** | Must share data across app |
| **Hardware Access** | One printer, one screen |

### ❌ Bad Uses (Don't Use Singleton When...)

| Situation | Why Singleton Fails |
|-----------|-------------------|
| **Shopping Cart** | Each user needs their own cart! |
| **User-specific data** | Each user needs own instance |
| **Business Logic** | Hidden dependencies, hard to test |
| **Stateless services** | No need for single instance |
| **Things that need mocking** | Can't replace for tests |

### Decision Flowchart

```
Do you need EXACTLY ONE instance?
├── No → Don't use Singleton
└── Yes → Is it for the ENTIRE app lifetime?
    ├── No → Don't use Singleton
    └── Yes → Can you use Dependency Injection instead?
        ├── Yes → Use DI (better testability)
        └── No → Singleton is OK, but add resetInstance() for tests
```

---

## Key Vocabulary

| Word | Meaning |
|------|---------|
| **Instance** | An object created from a class |
| **Static** | Belongs to the class, not to instances |
| **Private** | Can only be accessed inside the class |
| **Constructor** | Method that runs when creating an object |
| **Dependency Injection** | Passing dependencies as parameters |
| **Global State** | Data accessible from anywhere in the program |
| **Race Condition** | Bug when multiple threads access same data |

---

## Quick Quiz

1. Why is the constructor `private`?
2. What does `getInstance()` do on the first call?
3. What does `getInstance()` do on the second call?
4. How can you prove two variables point to the same object?
5. Why is Singleton sometimes called an "anti-pattern"?
6. What's a better alternative for testable code?

<details>
<summary>Answers</summary>

1. To prevent `new ClassName()` from outside the class
2. Creates a new instance and stores it
3. Returns the already-stored instance (doesn't create new)
4. Use `===` comparison: `cart1 === cart2` returns `true`
5. It creates hidden dependencies and global state, making code hard to test and debug
6. Dependency Injection - pass dependencies explicitly through constructor

</details>

---

## Summary

**Singleton in 30 seconds:**
- ONE instance, shared everywhere
- Private constructor + static getInstance()
- Good for: Logger, Config, Cache, Connection Pool
- Bad for: Business logic, testable code
- Consider: Dependency Injection as alternative

---

## Try It Yourself

1. Read the code in `code/` folder
2. Copy the code by hand (don't copy-paste!)
3. Explain to yourself: "Why is each line needed?"
4. Try removing `private` from constructor - what happens?
5. Try creating a Logger singleton from scratch
6. Refactor the code to use Dependency Injection instead
