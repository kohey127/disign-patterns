/**
 * Strategy Pattern - Navigator (Context Class)
 *
 * The CONTEXT class holds a reference to a strategy and delegates work to it.
 * It doesn't know HOW the route is calculated - it just asks the strategy to do it.
 *
 * KEY POINT: The Navigator can switch strategies at RUNTIME.
 * The same Navigator object can use different algorithms at different times.
 */

import {
  RouteStrategy,
  RouteResult,
  FastestRouteStrategy,
  ShortestRouteStrategy,
  ScenicRouteStrategy,
} from "./RouteStrategy";

// ============================================
// CONTEXT CLASS
// ============================================

export class Navigator {
  // The strategy is stored as a private field
  // The Navigator only knows about the RouteStrategy INTERFACE
  private strategy: RouteStrategy;

  constructor(strategy: RouteStrategy) {
    this.strategy = strategy;
  }

  /**
   * Switch the strategy at RUNTIME.
   *
   * This is the POWER of Strategy pattern:
   * You can change the algorithm without changing the Navigator class.
   */
  setStrategy(strategy: RouteStrategy): void {
    this.strategy = strategy;
  }

  /**
   * Get the current strategy (useful for display).
   */
  getStrategyName(): string {
    return this.strategy.getName();
  }

  /**
   * Navigate from origin to destination.
   *
   * DELEGATION: Navigator doesn't calculate the route itself.
   * It DELEGATES to whatever strategy is currently set.
   */
  navigate(origin: string, destination: string): RouteResult {
    console.log(`  Strategy: ${this.strategy.getName()}`);
    console.log(`  From: ${origin}`);
    console.log(`  To: ${destination}`);

    // The actual calculation is done by the strategy
    const result = this.strategy.calculateRoute(origin, destination);

    console.log(`  Path: ${result.path.join(" → ")}`);
    console.log(`  Distance: ${result.distanceKm} km`);
    console.log(`  Time: ${result.estimatedMinutes} minutes`);
    console.log(`  ${result.description}`);

    return result;
  }
}

// ============================================
// HELPER: Strategy Factory Function
// ============================================

/**
 * Route type for the helper function.
 */
export type RouteType = "fastest" | "shortest" | "scenic";

/**
 * Create a strategy by name.
 *
 * This is a convenience function - useful when the strategy choice
 * comes from user input (e.g., a dropdown menu or URL parameter).
 *
 * NOTE: The exhaustiveness check (never) ensures that if you add
 * a new RouteType, TypeScript will remind you to handle it here.
 */
export function createRouteStrategy(type: RouteType): RouteStrategy {
  switch (type) {
    case "fastest":
      return new FastestRouteStrategy();
    case "shortest":
      return new ShortestRouteStrategy();
    case "scenic":
      return new ScenicRouteStrategy();
    default: {
      // Exhaustiveness check - TypeScript error if a case is missing
      const _exhaustive: never = type;
      throw new Error(`Unknown route type: ${_exhaustive}`);
    }
  }
}
