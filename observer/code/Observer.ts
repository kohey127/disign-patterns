/**
 * Observer Pattern - Observer & Subject Interfaces
 *
 * WHAT IS THE OBSERVER PATTERN?
 * It defines a one-to-many relationship between objects:
 * when one object (Subject) changes state, all its dependents
 * (Observers) are notified and updated automatically.
 *
 * Think: YouTube subscriptions.
 * - The channel (Subject) uploads a video
 * - All subscribers (Observers) get notified
 * - You can subscribe/unsubscribe at any time
 */

// ============================================
// EVENT - what gets sent to observers
// ============================================

/**
 * The notification payload.
 * All observers receive the same shape of data.
 */
export interface VideoEvent {
  channelName: string;
  videoTitle: string;
  videoUrl: string;
  uploadedAt: Date;
}

// ============================================
// OBSERVER INTERFACE
// ============================================

/**
 * The Observer interface.
 *
 * Any object that wants to receive notifications must implement this.
 * This is the KEY: the Subject doesn't know WHO is listening,
 * only that they have an update() method.
 */
export interface Observer {
  update(event: VideoEvent): void;
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
  subscribe(observer: Observer): void;
  unsubscribe(observer: Observer): void;
  notify(event: VideoEvent): void;
}

// ============================================
// CONCRETE SUBJECT: YouTube Channel
// ============================================

/**
 * A YouTube channel that people can subscribe to.
 *
 * When a new video is uploaded, all subscribers are notified.
 * Subscribers can join or leave at any time.
 */
export class YouTubeChannel implements Subject {
  private name: string;
  private observers: Observer[] = [];

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  /**
   * Add an observer to the notification list.
   * Like clicking "Subscribe" on YouTube.
   */
  subscribe(observer: Observer): void {
    const exists = this.observers.includes(observer);
    if (exists) {
      console.log(`  [${this.name}] ${observer.getName()} is already subscribed.`);
      return;
    }
    this.observers.push(observer);
    console.log(`  [${this.name}] ${observer.getName()} subscribed!`);
  }

  /**
   * Remove an observer from the notification list.
   * Like clicking "Unsubscribe" on YouTube.
   */
  unsubscribe(observer: Observer): void {
    const index = this.observers.indexOf(observer);
    if (index === -1) {
      console.log(`  [${this.name}] ${observer.getName()} is not subscribed.`);
      return;
    }
    this.observers.splice(index, 1);
    console.log(`  [${this.name}] ${observer.getName()} unsubscribed.`);
  }

  /**
   * Notify ALL observers about an event.
   * This is the CORE of the pattern - the Subject loops through
   * its observers and calls update() on each one.
   */
  notify(event: VideoEvent): void {
    console.log(`  [${this.name}] Notifying ${this.observers.length} subscriber(s)...`);
    for (const observer of this.observers) {
      observer.update(event);
    }
  }

  /**
   * Upload a new video - triggers notification to all subscribers.
   */
  uploadVideo(title: string): void {
    console.log(`\n  [${this.name}] Uploaded: "${title}"`);
    const event: VideoEvent = {
      channelName: this.name,
      videoTitle: title,
      videoUrl: `https://youtube.com/watch?v=${title.toLowerCase().replace(/\s+/g, "-")}`,
      uploadedAt: new Date(),
    };
    this.notify(event);
  }

  /**
   * Get the number of subscribers.
   */
  getSubscriberCount(): number {
    return this.observers.length;
  }
}
