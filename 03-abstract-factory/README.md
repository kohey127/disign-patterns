# Abstract Factory Pattern

## What is it? (One sentence)

**Abstract Factory creates families of related objects without specifying their concrete classes.**

---

## Before You Read This

Make sure you understand [Factory Pattern](../factory/README.md) first!

- **Factory** creates ONE type of object (e.g., Notifications)
- **Abstract Factory** creates MULTIPLE RELATED types (e.g., Button + Checkbox + Input that all match)

---

## The Problem (Why do we need this?)

Imagine you're building a cross-platform app that needs to look native on each OS.

On Windows, you need Windows-style buttons, checkboxes, and text inputs.
On macOS, you need Mac-style buttons, checkboxes, and text inputs.

**The naive approach:**

```typescript
function createUI(os: string) {
  let button, checkbox, input;

  if (os === "windows") {
    button = new WindowsButton();
    checkbox = new WindowsCheckbox();
    input = new WindowsTextInput();
  } else if (os === "mac") {
    button = new MacButton();
    checkbox = new MacCheckbox();
    input = new MacTextInput();
  }

  return { button, checkbox, input };
}
```

**Problems:**

1. **Mixing components** - What if someone accidentally creates `WindowsButton` + `MacCheckbox`? They won't look right together!
2. **Scattered logic** - This if/else repeats for every UI component
3. **Hard to extend** - Adding Linux support means updating EVERY place
4. **No compile-time safety** - Nothing prevents mixing incompatible components

---

## The Solution (How Abstract Factory helps)

Create a **factory interface** that produces families of related objects.

```typescript
// Abstract Factory - defines WHAT to create
interface UIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
  createTextInput(): TextInput;
}

// Windows Factory - creates Windows-style components
class WindowsUIFactory implements UIFactory {
  createButton(): Button { return new WindowsButton(); }
  createCheckbox(): Checkbox { return new WindowsCheckbox(); }
  createTextInput(): TextInput { return new WindowsTextInput(); }
}

// Mac Factory - creates Mac-style components
class MacUIFactory implements UIFactory {
  createButton(): Button { return new MacButton(); }
  createCheckbox(): Checkbox { return new MacCheckbox(); }
  createTextInput(): TextInput { return new MacTextInput(); }
}
```

**Now mixing is impossible:**

```typescript
const factory: UIFactory = new WindowsUIFactory();

// All components come from the SAME factory
// They're GUARANTEED to be compatible!
const button = factory.createButton();     // WindowsButton
const checkbox = factory.createCheckbox(); // WindowsCheckbox
const input = factory.createTextInput();   // WindowsTextInput
```

---

## Visual Explanation

```
┌─────────────────────────────────────────────────────────────────┐
│                     UIFactory (Abstract)                        │
│                                                                 │
│    createButton()      createCheckbox()     createTextInput()   │
└─────────────────────────────────────────────────────────────────┘
                │                                    │
        ┌───────┴───────┐                    ┌───────┴───────┐
        ▼               ▼                    ▼               ▼
┌───────────────┐ ┌───────────────┐  ┌───────────────┐ ┌───────────────┐
│ WindowsUI     │ │ MacUI         │  │ WindowsUI     │ │ MacUI         │
│ Factory       │ │ Factory       │  │ Factory       │ │ Factory       │
├───────────────┤ ├───────────────┤  ├───────────────┤ ├───────────────┤
│→WindowsButton │ │→ MacButton    │  │→WindowsCheck  │ │→ MacCheckbox  │
│→WindowsCheck  │ │→ MacCheckbox  │  │→WindowsInput  │ │→ MacTextInput │
│→WindowsInput  │ │→ MacTextInput │  └───────────────┘ └───────────────┘
└───────────────┘ └───────────────┘

KEY INSIGHT:
- Each factory produces a FAMILY of related products
- Products from the SAME factory are GUARANTEED to work together
- You can't accidentally mix Windows button with Mac checkbox
```

---

## How to Make an Abstract Factory (4 Steps)

### Step 1: Define product interfaces

Each product type needs an interface.

```typescript
// Product interfaces (what each component CAN do)
interface Button {
  render(): void;
  onClick(handler: () => void): void;
}

interface Checkbox {
  render(): void;
  isChecked(): boolean;
}

interface TextInput {
  render(): void;
  getValue(): string;
}
```

### Step 2: Create concrete products for each family

```typescript
// Windows family
class WindowsButton implements Button {
  render() { console.log("[Windows Button]"); }
  onClick(handler: () => void) { /* Windows click handling */ }
}

class WindowsCheckbox implements Checkbox {
  render() { console.log("[Windows Checkbox]"); }
  isChecked() { return this.checked; }
}

// Mac family
class MacButton implements Button {
  render() { console.log("[Mac Button]"); }
  onClick(handler: () => void) { /* Mac click handling */ }
}

class MacCheckbox implements Checkbox {
  render() { console.log("[Mac Checkbox]"); }
  isChecked() { return this.checked; }
}
```

### Step 3: Define the abstract factory interface

```typescript
// The Abstract Factory interface
interface UIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
  createTextInput(): TextInput;
}
```

### Step 4: Create concrete factories

```typescript
class WindowsUIFactory implements UIFactory {
  createButton(): Button { return new WindowsButton(); }
  createCheckbox(): Checkbox { return new WindowsCheckbox(); }
  createTextInput(): TextInput { return new WindowsTextInput(); }
}

class MacUIFactory implements UIFactory {
  createButton(): Button { return new MacButton(); }
  createCheckbox(): Checkbox { return new MacCheckbox(); }
  createTextInput(): TextInput { return new MacTextInput(); }
}
```

---

## Complete Example

```typescript
// ============================================
// PRODUCT INTERFACES
// ============================================

interface Button {
  render(): void;
}

interface Checkbox {
  render(): void;
  toggle(): void;
}

interface TextInput {
  render(): void;
  setValue(value: string): void;
}

// ============================================
// WINDOWS FAMILY
// ============================================

class WindowsButton implements Button {
  render() {
    console.log("Rendering Windows-style button: [ Click Me ]");
  }
}

class WindowsCheckbox implements Checkbox {
  private checked = false;

  render() {
    const mark = this.checked ? "☑" : "☐";
    console.log(`Rendering Windows-style checkbox: ${mark}`);
  }

  toggle() {
    this.checked = !this.checked;
  }
}

class WindowsTextInput implements TextInput {
  private value = "";

  render() {
    console.log(`Rendering Windows-style input: |${this.value}|`);
  }

  setValue(value: string) {
    this.value = value;
  }
}

// ============================================
// MAC FAMILY
// ============================================

class MacButton implements Button {
  render() {
    console.log("Rendering Mac-style button: ( Click Me )");
  }
}

class MacCheckbox implements Checkbox {
  private checked = false;

  render() {
    const mark = this.checked ? "✓" : "○";
    console.log(`Rendering Mac-style checkbox: ${mark}`);
  }

  toggle() {
    this.checked = !this.checked;
  }
}

class MacTextInput implements TextInput {
  private value = "";

  render() {
    console.log(`Rendering Mac-style input: ⌜${this.value}⌟`);
  }

  setValue(value: string) {
    this.value = value;
  }
}

// ============================================
// ABSTRACT FACTORY
// ============================================

interface UIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
  createTextInput(): TextInput;
}

class WindowsUIFactory implements UIFactory {
  createButton(): Button { return new WindowsButton(); }
  createCheckbox(): Checkbox { return new WindowsCheckbox(); }
  createTextInput(): TextInput { return new WindowsTextInput(); }
}

class MacUIFactory implements UIFactory {
  createButton(): Button { return new MacButton(); }
  createCheckbox(): Checkbox { return new MacCheckbox(); }
  createTextInput(): TextInput { return new MacTextInput(); }
}

// ============================================
// CLIENT CODE
// ============================================

function renderLoginForm(factory: UIFactory) {
  // Client code only knows about interfaces!
  // It has NO idea if it's Windows or Mac components
  const usernameInput = factory.createTextInput();
  const passwordInput = factory.createTextInput();
  const rememberMe = factory.createCheckbox();
  const loginButton = factory.createButton();

  console.log("=== Login Form ===");
  usernameInput.setValue("user@example.com");
  usernameInput.render();

  passwordInput.setValue("••••••••");
  passwordInput.render();

  rememberMe.toggle();
  rememberMe.render();

  loginButton.render();
  console.log("==================\n");
}

// Usage
const windowsFactory = new WindowsUIFactory();
const macFactory = new MacUIFactory();

console.log("On Windows:\n");
renderLoginForm(windowsFactory);

console.log("On Mac:\n");
renderLoginForm(macFactory);
```

---

## Real-World Use Cases

### 1. Database Access Layer

Different databases need different but compatible components.

```typescript
interface Connection {
  connect(): void;
  close(): void;
}

interface Command {
  execute(sql: string): void;
}

interface Transaction {
  begin(): void;
  commit(): void;
  rollback(): void;
}

// Abstract Factory
interface DatabaseFactory {
  createConnection(): Connection;
  createCommand(): Command;
  createTransaction(): Transaction;
}

// MySQL Family
class MySQLFactory implements DatabaseFactory {
  createConnection() { return new MySQLConnection(); }
  createCommand() { return new MySQLCommand(); }
  createTransaction() { return new MySQLTransaction(); }
}

// PostgreSQL Family
class PostgreSQLFactory implements DatabaseFactory {
  createConnection() { return new PostgreSQLConnection(); }
  createCommand() { return new PostgreSQLCommand(); }
  createTransaction() { return new PostgreSQLTransaction(); }
}
```

### 2. Theme System

Light and dark themes need matching colors, fonts, and icons.

```typescript
interface ThemeFactory {
  createColors(): ColorPalette;
  createTypography(): Typography;
  createIcons(): IconSet;
}

class LightThemeFactory implements ThemeFactory {
  createColors() { return new LightColors(); }      // white bg, dark text
  createTypography() { return new LightTypography(); }
  createIcons() { return new LightIcons(); }        // dark icons
}

class DarkThemeFactory implements ThemeFactory {
  createColors() { return new DarkColors(); }       // dark bg, light text
  createTypography() { return new DarkTypography(); }
  createIcons() { return new DarkIcons(); }         // light icons
}
```

### 3. Document Export

Different formats need matching components.

```typescript
interface DocumentFactory {
  createHeader(): Header;
  createParagraph(): Paragraph;
  createTable(): Table;
  createImage(): Image;
}

class HTMLDocumentFactory implements DocumentFactory {
  createHeader() { return new HTMLHeader(); }       // <h1>
  createParagraph() { return new HTMLParagraph(); } // <p>
  createTable() { return new HTMLTable(); }         // <table>
  createImage() { return new HTMLImage(); }         // <img>
}

class PDFDocumentFactory implements DocumentFactory {
  createHeader() { return new PDFHeader(); }
  createParagraph() { return new PDFParagraph(); }
  createTable() { return new PDFTable(); }
  createImage() { return new PDFImage(); }
}

class MarkdownDocumentFactory implements DocumentFactory {
  createHeader() { return new MarkdownHeader(); }   // #
  createParagraph() { return new MarkdownParagraph(); }
  createTable() { return new MarkdownTable(); }     // | col |
  createImage() { return new MarkdownImage(); }     // ![alt](url)
}
```

---

## Factory vs Abstract Factory

```
FACTORY PATTERN:
┌─────────────────────────────────────┐
│         NotificationFactory         │
│                                     │
│  create("email") → EmailNotification│
│  create("sms")   → SMSNotification  │
│  create("push")  → PushNotification │
│                                     │
│  → Creates ONE type of object       │
│  → Different classes, SAME family   │
└─────────────────────────────────────┘

ABSTRACT FACTORY PATTERN:
┌─────────────────────────────────────┐
│         UIFactory (Abstract)        │
│                                     │
│  createButton()    → Button         │
│  createCheckbox()  → Checkbox       │
│  createTextInput() → TextInput      │
│                                     │
│  → Creates MULTIPLE types           │
│  → All types belong to SAME theme   │
└─────────────────────────────────────┘
        │                   │
        ▼                   ▼
┌───────────────┐   ┌───────────────┐
│ WindowsUI     │   │ MacUI         │
│ Factory       │   │ Factory       │
│               │   │               │
│ →WinButton    │   │ →MacButton    │
│ →WinCheckbox  │   │ →MacCheckbox  │
│ →WinInput     │   │ →MacInput     │
└───────────────┘   └───────────────┘
```

| Aspect | Factory | Abstract Factory |
|--------|---------|------------------|
| **What it creates** | ONE type of product | FAMILY of related products |
| **Number of create methods** | Usually one | Multiple (one per product type) |
| **Main benefit** | Hide which class is created | Ensure products work together |
| **When to use** | Multiple classes, one interface | Multiple classes, multiple interfaces that must match |

### Easy Explanation: Fast Food Restaurant

Think about **Factory** and **Abstract Factory** like restaurants.

**Factory** is like a **drink machine**.
You press a button. You get a drink.
Cola, juice, or tea — you don't know how it's made.
But it only makes **one thing: drinks**.

```
DrinkFactory
  └── create() → Cola / Juice / Tea
```

**Abstract Factory** is like a **restaurant chain**.
McDonald's makes a burger, a drink, and fries.
Mos Burger also makes a burger, a drink, and fries.
Each restaurant makes **a full set of items**.

```
McDonald's (Factory A)
  ├── createBurger()  → Big Mac
  ├── createDrink()   → Coca-Cola
  └── createSide()    → French Fries

Mos Burger (Factory B)
  ├── createBurger()  → Mos Burger
  ├── createDrink()   → Melon Soda
  └── createSide()    → Onion Rings
```

The important rule: **you order from ONE restaurant**.
You don't mix a Big Mac with Mos Burger's onion rings.
Everything comes from the **same place**, so it all **fits together**.

Here is the simple summary:

| | Factory | Abstract Factory |
|--|---------|-----------------|
| **What it makes** | **One thing** (only drinks) | **A set of things** (burger + drink + side) |
| **How many create methods** | **One** (`create()`) | **Many** (`createBurger()`, `createDrink()`, ...) |
| **Best part** | You don't know **which** class is made | The set **never gets mixed up** |
| **Use when** | Many types of one thing | Many types of **a group of things that must match** |

**The #1 difference:**
- **Factory** → hides **WHAT** is created
- **Abstract Factory** → keeps **THE SET** together

---

## Anti-patterns

### 1. Speculative Generality — Using Abstract Factory when Factory is enough

Abstract Factory is for creating **families of related objects** (multiple types that must work together). If you only create **one type**, use a simple Factory. Don't use Abstract Factory "just in case."

**Bad — Abstract Factory for one product type:**
```typescript
interface NotificationFactory {
  createNotification(): Notification;
}

class EmailNotificationFactory implements NotificationFactory {
  createNotification() { return new EmailNotification(); }
}
// Only one create method → simple Factory is enough.
```

**Use Abstract Factory when you have multiple related types:**
```typescript
interface UIFactory {
  createButton(): Button;      // Multiple types
  createCheckbox(): Checkbox;  // that must
  createInput(): TextInput;    // work together
}
```

### 2. Unrelated Product Family — Products that don't need to match

Abstract Factory keeps products **consistent** (all from the same family). If your products don't need to match each other, they are not a family. Use separate simple factories instead.

**Bad — these products are not related:**
```typescript
interface AppFactory {
  createLogger(): Logger;
  createCache(): Cache;
  createValidator(): Validator;
}
// A Redis cache works fine with any logger.
// They don't need to "match."
```

**Better — only group products that must be consistent:**
```typescript
interface UIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
}
// Button and Checkbox MUST match — both Windows or both Mac.
```

Ask yourself: "Would mixing products from different factories cause a bug?" If the answer is no, Abstract Factory is the wrong choice.

### 3. Bloated Factory Interface — Too many create methods

When a factory interface has too many methods, every concrete factory must implement all of them. This makes adding new factories very hard. The GoF book calls this a key trade-off of the pattern.

**Bad — too many methods:**
```typescript
interface UIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
  createInput(): TextInput;
  createDropdown(): Dropdown;
  createSlider(): Slider;
  createDatePicker(): DatePicker;
  createColorPicker(): ColorPicker;
  createModal(): Modal;
  createToast(): Toast;
  // Every concrete factory must implement ALL 9 methods.
}
```

**Better — split into smaller, focused factories:**
```typescript
interface FormControlFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
  createInput(): TextInput;
}

interface FeedbackFactory {
  createModal(): Modal;
  createToast(): Toast;
}
```

### 4. Shotgun Surgery — Adding a new product breaks all factories

This is a known trade-off of Abstract Factory (documented in the GoF book). When you add a new product type to the interface, **every** concrete factory must be updated. This is called **Shotgun Surgery** — one change requires edits in many files.

**Example — adding `createSlider()` to UIFactory:**
```typescript
interface UIFactory {
  createButton(): Button;
  createCheckbox(): Checkbox;
  createSlider(): Slider; // NEW — every factory must add this
}

class WindowsUIFactory implements UIFactory {
  createButton() { return new WindowsButton(); }
  createCheckbox() { return new WindowsCheckbox(); }
  createSlider() { return new WindowsSlider(); } // Must add
}

class MacUIFactory implements UIFactory {
  createButton() { return new MacButton(); }
  createCheckbox() { return new MacCheckbox(); }
  createSlider() { return new MacSlider(); } // Must add
}
// If you have 5 factories, you edit 5 files.
```

This is not a "mistake" — it is a **trade-off** of the pattern. Before using Abstract Factory, ask: "Will I add new product types often?" If yes, this pattern may not be the best choice.
---

## When to Use Abstract Factory?

### Use Abstract Factory When...

| Situation | Why |
|-----------|-----|
| **Products must work together** | Factory ensures compatibility |
| **Multiple product families** | Switch entire family by changing factory |
| **Platform independence** | Same code works on Windows/Mac/Linux |
| **Theme/skin system** | All UI elements match the theme |

### Don't Use Abstract Factory When...

| Situation | Why |
|-----------|-----|
| **Only one product type** | Use simple Factory instead |
| **Products don't relate** | No need for family consistency |
| **Single family** | No benefit from abstraction |
| **Simple creation** | Overkill - just use `new` |

---

## Key Vocabulary

| Word | Meaning |
|------|---------|
| **Abstract Factory** | Interface that declares creation methods for each product type |
| **Concrete Factory** | Implementation that creates products of one family |
| **Product Family** | Set of related products (e.g., Windows UI components) |
| **Product Interface** | Common interface for one type of product |

---

## Quick Quiz

1. What's the main difference between Factory and Abstract Factory?
2. Why can't you accidentally mix Windows and Mac components with Abstract Factory?
3. How many create methods does an Abstract Factory typically have?
4. What happens when you want to support a new platform (e.g., Linux)?
5. When should you NOT use Abstract Factory?

<details>
<summary>Answers</summary>

1. Factory creates ONE type; Abstract Factory creates MULTIPLE RELATED types
2. Because all components come from the same factory instance, which only produces one family
3. Multiple - one for each product type (Button, Checkbox, Input, etc.)
4. Create a new concrete factory (LinuxUIFactory) that implements the interface
5. When you only have one product type, when products don't need to match, or when it's overkill for simple creation

</details>

---

## Summary

**Abstract Factory in 30 seconds:**
- Creates FAMILIES of related objects
- All products from one factory are guaranteed to work together
- Client code only depends on interfaces, not concrete classes
- Adding new family = create new factory, no changes to client
- Use when: products must match (UI themes, database drivers, document formats)

---

## Try It Yourself

1. Read the code in `code/` folder
2. Add a new platform: Linux (create LinuxUIFactory with Linux-style components)
3. Add a new product type: Slider (add to all factories)
4. Try to mix Windows button with Mac checkbox - notice the type error!
5. Create a ThemeFactory with Light and Dark themes
