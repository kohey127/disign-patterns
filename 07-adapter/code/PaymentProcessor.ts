/**
 * Adapter Pattern - Target Interface & Existing Implementation
 *
 * WHAT IS THE ADAPTER PATTERN?
 * It lets you use a class with an incompatible interface by wrapping it
 * in a translator. The translator converts the external API's methods
 * into the methods your code expects.
 *
 * Think: Power plug adapter.
 * - Your laptop has a Japanese plug (two flat prongs)
 * - The wall has a US socket (two flat + one round)
 * - A small adapter makes them work together
 * - The plug doesn't change. The socket doesn't change.
 */

// ============================================
// TARGET INTERFACE
// ============================================

/**
 * The PaymentProcessor interface.
 *
 * This is the "Target" — the interface your app uses everywhere.
 * All payment methods must look like this to the rest of the code.
 *
 * Think: The shape of the socket on your wall.
 * Everything must fit this shape to work.
 */
export interface PaymentProcessor {
  pay(amount: number): string; // Pay in dollars, get a receipt ID
}

// ============================================
// EXISTING IMPLEMENTATION
// ============================================

/**
 * A credit card processor that already fits the interface.
 *
 * Think: A plug that already matches the socket.
 * No adapter needed — it just works.
 */
export class CreditCardProcessor implements PaymentProcessor {
  pay(amount: number): string {
    console.log(`    Credit card: charged $${amount}`);
    return `cc-${Date.now()}`;
  }
}
