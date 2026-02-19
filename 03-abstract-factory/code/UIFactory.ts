/**
 * Abstract Factory Pattern Example: UI Factory
 *
 * This file defines:
 * 1. The Abstract Factory interface (UIFactory)
 * 2. Concrete factories (WindowsUIFactory, MacUIFactory)
 *
 * KEY CONCEPT: Each factory produces a FAMILY of related products.
 * All products from one factory are guaranteed to work together.
 */

import {
  Button,
  Checkbox,
  TextInput,
  WindowsButton,
  WindowsCheckbox,
  WindowsTextInput,
  MacButton,
  MacCheckbox,
  MacTextInput,
} from "./Products";

// ============================================
// ABSTRACT FACTORY INTERFACE
// ============================================

/**
 * UIFactory - The Abstract Factory interface.
 *
 * This interface declares methods for creating each type of product.
 * Concrete factories implement this to create products of a specific family.
 *
 * NOTE: The interface doesn't specify WHICH family (Windows/Mac).
 *       That's decided by which concrete factory you use.
 */
interface UIFactory {
  /**
   * Create a button for this platform
   */
  createButton(): Button;

  /**
   * Create a checkbox for this platform
   */
  createCheckbox(): Checkbox;

  /**
   * Create a text input for this platform
   */
  createTextInput(): TextInput;
}

// ============================================
// CONCRETE FACTORY: WINDOWS
// ============================================

/**
 * WindowsUIFactory - Creates Windows-style UI components.
 *
 * All components created by this factory will have consistent
 * Windows styling and behavior.
 */
class WindowsUIFactory implements UIFactory {
  createButton(): Button {
    console.log("  [Factory] Creating Windows button...");
    return new WindowsButton();
  }

  createCheckbox(): Checkbox {
    console.log("  [Factory] Creating Windows checkbox...");
    return new WindowsCheckbox();
  }

  createTextInput(): TextInput {
    console.log("  [Factory] Creating Windows text input...");
    return new WindowsTextInput();
  }
}

// ============================================
// CONCRETE FACTORY: MAC
// ============================================

/**
 * MacUIFactory - Creates Mac-style UI components.
 *
 * All components created by this factory will have consistent
 * Mac styling and behavior.
 */
class MacUIFactory implements UIFactory {
  createButton(): Button {
    console.log("  [Factory] Creating Mac button...");
    return new MacButton();
  }

  createCheckbox(): Checkbox {
    console.log("  [Factory] Creating Mac checkbox...");
    return new MacCheckbox();
  }

  createTextInput(): TextInput {
    console.log("  [Factory] Creating Mac text input...");
    return new MacTextInput();
  }
}

// ============================================
// FACTORY SELECTOR
// ============================================

/**
 * Platform types supported by the application
 */
type Platform = "windows" | "mac";

/**
 * Get the appropriate factory for the current platform.
 *
 * This is a common pattern: use a function to select
 * the right factory based on configuration/environment.
 */
function getUIFactory(platform: Platform): UIFactory {
  switch (platform) {
    case "windows":
      return new WindowsUIFactory();
    case "mac":
      return new MacUIFactory();
    default:
      // TypeScript exhaustiveness check
      const _exhaustiveCheck: never = platform;
      throw new Error(`Unknown platform: ${platform}`);
  }
}

/**
 * Auto-detect platform (simplified example)
 * In real code, you'd check navigator.platform or process.platform
 */
function detectPlatform(): Platform {
  // For demo purposes, randomly select a platform
  // In real code: return process.platform === "darwin" ? "mac" : "windows";
  return Math.random() > 0.5 ? "mac" : "windows";
}

export {
  UIFactory,
  WindowsUIFactory,
  MacUIFactory,
  Platform,
  getUIFactory,
  detectPlatform,
};
