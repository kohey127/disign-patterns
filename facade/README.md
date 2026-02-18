# Facade Pattern

## What is it? (One sentence)

**Facade gives you one simple method to control many complex subsystems.**

---

## Before You Read This

Make sure you understand basic classes in TypeScript first!

- **Facade** is a Structural pattern (about how objects connect together)
- Previous Structural patterns: Decorator (adding features by wrapping), Adapter (translating interfaces)
- Facade is about **giving a simple entry point to a complex system**
- The word "facade" means the **front of a building** — a clean entrance that hides the complex structure behind it

---

## The Problem (Why do we need this?)

Imagine you want to watch a movie at home.

You have a home theater system with 4 devices: TV, SoundSystem, StreamingPlayer, and RoomLights. To watch a movie, you need to do ALL of these steps:

```typescript
class TV {
  turnOn(): void { console.log("TV: turned on"); }
  turnOff(): void { console.log("TV: turned off"); }
  setInput(source: string): void { console.log(`TV: input set to ${source}`); }
}

class SoundSystem {
  turnOn(): void { console.log("SoundSystem: turned on"); }
  turnOff(): void { console.log("SoundSystem: turned off"); }
  setVolume(level: number): void { console.log(`SoundSystem: volume set to ${level}`); }
  setMode(mode: string): void { console.log(`SoundSystem: mode set to ${mode}`); }
}

class StreamingPlayer {
  turnOn(): void { console.log("StreamingPlayer: turned on"); }
  turnOff(): void { console.log("StreamingPlayer: turned off"); }
  play(movie: string): void { console.log(`StreamingPlayer: playing "${movie}"`); }
}

class RoomLights {
  dim(level: number): void { console.log(`RoomLights: dimmed to ${level}%`); }
  brighten(): void { console.log("RoomLights: brightened to 100%"); }
}

// --- Watch a movie: 8 steps! ---
const tv = new TV();
const sound = new SoundSystem();
const player = new StreamingPlayer();
const lights = new RoomLights();

lights.dim(20);
tv.turnOn();
tv.setInput("HDMI 1");
sound.turnOn();
sound.setMode("surround");
sound.setVolume(50);
player.turnOn();
player.play("The Matrix");
```

**The problem:**
- 8 steps every time you watch a movie
- Easy to forget a step (like dimming the lights)
- You must remember the right order
- New users must learn ALL 4 devices

What if you could do all this with one method call?

---

## The Solution (How Facade helps)

Think of a **TV remote's "Movie" button**.

- You press one button
- The remote sets the input, sound mode, volume, and lights — all at once
- The button doesn't make decisions. It runs the same steps every time.
- You can still use individual buttons for fine control

The Facade pattern works the same way.

### Step 1: You already have the subsystems

These are the 4 device classes from above. We don't change them at all.

```typescript
class TV {
  turnOn(): void { console.log("TV: turned on"); }
  turnOff(): void { console.log("TV: turned off"); }
  setInput(source: string): void { console.log(`TV: input set to ${source}`); }
}

class SoundSystem {
  turnOn(): void { console.log("SoundSystem: turned on"); }
  turnOff(): void { console.log("SoundSystem: turned off"); }
  setVolume(level: number): void { console.log(`SoundSystem: volume set to ${level}`); }
  setMode(mode: string): void { console.log(`SoundSystem: mode set to ${mode}`); }
}

class StreamingPlayer {
  turnOn(): void { console.log("StreamingPlayer: turned on"); }
  turnOff(): void { console.log("StreamingPlayer: turned off"); }
  play(movie: string): void { console.log(`StreamingPlayer: playing "${movie}"`); }
}

class RoomLights {
  dim(level: number): void { console.log(`RoomLights: dimmed to ${level}%`); }
  brighten(): void { console.log("RoomLights: brightened to 100%"); }
}
```

### Step 2: Create the Facade

The Facade wraps all 4 subsystems. It gives you simple methods like `watchMovie()`.

```typescript
class HomeTheaterFacade {
  private tv: TV;
  private sound: SoundSystem;
  private player: StreamingPlayer;
  private lights: RoomLights;

  constructor(tv: TV, sound: SoundSystem, player: StreamingPlayer, lights: RoomLights) {
    this.tv = tv;
    this.sound = sound;
    this.player = player;
    this.lights = lights;
  }

  watchMovie(movie: string): void {
    this.lights.dim(20);
    this.tv.turnOn();
    this.tv.setInput("HDMI 1");
    this.sound.turnOn();
    this.sound.setMode("surround");
    this.sound.setVolume(50);
    this.player.turnOn();
    this.player.play(movie);
  }

  endMovie(): void {
    this.player.turnOff();
    this.sound.turnOff();
    this.tv.turnOff();
    this.lights.brighten();
  }
}
```

### Step 3: Use the Facade

Now you can watch a movie with one line:

```typescript
// Create subsystems
const tv = new TV();
const sound = new SoundSystem();
const player = new StreamingPlayer();
const lights = new RoomLights();

// Create the Facade
const theater = new HomeTheaterFacade(tv, sound, player, lights);

// One line to start!
theater.watchMovie("The Matrix");
// RoomLights: dimmed to 20%
// TV: turned on
// TV: input set to HDMI 1
// SoundSystem: turned on
// SoundSystem: mode set to surround
// SoundSystem: volume set to 50
// StreamingPlayer: turned on
// StreamingPlayer: playing "The Matrix"

// One line to stop!
theater.endMovie();
// StreamingPlayer: turned off
// SoundSystem: turned off
// TV: turned off
// RoomLights: brightened to 100%
```

### Step 4: Direct access still works

The Facade is a shortcut, not a wall. You can still use each device directly.

```typescript
// Create subsystems
const tv = new TV();
const sound = new SoundSystem();
const player = new StreamingPlayer();
const lights = new RoomLights();

// Create the Facade
const theater = new HomeTheaterFacade(tv, sound, player, lights);

theater.watchMovie("The Matrix");  // Use the shortcut

// Direct access — "I want to turn up the volume"
sound.setVolume(80);
// SoundSystem: volume set to 80
```

---

## "Wait — isn't that just a function?"

Good question! For this simple example, a function works fine:

```typescript
function watchMovie(tv: TV, sound: SoundSystem, player: StreamingPlayer, lights: RoomLights, movie: string): void {
  lights.dim(20);
  tv.turnOn();
  tv.setInput("HDMI 1");
  sound.turnOn();
  sound.setMode("surround");
  sound.setVolume(50);
  player.turnOn();
  player.play(movie);
}
```

**If a function is enough, use a function.** Don't create a Facade class just because the pattern exists.

So when does a Facade class actually help? When you need **multiple related methods that share the same subsystems**:

```typescript
// watchMovie() and endMovie() both use the same tv, sound, player, lights.
// A class holds these references so you don't pass them every time.
const theater = new HomeTheaterFacade(tv, sound, player, lights);
theater.watchMovie("The Matrix");
// ... later ...
theater.endMovie();
```

But the real power of Facade is not in small examples like this. Read the next section.

---

## Where Facade Really Shines — Module Boundaries

The home theater example shows the mechanics. But in practice, Facade shines when you build a **module that other people will use**.

### Example: Checkout Module

Your team is building an online store. The checkout module has 5 internal classes:

```typescript
class PriceCalculator {
  calculate(items: Item[]): number { /* subtotal, discounts, coupons... */ }
}
class TaxCalculator {
  calculate(amount: number, region: string): number { /* regional tax rates... */ }
}
class PaymentGateway {
  charge(amount: number, card: CardInfo): ChargeResult { /* API call... */ }
}
class InvoiceGenerator {
  generate(order: Order, charge: ChargeResult): Invoice { /* PDF... */ }
}
class NotificationService {
  sendReceipt(email: string, invoice: Invoice): void { /* email... */ }
}
```

Without Facade, every team member who uses checkout must know ALL 5 classes:

```typescript
// Other team members must write this every time
const price = new PriceCalculator().calculate(items);
const tax = new TaxCalculator().calculate(price, "JP");
const total = price + tax;
const charge = new PaymentGateway().charge(total, cardInfo);
const invoice = new InvoiceGenerator().generate(order, charge);
new NotificationService().sendReceipt(email, invoice);
```

With Facade, they call one method:

```typescript
class CheckoutFacade {
  constructor(
    private pricing: PriceCalculator,
    private tax: TaxCalculator,
    private payment: PaymentGateway,
    private invoices: InvoiceGenerator,
    private notifications: NotificationService
  ) {}

  checkout(items: Item[], cardInfo: CardInfo, email: string): Invoice {
    const price = this.pricing.calculate(items);
    const tax = this.tax.calculate(price, "JP");
    const charge = this.payment.charge(price + tax, cardInfo);
    const invoice = this.invoices.generate({ items, price, tax }, charge);
    this.notifications.sendReceipt(email, invoice);
    return invoice;
  }
}

// --- Other team members just call this ---
const invoice = checkoutFacade.checkout(items, cardInfo, email);
```

**This is where Facade matters.** Other people don't need to know how your 5 classes connect. They just call `checkout()`.

### The key difference

| Situation | Use a function | Use a Facade class |
|-----------|---------------|-------------------|
| One-off task for yourself | Yes | Overkill |
| Multiple related methods sharing state | Maybe | Yes |
| Entry point for a module other people use | No | **Yes — this is the main use case** |

---

## Visual Explanation

```
REAL WORLD:

  TV Remote "Movie" Button
  ──→ Sets input to HDMI 1
  ──→ Sets sound to surround
  ──→ Sets volume to 50
  ──→ Dims lights

  One press does 4 things.
  No decisions. Same steps every time.
  You can still use individual buttons.

IN CODE:

  theater.watchMovie("The Matrix")
  ──→ tv.turnOn(), tv.setInput("HDMI 1")
  ──→ sound.turnOn(), sound.setMode("surround")
  ──→ player.turnOn(), player.play(movie)
  ──→ lights.dim(20)


BEFORE (without Facade):

  ┌──────────┐     ┌───────────────────┐
  │          │────►│ TV                │
  │          │────►│ SoundSystem       │
  │ Your App │────►│ StreamingPlayer   │
  │          │────►│ RoomLights        │
  │          │     │                   │
  └──────────┘     └───────────────────┘
  You must know ALL 4 devices and their methods.


AFTER (with Facade):

  ┌──────────┐     ┌─────────────┐     ┌───────────────────┐
  │          │     │  Facade     │────►│ TV                │
  │ Your App │────►│             │────►│ SoundSystem       │
  │          │     │ watchMovie()│────►│ StreamingPlayer   │
  │          │     │ endMovie()  │────►│ RoomLights        │
  └──────────┘     └─────────────┘     └───────────────────┘
  You call ONE method. The Facade handles the rest.
  (You can still access subsystems directly if needed!)


KEY INSIGHT:
- The Facade is a SHORTCUT, not a wall
- Subsystems still work on their own
- The subsystems don't know the Facade exists
```

---

## Complete Example

```typescript
// ============================================
// SUBSYSTEMS (4 devices)
// ============================================

class TV {
  turnOn(): void { console.log("  TV: turned on"); }
  turnOff(): void { console.log("  TV: turned off"); }
  setInput(source: string): void { console.log(`  TV: input set to ${source}`); }
}

class SoundSystem {
  turnOn(): void { console.log("  SoundSystem: turned on"); }
  turnOff(): void { console.log("  SoundSystem: turned off"); }
  setVolume(level: number): void { console.log(`  SoundSystem: volume set to ${level}`); }
  setMode(mode: string): void { console.log(`  SoundSystem: mode set to ${mode}`); }
}

class StreamingPlayer {
  turnOn(): void { console.log("  StreamingPlayer: turned on"); }
  turnOff(): void { console.log("  StreamingPlayer: turned off"); }
  play(movie: string): void { console.log(`  StreamingPlayer: playing "${movie}"`); }
}

class RoomLights {
  dim(level: number): void { console.log(`  RoomLights: dimmed to ${level}%`); }
  brighten(): void { console.log("  RoomLights: brightened to 100%"); }
}

// ============================================
// FACADE
// ============================================

class HomeTheaterFacade {
  private tv: TV;
  private sound: SoundSystem;
  private player: StreamingPlayer;
  private lights: RoomLights;

  constructor(tv: TV, sound: SoundSystem, player: StreamingPlayer, lights: RoomLights) {
    this.tv = tv;
    this.sound = sound;
    this.player = player;
    this.lights = lights;
  }

  watchMovie(movie: string): void {
    console.log(`  Starting movie: "${movie}"...`);
    this.lights.dim(20);
    this.tv.turnOn();
    this.tv.setInput("HDMI 1");
    this.sound.turnOn();
    this.sound.setMode("surround");
    this.sound.setVolume(50);
    this.player.turnOn();
    this.player.play(movie);
    console.log("  Enjoy the movie!");
  }

  endMovie(): void {
    console.log("  Shutting down...");
    this.player.turnOff();
    this.sound.turnOff();
    this.tv.turnOff();
    this.lights.brighten();
    console.log("  All done!");
  }
}

// ============================================
// USAGE
// ============================================

const tv = new TV();
const sound = new SoundSystem();
const player = new StreamingPlayer();
const lights = new RoomLights();

const theater = new HomeTheaterFacade(tv, sound, player, lights);

// Watch a movie — one call!
theater.watchMovie("The Matrix");

// End the movie — one call!
theater.endMovie();

// Direct access still works
sound.setVolume(80);
```

---

## Real-World Use Cases

### 1. jQuery

jQuery is a Facade for the browser's DOM API.

```
Without jQuery (raw DOM):
  document.getElementById("myDiv").style.display = "none";
  document.getElementById("myDiv").addEventListener("click", handler);

With jQuery (Facade):
  $("#myDiv").hide();
  $("#myDiv").click(handler);
```

The DOM API is still there. jQuery just makes common tasks simpler.

### 2. Express.js

Express is a Facade for Node.js HTTP module.

```
Without Express (raw Node.js):
  const server = http.createServer((req, res) => {
    if (req.method === "GET" && req.url === "/users") {
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify(users));
    }
  });

With Express (Facade):
  app.get("/users", (req, res) => res.json(users));
```

Node's HTTP module still works. Express just gives you a simpler interface.

### 3. ORM (Object-Relational Mapping)

ORMs like Prisma are Facades for raw SQL.

```
Without ORM (raw SQL):
  db.query("SELECT * FROM users WHERE age > 18 ORDER BY name");

With ORM (Facade):
  User.findMany({ where: { age: { gt: 18 } }, orderBy: { name: "asc" } });
```

The database still accepts SQL. The ORM makes common queries easier.

### 4. console.log

Even `console.log()` is a Facade! It hides the details of writing to stdout, formatting objects, and converting types.

```
Behind the scenes, console.log:
  1. Converts the value to a string
  2. Formats objects for readability
  3. Writes to process.stdout
  4. Adds a newline character

You just call: console.log("hello")
```

---

## Facade vs Other Patterns

| Aspect | Facade | Adapter | Decorator |
|--------|--------|---------|-----------|
| **Purpose** | Simplify a complex system | Make incompatible interfaces work together | Add features by wrapping |
| **Wraps** | Multiple objects | One object with a DIFFERENT interface | One object with the SAME interface |
| **Creates new interface?** | Yes — simpler than the originals | Yes — converts one to another | No — keeps the same interface |
| **Subsystems know about it?** | No | No | No |
| **Pattern type** | Structural | Structural | Structural |

### Easy Explanation

**Facade** is like a TV remote's "Movie" button:
```
Press "Movie" → (sets input, sound mode, volume, lights)
One button does many things. No decisions.
```

**Adapter** is like a power plug converter:
```
Japanese plug → adapter → US socket
Makes two different shapes fit together.
```

**Decorator** is like gift wrapping:
```
Box → wrap in paper → add ribbon
Each layer adds something. Same shape throughout.
```

**The #1 insight:**
- **Facade** → **SIMPLIFY** a complex system (new simple interface for multiple objects)
- **Adapter** → **TRANSLATE** between different interfaces (one object)
- **Decorator** → **ADD** behavior (stack layers, same interface, one object)

---

## Anti-patterns

### 1. God Facade — Putting everything in one Facade

A Facade should cover one task or one area. If your Facade has 20 methods, it became the problem it was trying to solve.

**Bad — one Facade does everything:**
```typescript
class GodFacade {
  constructor(
    private tv: TV,
    private sound: SoundSystem,
    private player: StreamingPlayer,
    private lights: RoomLights
  ) {}

  watchMovie(movie: string): void { /* ... */ }
  endMovie(): void { /* ... */ }
  playMusic(): void { /* ... */ }
  startGaming(): void { /* ... */ }
  startKaraoke(): void { /* ... */ }
  startPresentation(): void { /* ... */ }
  adjustLightsForReading(): void { /* ... */ }
  setupPartyMode(): void { /* ... */ }
  // 20 more methods...
}
```

**Better — split into focused Facades:**
```typescript
class MovieFacade {
  constructor(private tv: TV, private sound: SoundSystem,
              private player: StreamingPlayer, private lights: RoomLights) {}

  watchMovie(movie: string): void { /* ... */ }
  endMovie(): void { /* ... */ }
}

class GamingFacade {
  constructor(private tv: TV, private sound: SoundSystem,
              private lights: RoomLights) {}

  startGaming(): void { /* ... */ }
  endGaming(): void { /* ... */ }
}
```

### 2. Facade as a Wall — Blocking direct access to subsystems

A Facade should be a shortcut, not a wall. Users should still be able to use subsystems directly when they need more control.

**Bad — Facade creates subsystems inside, nobody else can touch them:**
```typescript
class WallFacade {
  private tv: TV;
  private sound: SoundSystem;

  constructor() {
    this.tv = new TV();             // Created inside — can't be shared
    this.sound = new SoundSystem(); // Created inside — can't be shared
  }

  watchMovie(movie: string): void { /* ... */ }
  // No way to adjust volume separately!
}

const facade = new WallFacade();
facade.watchMovie("The Matrix");
// Can't do: sound.setVolume(80) — no access to sound!
```

**Better — Facade receives subsystems from outside:**
```typescript
// Subsystems are created outside — you still have access
const tv = new TV();
const sound = new SoundSystem();
const facade = new HomeTheaterFacade(tv, sound, player, lights);

facade.watchMovie("The Matrix"); // Use the shortcut
sound.setVolume(80);             // Direct access still works!
```

### 3. Business Logic in Facade — Adding decisions to the Facade

A Facade should only call subsystem methods in order. It should not make decisions like "if it's night, lower volume" or "if it's a horror movie, dim more". Those decisions belong somewhere else.

**Bad — Facade makes decisions:**
```typescript
class SmartFacade {
  constructor(
    private tv: TV,
    private sound: SoundSystem,
    private player: StreamingPlayer,
    private lights: RoomLights
  ) {}

  watchMovie(movie: string): void {
    // Decisions don't belong here!
    const hour = new Date().getHours();
    if (hour >= 22) {
      this.sound.setVolume(20);  // Quiet at night
    } else {
      this.sound.setVolume(50);  // Normal during day
    }

    if (movie.includes("Horror")) {
      this.lights.dim(5);  // Extra dark for horror
    } else {
      this.lights.dim(20);
    }

    this.tv.turnOn();
    this.player.play(movie);
  }
}
```

**Better — Facade only coordinates, decisions live outside:**
```typescript
class CleanFacade {
  constructor(
    private tv: TV,
    private sound: SoundSystem,
    private player: StreamingPlayer,
    private lights: RoomLights
  ) {}

  watchMovie(movie: string): void {
    // Only coordination — no decisions
    this.lights.dim(20);
    this.tv.turnOn();
    this.tv.setInput("HDMI 1");
    this.sound.turnOn();
    this.sound.setMode("surround");
    this.sound.setVolume(50);
    this.player.turnOn();
    this.player.play(movie);
  }
}
```

### 4. Mirror Facade — Wrapping each subsystem method one-to-one

If your Facade methods just call one subsystem method each, it adds no value. A Facade should combine multiple steps into one meaningful action.

**Bad — just repeating subsystem methods:**
```typescript
class MirrorFacade {
  constructor(private tv: TV, private sound: SoundSystem) {}

  turnOnTv(): void { this.tv.turnOn(); }           // Just a wrapper
  turnOffTv(): void { this.tv.turnOff(); }          // Just a wrapper
  setTvInput(s: string): void { this.tv.setInput(s); } // Just a wrapper
  turnOnSound(): void { this.sound.turnOn(); }      // Just a wrapper
  setVolume(n: number): void { this.sound.setVolume(n); } // Just a wrapper
}
```

**Better — combine steps into meaningful actions:**
```typescript
class UsefulFacade {
  constructor(private tv: TV, private sound: SoundSystem,
              private player: StreamingPlayer, private lights: RoomLights) {}

  watchMovie(movie: string): void {
    // Combines 8 steps into 1 meaningful action
    this.lights.dim(20);
    this.tv.turnOn();
    this.tv.setInput("HDMI 1");
    this.sound.turnOn();
    this.sound.setMode("surround");
    this.sound.setVolume(50);
    this.player.turnOn();
    this.player.play(movie);
  }
}
```

---

## When to Use Facade?

### Use Facade When...

| Situation | Why |
|-----------|-----|
| **You're building a module other people will use** | Give them a simple entry point so they don't need to learn your internal classes |
| **Multiple classes must be used together in a specific order** | The Facade remembers the order so users don't have to |
| **You're wrapping a complex library for your team** | Give your team a simpler interface to work with |
| **You have multiple related methods sharing the same subsystems** | A class holds the references (watchMovie + endMovie share the same devices) |

### Don't Use Facade When...

| Situation | Why |
|-----------|-----|
| **A simple function does the job** | Don't create a class for one function |
| **There's only one subsystem** | No complexity to simplify — just use it directly |
| **Each subsystem is used independently** | If they're not related, don't combine them |
| **You need to translate interfaces** | Use Adapter instead |
| **You need to add behavior** | Use Decorator instead |

---

## What if the Facade Grows Complex?

This is a fair concern. The answer: **keep the Facade thin**.

A Facade should only hold the **order of steps**. Each step's logic stays in its subsystem.

```
Good Facade:

  checkout() {
    1. pricing.calculate()      ← details inside PriceCalculator
    2. tax.calculate()          ← details inside TaxCalculator
    3. payment.charge()         ← details inside PaymentGateway
    4. invoices.generate()      ← details inside InvoiceGenerator
    5. notifications.send()     ← details inside NotificationService
  }

  The Facade is 5 lines of method calls.
  Each subsystem handles its own complexity.
```

If the Facade itself gets complex, that means either:
1. **Business logic leaked in** → move it to a subsystem or a service
2. **Too many responsibilities** → split into multiple Facades

---

## Key Vocabulary

| Word | Meaning |
|------|---------|
| **Facade** | A class that gives a simple interface to a complex system (from French "face" — the front of a building) |
| **Subsystem** | One of the classes behind the Facade (e.g., TV, SoundSystem) |
| **Client** | The code that uses the Facade (e.g., your main program) |
| **Coordinate** | Make multiple things work together in the right order |
| **Shortcut** | A quick way to do something that normally takes many steps |
| **Module boundary** | The point where one part of the code meets another — the Facade sits here |

---

## Quick Quiz

1. What is the difference between Facade and Adapter?
2. Can you still use subsystems directly when you have a Facade?
3. When should you use a plain function instead of a Facade class?
4. Should a Facade create its subsystems inside the constructor? Why not?
5. What should you do when a Facade method starts getting complex?

<details>
<summary>Answers</summary>

1. Facade simplifies a complex system (many objects → one simple interface). Adapter translates between two incompatible interfaces (one object → different interface).
2. Yes! The Facade is a shortcut, not a wall. You can always access subsystems directly for more control.
3. When you only have one action and don't need to share subsystem references across methods. If a function is enough, use a function.
4. No. The Facade should receive subsystems through its constructor. This way, the caller still has direct access to the subsystems when needed.
5. Move the complex logic into the subsystems. The Facade should only hold the order of method calls (step 1, step 2, step 3...), not the details of each step.

</details>

---

## Summary

**Facade Pattern in 30 seconds:**
- You have a complex system with many objects and many steps
- Common tasks need calling many methods in the right order
- Create a Facade: one class with simple methods like `watchMovie()`
- The subsystems still work on their own — the Facade is a shortcut, not a wall
- **Main use case:** providing a simple entry point for a module that other people use
- If a function is enough, don't create a Facade class

---

## Try It Yourself

1. Read the code in `code/` folder
2. Add a `playMusic(song: string)` method to `HomeTheaterFacade` that uses different sound settings (e.g., "music" mode, volume 70, lights at 50%)
3. Add a `PopcornMaker` subsystem with `turnOn()` and `pop()` methods, and update the Facade to use it in `watchMovie()`
4. Create a second Facade called `GamingFacade` that sets up the same devices differently for gaming (e.g., different TV input, "gaming" sound mode, brighter lights)
5. What would happen if you put time-based logic (like "quiet mode after 10pm") in the Facade? Where should that logic go instead?
