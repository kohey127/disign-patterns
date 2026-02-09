/**
 * Main Demo - Strategy Pattern in Action
 *
 * Run this file to see how Strategy Pattern works:
 *   bun run main.ts
 *
 * KEY INSIGHT: The same Navigator can use different routing algorithms
 * at runtime. The algorithm can be swapped without changing any other code.
 */

import {
  FastestRouteStrategy,
  ShortestRouteStrategy,
  ScenicRouteStrategy,
} from "./RouteStrategy";
import { Navigator, createRouteStrategy } from "./Navigator";

// ============================================
// DEMO START
// ============================================

console.log("=".repeat(55));
console.log("  STRATEGY PATTERN DEMO - Navigation Routing");
console.log("=".repeat(55));

// ============================================
// DEMO 1: BASIC USAGE
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 1: Basic Usage - Navigate with Fastest Route");
console.log("─".repeat(55));
console.log();

// Create a Navigator with the fastest route strategy
const navigator = new Navigator(new FastestRouteStrategy());
navigator.navigate("Tokyo", "Kamakura");

// ============================================
// DEMO 2: RUNTIME STRATEGY SWITCHING
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 2: Runtime Strategy Switching");
console.log("─".repeat(55));

console.log("\n  --- Switching to Shortest Route ---\n");

// Same navigator, different strategy!
navigator.setStrategy(new ShortestRouteStrategy());
navigator.navigate("Tokyo", "Kamakura");

console.log("\n  --- Switching to Scenic Route ---\n");

// Switch again - no need to create a new Navigator
navigator.setStrategy(new ScenicRouteStrategy());
navigator.navigate("Tokyo", "Kamakura");

// ============================================
// DEMO 3: COMPARE ALL STRATEGIES
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 3: Compare All Strategies (Same Route)");
console.log("─".repeat(55));

const strategies = [
  new FastestRouteStrategy(),
  new ShortestRouteStrategy(),
  new ScenicRouteStrategy(),
];

const origin = "Osaka";
const destination = "Kyoto";

console.log(`\n  Route: ${origin} → ${destination}\n`);
console.log("  ┌────────────────────────────────┬──────────┬─────────┐");
console.log("  │ Strategy                       │ Distance │ Time    │");
console.log("  ├────────────────────────────────┼──────────┼─────────┤");

for (const strategy of strategies) {
  const result = strategy.calculateRoute(origin, destination);
  const name = strategy.getName().padEnd(30);
  const dist = `${result.distanceKm} km`.padEnd(8);
  const time = `${result.estimatedMinutes} min`.padEnd(7);
  console.log(`  │ ${name} │ ${dist} │ ${time} │`);
}

console.log("  └────────────────────────────────┴──────────┴─────────┘");

// ============================================
// DEMO 4: HELPER FUNCTION
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 4: Using createRouteStrategy Helper");
console.log("─".repeat(55));
console.log();

// Imagine this comes from user input or a config file
const userChoice = "scenic";
const strategy = createRouteStrategy(userChoice);
const nav = new Navigator(strategy);
nav.navigate("Nagoya", "Takayama");

// ============================================
// KEY POINT DEMONSTRATION
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  KEY POINT: Why Strategy Pattern?");
console.log("─".repeat(55));

console.log(`
  WITHOUT Strategy Pattern (if/else approach):

  function navigate(origin, dest, type) {
    if (type === "fastest") {
      // 20 lines of highway routing logic
    } else if (type === "shortest") {
      // 20 lines of local road logic
    } else if (type === "scenic") {
      // 20 lines of scenic road logic
    }
    // Adding a new algorithm means modifying THIS function
    // Violates Open/Closed Principle!
  }

  WITH Strategy Pattern:

  navigator.setStrategy(new FastestRouteStrategy());
  navigator.navigate("Tokyo", "Kamakura");

  // Adding a new algorithm? Just create a new class!
  // navigator.setStrategy(new TollFreeRouteStrategy());
  // No existing code needs to change.

  Benefits:
  1. OPEN/CLOSED - Add new strategies without modifying existing code
  2. RUNTIME SWAP - Change algorithm while the program runs
  3. ISOLATION - Each algorithm is in its own class (easy to test)
  4. NO CONDITIONALS - No growing if/else or switch chains
`);

// ============================================
// DEMO COMPLETE
// ============================================

console.log("=".repeat(55));
console.log("  DEMO COMPLETE");
console.log("=".repeat(55));
console.log(`
  Try these exercises:

  1. Create a TollFreeRouteStrategy that avoids toll roads
  2. Add a "fuelCost" field to RouteResult and calculate it
     for each strategy
  3. Create an EcoRouteStrategy that optimizes for lowest
     fuel consumption (balances distance and speed)
  4. Make Navigator accept a callback function instead of
     a class - compare the two approaches
`);
