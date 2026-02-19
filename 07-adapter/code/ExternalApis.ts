/**
 * Adapter Pattern - External APIs (Adaptees)
 *
 * These are third-party libraries with their own interfaces.
 * You CANNOT change them — they belong to Stripe and PayPal.
 *
 * Think: These are plugs from other countries.
 * They have different shapes that don't fit your socket.
 * You need an adapter to make them work.
 */

// ============================================
// ADAPTEE 1: Stripe API
// ============================================

/**
 * Stripe's payment API.
 *
 * Differences from your PaymentProcessor:
 * - Method name: createCharge() instead of pay()
 * - Amount: cents (2999) instead of dollars (29.99)
 * - Parameters: needs currency ("usd")
 * - Return type: object { chargeId, status } instead of string
 */
export class StripeApi {
  createCharge(
    amountInCents: number,
    currency: string
  ): { chargeId: string; status: string } {
    console.log(
      `    Stripe: charged ${amountInCents} cents (${currency})`
    );
    return {
      chargeId: `stripe-${Date.now()}`,
      status: "succeeded",
    };
  }
}

// ============================================
// ADAPTEE 2: PayPal SDK
// ============================================

/**
 * PayPal's payment SDK.
 *
 * Differences from your PaymentProcessor:
 * - Method name: sendPayment() instead of pay()
 * - Amount type: string ("29.99") instead of number (29.99)
 * - Return type: object { transactionId, completed } instead of string
 */
export class PayPalSdk {
  sendPayment(
    amountStr: string
  ): { transactionId: string; completed: boolean } {
    console.log(`    PayPal: sent $${amountStr}`);
    return {
      transactionId: `pp-${Date.now()}`,
      completed: true,
    };
  }
}
