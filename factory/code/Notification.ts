/**
 * Factory Pattern Example: Notification System
 *
 * This file defines the Notification interface and concrete implementations.
 * All notification types (Email, SMS, Push) implement the same interface.
 */

// ============================================
// NOTIFICATION INTERFACE
// ============================================

/**
 * Common interface for all notification types.
 * This is the "Product" in Factory Pattern terminology.
 */
interface Notification {
  /** Send the notification with a message */
  send(message: string): void;

  /** Get the type of notification */
  getType(): string;

  /** Get the recipient */
  getRecipient(): string;
}

// ============================================
// CONCRETE IMPLEMENTATIONS
// ============================================

/**
 * Email Notification - sends via email
 */
class EmailNotification implements Notification {
  constructor(private email: string) {}

  send(message: string): void {
    console.log(`[EMAIL] Sending to ${this.email}`);
    console.log(`        Subject: Notification`);
    console.log(`        Body: ${message}`);
    console.log(`        Status: Sent successfully!\n`);
  }

  getType(): string {
    return "email";
  }

  getRecipient(): string {
    return this.email;
  }
}

/**
 * SMS Notification - sends via text message
 */
class SMSNotification implements Notification {
  constructor(private phone: string) {}

  send(message: string): void {
    // SMS has character limit, so truncate if needed
    const truncated = message.length > 160
      ? message.substring(0, 157) + "..."
      : message;

    console.log(`[SMS] Sending to ${this.phone}`);
    console.log(`      Message: ${truncated}`);
    console.log(`      Status: Sent successfully!\n`);
  }

  getType(): string {
    return "sms";
  }

  getRecipient(): string {
    return this.phone;
  }
}

/**
 * Push Notification - sends to mobile device
 */
class PushNotification implements Notification {
  constructor(private deviceId: string) {}

  send(message: string): void {
    console.log(`[PUSH] Sending to device ${this.deviceId}`);
    console.log(`       Alert: ${message}`);
    console.log(`       Status: Sent successfully!\n`);
  }

  getType(): string {
    return "push";
  }

  getRecipient(): string {
    return this.deviceId;
  }
}

/**
 * Slack Notification - sends to Slack channel
 * (Added to demonstrate extending the factory)
 */
class SlackNotification implements Notification {
  constructor(private channelId: string) {}

  send(message: string): void {
    console.log(`[SLACK] Sending to channel ${this.channelId}`);
    console.log(`        Message: ${message}`);
    console.log(`        Status: Sent successfully!\n`);
  }

  getType(): string {
    return "slack";
  }

  getRecipient(): string {
    return this.channelId;
  }
}

export {
  Notification,
  EmailNotification,
  SMSNotification,
  PushNotification,
  SlackNotification
};
