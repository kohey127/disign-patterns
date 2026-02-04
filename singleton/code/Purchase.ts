/**
 * Purchase - Handles checkout process
 *
 * This class demonstrates how Singleton is used from another class.
 * It gets the cart instance and processes the purchase.
 */

import { UserCart } from "./UserCart";

class Purchase {
  // Store reference to the cart singleton
  private cart: UserCart;

  constructor() {
    // Get the SAME cart instance that exists everywhere else
    this.cart = UserCart.getInstance();
  }

  // Process the purchase
  execute(): void {
    const items = this.cart.getItems();

    if (items.length === 0) {
      console.log("Cannot purchase: Cart is empty!");
      return;
    }

    // Show purchase summary
    console.log("\n🛒 Purchase Complete!");
    console.log("-------------------");
    items.forEach(item => {
      console.log(`  ${item.name}: ¥${item.price}`);
    });
    console.log("-------------------");
    console.log(`  Total (with tax): ¥${this.cart.calcTotal()}`);
    console.log("");

    // Clear the cart after purchase
    this.cart.reset();
    console.log("Cart has been cleared.\n");
  }
}

export { Purchase };
