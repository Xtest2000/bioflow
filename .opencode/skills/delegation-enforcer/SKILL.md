---
name: delegation-enforcer
description: ENFORCES delegation-first behavior. Use BEFORE any implementation task. Decomposes work, delegates to subagents, verifies outputs. NEVER implements directly.
version: 1.0.0
metadata:
  clawdbot:
    emoji: "🎯"
    priority: "CRITICAL"
---

# Delegation Enforcer - CRITICAL COMPLIANCE SKILL

**Purpose**: Force strict adherence to delegation-first protocol. This skill PREVENTS direct implementation.

---

## ⚠️ CRITICAL: Pre-Action Self-Check (MANDATORY)

**BEFORE** any implementation action, MUST execute this checklist:

### Step 1: Task Classification
```
Is this task trivial? (single file, known location, <5 min work)
- YES → Direct action OK (but still prefer delegation)
- NO → MUST DELEGATE
```

### Step 2: Complexity Assessment
```
Does this task have 2+ steps?
- YES → Create todo list, then delegate each step
- NO → Continue to Step 3
```

### Step 3: Implementation Detection
```
Am I about to write/edit code?
- YES → STOP IMMEDIATELY
        → Call task() to delegate
        → Log: "VIOLATION PREVENTED: Delegating to {category} agent"
- NO → Continue
```

### Step 4: Exploration Check
```
Have I fired explore/librarian agents?
- For non-trivial tasks: MUST fire 2+ agents in parallel
- For unfamiliar libraries: MUST fire librarian
- For codebase patterns: MUST fire explore
```

---

## 🚨 Violation Recovery Protocol

If you catch yourself implementing directly:

1. **STOP** all edits immediately
2. **REVERT** any changes made (git checkout / undo)
3. **LOG** the violation: "VIOLATION: Attempted direct implementation at {timestamp}"
4. **DELEGATE** via `task()` to appropriate agent
5. **VERIFY** the subagent completes correctly

---

## 📋 Delegation Decision Tree

```
Task Received
    ↓
Is it a single-file typo/config change?
    ├─ YES → Direct action (but consider delegation)
    └─ NO
        ↓
Does it involve 2+ files or steps?
    ├─ YES → Create todos → Delegate each in parallel
    └─ NO
        ↓
Am I unfamiliar with the code/library?
    ├─ YES → Fire explore/librarian FIRST
    └─ NO
        ↓
Is it visual/frontend work?
    ├─ YES → Delegate to visual-engineering + frontend-design skill
    └─ NO
        ↓
Is it complex logic/architecture?
    ├─ YES → Delegate to ultrabrain OR consult oracle
    └─ NO
        ↓
Delegate to appropriate category (quick/unspecified-low/unspecified-high/deep)
```

---

## 🎯 Category Selection Protocol

**MANDATORY** - Always match task domain to category:

| Task Domain | MUST Use Category | Required Skills |
|-------------|------------------|-----------------|
| UI, styling, CSS, layout | `visual-engineering` | `frontend-design`, `frontend-ui-ux` |
| Hard logic, algorithms, architecture | `ultrabrain` | None |
| Autonomous research + implementation | `deep` | `file-search` |
| Single-file typo, trivial config | `quick` | None |
| Documentation, comments | `writing` | None |
| Creative/unconventional | `artistry` | `frontend-design` |

**VIOLATION EXAMPLE** (will produce poor results):
```typescript
task(category="quick", load_skills=[], prompt="Redesign the dashboard...")
// WRONG: Visual work in quick category → INFERIOR OUTPUT
```

**CORRECT EXAMPLE**:
```typescript
task(
  category="visual-engineering",
  load_skills=["frontend-design", "frontend-ui-ux"],
  prompt="Redesign the dashboard with..."
)
// CORRECT: Visual work → visual-engineering category
```

---

## 📝 Mandatory Delegation Prompt Structure

When delegating, your prompt **MUST** include ALL 6 sections:

```
1. TASK: Atomic, specific goal (one action per delegation)
2. EXPECTED OUTCOME: Concrete deliverables with success criteria
3. REQUIRED TOOLS: Explicit tool whitelist (prevents tool sprawl)
4. MUST DO: Exhaustive requirements - leave NOTHING implicit
5. MUST NOT DO: Forbidden actions - anticipate and block rogue behavior
6. CONTEXT: File paths, existing patterns, constraints
```

**Example** (5+ lines, exhaustive):
```
TASK: Fix TypeScript type errors in auth.ts after the recent refactoring.

EXPECTED OUTCOME:
- Zero TypeScript errors in src/auth/auth.ts
- All types properly inferred or explicitly declared
- No use of 'as any' or '@ts-ignore'

REQUIRED TOOLS:
- lsp_diagnostics (verify errors)
- read (examine current types)
- edit (fix type issues)

MUST DO:
- Run lsp_diagnostics before and after changes
- Preserve existing type patterns from the codebase
- Use explicit types for all function signatures

MUST NOT DO:
- Do NOT use 'as any' to suppress errors
- Do NOT use '@ts-ignore' or '@ts-expect-error'
- Do NOT change runtime behavior

CONTEXT:
- File: src/auth/auth.ts
- Error location: Lines 42-58 (getUser function)
- Existing pattern: See src/types/user.ts for User interface
```

---

## 🔁 Session Continuity (MANDATORY)

Every `task()` output includes a `session_id`. **USE IT**:

**ALWAYS continue when**:
- Task failed/incomplete → `session_id="{id}", prompt="Fix: {specific error}"`
- Follow-up question → `session_id="{id}", prompt="Also: {question}"`
- Verification failed → `session_id="{id}", prompt="Failed: {error}. Fix."`

**Why session_id is CRITICAL**:
- Subagent has FULL conversation context preserved
- No repeated file reads, exploration, or setup
- Saves 70%+ tokens on follow-ups
- Subagent knows what it already tried/learned

```typescript
// WRONG: Starting fresh loses all context
task(category="quick", load_skills=[], prompt="Fix type error...")

// CORRECT: Resume preserves everything
task(
  session_id="ses_abc123",
  load_skills=[],
  prompt="Fix: Type error on line 42"
)
```

**After EVERY delegation, STORE the session_id for potential continuation.**

---

## ⏰ Background Task Protocol

**Parallelize EVERYTHING**:

```typescript
// CORRECT: Always background, always parallel
task(
  subagent_type="explore",
  run_in_background=true,
  load_skills=["file-search"],
  description="Find auth implementations",
  prompt="[CONTEXT] I'm implementing JWT auth for the REST API in src/api/routes/. [GOAL] Need to match existing auth conventions. [DOWNSTREAM] Will use this to decide middleware structure. [REQUEST] Find: auth middleware, login handlers, token generation. Focus on src/ — skip tests."
)

task(
  subagent_type="librarian",
  run_in_background=true,
  load_skills=[],
  description="Find JWT security docs",
  prompt="[CONTEXT] Implementing JWT auth. [GOAL] Choose token storage strategy. [DOWNSTREAM] Will decide between httpOnly cookies vs localStorage. [REQUEST] Find: OWASP guidelines, recommended token lifetimes, refresh strategies. Skip basic tutorials."
)

// Continue working immediately. System notifies on completion.
```

**Background Result Collection**:
1. Launch parallel agents → receive `task_ids`
2. Continue immediate work
3. System sends `<system-reminder>` on each task completion
4. Then call `background_output(task_id="...")`
5. Need results not yet ready? **End your response** — wait for notification

**NEVER**:
```typescript
// WRONG: Sequential or blocking
result = task(..., run_in_background=false)  // Never wait synchronously
```

---

## 🎯 Success Metrics

Track these metrics to measure delegation compliance:

| Metric | Target | Measurement |
|--------|--------|-------------|
| Delegation Rate | >90% | Tasks delegated / Total tasks |
| Parallel Execution | >80% | Background tasks / Total subagents |
| Session Reuse | >70% | Continued sessions / Total follow-ups |
| Direct Implementation | <10% | Direct edits / Total changes |

---

## 📌 Quick Reference Card

**BEFORE acting, ask**:
1. ☐ Is this truly trivial (single file, <5 min)?
2. ☐ Should I delegate this to a specialist?
3. ☐ Have I fired explore/librarian agents?
4. ☐ Am I about to write code? → STOP, DELEGATE
5. ☐ Is this visual work? → `visual-engineering` category
6. ☐ Is this complex logic? → `ultrabrain` or `oracle`

**When in doubt**: **DELEGATE FIRST, ASK LATER**

---

**Remember**: Your value is **orchestration**, not implementation.
A well-delegated task produces **measurably better** results than direct action.
