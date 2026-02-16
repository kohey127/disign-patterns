/**
 * Decorator Pattern - Concrete Decorators
 *
 * Each decorator adds ONE specific behavior to the notification.
 * They can be stacked in any order, like layers of gift wrapping.
 *
 * Think: Each decorator is one layer:
 * - TimestampDecorator → adds "[2024-01-15 10:30]" before the message
 * - UrgentDecorator    → makes it uppercase + adds "URGENT:" prefix
 * - EmojiDecorator     → adds an emoji prefix like "🔔"
 */

import { NotifierDecorator } from "./Notifier";

// ============================================
// CONCRETE DECORATOR 1: Timestamp
// ============================================

/**
 * Adds a timestamp to the message.
 *
 * Think: Stamping the date on a letter before sending it.
 * The original message stays the same — we just add info before it.
 */
export class TimestampDecorator extends NotifierDecorator {
  send(message: string): void {
    const now = new Date().toLocaleString("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });
    const decorated = `[${now}] ${message}`;
    this.wrapped.send(decorated);
  }

  getDescription(): string {
    return `TimestampDecorator(${this.wrapped.getDescription()})`;
  }
}

// ============================================
// CONCRETE DECORATOR 2: Urgent
// ============================================

/**
 * Makes the message URGENT — uppercase + "URGENT:" prefix.
 *
 * Think: Writing in ALL CAPS on a sticky note and adding
 * a big red "URGENT" stamp. The content is the same,
 * but it looks and feels more important.
 */
export class UrgentDecorator extends NotifierDecorator {
  send(message: string): void {
    const decorated = `URGENT: ${message.toUpperCase()}`;
    this.wrapped.send(decorated);
  }

  getDescription(): string {
    return `UrgentDecorator(${this.wrapped.getDescription()})`;
  }
}

// ============================================
// CONCRETE DECORATOR 3: Emoji
// ============================================

/**
 * Adds an emoji prefix to the message.
 *
 * Think: Putting a sticker on an envelope.
 * You can choose different emojis for different purposes.
 */
export class EmojiDecorator extends NotifierDecorator {
  private emoji: string;

  constructor(wrapped: import("./Notifier").Notifier, emoji: string = "🔔") {
    super(wrapped);
    this.emoji = emoji;
  }

  send(message: string): void {
    const decorated = `${this.emoji} ${message}`;
    this.wrapped.send(decorated);
  }

  getDescription(): string {
    return `EmojiDecorator(${this.wrapped.getDescription()})`;
  }
}
