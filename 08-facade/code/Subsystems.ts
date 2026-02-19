/**
 * Facade Pattern - Subsystem Classes
 *
 * WHAT IS THE FACADE PATTERN?
 * It gives you one simple method to control many complex subsystems.
 * Instead of calling 10 methods on 4 different objects, you call 1 method
 * on the Facade.
 *
 * Think: A TV remote's "Movie" button.
 * - One button press sets input, sound mode, volume, and lights
 * - The button doesn't make decisions — same steps every time
 * - You can still use individual buttons for fine control
 */

// ============================================
// SUBSYSTEM 1: TV
// ============================================

/**
 * The TV class.
 *
 * Has its own interface with turnOn(), turnOff(), and setInput().
 * It doesn't know about the Facade at all.
 */
export class TV {
  turnOn(): void {
    console.log("    TV: turned on");
  }

  turnOff(): void {
    console.log("    TV: turned off");
  }

  setInput(source: string): void {
    console.log(`    TV: input set to ${source}`);
  }
}

// ============================================
// SUBSYSTEM 2: SOUND SYSTEM
// ============================================

/**
 * The SoundSystem class.
 *
 * Has its own interface with turnOn(), turnOff(), setVolume(), and setMode().
 * It doesn't know about the Facade at all.
 */
export class SoundSystem {
  turnOn(): void {
    console.log("    SoundSystem: turned on");
  }

  turnOff(): void {
    console.log("    SoundSystem: turned off");
  }

  setVolume(level: number): void {
    console.log(`    SoundSystem: volume set to ${level}`);
  }

  setMode(mode: string): void {
    console.log(`    SoundSystem: mode set to ${mode}`);
  }
}

// ============================================
// SUBSYSTEM 3: STREAMING PLAYER
// ============================================

/**
 * The StreamingPlayer class.
 *
 * Has its own interface with turnOn(), turnOff(), and play().
 * It doesn't know about the Facade at all.
 */
export class StreamingPlayer {
  turnOn(): void {
    console.log("    StreamingPlayer: turned on");
  }

  turnOff(): void {
    console.log("    StreamingPlayer: turned off");
  }

  play(movie: string): void {
    console.log(`    StreamingPlayer: playing "${movie}"`);
  }
}

// ============================================
// SUBSYSTEM 4: ROOM LIGHTS
// ============================================

/**
 * The RoomLights class.
 *
 * Has its own interface with dim() and brighten().
 * It doesn't know about the Facade at all.
 */
export class RoomLights {
  dim(level: number): void {
    console.log(`    RoomLights: dimmed to ${level}%`);
  }

  brighten(): void {
    console.log("    RoomLights: brightened to 100%");
  }
}
