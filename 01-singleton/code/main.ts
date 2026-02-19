/**
 * Main Demo - Singleton Pattern in Action
 *
 * Run this file to see how Singleton works:
 *   bun run main.ts
 */

import { UserCart } from "./UserCart";
import { ItemList } from "./ItemList";
import { Purchase } from "./Purchase";

// ========================================
// Helper function to display product list
// ========================================
function displayItemList(): void {
  console.log("\n📦 Available Products:");
  console.log("------------------------");

  // Get the cart singleton to check what's already added
  const cart = UserCart.getInstance();

  ItemList.getAll().forEach(item => {
    // Check if item is already in cart
    const label = cart.isAdded(item.name) ? " [In Cart]" : "";
    console.log(`  ${item.name}: ¥${item.price}${label}`);
  });
  console.log("------------------------\n");
}

// ========================================
// DEMO START
// ========================================

console.log("=".repeat(50));
console.log("  SINGLETON PATTERN DEMO - Shopping Cart");
console.log("=".repeat(50));

// 1. Show all products (cart is empty)
displayItemList();

// 2. Get cart and show it's empty
const cart = UserCart.getInstance();
console.log("Initial cart state:");
cart.print();

// 3. Add some items to cart
console.log("\n➕ Adding Apple to cart...");
const apple = ItemList.find("Apple");
if (apple) cart.add(apple);
cart.print();

console.log("\n➕ Adding Banana to cart...");
const banana = ItemList.find("Banana");
if (banana) cart.add(banana);
cart.print();

// 4. Show products again - now with "In Cart" labels
displayItemList();

// 5. Show total price
console.log(`💰 Cart Total (with 10% tax): ¥${cart.calcTotal()}`);

// 6. Make purchase (this uses the SAME cart instance!)
const purchase = new Purchase();
purchase.execute();

// 7. Verify cart is now empty
console.log("Cart after purchase:");
cart.print();

console.log("=".repeat(50));
console.log("  DEMO COMPLETE");
console.log("=".repeat(50));

// ========================================
// KEY POINT DEMONSTRATION
// ========================================
console.log("\n🔑 KEY POINT: Same Instance Everywhere\n");

const cart1 = UserCart.getInstance();
const cart2 = UserCart.getInstance();
const cart3 = UserCart.getInstance();

console.log("cart1 === cart2:", cart1 === cart2); // true
console.log("cart2 === cart3:", cart2 === cart3); // true
console.log("\n→ All variables point to the SAME object!");
