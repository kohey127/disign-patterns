/**
 * Observer Pattern - Concrete Observers (Subscribers)
 *
 * Each observer reacts DIFFERENTLY to the same event.
 * That's the beauty of the pattern:
 * - The Subject sends ONE notification
 * - Each Observer handles it in its OWN way
 *
 * Think: When a YouTube channel uploads a video...
 * - One person watches it immediately
 * - Another saves it for later
 * - A bot logs it to a database
 */

import { Observer, VideoEvent } from "./Observer";

// ============================================
// CONCRETE OBSERVER 1: Regular User
// ============================================

/**
 * A regular user who watches videos right away.
 *
 * Think: "I have notifications on, I watch everything immediately!"
 */
export class RegularUser implements Observer {
  private name: string;

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  update(event: VideoEvent): void {
    console.log(
      `    [${this.name}] New video from ${event.channelName}! ` +
      `Watching "${event.videoTitle}" now.`
    );
  }
}

// ============================================
// CONCRETE OBSERVER 2: Watch-Later User
// ============================================

/**
 * A user who saves videos to watch later.
 *
 * Think: "I'm busy, I'll add it to my Watch Later playlist."
 */
export class WatchLaterUser implements Observer {
  private name: string;
  private watchLater: string[] = [];

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  update(event: VideoEvent): void {
    this.watchLater.push(event.videoTitle);
    console.log(
      `    [${this.name}] Saved "${event.videoTitle}" to Watch Later. ` +
      `(${this.watchLater.length} video(s) in queue)`
    );
  }

  getWatchLaterList(): string[] {
    return [...this.watchLater];
  }
}

// ============================================
// CONCRETE OBSERVER 3: Notification Bot
// ============================================

/**
 * An automated bot that logs all uploads.
 *
 * Think: A Discord bot that posts "New video!" in a server channel.
 * This shows that Observers don't have to be "users" - they can be
 * any object that needs to react to changes.
 */
export class NotificationBot implements Observer {
  private name: string;
  private log: string[] = [];

  constructor(name: string) {
    this.name = name;
  }

  getName(): string {
    return this.name;
  }

  update(event: VideoEvent): void {
    const logEntry = `[${event.uploadedAt.toISOString()}] ${event.channelName} uploaded "${event.videoTitle}"`;
    this.log.push(logEntry);
    console.log(
      `    [${this.name}] Logged: ${event.channelName} → "${event.videoTitle}"`
    );
  }

  getLog(): string[] {
    return [...this.log];
  }
}
