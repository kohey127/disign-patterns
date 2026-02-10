# Observer Pattern

## What is it? (One sentence)

**Observer lets one object (Subject) notify many dependent objects (Observers) automatically when its state changes.**

---

## Before You Read This

Make sure you understand basic interfaces and classes in TypeScript first!

- **Observer** is a Behavioral pattern (about how objects communicate)
- Previous pattern: Strategy was about **choosing an algorithm**
- Observer is about **reacting to changes** — a publish/subscribe relationship

---

## The Problem (Why do we need this?)

Imagine you're building a YouTube-like video platform.

When a channel uploads a new video, many things need to happen:
- **Subscribers** get a notification
- **Watch Later users** add it to their queue
- **Discord bots** post an announcement in a server

**The naive approach:**

```typescript
function uploadVideo(channel: Channel, title: string) {
  // Save the video...
  saveVideo(channel, title);

  // Now manually notify everyone
  for (const user of getAllRegularUsers(channel)) {
    sendPushNotification(user, title);
  }
  for (const user of getAllWatchLaterUsers(channel)) {
    addToWatchLater(user, title);
  }
  for (const bot of getAllBots(channel)) {
    bot.postToDiscord(title);
  }
  // What if we add email notifications? Modify this function again...
}
```

**Problems:**

1. **Tightly coupled** — The channel knows about every type of subscriber
2. **Hard to extend** — Adding a new notification type means changing the upload function
3. **Violates Open/Closed Principle** — You must change existing code to add new behavior
4. **Hard to test** — Can't test notification logic in isolation
5. **No dynamic subscription** — Can't easily subscribe/unsubscribe at runtime

---

## The Solution (How Observer helps)

Define a common interface for all observers, and let the subject manage a list of them.

```typescript
// Observer interface - all subscribers share this shape
interface Observer {
  update(event: VideoEvent): void;
}

// Subject manages observers and notifies them
class YouTubeChannel {
  private observers: Observer[] = [];

  subscribe(observer: Observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }

  uploadVideo(title: string) {
    // ... save video ...
    // Notify all observers
    for (const observer of this.observers) {
      observer.update({ channelName: this.name, videoTitle: title });
    }
  }
}
```

**Now adding a new observer type is easy:**

```typescript
class RegularUser implements Observer {
  update(event: VideoEvent) {
    console.log(`Watching "${event.videoTitle}" now!`);
  }
}

class DiscordBot implements Observer {
  update(event: VideoEvent) {
    console.log(`Posted "${event.videoTitle}" to Discord.`);
  }
}

// Subscribe - the channel doesn't care WHO is listening
channel.subscribe(new RegularUser("Alice"));
channel.subscribe(new DiscordBot("MyBot"));
channel.uploadVideo("New Tutorial"); // Both get notified!
```

---

## Visual Explanation

```
┌─────────────────────────────────────────────────────┐
│          YouTubeChannel (Subject)                   │
│                                                     │
│   - observers: Observer[]                           │
│   + subscribe(observer)                             │
│   + unsubscribe(observer)                           │
│   + notify() → calls update() on each observer      │
│   + uploadVideo(title) → triggers notify()          │
└──────────────────────┬──────────────────────────────┘
                       │ notifies
                       ▼
          ┌────────────────────────┐
          │   Observer             │
          │   (interface)          │
          │                        │
          │  + update(event)       │
          │  + getName()           │
          └────────────────────────┘
            ▲          ▲          ▲
            │          │          │
   ┌────────┴──┐ ┌────┴─────┐ ┌─┴──────────┐
   │ Regular   │ │ WatchLat │ │ Notif.     │
   │ User      │ │ er User  │ │ Bot        │
   ├───────────┤ ├──────────┤ ├────────────┤
   │ Watches   │ │ Saves to │ │ Logs to    │
   │ right away│ │ queue    │ │ Discord    │
   └───────────┘ └──────────┘ └────────────┘

KEY INSIGHT:
- The channel doesn't know WHO is subscribed
- It just calls update() on each observer
- Observers can join or leave at any time
- Each observer reacts DIFFERENTLY to the same event
```

---

## How to Make an Observer (3 Steps)

### Step 1: Define the Observer and Subject interfaces

```typescript
interface VideoEvent {
  channelName: string;
  videoTitle: string;
  videoUrl: string;
  uploadedAt: Date;
}

interface Observer {
  update(event: VideoEvent): void;
  getName(): string;
}

interface Subject {
  subscribe(observer: Observer): void;
  unsubscribe(observer: Observer): void;
  notify(event: VideoEvent): void;
}
```

### Step 2: Create the concrete Subject

```typescript
class YouTubeChannel implements Subject {
  private observers: Observer[] = [];

  subscribe(observer: Observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) this.observers.splice(index, 1);
  }

  notify(event: VideoEvent) {
    for (const observer of this.observers) {
      observer.update(event);
    }
  }

  uploadVideo(title: string) {
    const event: VideoEvent = {
      channelName: this.name,
      videoTitle: title,
      videoUrl: `https://youtube.com/watch?v=${title}`,
      uploadedAt: new Date(),
    };
    this.notify(event);
  }
}
```

### Step 3: Create concrete Observers

```typescript
class RegularUser implements Observer {
  getName() { return this.name; }

  update(event: VideoEvent) {
    console.log(`Watching "${event.videoTitle}" now!`);
  }
}

class WatchLaterUser implements Observer {
  private queue: string[] = [];

  getName() { return this.name; }

  update(event: VideoEvent) {
    this.queue.push(event.videoTitle);
    console.log(`Saved "${event.videoTitle}" for later.`);
  }
}
```

---

## Complete Example

```typescript
// ============================================
// INTERFACES
// ============================================

interface VideoEvent {
  channelName: string;
  videoTitle: string;
}

interface Observer {
  update(event: VideoEvent): void;
}

interface Subject {
  subscribe(observer: Observer): void;
  unsubscribe(observer: Observer): void;
  notify(event: VideoEvent): void;
}

// ============================================
// CONCRETE SUBJECT
// ============================================

class YouTubeChannel implements Subject {
  private name: string;
  private observers: Observer[] = [];

  constructor(name: string) {
    this.name = name;
  }

  subscribe(observer: Observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer: Observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }

  notify(event: VideoEvent) {
    for (const observer of this.observers) {
      observer.update(event);
    }
  }

  uploadVideo(title: string) {
    console.log(`[${this.name}] Uploaded: "${title}"`);
    this.notify({ channelName: this.name, videoTitle: title });
  }
}

// ============================================
// CONCRETE OBSERVERS
// ============================================

class RegularUser implements Observer {
  constructor(private name: string) {}

  update(event: VideoEvent) {
    console.log(`  [${this.name}] Watching "${event.videoTitle}" now!`);
  }
}

class WatchLaterUser implements Observer {
  private queue: string[] = [];
  constructor(private name: string) {}

  update(event: VideoEvent) {
    this.queue.push(event.videoTitle);
    console.log(`  [${this.name}] Saved "${event.videoTitle}" to Watch Later.`);
  }
}

// ============================================
// USAGE
// ============================================

const channel = new YouTubeChannel("Tech Academy");
const alice = new RegularUser("Alice");
const bob = new WatchLaterUser("Bob");

channel.subscribe(alice);
channel.subscribe(bob);

channel.uploadVideo("Observer Pattern Tutorial");
// [Tech Academy] Uploaded: "Observer Pattern Tutorial"
//   [Alice] Watching "Observer Pattern Tutorial" now!
//   [Bob] Saved "Observer Pattern Tutorial" to Watch Later.

// Unsubscribe Bob
channel.unsubscribe(bob);

channel.uploadVideo("Strategy Pattern Tutorial");
// [Tech Academy] Uploaded: "Strategy Pattern Tutorial"
//   [Alice] Watching "Strategy Pattern Tutorial" now!
// Bob is NOT notified!
```

---

## Real-World Use Cases

### 1. DOM Event Listeners (You Already Use This!)

The browser's event system IS the Observer pattern.

```typescript
// The button is the Subject
// The callback function is the Observer
button.addEventListener("click", handleClick);   // subscribe
button.removeEventListener("click", handleClick); // unsubscribe

// When the button is clicked, all listeners are notified
```

### 2. React State Management

React's `useState` and re-rendering is Observer under the hood.

```typescript
// Simplified concept:
// Component "subscribes" to state changes
// When setState is called, React "notifies" the component to re-render

const [count, setCount] = useState(0);
// setCount(1) → React notifies the component → re-render
```

### 3. Chat Application

```typescript
interface Message {
  sender: string;
  text: string;
}

interface ChatObserver {
  onMessage(message: Message): void;
}

class ChatRoom {
  private participants: ChatObserver[] = [];

  join(participant: ChatObserver) {
    this.participants.push(participant);
  }

  leave(participant: ChatObserver) {
    this.participants = this.participants.filter(p => p !== participant);
  }

  sendMessage(message: Message) {
    for (const participant of this.participants) {
      participant.onMessage(message);
    }
  }
}
```

### 4. Stock Price Tracker

```typescript
interface StockObserver {
  onPriceChange(symbol: string, price: number): void;
}

class StockTicker {
  private observers: StockObserver[] = [];
  private prices: Map<string, number> = new Map();

  subscribe(observer: StockObserver) {
    this.observers.push(observer);
  }

  updatePrice(symbol: string, price: number) {
    this.prices.set(symbol, price);
    for (const observer of this.observers) {
      observer.onPriceChange(symbol, price);
    }
  }
}
```

---

## Observer vs Other Patterns

```
OBSERVER PATTERN:
┌─────────────────────────────────────┐
│  Subject (YouTubeChannel)           │
│                                     │
│  subscribe(o)   → add listener      │
│  unsubscribe(o) → remove listener   │
│  notify()       → push to ALL       │
│                                     │
│  → ONE-TO-MANY relationship         │
│  → PUSH-based (subject pushes)      │
│  → LOOSE coupling                   │
└─────────────────────────────────────┘

STRATEGY PATTERN (for comparison):
┌─────────────────────────────────────┐
│  Context (Navigator)                │
│                                     │
│  setStrategy(s) → swap algorithm    │
│  execute()      → delegates to ONE  │
│                                     │
│  → ONE-TO-ONE relationship          │
│  → Context USES one strategy        │
└─────────────────────────────────────┘
```

| Aspect | Observer | Strategy |
|--------|----------|----------|
| **Purpose** | Notify many objects of changes | Choose one algorithm |
| **Relationship** | One-to-many | One-to-one |
| **Direction** | Subject pushes to observers | Context delegates to strategy |
| **Who changes** | Observers can join/leave | Strategy is swapped |
| **Pattern type** | Behavioral | Behavioral |

### Easy Explanation: YouTube vs Restaurant

**Observer** is like a YouTube channel:
```
Channel uploads a video
  → Alice gets notified
  → Bob gets notified
  → Charlie gets notified
  (everyone who subscribed)
```

**Strategy** is like choosing a chef:
```
Restaurant gets an order
  → Delegates to ONE chef
  (only one algorithm at a time)
```

**The #1 insight:**
- **Observer** → one event, **MANY** reactions
- **Strategy** → one task, **ONE** algorithm (but swappable)

---

## Common Mistakes

### Mistake 1: Forgetting to unsubscribe (Memory Leak)

**Bad:**
```typescript
class UserComponent {
  constructor(channel: YouTubeChannel) {
    channel.subscribe(this); // subscribe...
  }
  // Never unsubscribes! Even after the component is destroyed,
  // the channel still holds a reference → memory leak
}
```

**Better:**
```typescript
class UserComponent {
  constructor(private channel: YouTubeChannel) {
    channel.subscribe(this);
  }

  destroy() {
    this.channel.unsubscribe(this); // Clean up!
  }
}
```

### Mistake 2: Observer modifies the Subject during update

**Bad:**
```typescript
class BadObserver implements Observer {
  update(event: VideoEvent) {
    // DON'T modify the subject during notification!
    channel.unsubscribe(this); // Can cause iteration bugs
    channel.uploadVideo("Response video"); // Infinite loop risk!
  }
}
```

### Mistake 3: Too many fine-grained notifications

**Bad:**
```typescript
// Notifying on every tiny change
user.setName("Alice");    // notify!
user.setAge(25);          // notify!
user.setEmail("a@b.com"); // notify!
// 3 notifications for what should be 1 update
```

**Better:**
```typescript
// Batch updates, then notify once
user.update({ name: "Alice", age: 25, email: "a@b.com" });
// 1 notification
```

---

## When to Use Observer?

### Use Observer When...

| Situation | Why |
|-----------|-----|
| **One change should affect many objects** | Notify all at once |
| **You don't know how many observers in advance** | Dynamic subscribe/unsubscribe |
| **Objects should be loosely coupled** | Subject doesn't know concrete observers |
| **You're replacing manual "polling" for changes** | Push is more efficient than pull |

### Don't Use Observer When...

| Situation | Why |
|-----------|-----|
| **Only one object needs to know** | Direct method call is simpler |
| **Notification order matters strictly** | Observer doesn't guarantee order |
| **Updates are very frequent** | Can cause performance issues |
| **Simple parent-child relationship** | A callback or event handler is enough |

---

## Key Vocabulary

| Word | Meaning |
|------|---------|
| **Subject** | The object being observed (sends notifications) |
| **Observer** | The object that receives notifications |
| **Subscribe** | Register to receive notifications |
| **Unsubscribe** | Stop receiving notifications |
| **Notify** | Subject tells all observers about a change |
| **Event/Payload** | The data sent with the notification |
| **Publish/Subscribe** | Another name for the Observer pattern |

---

## Quick Quiz

1. What is the relationship between Subject and Observer — one-to-one or one-to-many?
2. Does the Subject know the concrete type of its observers?
3. What happens if you forget to unsubscribe an observer?
4. How is Observer different from Strategy?
5. Name one real-world example of the Observer pattern you use every day.

<details>
<summary>Answers</summary>

1. One-to-many — one Subject notifies many Observers
2. No — it only knows the Observer interface (loose coupling)
3. Memory leak — the Subject keeps a reference to the observer, preventing garbage collection
4. Observer is one-to-many (notify many); Strategy is one-to-one (delegate to one algorithm)
5. DOM event listeners (`addEventListener`), React state/re-rendering, push notifications, chat apps

</details>

---

## Summary

**Observer Pattern in 30 seconds:**
- Define a Subject that maintains a list of Observers
- Observers implement a common interface with an `update()` method
- When the Subject's state changes, it calls `update()` on all Observers
- Observers can subscribe/unsubscribe at any time
- Use when: one change should notify many objects, loose coupling needed, dynamic subscriptions

---

## Try It Yourself

1. Read the code in `code/` folder
2. Create a `HighlightUser` observer that only reacts to videos with certain keywords
3. Add an `unsubscribeAll()` method to `YouTubeChannel`
4. Create a `BlogSite` subject that uses the same Observer interface but for blog posts
5. Implement a stock price tracker with `StockTicker` subject and `Trader` observers
