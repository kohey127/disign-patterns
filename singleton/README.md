# Singleton Pattern

## What is it? (One sentence)

**Singleton makes sure a class has only ONE instance in your entire program.**

---

## The Problem (Why do we need this?)

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

## When to Use Singleton?

✅ **Good uses:**
- Shopping cart (one per user session)
- Logger (one log file for entire app)
- Configuration (one settings object)
- Database connection pool

❌ **Be careful:**
- Singleton is sometimes called an "anti-pattern"
- It can make testing harder
- It's like a global variable (which can cause problems)

---

## Key Vocabulary

| Word | Meaning |
|------|---------|
| **Instance** | An object created from a class |
| **Static** | Belongs to the class, not to instances |
| **Private** | Can only be accessed inside the class |
| **Constructor** | Method that runs when creating an object |

---

## Quick Quiz

1. Why is the constructor `private`?
2. What does `getInstance()` do on the first call?
3. What does `getInstance()` do on the second call?
4. How can you prove two variables point to the same object?

<details>
<summary>Answers</summary>

1. To prevent `new ClassName()` from outside the class
2. Creates a new instance and stores it
3. Returns the already-stored instance (doesn't create new)
4. Use `===` comparison: `cart1 === cart2` returns `true`

</details>

---

## Try It Yourself

1. Read the code in `code/` folder
2. Copy the code by hand (don't copy-paste!)
3. Explain to yourself: "Why is each line needed?"
4. Try removing `private` from constructor - what happens?
