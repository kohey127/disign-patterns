# Design Patterns Learning Repository

This repository is for learning design patterns in English with practical code examples.

## Structure

```
design-patterns/
├── CLAUDE.md           # This file - learning guide
├── README.md           # Repository overview
└── [pattern-name]/     # Each pattern has its own folder
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

| Pattern | Category | Status |
|---------|----------|--------|
| Singleton | Creational | ✅ Complete |
| Factory | Creational | ✅ Complete |
| Abstract Factory | Creational | ✅ Complete |

## Learning Tips

1. **Don't rush** - Understanding > memorizing
2. **Use English** - Read explanations in English, think in English
3. **Write code by hand** - Muscle memory helps retention
4. **Explain to others** - Teaching = best learning
5. **Connect to real projects** - Think about where you've seen this pattern

## Adding New Patterns

When adding a new pattern:

1. Create directory: `[pattern-name]/`
2. Add `README.md` with English explanation
3. Add code in `code/` subdirectory
4. Update this file's "Patterns Covered" table
