/**
 * Main Demo - Abstract Factory Pattern in Action
 *
 * Run this file to see how Abstract Factory Pattern works:
 *   bun run main.ts
 *
 * KEY INSIGHT: The same client code works with ANY factory!
 * Change the factory, and the entire UI family changes.
 */

import {
  UIFactory,
  WindowsUIFactory,
  MacUIFactory,
  getUIFactory,
} from "./UIFactory";
import { Button, Checkbox, TextInput } from "./Products";

// ============================================
// CLIENT CODE
// ============================================

/**
 * Render a login form using the provided factory.
 *
 * IMPORTANT: This function has NO idea which platform it's rendering for!
 * It only knows about the interfaces (Button, Checkbox, TextInput).
 * The factory determines the actual implementation.
 */
function renderLoginForm(factory: UIFactory): void {
  console.log("\n  Creating UI components...\n");

  // Create components - factory decides which concrete class
  const usernameInput = factory.createTextInput();
  const passwordInput = factory.createTextInput();
  const rememberMe = factory.createCheckbox();
  const loginButton = factory.createButton();

  // Configure components
  usernameInput.setValue("user@example.com");
  passwordInput.setValue("********");
  rememberMe.toggle(); // Check the "remember me" box

  // Render the form
  console.log("\n  === Login Form ===\n");

  console.log("  Username:");
  usernameInput.render();

  console.log("\n  Password:");
  passwordInput.render();

  console.log("\n  Remember me:");
  rememberMe.render();

  console.log("\n  Action:");
  loginButton.render();

  console.log("\n  ====================\n");
}

/**
 * Render a settings panel using the provided factory.
 * Another example of client code that works with any factory.
 */
function renderSettingsPanel(factory: UIFactory): void {
  console.log("\n  Creating settings panel...\n");

  const darkMode = factory.createCheckbox();
  const notifications = factory.createCheckbox();
  const saveButton = factory.createButton();

  notifications.toggle(); // Enable notifications by default

  console.log("\n  === Settings ===\n");

  console.log("  Dark Mode:");
  darkMode.render();

  console.log("\n  Enable Notifications:");
  notifications.render();

  console.log("\n  Save Settings:");
  saveButton.render();

  console.log("\n  ================\n");
}

// ============================================
// DEMO START
// ============================================

console.log("=".repeat(55));
console.log("  ABSTRACT FACTORY PATTERN DEMO - Cross-Platform UI");
console.log("=".repeat(55));

// ============================================
// DEMO 1: WINDOWS UI
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 1: Windows Platform");
console.log("─".repeat(55));

const windowsFactory = new WindowsUIFactory();
renderLoginForm(windowsFactory);

// ============================================
// DEMO 2: MAC UI
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 2: Mac Platform");
console.log("─".repeat(55));

const macFactory = new MacUIFactory();
renderLoginForm(macFactory);

// ============================================
// DEMO 3: SAME CLIENT CODE, DIFFERENT FACTORY
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 3: Same Settings Panel, Different Platforms");
console.log("─".repeat(55));

console.log("\n  On Windows:");
renderSettingsPanel(windowsFactory);

console.log("\n  On Mac:");
renderSettingsPanel(macFactory);

// ============================================
// DEMO 4: FACTORY SELECTOR
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  DEMO 4: Using Factory Selector");
console.log("─".repeat(55));

// In real code, this would detect the actual platform
const platform = "mac"; // or "windows"
const autoFactory = getUIFactory(platform);

console.log(`\n  Detected platform: ${platform}`);
console.log("  Creating UI with auto-selected factory...\n");

const button = autoFactory.createButton();
button.render();

// ============================================
// KEY POINT DEMONSTRATION
// ============================================

console.log("\n" + "─".repeat(55));
console.log("  KEY POINT: Why Abstract Factory?");
console.log("─".repeat(55));

console.log(`
  1. CONSISTENCY GUARANTEED
     All components from WindowsUIFactory look like Windows.
     All components from MacUIFactory look like Mac.
     You CAN'T accidentally mix them!

  2. EASY TO ADD NEW PLATFORM
     Want to support Linux?
     Just create LinuxUIFactory - no changes to client code!

  3. CLIENT CODE IS PLATFORM-AGNOSTIC
     renderLoginForm() works with ANY factory.
     It doesn't know or care about Windows vs Mac.

  4. SINGLE POINT OF CHANGE
     Switching platforms = changing ONE line (which factory to use).
     All UI components change together automatically.
`);

// ============================================
// COMPARISON WITH WRONG APPROACH
// ============================================

console.log("─".repeat(55));
console.log("  COMPARISON: Without Abstract Factory (BAD)");
console.log("─".repeat(55));

console.log(`
  // WITHOUT Abstract Factory - scattered if/else everywhere:

  function renderLoginForm(platform: string) {
    let button, checkbox, input;

    if (platform === "windows") {
      button = new WindowsButton();     // Repeated
      checkbox = new WindowsCheckbox(); // in every
      input = new WindowsTextInput();   // function!
    } else if (platform === "mac") {
      button = new MacButton();
      checkbox = new MacCheckbox();
      input = new MacTextInput();
    }

    // What if someone writes:
    // button = new WindowsButton();
    // checkbox = new MacCheckbox();  // OOPS! Mixed platforms!
  }

  // Problems:
  // - if/else repeated in EVERY function
  // - Easy to mix platforms by mistake
  // - Adding Linux = change EVERY function
`);

// ============================================
// DEMO COMPLETE
// ============================================

console.log("=".repeat(55));
console.log("  DEMO COMPLETE");
console.log("=".repeat(55));
console.log(`
  Try these exercises:

  1. Create LinuxUIFactory with Linux-style components
  2. Add a new product type: Slider
  3. Create a ThemeFactory (Light/Dark) with:
     - ColorPalette
     - Typography
     - IconSet
`);
