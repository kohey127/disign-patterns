/**
 * Main Demo - Observer Pattern in Action
 *
 * Run this file to see how Observer Pattern works:
 *   bun run main.ts
 *
 * KEY INSIGHT: The Subject (SlackChannel) doesn't know anything about
 * the concrete observers. It just calls onMessage() on each one.
 * Observers can be added or removed at any time.
 */

import { SlackChannel } from "./Observer";
import { DesktopApp, MobileApp, SlackBot } from "./Subscriber";

// ============================================
// DEMO START
// ============================================

console.log("=".repeat(55));
console.log("  OBSERVER PATTERN DEMO - Slack Notifications");
console.log("=".repeat(55));

// ============================================
// DEMO 1: JOIN CHANNEL & RECEIVE MESSAGES
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 1: Join Channel and Get Notified");
console.log("─".repeat(55));
console.log();

// Create a Slack channel (Subject)
const general = new SlackChannel("general");

// Create members (Observers) - same person, different devices + a bot
const alicePC = new DesktopApp("Alice");
const aliceMobile = new MobileApp("Alice");
const helpBot = new SlackBot("HelpBot", "help");

// Join the channel
general.join(alicePC);
general.join(aliceMobile);
general.join(helpBot);

// Someone posts a message - all members get notified
general.postMessage("Bob", "Hey everyone, good morning!");

// ============================================
// DEMO 2: BOT REACTS TO KEYWORD
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 2: Bot Detects a Keyword");
console.log("─".repeat(55));

// Post a message with the keyword "help"
general.postMessage("Charlie", "Can someone help me with the deploy?");

// ============================================
// DEMO 3: LEAVE CHANNEL
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 3: Leave Channel - Stop Receiving Messages");
console.log("─".repeat(55));
console.log();

// Alice turns off mobile notifications (leaves on mobile)
general.leave(aliceMobile);

// New message - only PC and bot get notified
general.postMessage("Bob", "Lunch at noon?");

// ============================================
// DEMO 4: MULTIPLE CHANNELS
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 4: One Observer, Multiple Channels");
console.log("─".repeat(55));
console.log();

// Create another channel
const devChannel = new SlackChannel("dev");

// Alice's PC joins #dev too
devChannel.join(alicePC);
devChannel.join(helpBot);

// Each channel notifies independently
devChannel.postMessage("Dave", "Pushed a fix for the login bug");
general.postMessage("Charlie", "Meeting in 5 minutes");

// ============================================
// DEMO 5: DYNAMIC - JOIN ANYTIME
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 5: Dynamic - Join and Leave Anytime");
console.log("─".repeat(55));
console.log();

const bobPC = new DesktopApp("Bob");

// Bob joins late
general.join(bobPC);
console.log(`\n  #general members: ${general.getMemberCount()}`);

general.postMessage("Alice", "Welcome Bob!");

// Bob leaves
console.log();
general.leave(bobPC);
console.log(`  #general members: ${general.getMemberCount()}`);

general.postMessage("Alice", "Bye Bob!");

// ============================================
// DEMO 6: DUPLICATE JOIN GUARD
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 6: Duplicate Join Guard");
console.log("─".repeat(55));
console.log();

// Try joining Alice's PC again - should be prevented
general.join(alicePC);

// ============================================
// KEY POINT
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  KEY POINT: Why Observer Pattern?");
console.log("─".repeat(55));

console.log(`
  The SlackChannel (Subject) doesn't know:
  - Whether an observer is a PC, a phone, or a bot
  - What each observer does with the message
  - How many observers there are

  It just calls onMessage() on each one. That's it.

  Benefits:
  1. LOOSE COUPLING - Channel doesn't know concrete observers
  2. DYNAMIC - Join/leave at any time
  3. ONE-TO-MANY - One message reaches many observers
  4. OPEN/CLOSED - Add new observer types (e.g., EmailNotifier)
     without changing SlackChannel
`);

// ============================================
// DEMO COMPLETE
// ============================================

console.log("=".repeat(55));
console.log("  DEMO COMPLETE");
console.log("=".repeat(55));
console.log(`
  Try these exercises:

  1. Create an "EmailNotifier" observer that sends email
     notifications for messages containing "@all"
  2. Add a "muteChannel()" method to observers so they
     can temporarily ignore messages
  3. Create a "ThreadChannel" subject that only notifies
     observers who are part of the thread
  4. Add a "priority" field so urgent messages are
     handled differently by each observer
`);
