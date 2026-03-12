---
name: pre-action-self-check
description: MANDATORY self-check protocol BEFORE any action. Forces explicit verbalization of intent, delegation decision, and category selection. Prevents autopilot implementation.
version: 1.0.0
metadata:
  clawdbot:
    emoji: "🛑"
    priority: "CRITICAL"
    triggers: ["before_action", "pre_implementation", "task_start"]
---

# Pre-Action Self-Check Protocol

**CRITICAL**: This protocol MUST execute before ANY implementation action.

---

## 🛑 STOP Protocol

Before ANY of these actions:
- Editing a file
- Running a command
- Creating a file
- Deleting content

**MUST** execute this checklist:

---

## ✅ Pre-Action Checklist

### Step 1: Intent Verbalization

**Verbalize out loud** (in your response):

```
🎯 Intent Detection:
- Surface form: "{what user literally said}"
- True intent: {research / implementation / investigation / evaluation / fix / open-ended}
- My routing decision: {explore → answer / plan → delegate / clarify first / etc.}
```

**Example**:
```
🎯 Intent Detection:
- Surface form: "Add login button to header"
- True intent: Implementation (explicit)
- My routing decision: Plan → delegate to visual-engineering agent
```

---

### Step 2: Delegation Decision

**Answer these questions**:

```
Q1: Is this a single-file trivial change (<5 min, known location)?
    □ YES → Can proceed directly (but still consider delegation)
    □ NO → Must delegate

Q2: Does this involve 2+ files or steps?
    □ YES → Create todos → Delegate each in parallel
    □ NO → Continue to Q3

Q3: Am I about to write/edit code?
    □ YES → STOP → Call task() to delegate
    □ NO → Continue to Q4

Q4: Have I fired explore/librarian agents (if needed)?
    □ YES → Continue
    □ NO → Fire agents first
```

**Log the decision**:
```
📋 Delegation Decision:
- Q1: NO
- Q2: YES → Creating todos, will delegate
- Decision: DELEGATE to {category} agent
```

---

### Step 3: Category Selection (If Delegating)

**MUST** select correct category based on task domain:

```
Task Domain Analysis:
├─ UI/Styling/CSS/Layout → visual-engineering
├─ Hard logic/algorithms → ultrabrain
├─ Research + implement → deep
├─ Single-file typo → quick
├─ Documentation → writing
└─ Creative design → artistry
```

**Log selection**:
```
🎯 Category Selection:
- Domain: Visual/Frontend
- Selected: visual-engineering
- Skills: frontend-design, frontend-ui-ux
- Reasoning: UI work requires visual-engineering model (optimized for design)
```

**ANTI-PATTERN CHECK**:
```
⚠️ Am I tempted to use 'quick' for visual work?
   □ YES → STOP → Switch to visual-engineering
   □ NO → Continue
```

---

### Step 4: Prompt Quality Check (If Delegating)

**Verify prompt has ALL 6 sections** (5+ lines each):

```
□ 1. TASK: Atomic, specific goal
□ 2. EXPECTED OUTCOME: Concrete deliverables
□ 3. REQUIRED TOOLS: Explicit whitelist
□ 4. MUST DO: Exhaustive requirements
□ 5. MUST NOT DO: Forbidden actions
□ 6. CONTEXT: File paths, patterns, constraints
```

**Quality gate**:
```
Prompt length: {N} lines (minimum: 25 total)
Specificity: {high/medium/low}
Clarity: {clear/ambiguous}
```

---

### Step 5: Parallel Execution Check

**If multiple tasks exist**:

```
Q: Can these run in parallel?
   □ YES → Launch all with run_in_background=true
   □ NO → Sequence with dependencies noted

Q: Have I fired 2+ explore/librarian agents (if researching)?
   □ YES → Continue
   □ NO → Fire in parallel now
```

**Log parallelization**:
```
🚀 Parallel Execution:
- Agent 1: explore (background) - Find auth patterns
- Agent 2: librarian (background) - Find JWT docs
- Agent 3: deep (background) - Implement login form
- Expected time savings: ~60% (parallel vs sequential)
```

---

## 🚨 Violation Detection

**If you catch yourself skipping this protocol**:

```
🛑 PROTOCOL VIOLATION DETECTED:
- Action attempted: {what you were about to do}
- Skipped steps: {which checklist items}
- Correction: STOPPING → Executing protocol → Will delegate

✅ Corrected Action:
{Show proper delegation with full protocol}
```

---

## 📝 Output Template

**Use this template in your responses**:

```markdown
### 🛑 Pre-Action Self-Check

**Intent**: {research/implementation/investigation/evaluation/fix/open-ended}

**Delegation Decision**:
- Trivial? □ YES □ NO
- Multi-step? □ YES □ NO
- Code changes? □ YES □ NO
- **Verdict**: DELEGATE / PROCEED

**Category**: {selected-category}
**Skills**: {skill-1, skill-2, ...}
**Parallel**: □ YES (N agents) □ NO

**Next Action**: {delegating / proceeding with X}
```

---

## 🔁 Integration Points

### With Todo Management

```
IF task has 2+ steps
THEN → todowrite FIRST (create detailed todos)
     → Mark current as in_progress
     → Delegate each todo item
```

### With Session Continuity

```
IF continuing previous task
THEN → Use session_id from previous task()
     → Prompt: "Continue: {specific task}"
     → Avoid starting fresh
```

### With Background Tasks

```
IF launching multiple agents
THEN → All with run_in_background=true
     → Store task_ids
     → Continue work immediately
     → Wait for <system-reminder>
```

---

## 📊 Compliance Metrics

Track your compliance rate:

```yaml
# ~/.pre-action-check/metrics.yaml
total_actions: 150
protocol_followed: 142
violations_detected: 8
compliance_rate: 94.7%

violations_by_type:
  skipped_intent: 3
  skipped_delegation_check: 2
  wrong_category: 2
  inadequate_prompt: 1
  
improvement_trend:
  week1: 85%
  week2: 91%
  week3: 94.7%
```

---

## 🎯 Examples

### Example 1: User Request

**User**: "Add dark mode toggle to settings"

**Pre-Action Self-Check**:
```
### 🛑 Pre-Action Self-Check

**Intent**: Implementation (explicit)

**Delegation Decision**:
- Trivial? ❌ NO (multiple files: component, store, styles)
- Multi-step? ✅ YES (create component, add state, wire toggle, persist preference)
- Code changes? ✅ YES
- **Verdict**: DELEGATE

**Category**: visual-engineering
**Skills**: frontend-design, frontend-ui-ux
**Parallel**: ✅ YES (3 agents)

**Next Action**: 
1. Create todo list
2. Delegate component creation to Agent 1
3. Delegate state management to Agent 2
4. Delegate styling to Agent 3
```

---

### Example 2: Bug Fix

**User**: "Getting type error on line 42 of auth.ts"

**Pre-Action Self-Check**:
```
### 🛑 Pre-Action Self-Check

**Intent**: Fix needed (explicit)

**Delegation Decision**:
- Trivial? ❌ NO (need to understand context first)
- Multi-step? ❌ NO (single fix)
- Code changes? ✅ YES
- **Verdict**: DELEGATE (after exploration)

**Category**: quick
**Skills**: file-search
**Parallel**: ❌ NO (sequential: explore first, then fix)

**Next Action**:
1. Fire explore agent to find type patterns
2. Delegate fix to quick agent with context
```

---

## ⚠️ Common Pitfalls

### Pitfall 1: "This is quick, I'll do it myself"

```
🚨 WARNING: This is the #1 failure mode.

Reality check:
- Your "quick" edit → 20 lines changed
- Subagent with proper category → 200 lines, better quality
- Your speed ≠ better result

Correction:
✅ ALWAYS delegate, even for "quick" tasks
```

### Pitfall 2: "I'll just read this file first"

```
🚨 WARNING: Direct reads without explore = missing context.

Better approach:
✅ Fire explore agent: "Find all implementations of X"
✅ Get patterns from multiple files
✅ Then delegate with full context
```

### Pitfall 3: "Let me check the error first"

```
🚨 WARNING: Manual investigation = context waste.

Better approach:
✅ Delegate to oracle: "Diagnose error on line X"
✅ Oracle has deeper reasoning capacity
✅ You stay in orchestrator role
```

---

## 📌 Quick Reference

**BEFORE acting, recite**:
```
1. What is my true intent?
2. Should I delegate this?
3. Which category matches the domain?
4. Is my prompt exhaustive?
5. Can I parallelize this?
```

**If unsure**: **DELEGATE FIRST, VERIFY LATER**

---

**Remember**: This protocol exists because **autopilot = failure**.
Conscious orchestration = **measurably better outcomes**.
