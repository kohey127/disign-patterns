/**
 * Facade Pattern - HomeTheaterFacade
 *
 * This is the Facade class. It wraps all four subsystems
 * and gives you simple methods like watchMovie() and endMovie().
 *
 * KEY INSIGHT: The Facade doesn't replace the subsystems.
 * You can still use TV, SoundSystem, etc. directly if you want.
 * The Facade just makes the common tasks easier.
 */

import { TV, SoundSystem, StreamingPlayer, RoomLights } from "./Subsystems";

export class HomeTheaterFacade {
  private tv: TV;
  private sound: SoundSystem;
  private player: StreamingPlayer;
  private lights: RoomLights;

  constructor(
    tv: TV,
    sound: SoundSystem,
    player: StreamingPlayer,
    lights: RoomLights
  ) {
    this.tv = tv;
    this.sound = sound;
    this.player = player;
    this.lights = lights;
  }

  /**
   * Start watching a movie.
   * This one method does what would take 8 manual steps.
   */
  watchMovie(movie: string): void {
    console.log(`  [Facade] Starting movie: "${movie}"...`);
    this.lights.dim(20);
    this.tv.turnOn();
    this.tv.setInput("HDMI 1");
    this.sound.turnOn();
    this.sound.setMode("surround");
    this.sound.setVolume(50);
    this.player.turnOn();
    this.player.play(movie);
    console.log(`  [Facade] Enjoy the movie!`);
  }

  /**
   * End the movie and reset everything.
   */
  endMovie(): void {
    console.log("  [Facade] Shutting down...");
    this.player.turnOff();
    this.sound.turnOff();
    this.tv.turnOff();
    this.lights.brighten();
    console.log("  [Facade] All done!");
  }
}
