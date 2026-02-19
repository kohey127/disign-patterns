/**
 * Singleton Pattern Example: UserCart
 *
 * This class manages a shopping cart for an e-commerce application.
 * Only ONE cart instance exists throughout the entire application.
 */

// Item type definition
interface Item {
  id: number;
  name: string;
  price: number;
}

class UserCart {
  // ========================================
  // SINGLETON IMPLEMENTATION - KEY PARTS
  // ========================================

  // 1. Static property to hold the ONE instance
  private static instance: UserCart;

  // 2. Private constructor - prevents "new UserCart()" from outside
  private constructor() {
    // Empty - initialization happens here if needed
  }

  // 3. Static method to get the instance
  //    - Creates instance on FIRST call
  //    - Returns SAME instance on all future calls
  static getInstance(): UserCart {
    if (!UserCart.instance) {
      // First time: create the instance
      UserCart.instance = new UserCart();
    }
    // Always return the same instance
    return UserCart.instance;
  }

  // ========================================
  // CART FUNCTIONALITY
  // ========================================

  // Array to store cart items
  private items: Item[] = [];

  // Add item to cart
  add(item: Item): void {
    this.items.push(item);
  }

  // Get all items in cart
  getItems(): Item[] {
    return this.items;
  }

  // Clear the cart
  reset(): void {
    this.items = [];
  }

  // Check if item is already in cart
  isAdded(name: string): boolean {
    return this.items.some(item => item.name === name);
  }

  // Calculate total price (with 10% tax)
  calcTotal(): number {
    const subtotal = this.items.reduce((sum, item) => sum + item.price, 0);
    return Math.floor(subtotal * 1.1); // 10% tax
  }

  // Print cart contents
  print(): void {
    if (this.items.length === 0) {
      console.log("Cart is empty.");
      return;
    }
    console.log("=== Cart Contents ===");
    this.items.forEach(item => {
      console.log(`- ${item.name}: ¥${item.price}`);
    });
    console.log("=====================");
  }
}

export { UserCart, Item };
