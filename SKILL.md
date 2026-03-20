---
name: elite-coding
description: >
  Load this skill for ANY coding task — new features, bug fixes, refactors, architecture decisions,
  reviews, or debugging. Triggers: user asks to write, fix, review, explain, or design code in any
  language or framework. This skill forces a top-tier reasoning process that compensates for the
  gap between fast/light model defaults and expert-level coding output. The goal is not to add
  steps — it is to add DEPTH at each step, producing code that an elite engineer would be proud
  to ship.
license: MIT
---

# Elite Coding — Reasoning Amplifier for Coding Tasks

## Core Philosophy

The difference between average AI code and expert AI code is not syntax knowledge — it is
**the quality of thinking before the first line is written**. This skill forces that thinking
to happen explicitly. You are not allowed to write code until you have completed the pre-coding
phase below.

The goal: produce code that is **correct first, complete second, clean third** — in that exact
order of priority. Code that looks clean but silently fails on edge cases is worse than messy
code that handles them.

---

## Phase 0: STOP. Read This Before Anything Else.

Before writing a single character of code, answer these three questions internally:

1. **What is the exact desired behavior?** (Not what the user said — what they *mean*. These
   are often different. A user asking to "sort a list" might need stable sort, might have
   duplicates, might need nulls handled. Infer from context; ask if critical.)

2. **What are the 3 most likely ways this code will fail?** (Not hypothetical failures — likely
   ones given the context. A function that reads a file will fail on: missing file, empty file,
   malformed content. Name them before coding.)

3. **What does "done" look like?** (Specify the exit condition. If you cannot describe how to
   verify the code is correct, you do not understand the task well enough to code it yet.)

Only after answering these three questions proceed to Phase 1.

---

## Phase 1: Architecture Before Implementation

### 1.1 Decomposition
Break the problem into sub-problems *before* choosing data structures or writing functions.
Draw this decomposition mentally or in comments:

```
Problem: [describe in one sentence]
Sub-problems:
  A. [smallest independent unit]
  B. [next unit — can it depend on A? should it?]
  C. [...]
Dependencies: A → B → C or A ∥ B → C
```

**Rule:** If you cannot decompose the problem into at least 2 independent pieces, you have not
understood it well enough. Keep breaking it down.

### 1.2 Interface Design (API-First)
Design the *interface* before the implementation:
- What inputs go in? (types, shapes, constraints — what's valid? what's invalid?)
- What outputs come out? (type, shape, when it can be null/empty/error)
- What side effects occur? (mutations, I/O, state changes)
- What exceptions/errors can propagate upward?

Write this as a type signature or docstring comment *before* the function body.

### 1.3 Data Structure Selection
For each data structure you're about to use, ask:
- Read frequency vs write frequency? (informs array vs map vs set)
- Does order matter? (informs whether a set is appropriate)
- Are lookups by key? (informs object/map over array)
- What is the realistic max size? (informs whether O(n²) is acceptable)

Default choices that are almost always wrong:
- Using an array when you need O(1) lookup by key → use Map/object
- Using a flat structure when hierarchy is natural → model the hierarchy
- Mutating shared state when a return value would work → return instead

---

## Phase 2: Implementation Standards

### 2.1 Naming — The Most Important Quality Signal
Names are the primary documentation. A well-named function needs no comment.

**Variable names:**
- Boolean: `is`, `has`, `can`, `should` prefix → `isLoading`, `hasError`, `canEdit`
- Arrays/collections: plural noun → `users`, `activeItems`, `pendingRequests`
- Single items: singular noun → `user`, `item`, `request`
- Counts: `count`, `total`, `num` → `userCount`, `totalPages`
- Functions: verb + noun → `fetchUser`, `validateEmail`, `parseResponse`

**Anti-patterns to never use:**
- Single letters except loop counters (`i`, `j`) and math (`x`, `y`)
- Abbreviations that aren't universal (`usr`, `cfg`, `tmp` — spell them out)
- Generic names that say nothing (`data`, `info`, `result`, `temp`, `obj`)
- Misleading names (a function called `getUser` that also writes to DB)

### 2.2 Function Design
Each function must satisfy all of these:
- **Single responsibility:** If you need "and" to describe what it does → split it
- **Predictable:** Same inputs always produce same outputs (avoid hidden dependencies on
  global state or time unless the function's explicit purpose is to access them)
- **Short:** Target < 20 lines for pure logic functions; > 40 lines is a warning sign that
  it needs decomposition. This is a guideline, not an absolute rule — some functions are
  legitimately long due to complex state machines or exhaustive switch cases.
- **No surprise mutations:** If a function receives an object, it should not mutate it unless
  explicitly named as a mutating function (`updateUser` is fine; `getUser` that mutates is not)

### 2.3 Error Handling — Non-Negotiable
Every function that can fail *must* handle failure. There is no acceptable "I'll add error
handling later." Categories of failure that must always be handled:

**I/O operations (file, network, DB):**
```
// NEVER:
const data = fs.readFileSync(path)

// ALWAYS:
try {
  const data = fs.readFileSync(path)
} catch (err) {
  // Handle: log, return default, throw typed error, or fail fast
  // Choose ONE — but choose explicitly
}
```

**User/external input:**
```
// NEVER: assume input is valid
function processAge(age) { return age * 2 }

// ALWAYS: validate at the boundary
function processAge(age) {
  if (typeof age !== 'number' || age < 0 || age > 150) {
    throw new TypeError(`Invalid age: ${age}`)
  }
  return age * 2
}
```

**Null/undefined (the billion-dollar mistake):**
Every access chain (`obj.prop.nested.value`) is a potential null crash. Before writing
`obj.prop`, ask: "Is it possible for `obj` or `obj.prop` to be null/undefined in any
realistic scenario?" If yes, handle it.

### 2.4 The Happy Path Trap
The most common failure mode in AI-generated code: code that works perfectly on the
example input and fails on everything else.

Before finalizing any function, mentally run it on:
- Empty input (`[]`, `""`, `{}`, `null`, `0`, `false`)
- Single-element input (when input is a collection)
- Very large input (are there O(n²) loops? recursion depth limits?)
- Boundary values (first/last element, min/max numeric range)
- Duplicate values (when uniqueness might be assumed)
- Unicode/special characters (when processing strings)
- Concurrent access (when shared state is involved)

---

## Phase 3: Code Review Before Delivery

After writing code, before responding, run through this checklist mentally.
Do not skip items. Mark each as ✓ or flag it explicitly in your response.

### Security Checklist
- [ ] Is any user input used in a SQL query without parameterization?
- [ ] Is any user input rendered as HTML without escaping?
- [ ] Are any secrets (API keys, passwords) hardcoded in the code?
- [ ] Does any file path operation use user input directly (path traversal)?
- [ ] Are error messages leaking internal implementation details to end users?

### Correctness Checklist
- [ ] Does the code handle all error cases identified in Phase 0?
- [ ] Is the return value correct for empty/null input?
- [ ] Are all loops guaranteed to terminate?
- [ ] Are there any off-by-one errors in array indexing?
- [ ] Are comparisons using the right equality (`===` not `==` in JS; `is` not `==` for
  identity in Python; etc.)?

### Completeness Checklist
- [ ] Are all the sub-problems from Phase 1 addressed in the implementation?
- [ ] Are there any TODOs in the code that represent missing critical functionality?
  (TODOs for optimization are acceptable; TODOs for correctness are not)
- [ ] If the task required state management, is the initial state correct?
- [ ] If the task required cleanup (event listeners, connections, timers), is cleanup implemented?

### Clarity Checklist
- [ ] Would a developer unfamiliar with this codebase understand what each function does
  from its name and signature alone?
- [ ] Are there any "magic numbers" or "magic strings" that should be named constants?
- [ ] Are complex conditions extracted into named booleans or helper functions?
- [ ] Are comments explaining *why*, not *what* (code explains what; comments explain why)?

---

## Phase 4: Debugging Protocol

When the task is to fix a bug, not write new code:

### 4.1 Reproduce First
Never fix what you cannot reproduce. Define:
- Exact input that causes the bug
- Expected behavior
- Actual behavior
- Is it deterministic? (always happens) or intermittent? (sometimes happens)

Intermittent bugs are almost always one of: race condition, uninitialized state,
floating point comparison, or time-dependent logic. Start there.

### 4.2 Locate Before Fix
Follow the data, not the code structure:
1. Start at the *output* (the wrong result or error)
2. Trace backward to find where the data became wrong
3. The bug is at the point where a correct value became incorrect — not necessarily
   where the symptom appears

**The rule:** Do not read more than 20 lines of code without forming a hypothesis about
where the bug is. Force yourself to hypothesize, then verify. Reading without hypothesizing
produces no insight.

### 4.3 Fix the Root Cause, Not the Symptom
Test: if you removed your fix, would the bug come back? If yes → you fixed a symptom.
The real fix prevents the wrong state from ever occurring, not just handles it after the fact.

Wrong: `if (user == null) return null` (handles null after it occurred)
Right: understand why `user` is null here, fix the source

---

## Phase 5: Communication Standards

### When Presenting Code

Always include:
1. **What this code does** — 1–2 sentence plain language summary
2. **Key decisions made** — Why this approach vs obvious alternatives (only for non-obvious choices)
3. **What is NOT handled** — Explicitly list known limitations or out-of-scope cases. This is not
   weakness — it is precision. "This does not handle concurrent writes" is better than silently
   failing on concurrent writes.
4. **How to verify it works** — At minimum: what to test, what the expected output is

### When You're Uncertain

Distinguish clearly between:
- **Confident:** "This will work because [reason]"
- **Likely:** "This should work; the main risk is [specific scenario]"
- **Uncertain:** "I'm not sure this handles [edge case] — test this specifically"
- **Requires context:** "This depends on [external factor I don't have info about]"

Never present uncertain code as certain. The user can handle uncertainty; they cannot
handle silent incorrectness.

### When the Task Is Ambiguous

If there are two reasonable interpretations of a coding task that would lead to
significantly different implementations, state the ambiguity explicitly and either:
- Ask which interpretation is correct (if the difference is critical)
- State which interpretation you're using and why, then implement it (if you have
  enough context to make an informed choice)

Do not silently pick one interpretation and code it as if it were the obvious choice.

---

## Language-Specific Rules

### JavaScript / TypeScript
- Prefer `const` over `let`; never use `var`
- Use `===` never `==`
- Prefer `async/await` over `.then()` chains for readability
- In TypeScript: `any` is a code smell; use `unknown` + type narrowing instead
- Array methods (`map`, `filter`, `reduce`) over `for` loops for transformations
- Destructuring for function parameters when > 2 args: `function fn({ name, age, role })`
- Optional chaining `?.` and nullish coalescing `??` over nested ternaries

### Python
- Type hints on all function signatures: `def process(items: list[str]) -> dict[str, int]:`
- f-strings over `.format()` or `%` formatting
- List/dict comprehensions over `for` loops for transformations
- Context managers (`with`) for all file and connection operations
- Dataclasses or TypedDict for structured data, not naked dicts
- Explicit exception types: `except ValueError:` not bare `except:`
- `pathlib.Path` over `os.path` for file operations

### SQL
- Always use parameterized queries — never string concatenation with user input
- Explicit column lists in SELECT — never `SELECT *` in production code
- Transactions for multi-statement operations that must be atomic
- Indexes on columns used in WHERE, JOIN, and ORDER BY (mention when creating schema)
- LIMIT clauses on queries that could return unbounded rows

### CSS / Frontend
- CSS variables for all colors and repeated values
- Mobile-first: base styles for mobile, media queries add complexity for larger screens
- Avoid `!important` — it is a signal that specificity is wrong, not a fix
- Use semantic HTML elements over generic `div` + class (nav, main, article, section, header)
- Accessibility: interactive elements need focus styles, images need alt text, forms need labels

---

## Anti-Patterns: Things That Will Happen If You Do Not Read This Skill

These are the most common failure modes of light model coding. They are listed here as
explicit prohibitions:

1. **Writing code before understanding the full task.** If the task involves multiple steps,
   describe the full plan first in a comment block, then implement.

2. **Showing only the "happy path."** Every piece of code you write must demonstrate awareness
   that things go wrong. If there is no error handling in your output, that is a defect.

3. **Using placeholder variables as final output.** `result`, `data`, `temp`, `value` are not
   names — they are blank spaces. Replace every one before responding.

4. **Implementing the wrong abstraction level.** If asked to "add a button that deletes a user,"
   the answer is the button code + the delete handler + the API call + the confirmation dialog.
   Not just the button HTML.

5. **Ignoring the existing codebase style.** If context includes existing code, match its
   patterns — variable naming, error handling, module structure. Do not introduce a new style
   into an established codebase.

6. **Resolving ambiguity silently.** If you made a choice between two valid approaches, say so.
   The user cannot improve code they don't understand.

7. **Answering a different question.** The user's literal words and their actual need can differ.
   Before responding, verify: does my output solve the actual problem, or just the literal request?

---

## Quick Reference: Pre-Submission Checklist

Copy this into your mental process before every code response:

```
□ Phase 0: I know the exact desired behavior, 3 failure modes, and the done condition
□ Phase 1: Decomposed, interface designed, data structures chosen deliberately
□ Phase 2: Names are descriptive, functions are single-purpose, errors are handled,
           edge cases are considered
□ Phase 3: Security, correctness, completeness, clarity — all reviewed
□ Phase 5: Summary included, limitations stated, verification path provided
```

If any checkbox cannot be checked, address that gap before responding.

---

## On Using This Skill Efficiently

This skill does not require you to write out every phase explicitly in your response.
It requires you to *think through* every phase before writing code. The response to the
user should be clean, focused output — not a transcript of your reasoning process.

**Show the reasoning when:**
- The task involves a non-obvious architectural decision
- You are uncertain about an edge case and the user should know
- The task has ambiguity that affects the implementation significantly

**Keep it clean when:**
- The task is well-defined and your solution is straightforward
- Explaining your reasoning would bury the actual code the user needs

The goal is code that a senior engineer would review and say: "This looks right, handles
the edge cases, and I understand what it's doing." That is the bar. Everything in this
skill exists to hit that bar consistently.