/**
 * Template Method Pattern - Concrete Drink Classes
 *
 * Each class extends HotDrink and fills in the "blanks":
 * - brew() — how to brew this specific drink
 * - addCondiments() — what to add after pouring
 * - wantsCondiments() — optional hook override
 *
 * The make() template method in HotDrink controls the order.
 * These classes only define WHAT happens at each step, not WHEN.
 */

import { HotDrink } from "./HotDrink";

// ============================================
// CONCRETE CLASS: Tea
// ============================================

/**
 * Tea: steep the tea bag, add lemon.
 *
 * Uses the default wantsCondiments() (true),
 * so addCondiments() will be called.
 */
export class Tea extends HotDrink {
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

/**
 * Coffee: drip through filter, add milk and sugar.
 *
 * Uses the default wantsCondiments() (true),
 * so addCondiments() will be called.
 */
export class Coffee extends HotDrink {
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

/**
 * Black Coffee: same brewing as Coffee, but NO condiments.
 *
 * Overrides the wantsCondiments() hook to return false.
 * This means addCondiments() will NOT be called,
 * even though it's implemented.
 */
export class BlackCoffee extends HotDrink {
  brew(): void {
    console.log("  Dripping coffee through filter");
  }

  addCondiments(): void {
    console.log("  Adding milk and sugar");
  }

  // Override the hook — no condiments for black coffee
  wantsCondiments(): boolean {
    return false;
  }
}

// ============================================
// CONCRETE CLASS: HotChocolate (uses hook)
// ============================================

/**
 * Hot Chocolate: melt chocolate, no condiments needed.
 *
 * Another example of using the hook to skip condiments.
 */
export class HotChocolate extends HotDrink {
  brew(): void {
    console.log("  Melting chocolate into hot water");
  }

  addCondiments(): void {
    console.log("  Adding whipped cream");
  }

  // Hot chocolate is already sweet — no condiments
  wantsCondiments(): boolean {
    return false;
  }
}
