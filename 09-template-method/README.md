# Template Method Pattern

## What is it? (One sentence)

**Template Method defines the skeleton of an algorithm in a base class, and lets subclasses override specific steps without changing the overall structure.**

---

## Before You Read This

Make sure you understand abstract classes and inheritance in TypeScript first!

- **Template Method** is a Behavioral pattern (about how objects communicate)
- It is the "inheritance version" of **Strategy**
- Strategy = swap the **entire algorithm** via composition (has-a)
- Template Method = customize **steps** of an algorithm via inheritance (is-a)
- If you studied Strategy already, this will feel familiar — but the approach is different

---

## The Problem (Why do we need this?)

Imagine you work at a cafe. You make tea and coffee all day.

The steps are almost the same:

```
Making Tea:            Making Coffee:
1. Boil water          1. Boil water           ← same
2. Steep tea bag       2. Drip through filter   ← different
3. Pour into cup       3. Pour into cup         ← same
4. Add lemon           4. Add milk and sugar    ← different
```

Two out of four steps are **identical**. Only steps 2 and 4 are different.

**The naive approach:**

```typescript
function makeTea(): void {
  console.log("Boiling water...");
  console.log("Steeping tea bag for 3 minutes"); // Only this is different
  console.log("Pouring into cup...");
  console.log("Adding lemon");                   // Only this is different
}

function makeCoffee(): void {
  console.log("Boiling water...");
  console.log("Dripping coffee through filter"); // Only this is different
  console.log("Pouring into cup...");
  console.log("Adding milk and sugar");           // Only this is different
}

makeTea();
makeCoffee();
```

**Problems:**

1. **Duplicate code** — "Boiling water" and "Pouring into cup" are copied in both functions
2. **Easy to forget steps** — If you add "Warm the cup first", you must change every function
3. **No shared structure** — Nothing shows that tea and coffee follow the same 4-step process
4. **Hard to add new drinks** — Adding hot chocolate means copying the whole thing again

What if you could define the structure once, and only change the parts that differ?

---

## The Solution (How Template Method helps)

Think of a **recipe card** with some steps printed and some blank.

- The **printed steps** are the same for every drink (boil water, pour into cup)
- The **blank steps** must be filled in by each drink (how to brew, what to add)

In code, this means:

### Step 1: Create the base class with the template method

The base class defines the algorithm structure. Some steps are fixed. Some are abstract (blank — subclasses must fill them in).

```typescript
abstract class HotDrink {
  // This is the TEMPLATE METHOD
  // It defines the algorithm: 4 steps, always in this order
  make(): void {
    this.boilWater();
    this.brew();       // abstract — each drink does this differently
    this.pourInCup();
    this.addCondiments(); // abstract — each drink does this differently
  }

  // Fixed steps — same for every drink
  boilWater(): void {
    console.log("Boiling water...");
  }

  pourInCup(): void {
    console.log("Pouring into cup...");
  }

  // Abstract steps — subclasses MUST fill these in
  abstract brew(): void;
  abstract addCondiments(): void;
}
```

### Step 2: Create subclasses that fill in the blanks

Each subclass only writes the parts that are different. Everything else (`boilWater`, `pourInCup`, `make`) comes from `HotDrink`.

```typescript
// Continues from HotDrink above

class Tea extends HotDrink {
  brew(): void {
    console.log("Steeping tea bag for 3 minutes");
  }
  addCondiments(): void {
    console.log("Adding lemon");
  }
}

class Coffee extends HotDrink {
  brew(): void {
    console.log("Dripping coffee through filter");
  }
  addCondiments(): void {
    console.log("Adding milk and sugar");
  }
}
```

### Step 3: Use it

```typescript
// Continues from above

const tea = new Tea();
tea.make();
// Boiling water...
// Steeping tea bag for 3 minutes
// Pouring into cup...
// Adding lemon

const coffee = new Coffee();
coffee.make();
// Boiling water...
// Dripping coffee through filter
// Pouring into cup...
// Adding milk and sugar
```

**The structure is defined once. Each drink only writes the parts that differ.**

---

## Hook Methods (Optional Steps)

What if some drinks don't want condiments? For example, black coffee — no milk, no sugar.

A **hook** is a method with a **default implementation** that subclasses **can** override — but don't have to. It is different from an abstract method, which subclasses **must** override.

We change `HotDrink`'s `make()` to check a hook before adding condiments:

```typescript
// Only showing the changed parts of HotDrink:

  make(): void {
    this.boilWater();
    this.brew();
    this.pourInCup();
    if (this.wantsCondiments()) {  // ← NEW: check the hook
      this.addCondiments();
    }
  }

  // NEW: Hook method — default is true, subclasses CAN override
  wantsCondiments(): boolean {
    return true;
  }
```

Now a subclass can skip condiments by overriding the hook:

```typescript
class BlackCoffee extends HotDrink {
  brew(): void { console.log("Dripping coffee through filter"); }
  addCondiments(): void { console.log("Adding milk and sugar"); }

  // Override the hook — no condiments for black coffee!
  wantsCondiments(): boolean {
    return false;
  }
}

// Tea uses default wantsCondiments() (true) — condiments added
const tea = new Tea();
tea.make();
// Boiling water...
// Steeping tea bag for 3 minutes
// Pouring into cup...
// Adding lemon          ← condiments added

// BlackCoffee overrides wantsCondiments() to false — condiments skipped
const black = new BlackCoffee();
black.make();
// Boiling water...
// Dripping coffee through filter
// Pouring into cup...
//                       ← no condiments!
```

**Summary of method types in Template Method:**

| Type | Must override? | Has default? | Example |
|------|---------------|-------------|---------|
| **Template method** | No (don't override) | Yes (the algorithm) | `make()` |
| **Abstract method** | Yes | No | `brew()` |
| **Concrete method** | No | Yes (shared logic) | `boilWater()` |
| **Hook method** | No (optional) | Yes (often empty or returns default) | `wantsCondiments()` |

### Warning: Hooks can be confusing in practice

Hook methods are **implicit**. A developer reading only the subclass cannot tell that `wantsCondiments()` exists in the base class, or that it defaults to `true`. The behavior is hidden.

```typescript
// A developer reads this class:
class BlackCoffee extends HotDrink {
  brew(): void { console.log("Dripping coffee through filter"); }
  addCondiments(): void { console.log("Adding milk and sugar"); }
  wantsCondiments(): boolean { return false; }
}
// "What is wantsCondiments()? Where does it come from? What happens if I delete it?"
// You must read the base class to understand.
```

**A constructor parameter is often clearer:**

```typescript
abstract class HotDrink {
  constructor(private withCondiments: boolean = true) {}

  make(): void {
    this.boilWater();
    this.brew();
    this.pourInCup();
    if (this.withCondiments) {
      this.addCondiments();
    }
  }

  boilWater(): void { console.log("Boiling water..."); }
  pourInCup(): void { console.log("Pouring into cup..."); }
  abstract brew(): void;
  abstract addCondiments(): void;
}

class BlackCoffee extends HotDrink {
  constructor() {
    super(false); // ← Explicit! "no condiments" is obvious at a glance
  }
  brew(): void { console.log("Dripping coffee through filter"); }
  addCondiments(): void { console.log("Adding milk and sugar"); }
}
```

**When are hooks OK?**

| Situation | Hooks OK? | Why |
|-----------|----------|-----|
| **Frameworks** (React, test frameworks) | Yes | All developers read the docs. Hooks are a well-known convention. |
| **Your own app code** | Usually no | Team members may not read the base class carefully. Use explicit parameters instead. |

---

## Visual Explanation

```
REAL WORLD:

  Recipe Card for Hot Drinks
  ┌──────────────────────────────────┐
  │ 1. Boil water         [printed]  │
  │ 2. Brew               [blank]    │  ← fill in for each drink
  │ 3. Pour into cup      [printed]  │
  │ 4. Add condiments     [blank]    │  ← fill in for each drink
  └──────────────────────────────────┘

  Tea fills in:    2. "Steep tea bag"    4. "Add lemon"
  Coffee fills in: 2. "Drip through filter"  4. "Add milk & sugar"


IN CODE:

  ┌─────────────────────────────────────┐
  │       HotDrink (abstract)           │
  │                                     │
  │  make():  ─── the TEMPLATE METHOD   │
  │    1. boilWater()      [fixed]      │
  │    2. brew()           [abstract]   │
  │    3. pourInCup()      [fixed]      │
  │    4. addCondiments()  [abstract]   │
  │    hook: wantsCondiments() [hook]   │
  └──────────────────┬──────────────────┘
                     │
          ┌──────────┴──────────┐
          │                     │
  ┌───────┴───────┐   ┌────────┴──────┐
  │     Tea       │   │    Coffee     │
  │               │   │               │
  │ brew():       │   │ brew():       │
  │  "steep bag"  │   │  "drip filter"│
  │               │   │               │
  │ addCondiments │   │ addCondiments │
  │  "add lemon"  │   │  "milk+sugar" │
  └───────────────┘   └───────────────┘


KEY INSIGHT:
- The BASE CLASS controls the algorithm structure
- Subclasses only fill in the BLANKS
- The order of steps never changes
- This is the OPPOSITE of Strategy:
    Strategy  → client picks the algorithm (composition)
    Template  → base class locks the structure (inheritance)
```

---

## Complete Example

```typescript
// ============================================
// ABSTRACT BASE CLASS
// ============================================

abstract class HotDrink {
  // The TEMPLATE METHOD — defines the algorithm
  // Subclasses cannot change the order of steps
  make(): void {
    this.boilWater();
    this.brew();
    this.pourInCup();
    if (this.wantsCondiments()) {
      this.addCondiments();
    }
  }

  // Fixed steps — same for every drink
  boilWater(): void {
    console.log("  Boiling water...");
  }

  pourInCup(): void {
    console.log("  Pouring into cup...");
  }

  // Abstract steps — subclasses MUST implement
  abstract brew(): void;
  abstract addCondiments(): void;

  // Hook — subclasses CAN override (default: true)
  wantsCondiments(): boolean {
    return true;
  }
}

// ============================================
// CONCRETE CLASS: Tea
// ============================================

class Tea extends HotDrink {
  brew(): void {
    console.log("  Steeping tea bag for 3 minutes");
  }

  addCondiments(): void {
    console.log("  Adding lemon");
  }
}

// ============================================
// CONCRETE CLASS: Coffee
// ============================================

class Coffee extends HotDrink {
  brew(): void {
    console.log("  Dripping coffee through filter");
  }

  addCondiments(): void {
    console.log("  Adding milk and sugar");
  }
}

// ============================================
// CONCRETE CLASS: BlackCoffee (uses hook)
// ============================================

class BlackCoffee extends HotDrink {
  brew(): void {
    console.log("  Dripping coffee through filter");
  }

  addCondiments(): void {
    console.log("  Adding milk and sugar");
  }

  // Override the hook — skip condiments
  wantsCondiments(): boolean {
    return false;
  }
}

// ============================================
// USAGE
// ============================================

console.log("Making Tea:");
const tea = new Tea();
tea.make();

console.log("\nMaking Coffee:");
const coffee = new Coffee();
coffee.make();

console.log("\nMaking Black Coffee:");
const black = new BlackCoffee();
black.make();
```

---

## Real-World Use Cases

### 1. Testing Frameworks (setup → test → teardown)

Every test follows the same structure. You only write the test-specific parts.

```typescript
abstract class TestCase {
  // Template method
  run(): void {
    this.setUp();
    this.execute();
    this.tearDown();
  }

  // Hook — optional setup (default: do nothing)
  setUp(): void {}

  // Abstract — each test writes its own logic
  abstract execute(): void;

  // Hook — optional cleanup (default: do nothing)
  tearDown(): void {}
}

class UserLoginTest extends TestCase {
  setUp(): void {
    console.log("Creating test user in database...");
  }

  execute(): void {
    console.log("Testing login with valid password...");
  }

  tearDown(): void {
    console.log("Deleting test user from database...");
  }
}

const test = new UserLoginTest();
test.run();
// Creating test user in database...
// Testing login with valid password...
// Deleting test user from database...
```

### 2. Data Export (fetch → format → save)

Exporting data to different formats. The overall process is the same.

```typescript
abstract class DataExporter {
  // Template method
  export(data: string[]): string {
    const header = this.formatHeader();
    const body = this.formatBody(data);
    const footer = this.formatFooter();
    return header + body + footer;
  }

  abstract formatHeader(): string;
  abstract formatBody(data: string[]): string;

  // Hook — not all formats need a footer
  formatFooter(): string {
    return "";
  }
}

class CsvExporter extends DataExporter {
  formatHeader(): string {
    return "name,email\n";
  }

  formatBody(data: string[]): string {
    return data.join("\n");
  }
}

class HtmlExporter extends DataExporter {
  formatHeader(): string {
    return "<table><tr><th>Data</th></tr>";
  }

  formatBody(data: string[]): string {
    return data.map((row) => `<tr><td>${row}</td></tr>`).join("");
  }

  formatFooter(): string {
    return "</table>";
  }
}

const csv = new CsvExporter();
console.log(csv.export(["Alice,a@test.com", "Bob,b@test.com"]));
// name,email
// Alice,a@test.com
// Bob,b@test.com

const html = new HtmlExporter();
console.log(html.export(["Alice", "Bob"]));
// <table><tr><th>Data</th></tr><tr><td>Alice</td></tr><tr><td>Bob</td></tr></table>
```

### 3. React Class Components

React's class component lifecycle is a Template Method. React calls the methods in a fixed order. You override only the ones you need.

```
React calls these in order (you can't change the order):

  1. constructor()           ← you override
  2. render()                ← you MUST override (abstract)
  3. componentDidMount()     ← hook (optional)
  4. componentDidUpdate()    ← hook (optional)
  5. componentWillUnmount()  ← hook (optional)

React controls the STRUCTURE.
You fill in the STEPS.
```

---

## Template Method vs Strategy

This is the most important comparison. Both patterns solve a similar problem — "I have an algorithm that varies" — but they use different approaches.

```
TEMPLATE METHOD (inheritance):

  ┌─────────────────────┐
  │  HotDrink (base)    │
  │                     │
  │  make():            │    Base class CONTROLS the structure
  │    1. boilWater()   │    Subclasses fill in blanks
  │    2. brew()  ←─────│─── abstract (must override)
  │    3. pourInCup()   │
  │    4. addCondiments │
  └─────────┬───────────┘
            │ extends
     ┌──────┴──────┐
     │    Tea      │
     │ brew(): ... │
     └─────────────┘


STRATEGY (composition):

  ┌─────────────────────┐      ┌──────────────────┐
  │  Navigator (context) │      │ RouteStrategy    │
  │                     │      │ (interface)      │
  │  strategy ──────────│─────►│ calculateRoute() │
  │  navigate():        │      └──────────────────┘
  │    strategy.calc()  │               ▲
  └─────────────────────┘        ┌──────┴──────┐
                                 │ FastestRoute │
  Context DELEGATES              │ calc(): ... │
  to a separate object           └─────────────┘
```

| Aspect | Template Method | Strategy |
|--------|----------------|----------|
| **How it varies** | Override **steps** of an algorithm | Swap the **entire algorithm** |
| **Mechanism** | Inheritance (is-a) | Composition (has-a) |
| **When decided** | At compile time (class definition) | At runtime (`setStrategy()`) |
| **Can change at runtime?** | No — you can't change a class's parent | Yes — swap strategy anytime |
| **Base class role** | Controls the algorithm structure | Delegates everything to strategy |
| **Code reuse** | Shared steps live in the base class | Each strategy is fully independent |
| **Number of classes** | One base + one subclass per variation | One context + one class per algorithm |

### When to use which?

| Situation | Use Template Method | Use Strategy |
|-----------|-------------------|-------------|
| Algorithms share many common steps | Yes — put shared steps in base class | No — each strategy would duplicate them |
| Need to swap at runtime | No | Yes |
| Variations are small (1-2 steps differ) | Yes | Overkill |
| Variations are large (entire algorithm differs) | Overkill | Yes |
| You prefer composition over inheritance | No | Yes |

### Easy Explanation

**Template Method** is like a **fill-in-the-blank test**:
```
The teacher writes the questions (structure).
Students fill in the answers (details).
Everyone follows the same format.
```

**Strategy** is like **hiring a different chef**:
```
The restaurant picks a chef.
Each chef cooks completely differently.
You can swap chefs anytime.
```

---

## Anti-patterns

### 1. Too Many Abstract Steps — Forcing subclasses to implement everything

If the base class has many abstract methods, subclasses become huge and the pattern loses its benefit. The whole point is that subclasses only write the parts that differ.

**Bad — 6 abstract methods, subclasses are bloated:**
```typescript
abstract class Report {
  generate(): void {
    this.fetchData();
    this.validateData();
    this.formatHeader();
    this.formatBody();
    this.formatFooter();
    this.save();
  }

  abstract fetchData(): void;
  abstract validateData(): void;
  abstract formatHeader(): void;
  abstract formatBody(): void;
  abstract formatFooter(): void;
  abstract save(): void;
}

// Every subclass must implement ALL 6 methods
// Even if most are the same across reports
```

**Better — only make the truly varying steps abstract:**
```typescript
abstract class Report {
  generate(): void {
    this.fetchData();
    this.validateData();
    this.formatHeader();
    this.formatBody();
    this.formatFooter();
    this.save();
  }

  fetchData(): void { /* shared default logic */ }
  validateData(): void { /* shared default logic */ }
  formatFooter(): void { /* shared default logic */ }
  save(): void { /* shared default logic */ }

  // Only these actually differ between reports
  abstract formatHeader(): void;
  abstract formatBody(): void;
}
```

**Rule of thumb:** If most subclasses would write the same code for a step, it should not be abstract.

### 2. Breaking the Template — Overriding the template method itself

The template method defines the algorithm structure. If a subclass overrides it, the structure breaks and the pattern loses its purpose.

**Bad — subclass changes the order:**
```typescript
abstract class HotDrink {
  make(): void {
    this.boilWater();
    this.brew();
    this.pourInCup();
    this.addCondiments();
  }

  boilWater(): void { console.log("Boiling water..."); }
  pourInCup(): void { console.log("Pouring into cup..."); }
  abstract brew(): void;
  abstract addCondiments(): void;
}

class WeirdTea extends HotDrink {
  brew(): void { console.log("Steeping tea bag"); }
  addCondiments(): void { console.log("Adding lemon"); }

  // Overrides the template method — breaks the pattern!
  make(): void {
    this.addCondiments(); // Lemon first??
    this.brew();
    // Forgot boilWater and pourInCup!
  }
}
```

**In languages like Java, you can prevent this with `final`. TypeScript does not have `final` for methods.** So you must rely on convention: **never override the template method**.

### 3. Using Template Method When Strategy Is Better

If subclasses share almost no common steps, inheritance adds complexity for no benefit. Use Strategy instead.

**Bad — the "shared" base class has nothing shared:**
```typescript
abstract class Notifier {
  send(message: string): void {
    this.connect();
    this.format(message);
    this.deliver();
    this.disconnect();
  }

  // Every step is abstract — nothing is shared!
  abstract connect(): void;
  abstract format(message: string): void;
  abstract deliver(): void;
  abstract disconnect(): void;
}
```

If every step is abstract, the base class only provides the **order**. A Strategy interface does the same thing more simply:

**Better — use Strategy:**
```typescript
interface Notifier {
  send(message: string): void;
}

class EmailNotifier implements Notifier {
  send(message: string): void {
    // connect, format, deliver, disconnect — all in one place
    console.log(`Sending email: ${message}`);
  }
}

class SmsNotifier implements Notifier {
  send(message: string): void {
    console.log(`Sending SMS: ${message}`);
  }
}
```

**Rule of thumb:** If subclasses share less than half the steps, prefer Strategy.

### 4. Calling Abstract Methods in Constructor

In some languages, calling an abstract method in the constructor can cause bugs. The subclass is not fully created yet when the base constructor runs.

**Bad — brew() runs before Tea is fully constructed:**
```typescript
abstract class HotDrink {
  constructor() {
    this.brew(); // Dangerous! Subclass may not be ready yet
  }

  abstract brew(): void;
}

class Tea extends HotDrink {
  brew(): void {
    console.log("Steeping tea bag");
  }
}
```

**Better — use a separate method:**
```typescript
abstract class HotDrink {
  abstract brew(): void;

  make(): void {
    this.brew(); // Called after construction — safe
  }
}

class Tea extends HotDrink {
  brew(): void {
    console.log("Steeping tea bag");
  }
}

const tea = new Tea(); // Constructor does nothing dangerous
tea.make();            // Now it's safe to call abstract methods
```

---

## When to Use Template Method?

### Use Template Method When...

| Situation | Why |
|-----------|-----|
| **Several classes follow the same step-by-step process** | Put the shared structure in a base class |
| **Most steps are the same, only 1-2 steps differ** | Subclasses only write what's different |
| **You want to enforce a fixed order of steps** | The base class controls the order |
| **You want to add "hooks" for optional behavior** | Hooks let subclasses plug in without forced overrides |

### Don't Use Template Method When...

| Situation | Why |
|-----------|-----|
| **Every step is different across subclasses** | No shared code — use Strategy instead |
| **You need to swap algorithms at runtime** | Inheritance is fixed — use Strategy instead |
| **There are only 1-2 variations, and they're simple** | A simple if/else or function parameter is enough |
| **The class hierarchy is already deep** | Adding more inheritance layers makes code hard to follow |

---

## Key Vocabulary

| Word | Meaning |
|------|---------|
| **Template Method** | The method in the base class that defines the algorithm's structure (e.g., `make()`) |
| **Abstract Method** | A method with no body — subclasses MUST override it (e.g., `brew()`) |
| **Hook Method** | A method with a default body — subclasses CAN override it (e.g., `wantsCondiments()`) |
| **Concrete Method** | A method with a fixed body — subclasses should NOT override it (e.g., `boilWater()`) |
| **Base Class** | The abstract class that holds the template method (e.g., `HotDrink`) |
| **Hollywood Principle** | "Don't call us, we'll call you" — the base class calls the subclass, not the other way around |

---

## Quick Quiz

1. What is the difference between an abstract method and a hook method?
2. Why is Template Method called "the inheritance version of Strategy"?
3. Can you change which "template" is used at runtime?
4. What is the Hollywood Principle?
5. When should you use Strategy instead of Template Method?

<details>
<summary>Answers</summary>

1. An abstract method has no body — subclasses MUST override it. A hook method has a default body — subclasses CAN override it but don't have to.
2. Both solve "algorithms that vary." Strategy uses composition (a separate object holds the algorithm). Template Method uses inheritance (the base class holds the structure, subclasses fill in steps).
3. No. The subclass is chosen when you create the object (`new Tea()` vs `new Coffee()`). You can't change it after that. If you need runtime swapping, use Strategy.
4. "Don't call us, we'll call you." The base class calls the subclass methods — the subclass never calls the template method's individual steps. The base class is in control.
5. When every step differs across implementations (nothing shared), or when you need to swap algorithms at runtime.

</details>

---

## Summary

**Template Method Pattern in 30 seconds:**
- You have several classes that follow the same step-by-step process
- Most steps are shared, but 1-2 steps differ
- Put the shared structure in an abstract base class (the template method)
- Subclasses only override the steps that are different
- Use **hooks** for optional steps (default body, subclasses can override)
- The base class controls the order — subclasses cannot change it
- If you need to swap algorithms at runtime, use **Strategy** instead

---

## Try It Yourself

1. Read the code in `code/` folder
2. Create a `GreenTea` class that steeps for 2 minutes instead of 3 and adds honey
3. Create a `HotChocolate` class that brews by melting chocolate, and override `wantsCondiments()` to return false
4. Add a new hook method `wantsExtraStep()` that lets subclasses add an extra step between pour and condiments (e.g., "Stirring...")
5. Compare: rewrite the same example using Strategy pattern instead of Template Method. Which feels simpler? When is each one better?
