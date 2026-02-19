/**
 * ItemList - Product Master Data
 *
 * This class manages all products available in the shop.
 * (In real applications, this data would come from a database)
 */

import { Item } from "./UserCart";

class ItemList {
  // Sample product data (normally this would be thousands of items)
  private static data: Item[] = [
    { id: 1, name: "Apple", price: 100 },
    { id: 2, name: "Banana", price: 80 },
    { id: 3, name: "Orange", price: 120 },
  ];

  // Find item by name
  static find(name: string): Item | undefined {
    return this.data.find(item => item.name === name);
  }

  // Get all items
  static getAll(): Item[] {
    return this.data;
  }
}

export { ItemList };
