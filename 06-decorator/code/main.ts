/**
 * Main Demo - Decorator Pattern in Action
 *
 * Run this file to see how Decorator Pattern works:
 *   bun run main.ts
 *
 * KEY INSIGHT: Every decorator has the same interface as the original.
 * You can wrap an object in as many layers as you want.
 * The code that calls send() doesn't know (or care) how many
 * decorators are wrapped around the original notifier.
 */

import { SimpleNotifier, Notifier } from "./Notifier";
import { TimestampDecorator, UrgentDecorator, EmojiDecorator } from "./Decorators";

// ============================================
// DEMO START
// ============================================

console.log("=".repeat(55));
console.log("  DECORATOR PATTERN DEMO - Notification Formatting");
console.log("=".repeat(55));

// ============================================
// DEMO 1: Plain Notifier (No Decoration)
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 1: Plain Notifier (No Decoration)");
console.log("─".repeat(55));
console.log();

const plain: Notifier = new SimpleNotifier();
plain.send("Server is running.");

// ============================================
// DEMO 2: Single Decorator (Timestamp)
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 2: Single Decorator (Timestamp)");
console.log("─".repeat(55));
console.log();

const withTimestamp: Notifier = new TimestampDecorator(new SimpleNotifier());
withTimestamp.send("Server is running.");

// ============================================
// DEMO 3: Stacking Decorators (3 Layers)
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 3: Stacking Decorators (3 Layers)");
console.log("─".repeat(55));
console.log();

// Build from inside out: SimpleNotifier → Timestamp → Urgent → Emoji
const stacked: Notifier = new EmojiDecorator(
  new UrgentDecorator(
    new TimestampDecorator(
      new SimpleNotifier()
    )
  ),
  "🚨"
);
stacked.send("Database connection lost!");

// ============================================
// DEMO 4: Order Matters!
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 4: Order Matters!");
console.log("─".repeat(55));
console.log();

// Order A: Timestamp THEN Urgent (timestamp is added first, then made uppercase)
console.log("  Order A: Timestamp → Urgent");
const orderA: Notifier = new UrgentDecorator(
  new TimestampDecorator(
    new SimpleNotifier()
  )
);
orderA.send("Deploy failed.");

console.log();

// Order B: Urgent THEN Timestamp (made uppercase first, then timestamp is added)
console.log("  Order B: Urgent → Timestamp");
const orderB: Notifier = new TimestampDecorator(
  new UrgentDecorator(
    new SimpleNotifier()
  )
);
orderB.send("Deploy failed.");

console.log();
console.log("  Notice: In Order A, Urgent runs first, then Timestamp adds its prefix.");
console.log("  In Order B, Timestamp runs first, then Urgent adds its prefix.");
console.log("  The outermost decorator's send() runs first!");

// ============================================
// DEMO 5: Same Decorator Twice
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 5: Same Decorator Twice");
console.log("─".repeat(55));
console.log();

const doubleEmoji: Notifier = new EmojiDecorator(
  new EmojiDecorator(
    new SimpleNotifier(),
    "🔔"
  ),
  "⚡"
);
doubleEmoji.send("New user signed up.");

// ============================================
// DEMO 6: getDescription() Shows the Chain
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 6: getDescription() Shows the Chain");
console.log("─".repeat(55));
console.log();

console.log(`  plain:    ${plain.getDescription()}`);
console.log(`  stamped:  ${withTimestamp.getDescription()}`);
console.log(`  stacked:  ${stacked.getDescription()}`);
console.log(`  orderA:   ${orderA.getDescription()}`);
console.log(`  orderB:   ${orderB.getDescription()}`);
console.log(`  double:   ${doubleEmoji.getDescription()}`);

// ============================================
// KEY POINT
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  KEY POINT: Why Decorator Pattern?");
console.log("─".repeat(55));

console.log(`
  Without Decorator, you'd need a class for every combination:
  - SimpleNotifier
  - TimestampNotifier
  - UrgentNotifier
  - EmojiNotifier
  - TimestampUrgentNotifier
  - TimestampEmojiNotifier
  - UrgentEmojiNotifier
  - TimestampUrgentEmojiNotifier
  → 8 classes for 3 features!  (2^3 = 8)
  → Add one more feature? 16 classes!  (2^4 = 16)

  With Decorator:
  - 1 base class + 3 decorators = 4 classes total
  - Stack them in any order, any combination
  - Add a new feature? Just 1 more decorator class
`);

// ============================================
// DEMO COMPLETE
// ============================================

console.log("=".repeat(55));
console.log("  DEMO COMPLETE");
console.log("=".repeat(55));
console.log(`
  Try these exercises:

  1. Create a "FilterDecorator" that blocks messages
     containing certain words (e.g., "spam")
  2. Create a "RepeatDecorator" that sends the message
     N times (e.g., repeat 3 times)
  3. Create a "LogDecorator" that logs messages to an
     array and also sends them normally
  4. Build a chain of 5 decorators and use getDescription()
     to visualize the wrapping order
  5. Try removing a decorator from the middle of a chain —
     why is this hard? What does that tell you about the pattern?
`);
