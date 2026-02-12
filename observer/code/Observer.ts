/**
 * Observer Pattern - Observer & Subject Interfaces
 *
 * WHAT IS THE OBSERVER PATTERN?
 * It defines a one-to-many relationship between objects:
 * when one object (Subject) changes state, all its dependents
 * (Observers) are notified and updated automatically.
 *
 * Think: Slack channel.
 * - Someone posts a message in #general (Subject)
 * - All members get notified in different ways (Observers)
 * - You can join/leave the channel at any time
 */

// ============================================
// EVENT - what gets sent to observers
// ============================================

/**
 * The notification payload.
 * All observers receive the same shape of data.
 */
export interface SlackMessage {
  channelName: string;
  sender: string;
  text: string;
  timestamp: Date;
}

// ============================================
// OBSERVER INTERFACE
// ============================================

/**
 * The Observer interface.
 *
 * Any object that wants to receive notifications must implement this.
 * This is the KEY: the Subject doesn't know WHO is listening,
 * only that they have an onMessage() method.
 */
export interface Observer {
  onMessage(message: SlackMessage): void;
  getName(): string;
}

// ============================================
// SUBJECT INTERFACE
// ============================================

/**
 * The Subject interface (also called "Observable" or "Publisher").
 *
 * Any object that sends notifications must implement this.
 * It manages a list of observers and notifies them when something happens.
 */
export interface Subject {
  join(observer: Observer): void;
  leave(observer: Observer): void;
  notifyAll(message: SlackMessage): void;
}

// ============================================
// CONCRETE SUBJECT: Slack Channel
// ============================================

/**
 * A Slack channel that members can join.
 *
 * When someone posts a message, all members are notified.
 * Members can join or leave at any time.
 */
export class SlackChannel implements Subject {
  private name: string;
  private observers: Observer[] = [];

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  /**
   * Add an observer to the channel.
   * Like joining a Slack channel.
   */
  join(observer: Observer): void {
    const exists = this.observers.includes(observer);
    if (exists) {
      console.log(`  [#${this.name}] ${observer.getName()} is already in the channel.`);
      return;
    }
    this.observers.push(observer);
    console.log(`  [#${this.name}] ${observer.getName()} joined the channel!`);
  }

  /**
   * Remove an observer from the channel.
   * Like leaving a Slack channel.
   */
  leave(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index === -1) {
      console.log(`  [#${this.name}] ${observer.getName()} is not in the channel.`);
      return;
    }
    this.observers.splice(index, 1);
    console.log(`  [#${this.name}] ${observer.getName()} left the channel.`);
  }

  /**
   * Notify ALL observers about a message.
   * This is the CORE of the pattern - the Subject loops through
   * its observers and calls onMessage() on each one.
   */
  notifyAll(message: SlackMessage): void {
    console.log(`  [#${this.name}] Notifying ${this.observers.length} member(s)...`);
    for (const observer of this.observers) {
      observer.onMessage(message);
    }
  }

  /**
   * Someone posts a message - triggers notification to all members.
   */
  postMessage(sender: string, text: string): void {
    console.log(`\n  [#${this.name}] ${sender}: "${text}"`);
    const message: SlackMessage = {
      channelName: this.name,
      sender,
      text,
      timestamp: new Date(),
    };
    this.notifyAll(message);
  }

  /**
   * Get the number of members.
   */
  getMemberCount(): number {
    return this.observers.length;
  }
}
