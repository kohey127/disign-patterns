/**
 * Abstract Factory Pattern Example: UI Components
 *
 * This file defines product interfaces and their concrete implementations
 * for different platforms (Windows, Mac).
 *
 * KEY CONCEPT: Products from the same family must work together.
 * WindowsButton + WindowsCheckbox = OK
 * WindowsButton + MacCheckbox = Wrong! (won't look consistent)
 */

// ============================================
// PRODUCT INTERFACES
// ============================================

/**
 * Button interface - all buttons can do these things
 */
interface Button {
  render(): void;
  onClick(handler: () => void): void;
}

/**
 * Checkbox interface - all checkboxes can do these things
 */
interface Checkbox {
  render(): void;
  toggle(): void;
  isChecked(): boolean;
}

/**
 * TextInput interface - all text inputs can do these things
 */
interface TextInput {
  render(): void;
  setValue(value: string): void;
  getValue(): string;
}

// ============================================
// WINDOWS FAMILY
// ============================================

/**
 * Windows-style button
 * Looks like: [ Button Text ]
 */
class WindowsButton implements Button {
  private clickHandler?: () => void;

  render(): void {
    console.log("  ┌─────────────────┐");
    console.log("  │   Click Me      │  ← Windows Button");
    console.log("  └─────────────────┘");
  }

  onClick(handler: () => void): void {
    this.clickHandler = handler;
  }
}

/**
 * Windows-style checkbox
 * Looks like: [✓] or [ ]
 */
class WindowsCheckbox implements Checkbox {
  private checked = false;

  render(): void {
    const mark = this.checked ? "☑" : "☐";
    console.log(`  ${mark} Windows Checkbox`);
  }

  toggle(): void {
    this.checked = !this.checked;
  }

  isChecked(): boolean {
    return this.checked;
  }
}

/**
 * Windows-style text input
 * Looks like: |text here|
 */
class WindowsTextInput implements TextInput {
  private value = "";

  render(): void {
    const display = this.value || "Enter text...";
    console.log(`  ┌${"─".repeat(20)}┐`);
    console.log(`  │ ${display.padEnd(18)} │  ← Windows Input`);
    console.log(`  └${"─".repeat(20)}┘`);
  }

  setValue(value: string): void {
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}

// ============================================
// MAC FAMILY
// ============================================

/**
 * Mac-style button
 * Looks like: ( Button Text )
 */
class MacButton implements Button {
  private clickHandler?: () => void;

  render(): void {
    console.log("  ╭─────────────────╮");
    console.log("  │   Click Me      │  ← Mac Button");
    console.log("  ╰─────────────────╯");
  }

  onClick(handler: () => void): void {
    this.clickHandler = handler;
  }
}

/**
 * Mac-style checkbox
 * Looks like: (✓) or (○)
 */
class MacCheckbox implements Checkbox {
  private checked = false;

  render(): void {
    const mark = this.checked ? "◉" : "○";
    console.log(`  ${mark} Mac Checkbox`);
  }

  toggle(): void {
    this.checked = !this.checked;
  }

  isChecked(): boolean {
    return this.checked;
  }
}

/**
 * Mac-style text input
 * Looks like: ⌜text here⌟
 */
class MacTextInput implements TextInput {
  private value = "";

  render(): void {
    const display = this.value || "Enter text...";
    console.log(`  ╭${"─".repeat(20)}╮`);
    console.log(`  │ ${display.padEnd(18)} │  ← Mac Input`);
    console.log(`  ╰${"─".repeat(20)}╯`);
  }

  setValue(value: string): void {
    this.value = value;
  }

  getValue(): string {
    return this.value;
  }
}

// ============================================
// LINUX FAMILY (Exercise: Try implementing this!)
// ============================================

/**
 * Linux-style button - TODO: Implement this!
 * Hint: Linux UI is often more minimal
 * Could look like: < Button Text >
 */
// class LinuxButton implements Button { ... }

/**
 * Linux-style checkbox - TODO: Implement this!
 * Could look like: [x] or [ ]
 */
// class LinuxCheckbox implements Checkbox { ... }

/**
 * Linux-style text input - TODO: Implement this!
 * Could look like: [text here]
 */
// class LinuxTextInput implements TextInput { ... }

export {
  // Interfaces
  Button,
  Checkbox,
  TextInput,
  // Windows family
  WindowsButton,
  WindowsCheckbox,
  WindowsTextInput,
  // Mac family
  MacButton,
  MacCheckbox,
  MacTextInput,
};
