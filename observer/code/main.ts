/**
 * Main Demo - Observer Pattern in Action
 *
 * Run this file to see how Observer Pattern works:
 *   bun run main.ts
 *
 * KEY INSIGHT: The Subject (YouTubeChannel) doesn't know anything about
 * the concrete observers. It just calls update() on each one.
 * Observers can be added or removed at any time.
 */

import { YouTubeChannel } from "./Observer";
import { RegularUser, WatchLaterUser, NotificationBot } from "./Subscriber";

// ============================================
// DEMO START
// ============================================

console.log("=".repeat(55));
console.log("  OBSERVER PATTERN DEMO - YouTube Subscriptions");
console.log("=".repeat(55));

// ============================================
// DEMO 1: BASIC SUBSCRIPTION & NOTIFICATION
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 1: Subscribe and Get Notified");
console.log("─".repeat(55));
console.log();

// Create a YouTube channel (Subject)
const techChannel = new YouTubeChannel("Tech Academy");

// Create subscribers (Observers)
const alice = new RegularUser("Alice");
const bob = new WatchLaterUser("Bob");
const bot = new NotificationBot("Discord Bot");

// Subscribe to the channel
techChannel.subscribe(alice);
techChannel.subscribe(bob);
techChannel.subscribe(bot);

// Upload a video - all subscribers get notified
techChannel.uploadVideo("TypeScript Design Patterns #1");

// ============================================
// DEMO 2: UNSUBSCRIBE
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 2: Unsubscribe - Stop Receiving Notifications");
console.log("─".repeat(55));
console.log();

// Bob unsubscribes
techChannel.unsubscribe(bob);

// Upload another video - only Alice and bot get notified
techChannel.uploadVideo("TypeScript Design Patterns #2");

// ============================================
// DEMO 3: MULTIPLE SUBJECTS
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 3: One Observer, Multiple Channels");
console.log("─".repeat(55));
console.log();

// Create another channel
const cookingChannel = new YouTubeChannel("Cooking Master");

// Alice subscribes to the cooking channel too
cookingChannel.subscribe(alice);
cookingChannel.subscribe(bot);

// Each channel notifies independently
cookingChannel.uploadVideo("How to Make Ramen");
techChannel.uploadVideo("TypeScript Design Patterns #3");

// ============================================
// DEMO 4: DYNAMIC SUBSCRIPTION
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 4: Dynamic - Subscribe and Unsubscribe Anytime");
console.log("─".repeat(55));
console.log();

const charlie = new RegularUser("Charlie");

// Charlie joins late
techChannel.subscribe(charlie);
console.log(`\n  Subscriber count: ${techChannel.getSubscriberCount()}`);

techChannel.uploadVideo("TypeScript Design Patterns #4");

// Charlie leaves
console.log();
techChannel.unsubscribe(charlie);
console.log(`  Subscriber count: ${techChannel.getSubscriberCount()}`);

techChannel.uploadVideo("TypeScript Design Patterns #5");

// ============================================
// DEMO 5: DUPLICATE SUBSCRIPTION GUARD
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 5: Duplicate Subscription Guard");
console.log("─".repeat(55));
console.log();

// Try subscribing Alice again - should be prevented
techChannel.subscribe(alice);

// ============================================
// KEY POINT DEMONSTRATION
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  KEY POINT: Why Observer Pattern?");
console.log("─".repeat(55));

console.log(`
  WITHOUT Observer Pattern (polling approach):

  // Every user has to keep checking...
  while (true) {
    if (channel.hasNewVideo()) {
      user.watch(channel.getLatestVideo());
    }
    sleep(1000); // Check again in 1 second
  }
  // Wasteful! Every user polls constantly.

  WITH Observer Pattern (push-based):

  channel.subscribe(user);
  // Done! The channel will PUSH updates to the user.
  // No polling, no wasted checks.

  Benefits:
  1. LOOSE COUPLING - Subject doesn't know concrete observers
  2. DYNAMIC - Subscribe/unsubscribe at any time
  3. ONE-TO-MANY - One event reaches many observers
  4. OPEN/CLOSED - Add new observer types without changing Subject
`);

// ============================================
// DEMO COMPLETE
// ============================================

console.log("=".repeat(55));
console.log("  DEMO COMPLETE");
console.log("=".repeat(55));
console.log(`
  Try these exercises:

  1. Create a "HighlightUser" observer that only reacts
     to videos with certain keywords in the title
  2. Add an "unsubscribeAll()" method to YouTubeChannel
  3. Create a second Subject type (e.g., BlogSite) that
     uses the same Observer interface
  4. Add a "priority" field to observers so important
     observers get notified first
`);
