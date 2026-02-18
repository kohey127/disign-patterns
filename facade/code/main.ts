/**
 * Main Demo - Facade Pattern in Action
 *
 * Run this file to see how Facade Pattern works:
 *   bun run main.ts
 *
 * KEY INSIGHT: The Facade doesn't hide the subsystems.
 * It just gives you a simple shortcut for common tasks.
 * You can still access each subsystem directly when needed.
 */

import { TV, SoundSystem, StreamingPlayer, RoomLights } from "./Subsystems";
import { HomeTheaterFacade } from "./HomeTheaterFacade";

// ============================================
// DEMO START
// ============================================

console.log("=".repeat(55));
console.log("  FACADE PATTERN DEMO - Home Theater System");
console.log("=".repeat(55));

// ============================================
// DEMO 1: Without Facade (Manual Steps)
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 1: Without Facade (Manual Steps)");
console.log("─".repeat(55));
console.log();

const tv = new TV();
const sound = new SoundSystem();
const player = new StreamingPlayer();
const lights = new RoomLights();

console.log("  Watching a movie the hard way...");
lights.dim(20);
tv.turnOn();
tv.setInput("HDMI 1");
sound.turnOn();
sound.setMode("surround");
sound.setVolume(50);
player.turnOn();
player.play("The Matrix");
console.log("  That was 8 steps!\n");

console.log("  Now stopping the hard way...");
player.turnOff();
sound.turnOff();
tv.turnOff();
lights.brighten();
console.log("  That was 4 more steps!");

// ============================================
// DEMO 2: With Facade (One Method Call)
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 2: With Facade (One Method Call)");
console.log("─".repeat(55));
console.log();

const theater = new HomeTheaterFacade(tv, sound, player, lights);
theater.watchMovie("The Matrix");

// ============================================
// DEMO 3: End Movie (One Method Call)
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 3: End Movie (One Method Call)");
console.log("─".repeat(55));
console.log();

theater.endMovie();

// ============================================
// DEMO 4: Direct Access Still Works
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 4: Direct Access Still Works");
console.log("─".repeat(55));
console.log();

console.log("  The Facade doesn't block direct access.");
console.log("  You can still control subsystems yourself:\n");
sound.turnOn();
sound.setVolume(80);
sound.setMode("music");
console.log("\n  Used SoundSystem directly — no Facade needed!");

// ============================================
// KEY POINT
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  KEY POINT: Why Facade Pattern?");
console.log("─".repeat(55));

console.log(`
  Without Facade:
  - You must remember 8+ steps in the right order
  - Every time you watch a movie, repeat all steps
  - Easy to forget a step (like dimming the lights)
  - New users must learn every subsystem

  With Facade:
  - watchMovie("The Matrix") — one line does everything
  - endMovie() — one line cleans up
  - New users can start immediately
  - You can still access subsystems directly when needed

  The Facade doesn't hide complexity — it gives you
  a shortcut for the most common tasks.
`);

// ============================================
// DEMO COMPLETE
// ============================================

console.log("=".repeat(55));
console.log("  DEMO COMPLETE");
console.log("=".repeat(55));
console.log(`
  Try these exercises:

  1. Add a playMusic(song: string) method to the Facade
     that sets different sound/light settings than watchMovie()

  2. Add a new subsystem (e.g., PopcornMaker) and update
     the Facade to use it in watchMovie()

  3. What happens if one subsystem fails (e.g., TV won't turn on)?
     How should the Facade handle errors?

  4. Can you have two different Facades for the same subsystems?
     (e.g., MovieFacade and GamingFacade with different settings)
`);
