/**
 * Main Demo - Adapter Pattern in Action
 *
 * Run this file to see how Adapter Pattern works:
 *   bun run main.ts
 *
 * KEY INSIGHT: The checkout() function only knows about PaymentProcessor.
 * It doesn't know (or care) whether it's talking to a credit card,
 * Stripe, or PayPal. The adapter handles all the translation.
 */

import { PaymentProcessor, CreditCardProcessor } from "./PaymentProcessor";
import { StripeApi, PayPalSdk } from "./ExternalApis";
import { StripeAdapter, PayPalAdapter } from "./Adapters";

// ============================================
// HELPER FUNCTION — uses the Target interface only
// ============================================

function checkout(
  processor: PaymentProcessor,
  amount: number,
  item: string
): void {
  console.log(`  Buying: ${item} ($${amount})`);
  const receipt = processor.pay(amount);
  console.log(`  Receipt: ${receipt}`);
}

// ============================================
// DEMO START
// ============================================

console.log("=".repeat(55));
console.log("  ADAPTER PATTERN DEMO - Payment Processing");
console.log("=".repeat(55));

// ============================================
// DEMO 1: Credit Card (No Adapter Needed)
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 1: Credit Card (No Adapter Needed)");
console.log("─".repeat(55));
console.log();

const creditCard = new CreditCardProcessor();
checkout(creditCard, 29.99, "TypeScript Book");

// ============================================
// DEMO 2: Stripe (Through Adapter)
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 2: Stripe (Through Adapter)");
console.log("─".repeat(55));
console.log();

const stripeApi = new StripeApi();
const stripe = new StripeAdapter(stripeApi);
checkout(stripe, 49.99, "Design Patterns Course");

// ============================================
// DEMO 3: PayPal (Through Adapter)
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 3: PayPal (Through Adapter)");
console.log("─".repeat(55));
console.log();

const paypalSdk = new PayPalSdk();
const paypal = new PayPalAdapter(paypalSdk);
checkout(paypal, 9.99, "Monthly Subscription");

// ============================================
// DEMO 4: All Three — Same Interface
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 4: All Three — Same Interface");
console.log("─".repeat(55));
console.log();

const processors: PaymentProcessor[] = [
  new CreditCardProcessor(),
  new StripeAdapter(new StripeApi()),
  new PayPalAdapter(new PayPalSdk()),
];

const items = [
  { name: "Coffee", price: 4.5 },
  { name: "Lunch", price: 12.0 },
  { name: "Movie Ticket", price: 15.0 },
];

for (let i = 0; i < processors.length; i++) {
  checkout(processors[i], items[i].price, items[i].name);
  console.log();
}

// ============================================
// DEMO 5: Easy to Add New Payment Methods
// ============================================

console.log("─".repeat(55));
console.log("  DEMO 5: Easy to Add New Payment Methods");
console.log("─".repeat(55));

console.log(`
  To add a new payment method (e.g., Apple Pay):

  1. The external API already exists:
     class ApplePayService {
       authorize(cents: number, merchantId: string): { token: string }
     }

  2. Create ONE adapter:
     class ApplePayAdapter implements PaymentProcessor {
       pay(amount: number): string { /* translate */ }
     }

  3. Done! checkout() works with Apple Pay automatically.
     No changes to checkout() or any other existing code.
`);

// ============================================
// KEY POINT
// ============================================

console.log("─".repeat(55));
console.log("  KEY POINT: Why Adapter Pattern?");
console.log("─".repeat(55));

console.log(`
  Without Adapter:
  - checkout() needs if/else for each payment method
  - Adding Stripe means changing checkout()
  - Adding PayPal means changing checkout() again
  - Every new method = more changes to existing code

  With Adapter:
  - checkout() only knows about PaymentProcessor
  - Each external API gets its own adapter
  - Adding a new payment method = ONE new adapter class
  - Existing code never changes (Open/Closed Principle)
`);

// ============================================
// DEMO COMPLETE
// ============================================

console.log("=".repeat(55));
console.log("  DEMO COMPLETE");
console.log("=".repeat(55));
console.log(`
  Try these exercises:

  1. Create an adapter for a fictional TwilioApi:
     class TwilioApi {
       sendSms(phone: string, body: string): { sid: string }
     }
     Make it work as a Notifier interface:
     interface Notifier { notify(message: string): string }

  2. Create a SquareAdapter that makes a Square class
     work as a Rectangle interface

  3. What happens if the external API throws an error?
     How should the adapter handle it?

  4. Can two different adapters wrap the same external API
     but translate differently? When would this be useful?
`);
