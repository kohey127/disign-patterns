/**
 * Template Method Pattern - HotDrink (Abstract Base Class)
 *
 * WHAT IS A TEMPLATE METHOD?
 * A Template Method defines the skeleton of an algorithm in a base class.
 * Subclasses override specific steps without changing the overall structure.
 *
 * In this example:
 * - HotDrink is the abstract base class
 * - make() is the template method — it defines the 4-step process
 * - brew() and addCondiments() are abstract — subclasses must implement them
 * - wantsCondiments() is a hook — subclasses can override it (but don't have to)
 */

// ============================================
// ABSTRACT BASE CLASS
// ============================================

/**
 * The base class for all hot drinks.
 *
 * The make() method is the TEMPLATE METHOD.
 * It defines the algorithm: 4 steps, always in this order.
 *
 * Two types of methods:
 * - Fixed: boilWater(), pourInCup() — same for every drink
 * - Abstract: brew(), addCondiments() — each drink does this differently
 * - Hook: wantsCondiments() — has a default, subclasses CAN override
 */
export abstract class HotDrink {
  /**
   * The TEMPLATE METHOD.
   *
   * This defines the algorithm structure.
   * Subclasses should NOT override this method.
   * (TypeScript doesn't have "final", so this is by convention.)
   */
  make(): void {
    this.boilWater();
    this.brew();
    this.pourInCup();
    if (this.wantsCondiments()) {
      this.addCondiments();
    }
  }

  // ============================================
  // FIXED STEPS — same for every drink
  // ============================================

  /**
   * Step 1: Boil water.
   * This is the same for all hot drinks.
   */
  boilWater(): void {
    console.log("  Boiling water...");
  }

  /**
   * Step 3: Pour into cup.
   * This is the same for all hot drinks.
   */
  pourInCup(): void {
    console.log("  Pouring into cup...");
  }

  // ============================================
  // ABSTRACT STEPS — subclasses MUST implement
  // ============================================

  /**
   * Step 2: Brew the drink.
   * Each drink brews differently (tea bag, coffee filter, etc.)
   */
  abstract brew(): void;

  /**
   * Step 4: Add condiments.
   * Each drink has different condiments (lemon, milk, etc.)
   */
  abstract addCondiments(): void;

  // ============================================
  // HOOK METHOD — subclasses CAN override
  // ============================================

  /**
   * Hook: Does this drink want condiments?
   *
   * Default is true. Subclasses can override to return false
   * if they don't want condiments (e.g., black coffee).
   *
   * A hook is different from an abstract method:
   * - Abstract: subclass MUST implement
   * - Hook: subclass CAN override (has a default)
   */
  wantsCondiments(): boolean {
    return true;
  }
}
