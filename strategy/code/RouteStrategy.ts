/**
 * Strategy Pattern - Route Strategy Interface & Concrete Strategies
 *
 * WHAT IS A STRATEGY?
 * A Strategy is an interchangeable algorithm.
 * All strategies share the same interface, so the client
 * can swap them without knowing the implementation details.
 *
 * In this example:
 * - RouteStrategy is the strategy interface
 * - FastestRouteStrategy, ShortestRouteStrategy, ScenicRouteStrategy
 *   are concrete strategies (different routing algorithms)
 */

// ============================================
// ROUTE RESULT - what every strategy returns
// ============================================

/**
 * The result of calculating a route.
 * All strategies return the same shape of data.
 */
export interface RouteResult {
  path: string[];
  distanceKm: number;
  estimatedMinutes: number;
  description: string;
}

// ============================================
// STRATEGY INTERFACE
// ============================================

/**
 * The Strategy interface.
 *
 * Every routing algorithm must implement this interface.
 * This is the KEY to the pattern - the client (Navigator)
 * only knows about this interface, not the concrete classes.
 */
export interface RouteStrategy {
  calculateRoute(origin: string, destination: string): RouteResult;
  getName(): string;
}

// ============================================
// CONCRETE STRATEGY 1: Fastest Route
// ============================================

/**
 * Takes the highway - fastest time, but not the shortest distance.
 *
 * Think: "I'm late for a meeting, get me there ASAP!"
 */
export class FastestRouteStrategy implements RouteStrategy {
  getName(): string {
    return "Fastest Route (Highway)";
  }

  calculateRoute(origin: string, destination: string): RouteResult {
    return {
      path: [origin, "Highway entrance", "Expressway", "Highway exit", destination],
      distanceKm: 65,
      estimatedMinutes: 50,
      description: `Highway route from ${origin} to ${destination}. Uses expressway for fastest travel time.`,
    };
  }
}

// ============================================
// CONCRETE STRATEGY 2: Shortest Route
// ============================================

/**
 * Takes local roads - shortest distance, but slower due to traffic lights.
 *
 * Think: "I want to save gas and don't mind taking longer."
 */
export class ShortestRouteStrategy implements RouteStrategy {
  getName(): string {
    return "Shortest Route (Local Roads)";
  }

  calculateRoute(origin: string, destination: string): RouteResult {
    return {
      path: [origin, "Local road A", "Town center", "Local road B", destination],
      distanceKm: 52,
      estimatedMinutes: 90,
      description: `Direct route from ${origin} to ${destination}. Shortest distance via local roads.`,
    };
  }
}

// ============================================
// CONCRETE STRATEGY 3: Scenic Route
// ============================================

/**
 * Takes the coastal road - longer but beautiful views.
 *
 * Think: "It's a weekend drive, I want to enjoy the scenery!"
 */
export class ScenicRouteStrategy implements RouteStrategy {
  getName(): string {
    return "Scenic Route (Coastal Road)";
  }

  calculateRoute(origin: string, destination: string): RouteResult {
    return {
      path: [origin, "Coastal road", "Beach viewpoint", "Cliff drive", "Harbor", destination],
      distanceKm: 70,
      estimatedMinutes: 120,
      description: `Scenic coastal route from ${origin} to ${destination}. Beautiful ocean views along the way.`,
    };
  }
}
