# Design Patterns Learning Repository

This repository is for learning design patterns in English with practical code examples.

## Structure

```
design-patterns/
├── CLAUDE.md           # This file - learning guide
├── README.md           # Repository overview
└── [NN-pattern-name]/  # Each pattern has its own numbered folder
    ├── README.md       # English explanation (simple & clear)
    ├── code/           # TypeScript implementation files
    └── notes.md        # Japanese notes (optional)
```

## How to Learn Each Pattern

### Step 1: Read the English README
- Each pattern has a `README.md` with simple English explanations
- Focus on understanding the **WHY** (problem it solves) before the **HOW**

### Step 2: Study the Code
- Read the TypeScript files in `code/` directory
- Each file has comments explaining key concepts
- Try to understand the flow without running it first

### Step 3: Practice
- **Transcribe**: Copy the code by hand (don't copy-paste)
- **Explain**: Try to explain the pattern in your own words
- **Modify**: Make small changes to see what happens

### Step 4: Review with Claude
Ask Claude to:
- Quiz you on the pattern
- Explain parts you don't understand
- Give you variations or real-world examples

## Useful Commands for Claude

When studying, you can ask Claude:

- "Explain [pattern name] like I'm 5"
- "What problem does [pattern] solve?"
- "Show me a different example of [pattern]"
- "Quiz me on [pattern]"
- "What are the pros and cons of [pattern]?"
- "When should I NOT use [pattern]?"

## Patterns Covered

| # | Pattern | Category | Status |
|---|---------|----------|--------|
| 01 | Singleton | Creational | ✅ Complete |
| 02 | Factory | Creational | ✅ Complete |
| 03 | Abstract Factory | Creational | ✅ Complete |
| 04 | Strategy | Behavioral | ✅ Complete |
| 05 | Observer | Behavioral | ✅ Complete |
| 06 | Decorator | Structural | ✅ Complete |
| 07 | Adapter | Structural | ✅ Complete |
| 08 | Facade | Structural | ✅ Complete |
| 09 | Template Method | Behavioral | 📋 Planned |
| 10 | Command | Behavioral | 📋 Planned |
| 11 | State | Behavioral | 📋 Planned |
| 12 | Builder | Creational | 📋 Planned |
| 13 | Composite | Structural | 📋 Planned |
| 14 | Proxy | Structural | 📋 Planned |

## Learning Tips

1. **Don't rush** - Understanding > memorizing
2. **Use English** - Read explanations in English, think in English
3. **Write code by hand** - Muscle memory helps retention
4. **Explain to others** - Teaching = best learning
5. **Connect to real projects** - Think about where you've seen this pattern

## Writing Style Rules (MUST FOLLOW)

The target reader is a **beginner in both design patterns and English**. Every README must follow these principles:

### Audience
- Assumes NO prior knowledge of design patterns
- Assumes intermediate Japanese speaker learning English
- English should be simple: short sentences, common words, no jargon without explanation

### Gradual Complexity (段階的に説明する)
- **Start with a real-world analogy** before any code (e.g., "Think of a Slack channel...")
- **Show the problem first** with a naive code example that anyone can read
- **Then show the simplest possible solution** — minimal code, no extras
- **Then build up** — add features one at a time, never introduce multiple new concepts at once
- Each code snippet should add exactly ONE new idea compared to the previous one

### Language Guidelines
- Use simple English: prefer "use" over "utilize", "change" over "modify"
- Define every technical term the first time it appears (e.g., "Subject (the object that sends notifications)")
- Keep sentences under 15 words where possible
- Use concrete examples, not abstract descriptions (e.g., "like a Slack channel" not "a one-to-many dependency")

## Code Snippet Rules (MUST FOLLOW)

All code snippets in README files must follow these rules to minimize cognitive load:

1. **No undefined references** — Every variable, property, and method used in a snippet must be defined or clearly visible in the same snippet. Never use `this.name` without a constructor that sets `name`.
2. **No unused arguments** — If a constructor doesn't exist, don't pass arguments to `new ClassName("arg")`.
3. **Consistent interfaces** — If `Observer` has `onMessage()` only, do NOT add `getName()` in another section. All snippets in one README must use the same interface shape.
4. **Consistent data types** — If `SlackMessage` has 3 fields in one snippet, don't add a 4th field (`timestamp`) in another snippet.
5. **Self-contained snippets** — Each code block should either be fully runnable on its own, or explicitly continue from the immediately preceding block.
6. **implements must be real** — If a class does `channel.join(this)`, it must `implements Observer` and have the required methods.
7. **Show usage with definition** — Don't show a class definition without showing how it gets called. Definition alone doesn't explain when/why the code runs.

## Adding New Patterns

When adding a new pattern:

1. Create directory: `[pattern-name]/`
2. Add `README.md` with English explanation
3. Add code in `code/` subdirectory
4. Update this file's "Patterns Covered" table
