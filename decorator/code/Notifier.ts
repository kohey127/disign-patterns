/**
 * Decorator Pattern - Notifier Interface, ConcreteComponent & Base Decorator
 *
 * WHAT IS THE DECORATOR PATTERN?
 * It lets you add new behavior to an object by wrapping it in another object.
 * The wrapper has the same interface as the original, so the rest of
 * your code doesn't know (or care) that decoration happened.
 *
 * Think: Gift wrapping.
 * - You have a box (the original object)
 * - You wrap it in paper (first decorator)
 * - You add a ribbon (second decorator)
 * - You attach a tag (third decorator)
 * - It's still a "gift" at every step — you can keep wrapping!
 */

// ============================================
// COMPONENT INTERFACE
// ============================================

/**
 * The Notifier interface.
 *
 * Both the plain notifier and all decorators share this shape.
 * This is the KEY: code that uses a Notifier doesn't know
 * whether it's plain or decorated.
 */
export interface Notifier {
  send(message: string): void;
  getDescription(): string;
}

// ============================================
// CONCRETE COMPONENT: Simple Notifier
// ============================================

/**
 * A simple notifier that just prints the message as-is.
 *
 * Think: A plain cardboard box with no wrapping.
 * This is the starting point before any decoration.
 */
export class SimpleNotifier implements Notifier {
  send(message: string): void {
    console.log(`    [Send] ${message}`);
  }

  getDescription(): string {
    return "SimpleNotifier";
  }
}

// ============================================
// BASE DECORATOR
// ============================================

/**
 * The base class for all decorators.
 *
 * It wraps a Notifier and delegates all calls to it by default.
 * Concrete decorators extend this class and override methods
 * to add their own behavior BEFORE or AFTER calling super.
 *
 * Think: A generic wrapping layer. It doesn't change anything
 * on its own — subclasses decide what to add.
 */
export abstract class NotifierDecorator implements Notifier {
  constructor(protected wrapped: Notifier) {}

  send(message: string): void {
    this.wrapped.send(message);
  }

  getDescription(): string {
    return this.wrapped.getDescription();
  }
}
