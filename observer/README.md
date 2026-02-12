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

Imagine you're building a messaging app like Slack.

When someone posts a message in a channel, many things need to happen:
- **Desktop app** shows the message on screen
- **Mobile app** sends a push notification
- **Bots** check for keywords and auto-reply

**The naive approach:**

```typescript
function postMessage(channel: Channel, text: string) {
  // Save the message...
  saveMessage(channel, text);

  // Now manually notify everyone
  for (const pc of getAllDesktopUsers(channel)) {
    showOnScreen(pc, text);
  }
  for (const phone of getAllMobileUsers(channel)) {
    sendPushNotification(phone, text);
  }
  for (const bot of getAllBots(channel)) {
    bot.checkKeywords(text);
  }
  // What if we add email notifications? Modify this function again...
}
```

**Problems:**

1. **Tightly coupled** — The channel knows about every type of member
2. **Hard to extend** — Adding a new notification type means changing the post function
3. **Violates Open/Closed Principle** — You must change existing code to add new behavior
4. **Hard to test** — Can't test notification logic in isolation
5. **No dynamic membership** — Can't easily join/leave at runtime

---

## The Solution (How Observer helps)

Define a common interface for all observers, and let the subject manage a list of them.

```typescript
// Observer interface - all members share this shape
interface Observer {
  onMessage(message: SlackMessage): void;
}

// Subject manages observers and notifies them
class SlackChannel {
  private observers: Observer[] = [];

  join(observer: Observer) {
    this.observers.push(observer);
  }

  leave(observer: Observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }

  postMessage(sender: string, text: string) {
    const message = { channelName: this.name, sender, text };
    // Notify all observers
    for (const observer of this.observers) {
      observer.onMessage(message);
    }
  }
}
```

**Now adding a new observer type is easy:**

```typescript
class DesktopApp implements Observer {
  onMessage(message: SlackMessage) {
    console.log(`New message on screen: ${message.text}`);
  }
}

class SlackBot implements Observer {
  onMessage(message: SlackMessage) {
    if (message.text.includes("help")) {
      console.log("Bot: How can I help you?");
    }
  }
}

// Join the channel - the channel doesn't care WHO is listening
channel.join(new DesktopApp("Alice"));
channel.join(new SlackBot("HelpBot"));
channel.postMessage("Bob", "I need help!"); // Both get notified!
```

---

## Visual Explanation

```
┌─────────────────────────────────────────────────────┐
│          SlackChannel (Subject)                      │
│                                                      │
│   - observers: Observer[]                            │
│   + join(observer)                                   │
│   + leave(observer)                                  │
│   + notifyAll() → calls onMessage() on each observer │
│   + postMessage(sender, text) → triggers notifyAll() │
└──────────────────────┬───────────────────────────────┘
                       │ notifies
                       ▼
          ┌────────────────────────┐
          │   Observer             │
          │   (interface)          │
          │                        │
          │  + onMessage(message)  │
          │  + getName()           │
          └────────────────────────┘
            ▲          ▲          ▲
            │          │          │
   ┌────────┴──┐ ┌────┴─────┐ ┌─┴──────────┐
   │ Desktop   │ │ Mobile   │ │ Slack      │
   │ App       │ │ App      │ │ Bot        │
   ├───────────┤ ├──────────┤ ├────────────┤
   │ Shows msg │ │ Push     │ │ Auto-reply │
   │ on screen │ │ notif.   │ │ on keyword │
   └───────────┘ └──────────┘ └────────────┘

KEY INSIGHT:
- The channel doesn't know WHO is listening
- It just calls onMessage() on each observer
- Observers can join or leave at any time
- Each observer reacts DIFFERENTLY to the same message
```

---

## How to Make an Observer (3 Steps)

### Step 1: Define the Observer and Subject interfaces

```typescript
interface SlackMessage {
  channelName: string;
  sender: string;
  text: string;
  timestamp: Date;
}

interface Observer {
  onMessage(message: SlackMessage): void;
  getName(): string;
}

interface Subject {
  join(observer: Observer): void;
  leave(observer: Observer): void;
  notifyAll(message: SlackMessage): void;
}
```

### Step 2: Create the concrete Subject

```typescript
class SlackChannel implements Subject {
  private observers: Observer[] = [];

  join(observer: Observer) {
    this.observers.push(observer);
  }

  leave(observer: Observer) {
    const index = this.observers.indexOf(observer);
    if (index !== -1) this.observers.splice(index, 1);
  }

  notifyAll(message: SlackMessage) {
    for (const observer of this.observers) {
      observer.onMessage(message);
    }
  }

  postMessage(sender: string, text: string) {
    const message: SlackMessage = {
      channelName: this.name,
      sender,
      text,
      timestamp: new Date(),
    };
    this.notifyAll(message);
  }
}
```

### Step 3: Create concrete Observers

```typescript
class DesktopApp implements Observer {
  getName() { return this.name; }

  onMessage(message: SlackMessage) {
    console.log(`[PC] New message: ${message.sender}: "${message.text}"`);
  }
}

class MobileApp implements Observer {
  getName() { return this.name; }

  onMessage(message: SlackMessage) {
    const preview = message.text.substring(0, 20) + "...";
    console.log(`[Mobile] Push: ${message.sender}: "${preview}"`);
  }
}
```

---

## Complete Example

```typescript
// ============================================
// INTERFACES
// ============================================

interface SlackMessage {
  channelName: string;
  sender: string;
  text: string;
}

interface Observer {
  onMessage(message: SlackMessage): void;
}

interface Subject {
  join(observer: Observer): void;
  leave(observer: Observer): void;
  notifyAll(message: SlackMessage): void;
}

// ============================================
// CONCRETE SUBJECT
// ============================================

class SlackChannel implements Subject {
  private name: string;
  private observers: Observer[] = [];

  constructor(name: string) {
    this.name = name;
  }

  join(observer: Observer) {
    this.observers.push(observer);
  }

  leave(observer: Observer) {
    this.observers = this.observers.filter(o => o !== observer);
  }

  notifyAll(message: SlackMessage) {
    for (const observer of this.observers) {
      observer.onMessage(message);
    }
  }

  postMessage(sender: string, text: string) {
    console.log(`[#${this.name}] ${sender}: "${text}"`);
    this.notifyAll({ channelName: this.name, sender, text });
  }
}

// ============================================
// CONCRETE OBSERVERS
// ============================================

class DesktopApp implements Observer {
  constructor(private name: string) {}

  onMessage(message: SlackMessage) {
    console.log(`  [${this.name} - PC] Shows message on screen`);
  }
}

class MobileApp implements Observer {
  constructor(private name: string) {}

  onMessage(message: SlackMessage) {
    console.log(`  [${this.name} - Mobile] Push notification sent`);
  }
}

class SlackBot implements Observer {
  constructor(private name: string, private keyword: string) {}

  onMessage(message: SlackMessage) {
    if (message.text.includes(this.keyword)) {
      console.log(`  [${this.name} - Bot] Auto-reply: "How can I help?"`);
    }
  }
}

// ============================================
// USAGE
// ============================================

const general = new SlackChannel("general");
const alicePC = new DesktopApp("Alice");
const aliceMobile = new MobileApp("Alice");
const helpBot = new SlackBot("HelpBot", "help");

general.join(alicePC);
general.join(aliceMobile);
general.join(helpBot);

general.postMessage("Bob", "Hey everyone!");
// [#general] Bob: "Hey everyone!"
//   [Alice - PC] Shows message on screen
//   [Alice - Mobile] Push notification sent
//   (HelpBot does nothing - no keyword match)

general.postMessage("Charlie", "I need help with deploy");
// [#general] Charlie: "I need help with deploy"
//   [Alice - PC] Shows message on screen
//   [Alice - Mobile] Push notification sent
//   [HelpBot - Bot] Auto-reply: "How can I help?"

// Leave channel
general.leave(aliceMobile);

general.postMessage("Bob", "Lunch?");
// [#general] Bob: "Lunch?"
//   [Alice - PC] Shows message on screen
//   (Alice's mobile is NOT notified!)
```

---

## Real-World Use Cases

### 1. DOM Event Listeners (You Already Use This!)

The browser's event system IS the Observer pattern.

```typescript
// The button is the Subject
// The callback function is the Observer
button.addEventListener("click", handleClick);   // join
button.removeEventListener("click", handleClick); // leave

// When the button is clicked, all listeners are notified
```

### 2. React State Management

React's `useState` and re-rendering is Observer under the hood.

```typescript
// Simplified concept:
// Component "joins" (subscribes to) state changes
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
│  Subject (SlackChannel)             │
│                                     │
│  join(o)      → add listener        │
│  leave(o)     → remove listener     │
│  notifyAll()  → push to ALL         │
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

### Easy Explanation: Slack vs Restaurant

**Observer** is like a Slack channel:
```
Someone posts a message in #general
  → Alice's PC shows it on screen
  → Alice's phone sends a push notification
  → HelpBot checks for keywords
  (everyone in the channel gets it)
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

### Mistake 1: Forgetting to leave (Memory Leak)

**Bad:**
```typescript
class NotificationService {
  constructor(channel: SlackChannel) {
    channel.join(this); // join...
  }
  // Never leaves! Even after the service is destroyed,
  // the channel still holds a reference → memory leak
}
```

**Better:**
```typescript
class NotificationService {
  constructor(private channel: SlackChannel) {
    channel.join(this);
  }

  destroy() {
    this.channel.leave(this); // Clean up!
  }
}
```

### Mistake 2: Observer modifies the Subject during notification

**Bad:**
```typescript
class BadObserver implements Observer {
  onMessage(message: SlackMessage) {
    // DON'T modify the subject during notification!
    channel.leave(this); // Can cause iteration bugs
    channel.postMessage("Bot", "Response"); // Infinite loop risk!
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
| **You don't know how many observers in advance** | Dynamic join/leave |
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
| **Subscribe / Join** | Register to receive notifications |
| **Unsubscribe / Leave** | Stop receiving notifications |
| **Notify** | Subject tells all observers about a change |
| **Event / Payload** | The data sent with the notification |
| **Publish / Subscribe** | Another name for the Observer pattern |

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
- Observers implement a common interface with an `onMessage()` (or `update()`) method
- When the Subject's state changes, it calls `onMessage()` on all Observers
- Observers can join/leave at any time
- Use when: one change should notify many objects, loose coupling needed, dynamic subscriptions

---

## Try It Yourself

1. Read the code in `code/` folder
2. Create an `EmailNotifier` observer that sends email for messages containing "@all"
3. Add a `leaveAll()` method to `SlackChannel` that removes all observers
4. Create a `DiscordServer` subject that uses the same Observer interface but for Discord messages
5. Implement a stock price tracker with `StockTicker` subject and `Trader` observers
