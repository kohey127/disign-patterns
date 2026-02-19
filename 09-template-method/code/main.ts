/**
 * Main Demo - Template Method Pattern in Action
 *
 * Run this file to see how Template Method works:
 *   bun run main.ts
 *
 * KEY INSIGHT: The base class (HotDrink) controls the algorithm structure.
 * Subclasses only fill in the steps that differ.
 * The order of steps is always: boilWater → brew → pourInCup → addCondiments.
 */

import { Tea, Coffee, BlackCoffee, HotChocolate } from "./Drinks";

// ============================================
// DEMO START
// ============================================

console.log("=".repeat(55));
console.log("  TEMPLATE METHOD PATTERN DEMO - Hot Drinks");
console.log("=".repeat(55));

// ============================================
// DEMO 1: BASIC USAGE
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 1: Making Tea");
console.log("─".repeat(55));
console.log();

// The make() template method runs: boilWater → brew → pourInCup → addCondiments
const tea = new Tea();
tea.make();

// ============================================
// DEMO 2: DIFFERENT DRINK, SAME STRUCTURE
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 2: Making Coffee (same structure, different steps)");
console.log("─".repeat(55));
console.log();

// Same 4-step process, but brew() and addCondiments() are different
const coffee = new Coffee();
coffee.make();

// ============================================
// DEMO 3: HOOK METHOD IN ACTION
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 3: Hook Method - Black Coffee (no condiments)");
console.log("─".repeat(55));
console.log();

// BlackCoffee overrides wantsCondiments() to return false
// So addCondiments() is skipped!
const blackCoffee = new BlackCoffee();
blackCoffee.make();

console.log("\n  --- Hot Chocolate (also uses hook) ---\n");

const hotChocolate = new HotChocolate();
hotChocolate.make();

// ============================================
// DEMO 4: COMPARE ALL DRINKS
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 4: Compare All Drinks");
console.log("─".repeat(55));

const drinks = [
  { name: "Tea", drink: new Tea() },
  { name: "Coffee", drink: new Coffee() },
  { name: "Black Coffee", drink: new BlackCoffee() },
  { name: "Hot Chocolate", drink: new HotChocolate() },
];

for (const { name, drink } of drinks) {
  console.log(`\n  ☕ ${name}:`);
  drink.make();
}

// ============================================
// KEY POINT DEMONSTRATION
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  KEY POINT: Template Method vs Strategy");
console.log("─".repeat(55));

console.log(`
  TEMPLATE METHOD (this pattern):

  abstract class HotDrink {
    make() {                    ← base class defines structure
      this.boilWater();         ← fixed step
      this.brew();              ← subclass fills in
      this.pourInCup();         ← fixed step
      this.addCondiments();     ← subclass fills in
    }
  }

  class Tea extends HotDrink {
    brew() { ... }              ← only writes what's different
    addCondiments() { ... }
  }


  STRATEGY (different approach):

  interface BrewStrategy {
    brew(): void;               ← entire algorithm in one object
  }

  class TeaStrategy implements BrewStrategy {
    brew() { ... }              ← whole algorithm lives here
  }

  class DrinkMaker {
    constructor(strategy: BrewStrategy) { ... }
    make() {
      this.strategy.brew();     ← delegates to strategy
    }
  }


  KEY DIFFERENCE:
  - Template Method: base class CONTROLS the structure (inheritance)
  - Strategy: context DELEGATES to a separate object (composition)
  - Template Method: steps are fixed, details vary
  - Strategy: the entire algorithm can be swapped at runtime
`);

// ============================================
// DEMO COMPLETE
// ============================================

console.log("=".repeat(55));
console.log("  DEMO COMPLETE");
console.log("=".repeat(55));
console.log(`
  Try these exercises:

  1. Create a GreenTea class that steeps for 2 minutes
     and adds honey instead of lemon

  2. Create a Matcha class that whisks matcha powder
     and has no condiments (use the hook)

  3. Add a new hook method wantsExtraStep() that lets
     subclasses add an extra step (e.g., "Stirring...")

  4. Rewrite this example using Strategy pattern instead.
     Compare: which feels simpler for this use case?
`);
