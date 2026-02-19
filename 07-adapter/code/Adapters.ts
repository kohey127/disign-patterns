/**
 * Adapter Pattern - Adapters
 *
 * Each adapter translates between your PaymentProcessor interface
 * and one external API. The adapter implements your interface
 * and wraps the external API inside.
 *
 * Think: Each adapter is a plug converter.
 * - StripeAdapter: Japanese plug → US socket
 * - PayPalAdapter: UK plug → US socket
 * Same socket (PaymentProcessor), different plugs (external APIs).
 */

import { PaymentProcessor } from "./PaymentProcessor";
import { StripeApi } from "./ExternalApis";
import { PayPalSdk } from "./ExternalApis";

// ============================================
// ADAPTER 1: Stripe
// ============================================

/**
 * Makes StripeApi work as a PaymentProcessor.
 *
 * Translation:
 * - pay(amount) → createCharge(amountInCents, currency)
 * - dollars → cents (multiply by 100)
 * - adds "usd" as the currency
 * - extracts chargeId from Stripe's response object
 */
export class StripeAdapter implements PaymentProcessor {
  private stripe: StripeApi;

  constructor(stripe: StripeApi) {
    this.stripe = stripe;
  }

  pay(amount: number): string {
    // Translate: dollars → cents
    const cents = Math.round(amount * 100);
    // Call Stripe's API with the right format
    const result = this.stripe.createCharge(cents, "usd");
    // Translate: extract the receipt ID from Stripe's response
    return result.chargeId;
  }
}

// ============================================
// ADAPTER 2: PayPal
// ============================================

/**
 * Makes PayPalSdk work as a PaymentProcessor.
 *
 * Translation:
 * - pay(amount) → sendPayment(amountStr)
 * - number → string with 2 decimal places
 * - extracts transactionId from PayPal's response object
 */
export class PayPalAdapter implements PaymentProcessor {
  private paypal: PayPalSdk;

  constructor(paypal: PayPalSdk) {
    this.paypal = paypal;
  }

  pay(amount: number): string {
    // Translate: number → string with 2 decimal places
    const result = this.paypal.sendPayment(amount.toFixed(2));
    // Translate: extract the receipt ID from PayPal's response
    return result.transactionId;
  }
}
