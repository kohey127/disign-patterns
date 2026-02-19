/**
 * Main Demo - Factory Pattern in Action
 *
 * Run this file to see how Factory Pattern works:
 *   bun run main.ts
 */

import { NotificationFactory, NotificationType } from "./NotificationFactory";
import { Notification } from "./Notification";

// ============================================
// DEMO START
// ============================================

console.log("=".repeat(50));
console.log("  FACTORY PATTERN DEMO - Notification System");
console.log("=".repeat(50));
console.log();

// ============================================
// BASIC USAGE
// ============================================

console.log("1. Basic Factory Usage");
console.log("-".repeat(40));

const factory = new NotificationFactory();

// Create different notification types using the SAME factory
const email = factory.create(NotificationType.Email, "user@example.com");
const sms = factory.create(NotificationType.SMS, "+1-234-567-8900");
const push = factory.create(NotificationType.Push, "device-abc-123");
const slack = factory.create(NotificationType.Slack, "#general");

// Send messages - all use the same interface!
email.send("Welcome to our service!");
sms.send("Your verification code is 123456");
push.send("You have a new message");
slack.send("Deployment completed successfully");

// ============================================
// CONVENIENCE METHODS
// ============================================

console.log("2. Using Convenience Methods");
console.log("-".repeat(40));

// Factory also provides convenience methods
const quickEmail = factory.createEmail("admin@company.com");
quickEmail.send("System alert: High CPU usage detected");

// ============================================
// KEY BENEFIT: LOOSE COUPLING
// ============================================

console.log("3. Demonstrating Loose Coupling");
console.log("-".repeat(40));

/**
 * This function doesn't know about EmailNotification, SMSNotification, etc.
 * It only knows about the Notification interface.
 * This is the power of the Factory Pattern!
 */
function sendUrgentAlert(notification: Notification, alertMessage: string): void {
  const urgentMessage = `[URGENT] ${alertMessage}`;
  console.log(`Preparing to send urgent alert via ${notification.getType()}...`);
  notification.send(urgentMessage);
}

// Same function works with any notification type!
sendUrgentAlert(
  factory.create(NotificationType.Email, "ceo@company.com"),
  "Server is down!"
);

sendUrgentAlert(
  factory.create(NotificationType.SMS, "+1-999-888-7777"),
  "Server is down!"
);

// ============================================
// KEY BENEFIT: EASY TO EXTEND
// ============================================

console.log("4. Demonstrating Easy Extension");
console.log("-".repeat(40));

/**
 * Imagine we need to send notifications based on user preferences.
 * The factory makes this easy - we don't need to know the concrete classes!
 */
interface UserPreferences {
  name: string;
  preferredChannel: NotificationType;
  contact: string;
}

const users: UserPreferences[] = [
  { name: "Alice", preferredChannel: NotificationType.Email, contact: "alice@example.com" },
  { name: "Bob", preferredChannel: NotificationType.SMS, contact: "+1-111-222-3333" },
  { name: "Charlie", preferredChannel: NotificationType.Slack, contact: "#charlie-alerts" },
];

console.log("Sending personalized notifications based on user preferences:\n");

users.forEach(user => {
  // Factory creates the right type based on user preference
  const notification = factory.create(user.preferredChannel, user.contact);
  notification.send(`Hello ${user.name}! This is your personalized notification.`);
});

// ============================================
// KEY POINT: CENTRALIZED CREATION
// ============================================

console.log("5. Key Point - Centralized Creation");
console.log("-".repeat(40));

console.log(`
The Factory Pattern centralizes object creation:

WITHOUT Factory:
  - new EmailNotification() scattered everywhere
  - new SMSNotification() scattered everywhere
  - Adding new type = change MANY files

WITH Factory:
  - factory.create() everywhere
  - Adding new type = change ONLY the factory

This makes your code:
  - Easier to maintain
  - Easier to test (swap factory with mock factory)
  - Easier to extend (add new types without touching existing code)
`);

// ============================================
// DEMO COMPLETE
// ============================================

console.log("=".repeat(50));
console.log("  DEMO COMPLETE");
console.log("=".repeat(50));
