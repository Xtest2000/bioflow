---
name: operation-tracker
description: Track operation accumulation across conversation turns. Prevents context exhaustion by detecting when to delegate. Threshold-based delegation trigger.
version: 1.0.0
metadata:
  clawdbot:
    emoji: "📊"
    config:
      stateDirs: ["~/.operation-tracker"]
---

# Operation Tracker - Prevent Context Exhaustion

**Philosophy**: The per-turn threshold is a trap—it's the **CONVERSATION-LEVEL accumulation** that kills sessions.

---

## 🎯 Purpose

This skill maintains awareness of operation counts across the **entire conversation** to prevent cumulative context exhaustion.

**Use when**:
- You notice multiple operations accumulating
- Working on iterative tasks across turns
- User says "continue" repeatedly
- Same file being edited multiple times

---

## 📊 Tracking Metrics

**Before EACH operation**, mentally note:

| Metric | Threshold | Action |
|--------|-----------|--------|
| Reads since last Task | >5 | DELEGATE remaining work |
| Edits since last Task | >3 | DELEGATE remaining work |
| Same-file turns | >2 | DELEGATE to fresh agent |
| Continue commands | >2 | DELEGATE to fresh agent |
| Total conversation ops | >15 | END SESSION, delegate |

---

## 🔄 Delegation Triggers

### HIGH PRIORITY (Delegate IMMEDIATELY)

```
IF (reads_since_task > 5) OR (edits_since_task > 3)
THEN → DELEGATE remaining work to fresh agent
     → Log: "Operation threshold exceeded. Delegating to preserve context."
```

### MEDIUM PRIORITY (Strongly Consider Delegation)

```
IF (same_file_turns > 2) OR (continue_count > 2)
THEN → Consider delegating to avoid iterative loop
     → Ask: "Should I delegate the remaining iterations to a subagent?"
```

### LOW PRIORITY (Awareness Only)

```
IF (total_conversation_operations > 10)
THEN → Warn user: "Accumulated {N} operations. Consider delegating remaining work."
```

---

## 📝 State Management

Track state in `~/.operation-tracker/state.yaml`:

```yaml
# Session State
session_id: "current-session-id"
start_time: "2026-03-12T10:00:00Z"

# Operation Counts
reads_since_task: 0
edits_since_task: 0
same_file_turns: 0
continue_count: 0
total_operations: 0

# File Tracking
last_edited_files: []
current_file_focus: null

# Delegation History
last_delegation_time: null
delegations_count: 0
```

### Reset Conditions

Reset counters when:
- Task delegation occurs (reset reads/edits)
- New session starts (reset all)
- User explicitly resets (`operation-tracker reset`)

---

## 🚨 Intervention Protocol

### When Threshold Exceeded

**Step 1: STOP current work**
```
"⚠️ Operation Tracker Alert: {metric} exceeded threshold ({current}/{threshold}).
Delegating remaining work to preserve session context."
```

**Step 2: Create delegation summary**
```typescript
task(
  category="quick",
  load_skills=[],
  run_in_background=false,
  description="Complete remaining iterations",
  prompt=`
CONTEXT: Working on {file} for {N} turns. Accumulated {M} operations.
CURRENT STATE: {describe what was done}
REMAINING WORK: {describe what needs to be done}

TASK: Complete the remaining {N} iterations on {file}.
- Continue from line {X}
- Apply same pattern as previous edits
- Run verification after each edit

VERIFY: 
- Run lsp_diagnostics on completion
- Show diff summary of all changes
`
)
```

**Step 3: Log the intervention**
```yaml
# ~/.operation-tracker/interventions.log
- timestamp: "2026-03-12T10:30:00Z"
  trigger: "reads_since_task > 5"
  value: 7
  action: "delegated to quick agent"
  session_preserved: true
```

---

## 📈 Analytics Dashboard

Track long-term patterns:

```yaml
# ~/.operation-tracker/analytics.yaml
weekly_stats:
  total_sessions: 15
  avg_operations_per_session: 12.3
  delegations_triggered: 8
  context_exhaustion_events: 2
  
threshold_effectiveness:
  reads_threshold:
    hits: 5  # correctly prevented exhaustion
    false_positives: 2  # delegated unnecessarily
  edits_threshold:
    hits: 3
    false_positives: 1
    
recommendations:
  - "Consider lowering reads threshold to 4"
  - "Increase edits threshold to 4 (too sensitive)"
```

---

## 🎯 Integration with AGENTS.md

Add to project's AGENTS.md:

```md
## Operation Tracker Integration

This project uses operation-tracker skill to prevent context exhaustion.

**Automatic Triggers**:
- >5 reads without delegation → Auto-delegate
- >3 edits without delegation → Auto-delegate
- >2 same-file iterations → Warn and delegate

**Manual Commands**:
- `operation-tracker status` - Show current counts
- `operation-tracker reset` - Reset counters
- `operation-tracker history` - Show intervention log
```

---

## 🔧 Usage Examples

### Example 1: Detecting Accumulation

```
User: "Fix the type errors in auth.ts"
Agent: [Reads auth.ts, edits 3 times]
User: "Now fix user.ts"
Agent: [Reads user.ts, edits 2 times]
User: "Also fix token.ts"
Agent: [Reads token.ts]

🚨 OPERATION TRACKER ALERT:
- reads_since_task: 6 (threshold: 5)
- Action: Delegating remaining work

"⚠️ I've accumulated 6 file reads without delegation. 
Delegating the remaining token.ts fixes to preserve context."
```

### Example 2: Same-File Iteration

```
User: "Add logging to the login function"
Agent: [Adds log statement]
User: "Now add one to the logout function too"
Agent: [Adds second log]
User: "And one more to the register function"
Agent: [Adds third log]
User: "Actually, can you add error messages too?"

🚨 OPERATION TRACKER ALERT:
- same_file_turns: 3 (threshold: 2)
- Action: Suggesting delegation

"I notice we're on the 3rd iteration on the same file. 
Should I delegate the error message additions to a subagent 
to avoid context accumulation?"
```

---

## 🛡️ Safety Features

### Graceful Degradation

If state file is missing/corrupted:
1. Reinitialize with defaults
2. Log the reset
3. Continue tracking

### User Override

User can override delegation:
```
User: "Don't delegate, just continue"
→ Log override
→ Continue with warning: "Context may exhaust in ~{N} more operations"
```

---

## 📌 Quick Reference

**Track Before Each Operation**:
```
1. reads_since_task++
2. if reads > 5 → DELEGATE
3. edits_since_task++
4. if edits > 3 → DELEGATE
5. if same_file → same_file_turns++
6. if same_file_turns > 2 → WARN
```

**Reset After**:
- Task delegation
- New session
- Explicit user command

---

**Remember**: Better to delegate early than exhaust context and lose progress.
