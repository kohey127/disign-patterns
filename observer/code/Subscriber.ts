/**
 * Observer Pattern - Concrete Observers (Channel Members)
 *
 * Each observer reacts DIFFERENTLY to the same message.
 * That's the beauty of the pattern:
 * - The Subject sends ONE notification
 * - Each Observer handles it in its OWN way
 *
 * Think: When someone posts in #general...
 * - PC user sees it on their screen
 * - Mobile user gets a push notification
 * - A bot auto-replies if it detects a keyword
 */

import { Observer, SlackMessage } from "./Observer";

// ============================================
// CONCRETE OBSERVER 1: Desktop App
// ============================================

/**
 * Slack on your PC - shows the message on screen.
 *
 * Think: You're working on your laptop, a message pops up
 * in the Slack window.
 */
export class DesktopApp implements Observer {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  onMessage(message: SlackMessage): void {
    console.log(
      `    [${this.name} - PC] ` +
      `#${message.channelName} に新着メッセージ: ${message.sender}「${message.text}」`
    );
  }
}

// ============================================
// CONCRETE OBSERVER 2: Mobile App
// ============================================

/**
 * Slack on your phone - sends a push notification.
 *
 * Think: Your phone buzzes with a notification banner.
 * Shows a short preview of the message.
 */
export class MobileApp implements Observer {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  onMessage(message: SlackMessage): void {
    // Mobile shows a shorter preview
    const preview = message.text.length > 20
      ? message.text.substring(0, 20) + "..."
      : message.text;
    console.log(
      `    [${this.name} - Mobile] ` +
      `Push notification: ${message.sender}: "${preview}"`
    );
  }
}

// ============================================
// CONCRETE OBSERVER 3: Slack Bot
// ============================================

/**
 * An automated bot that reacts to keywords.
 *
 * Think: A bot in your Slack workspace that auto-replies
 * when someone says "help" or logs all messages.
 * This shows that Observers don't have to be "users" - they can be
 * any object that needs to react to messages.
 */
export class SlackBot implements Observer {
  private name: string;
  private keyword: string;
  private log: string[] = [];

  constructor(name: string, keyword: string) {
    this.name = name;
    this.keyword = keyword;
  }

  getName(): string {
    return this.name;
  }

  onMessage(message: SlackMessage): void {
    // Log every message
    this.log.push(`[${message.channelName}] ${message.sender}: ${message.text}`);

    // Auto-reply if the keyword is found
    if (message.text.toLowerCase().includes(this.keyword)) {
      console.log(
        `    [${this.name} - Bot] ` +
        `Keyword "${this.keyword}" detected! Auto-reply: "How can I help you?"`
      );
    } else {
      console.log(
        `    [${this.name} - Bot] ` +
        `Message logged. (${this.log.length} messages recorded)`
      );
    }
  }

  getLog(): string[] {
    return [...this.log];
  }
}
