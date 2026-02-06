/**
 * Factory Pattern Example: NotificationFactory
 *
 * This is the FACTORY - the central place that creates notifications.
 * Client code asks the factory for a notification, and the factory
 * decides which concrete class to instantiate.
 */

import {
  Notification,
  EmailNotification,
  SMSNotification,
  PushNotification,
  SlackNotification
} from "./Notification";

// ============================================
// NOTIFICATION TYPE ENUM
// ============================================

/**
 * Using an enum prevents typos and enables autocomplete.
 * Compare: factory.create("emial", ...)  // typo, runtime error!
 *     vs:  factory.create(NotificationType.Email, ...)  // compile-time check!
 */
enum NotificationType {
  Email = "email",
  SMS = "sms",
  Push = "push",
  Slack = "slack"
}

// ============================================
// THE FACTORY
// ============================================

/**
 * NotificationFactory - Creates notification objects.
 *
 * KEY POINTS:
 * 1. Client code doesn't need to know about concrete classes
 * 2. Adding a new type only requires updating THIS file
 * 3. Factory's ONLY job is to create objects (single responsibility)
 */
class NotificationFactory {

  /**
   * Create a notification of the specified type.
   *
   * @param type - The type of notification to create
   * @param recipient - Who to send the notification to
   * @returns A Notification instance
   * @throws Error if the type is not supported
   */
  create(type: NotificationType, recipient: string): Notification {
    switch (type) {
      case NotificationType.Email:
        return new EmailNotification(recipient);

      case NotificationType.SMS:
        return new SMSNotification(recipient);

      case NotificationType.Push:
        return new PushNotification(recipient);

      case NotificationType.Slack:
        return new SlackNotification(recipient);

      default:
        // TypeScript's exhaustiveness checking helps here!
        // If you add a new enum value but forget the case,
        // this line will cause a compile error.
        const _exhaustiveCheck: never = type;
        throw new Error(`Unknown notification type: ${type}`);
    }
  }

  /**
   * Convenience method: Create email notification
   */
  createEmail(email: string): Notification {
    return this.create(NotificationType.Email, email);
  }

  /**
   * Convenience method: Create SMS notification
   */
  createSMS(phone: string): Notification {
    return this.create(NotificationType.SMS, phone);
  }

  /**
   * Convenience method: Create push notification
   */
  createPush(deviceId: string): Notification {
    return this.create(NotificationType.Push, deviceId);
  }

  /**
   * Convenience method: Create Slack notification
   */
  createSlack(channelId: string): Notification {
    return this.create(NotificationType.Slack, channelId);
  }
}

export { NotificationFactory, NotificationType };
