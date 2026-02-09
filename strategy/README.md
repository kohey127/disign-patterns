# Strategy Pattern

## What is it? (One sentence)

**Strategy lets you define a family of algorithms, put each in its own class, and make them interchangeable at runtime.**

---

## Before You Read This

Make sure you understand basic interfaces and classes in TypeScript first!

- **Strategy** is a Behavioral pattern (about how objects communicate)
- Previous patterns (Singleton, Factory, Abstract Factory) were Creational (about how objects are created)
- Strategy is about **choosing an algorithm** at runtime

---

## The Problem (Why do we need this?)

Imagine you're building a navigation app like Google Maps.

Users want to get from Point A to Point B, but they want different routing options:
- **Fastest route** - uses the highway, less time but more distance
- **Shortest route** - takes local roads, less distance but more time
- **Scenic route** - goes along the coast, most beautiful but longest

**The naive approach:**

```typescript
function navigate(origin: string, destination: string, type: string) {
  if (type === "fastest") {
    // 30 lines of highway routing logic...
    console.log("Take the highway");
  } else if (type === "shortest") {
    // 30 lines of local road logic...
    console.log("Take local roads");
  } else if (type === "scenic") {
    // 30 lines of scenic routing logic...
    console.log("Take the coastal road");
  }
}
```

**Problems:**

1. **Giant function** - All algorithms are crammed into one function
2. **Hard to add new routes** - Adding "toll-free route" means modifying this function
3. **Violates Open/Closed Principle** - You must change existing code to add new behavior
4. **Hard to test** - Can't test one algorithm in isolation
5. **Can't switch at runtime** - The type is passed once and that's it

---

## The Solution (How Strategy helps)

Extract each algorithm into its own class that implements a common interface.

```typescript
// Strategy interface - all algorithms share this shape
interface RouteStrategy {
  calculateRoute(origin: string, destination: string): RouteResult;
}

// Each algorithm in its own class
class FastestRouteStrategy implements RouteStrategy {
  calculateRoute(origin: string, destination: string): RouteResult {
    // Highway routing logic here
  }
}

class ShortestRouteStrategy implements RouteStrategy {
  calculateRoute(origin: string, destination: string): RouteResult {
    // Local road routing logic here
  }
}

// Context class - delegates to whatever strategy is set
class Navigator {
  private strategy: RouteStrategy;

  constructor(strategy: RouteStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: RouteStrategy) {
    this.strategy = strategy;
  }

  navigate(origin: string, destination: string) {
    return this.strategy.calculateRoute(origin, destination);
  }
}
```

**Now switching algorithms is easy:**

```typescript
const navigator = new Navigator(new FastestRouteStrategy());
navigator.navigate("Tokyo", "Kamakura"); // Uses highway

navigator.setStrategy(new ScenicRouteStrategy());
navigator.navigate("Tokyo", "Kamakura"); // Uses coastal road
// Same navigator, different algorithm!
```

---

## Visual Explanation

```
┌─────────────────────────────────────────────────────┐
│                  Navigator (Context)                 │
│                                                     │
│   - strategy: RouteStrategy                         │
│   + setStrategy(strategy)                           │
│   + navigate(origin, dest) → delegates to strategy  │
└──────────────────────┬──────────────────────────────┘
                       │ uses
                       ▼
          ┌────────────────────────┐
          │   RouteStrategy        │
          │   (interface)          │
          │                        │
          │  + calculateRoute()    │
          │  + getName()           │
          └────────────────────────┘
            ▲          ▲          ▲
            │          │          │
   ┌────────┴──┐ ┌────┴─────┐ ┌─┴──────────┐
   │ Fastest   │ │ Shortest │ │ Scenic     │
   │ Route     │ │ Route    │ │ Route      │
   │ Strategy  │ │ Strategy │ │ Strategy   │
   ├───────────┤ ├──────────┤ ├────────────┤
   │ Highway   │ │ Local    │ │ Coastal    │
   │ 65km 50m  │ │ 52km 90m│ │ 70km 120m  │
   └───────────┘ └──────────┘ └────────────┘

KEY INSIGHT:
- Navigator doesn't know HOW the route is calculated
- It just asks the current strategy to do it
- You can swap strategies at any time
```

---

## How to Make a Strategy (3 Steps)

### Step 1: Define the strategy interface

```typescript
interface RouteStrategy {
  calculateRoute(origin: string, destination: string): RouteResult;
  getName(): string;
}

interface RouteResult {
  path: string[];
  distanceKm: number;
  estimatedMinutes: number;
  description: string;
}
```

### Step 2: Create concrete strategies

```typescript
class FastestRouteStrategy implements RouteStrategy {
  getName() { return "Fastest Route"; }

  calculateRoute(origin: string, destination: string): RouteResult {
    return {
      path: [origin, "Highway", destination],
      distanceKm: 65,
      estimatedMinutes: 50,
      description: "Takes the expressway for fastest time.",
    };
  }
}

class ScenicRouteStrategy implements RouteStrategy {
  getName() { return "Scenic Route"; }

  calculateRoute(origin: string, destination: string): RouteResult {
    return {
      path: [origin, "Coastal road", "Beach viewpoint", destination],
      distanceKm: 70,
      estimatedMinutes: 120,
      description: "Beautiful ocean views along the way.",
    };
  }
}
```

### Step 3: Create the context class

```typescript
class Navigator {
  private strategy: RouteStrategy;

  constructor(strategy: RouteStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: RouteStrategy) {
    this.strategy = strategy;
  }

  navigate(origin: string, destination: string): RouteResult {
    return this.strategy.calculateRoute(origin, destination);
  }
}
```

---

## Complete Example

```typescript
// ============================================
// STRATEGY INTERFACE
// ============================================

interface RouteStrategy {
  calculateRoute(origin: string, destination: string): RouteResult;
  getName(): string;
}

interface RouteResult {
  path: string[];
  distanceKm: number;
  estimatedMinutes: number;
  description: string;
}

// ============================================
// CONCRETE STRATEGIES
// ============================================

class FastestRouteStrategy implements RouteStrategy {
  getName() { return "Fastest Route (Highway)"; }

  calculateRoute(origin: string, destination: string): RouteResult {
    return {
      path: [origin, "Highway entrance", "Expressway", "Highway exit", destination],
      distanceKm: 65,
      estimatedMinutes: 50,
      description: `Highway route from ${origin} to ${destination}.`,
    };
  }
}

class ShortestRouteStrategy implements RouteStrategy {
  getName() { return "Shortest Route (Local Roads)"; }

  calculateRoute(origin: string, destination: string): RouteResult {
    return {
      path: [origin, "Local road A", "Town center", "Local road B", destination],
      distanceKm: 52,
      estimatedMinutes: 90,
      description: `Direct route from ${origin} to ${destination}.`,
    };
  }
}

class ScenicRouteStrategy implements RouteStrategy {
  getName() { return "Scenic Route (Coastal Road)"; }

  calculateRoute(origin: string, destination: string): RouteResult {
    return {
      path: [origin, "Coastal road", "Beach viewpoint", "Cliff drive", "Harbor", destination],
      distanceKm: 70,
      estimatedMinutes: 120,
      description: `Scenic route from ${origin} to ${destination}.`,
    };
  }
}

// ============================================
// CONTEXT
// ============================================

class Navigator {
  private strategy: RouteStrategy;

  constructor(strategy: RouteStrategy) {
    this.strategy = strategy;
  }

  setStrategy(strategy: RouteStrategy) {
    this.strategy = strategy;
  }

  navigate(origin: string, destination: string) {
    console.log(`Using: ${this.strategy.getName()}`);
    const result = this.strategy.calculateRoute(origin, destination);
    console.log(`Path: ${result.path.join(" → ")}`);
    console.log(`Distance: ${result.distanceKm} km, Time: ${result.estimatedMinutes} min`);
    return result;
  }
}

// ============================================
// USAGE
// ============================================

const nav = new Navigator(new FastestRouteStrategy());
nav.navigate("Tokyo", "Kamakura");

// Switch at runtime!
nav.setStrategy(new ScenicRouteStrategy());
nav.navigate("Tokyo", "Kamakura");
```

---

## Real-World Use Cases

### 1. Sorting Algorithms

Different data sizes need different sorting approaches.

```typescript
interface SortStrategy {
  sort(data: number[]): number[];
}

class QuickSort implements SortStrategy {
  sort(data: number[]): number[] {
    // Good for large datasets
    return data.sort((a, b) => a - b);
  }
}

class BubbleSort implements SortStrategy {
  sort(data: number[]): number[] {
    // Simple, good for small/nearly-sorted data
    // ... bubble sort implementation
    return data;
  }
}

class DataProcessor {
  private sortStrategy: SortStrategy;

  setSortStrategy(strategy: SortStrategy) {
    this.sortStrategy = strategy;
  }

  process(data: number[]) {
    return this.sortStrategy.sort(data);
  }
}
```

### 2. Payment Processing

Different payment methods with different flows.

```typescript
interface PaymentStrategy {
  pay(amount: number): boolean;
  getName(): string;
}

class CreditCardPayment implements PaymentStrategy {
  getName() { return "Credit Card"; }
  pay(amount: number) {
    console.log(`Charging $${amount} to credit card`);
    return true;
  }
}

class PayPalPayment implements PaymentStrategy {
  getName() { return "PayPal"; }
  pay(amount: number) {
    console.log(`Sending $${amount} via PayPal`);
    return true;
  }
}

class CryptoPayment implements PaymentStrategy {
  getName() { return "Crypto"; }
  pay(amount: number) {
    console.log(`Sending $${amount} in crypto`);
    return true;
  }
}

class ShoppingCart {
  private paymentStrategy: PaymentStrategy;

  setPaymentMethod(strategy: PaymentStrategy) {
    this.paymentStrategy = strategy;
  }

  checkout(total: number) {
    return this.paymentStrategy.pay(total);
  }
}
```

### 3. Text Compression

Different compression algorithms for different file types.

```typescript
interface CompressionStrategy {
  compress(data: string): string;
  decompress(data: string): string;
}

class ZipCompression implements CompressionStrategy {
  compress(data: string) { /* zip logic */ return data; }
  decompress(data: string) { /* unzip logic */ return data; }
}

class GzipCompression implements CompressionStrategy {
  compress(data: string) { /* gzip logic */ return data; }
  decompress(data: string) { /* gunzip logic */ return data; }
}

class FileManager {
  private compression: CompressionStrategy;

  setCompression(strategy: CompressionStrategy) {
    this.compression = strategy;
  }

  saveFile(data: string) {
    const compressed = this.compression.compress(data);
    // save compressed data
  }
}
```

---

## Strategy vs Other Patterns

```
STRATEGY PATTERN:
┌─────────────────────────────────────┐
│         Context (Navigator)         │
│                                     │
│  setStrategy(s)  → swap algorithm   │
│  execute()       → delegates to s   │
│                                     │
│  → Same INTERFACE, different LOGIC  │
│  → Chosen at RUNTIME               │
│  → ONE strategy active at a time    │
└─────────────────────────────────────┘

FACTORY PATTERN (for comparison):
┌─────────────────────────────────────┐
│        Factory                      │
│                                     │
│  create(type) → returns new object  │
│                                     │
│  → About CREATING objects           │
│  → Strategy is about BEHAVIOR      │
└─────────────────────────────────────┘
```

| Aspect | Strategy | Factory |
|--------|----------|---------|
| **Purpose** | Switch algorithm/behavior | Create objects |
| **What varies** | The logic (how to do something) | The type (what to create) |
| **When decided** | Can change at runtime | Usually decided at creation |
| **Pattern type** | Behavioral | Creational |

### Easy Explanation: Restaurant Chef

Think about **Strategy** like choosing a chef at a restaurant.

You order "steak." But HOW the steak is cooked depends on the chef:

```
Restaurant (Context)
  ├── setChef(FrenchChef)   → Steak with wine sauce
  ├── setChef(JapaneseChef) → Wagyu with wasabi
  └── setChef(ItalianChef)  → Steak alla Fiorentina
```

**Same input (steak), different algorithm (cooking style), different output.**

You can switch the chef anytime. The restaurant doesn't need to change how it takes orders. It just delegates the cooking to whoever the current chef is.

**The #1 insight:**
- **Strategy** → swap the **HOW** (algorithm) at runtime
- The context doesn't care which strategy is used — it just delegates

---

## Common Mistakes

### Mistake 1: Using Strategy when a simple function would do

**Overkill:**
```typescript
// If you only have one method and no state, just use a function!
interface Validator {
  validate(input: string): boolean;
}

class EmailValidator implements Validator {
  validate(input: string) { return input.includes("@"); }
}
```

**Simpler:**
```typescript
// A function is fine here
type ValidatorFn = (input: string) => boolean;

const emailValidator: ValidatorFn = (input) => input.includes("@");
const phoneValidator: ValidatorFn = (input) => /^\d{10}$/.test(input);
```

### Mistake 2: Too many strategies that are almost identical

**Smelly:**
```typescript
class SortAscending implements SortStrategy { /* ... */ }
class SortDescending implements SortStrategy { /* ... */ }
// These only differ by one comparison - parameterize instead!
```

**Better:**
```typescript
class SortStrategy {
  constructor(private direction: "asc" | "desc") {}
  sort(data: number[]) {
    return this.direction === "asc"
      ? data.sort((a, b) => a - b)
      : data.sort((a, b) => b - a);
  }
}
```

### Mistake 3: Client needs to know all strategy details

**Bad - client must understand strategy internals:**
```typescript
const strategy = new FastestRoute();
strategy.setTollPreference(true);  // Client knows too much
strategy.setAvoidHighways(false);  // about strategy internals
navigator.setStrategy(strategy);
```

**Better - configure through constructor or simple options:**
```typescript
const strategy = new FastestRoute({ avoidTolls: false });
navigator.setStrategy(strategy);
```

---

## When to Use Strategy?

### Use Strategy When...

| Situation | Why |
|-----------|-----|
| **Multiple algorithms for the same task** | Each algorithm becomes its own class |
| **Algorithm should be swappable at runtime** | setStrategy() makes this easy |
| **You have a big if/else or switch for behavior** | Replace conditionals with objects |
| **Algorithm has complex logic worth isolating** | Easier to test and maintain separately |

### Don't Use Strategy When...

| Situation | Why |
|-----------|-----|
| **Only 2 simple options** | A simple if/else is fine |
| **Algorithm never changes** | No need for swappability |
| **No shared interface** | Strategies must be interchangeable |
| **A function would suffice** | Don't wrap a one-liner in a class |

---

## Key Vocabulary

| Word | Meaning |
|------|---------|
| **Strategy** | Interface that all algorithms implement |
| **Concrete Strategy** | A specific algorithm (e.g., FastestRoute) |
| **Context** | The class that uses a strategy (e.g., Navigator) |
| **Delegation** | Context passes the work to the strategy instead of doing it itself |

---

## Quick Quiz

1. What is the main benefit of Strategy pattern over if/else?
2. What does the Context class do - implement the algorithm or delegate to it?
3. Can you change the strategy while the program is running?
4. What's the difference between Strategy and Factory patterns?
5. When should you NOT use Strategy and just use a simple function instead?

<details>
<summary>Answers</summary>

1. Each algorithm is isolated in its own class - easy to add, remove, test, and swap without modifying existing code (Open/Closed Principle)
2. Delegate - the Context holds a reference to a Strategy and calls its method
3. Yes! That's a key feature - setStrategy() lets you swap algorithms at runtime
4. Factory is about CREATING objects; Strategy is about CHOOSING behavior/algorithms
5. When the "strategy" is just a one-liner or stateless function - a plain function or lambda is simpler

</details>

---

## Summary

**Strategy Pattern in 30 seconds:**
- Define a family of algorithms, each in its own class
- All algorithms implement the same interface
- A Context class holds one strategy and delegates work to it
- Swap strategies at runtime with setStrategy()
- Use when: multiple algorithms for the same task, runtime swapping needed, replacing big if/else chains

---

## Try It Yourself

1. Read the code in `code/` folder
2. Create a `TollFreeRouteStrategy` that avoids toll roads
3. Add a `fuelCost` field to `RouteResult` and calculate it per strategy
4. Try using a function instead of a class - compare the approaches
5. Create a payment system with CreditCard, PayPal, and Crypto strategies
