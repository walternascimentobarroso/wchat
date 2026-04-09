# Agent Teams — Master Reference Guide

> Source: https://code.claude.com/docs/en/agent-teams  
> Claude Code v2.1.32+ required. Feature is experimental and disabled by default.

---

## Enable Agent Teams

Set in `.claude/settings.local.json` (project-local, gitignored):

```json
{
  "env": {
    "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1"
  }
}
```

---

## What Are Agent Teams?

A team consists of:

| Component    | Role                                                                     |
| :----------- | :----------------------------------------------------------------------- |
| **Lead**     | The main Claude Code session. Creates the team, spawns and coordinates teammates. |
| **Teammates**| Separate Claude Code instances, each with their own context window.       |
| **Task list**| Shared list of work items. Teammates claim and complete tasks.            |
| **Mailbox**  | Messaging system for direct inter-agent communication.                    |

Storage locations (auto-managed, do not edit by hand):
- Team config: `~/.claude/teams/{team-name}/config.json`
- Task list: `~/.claude/tasks/{team-name}/`

---

## Agent Teams vs. Subagents

| Dimension        | Subagents                                      | Agent Teams                                         |
| :--------------- | :--------------------------------------------- | :-------------------------------------------------- |
| **Context**      | Own context; results return to caller          | Own context; fully independent                      |
| **Communication**| Report back to main agent only                 | Teammates message each other directly               |
| **Coordination** | Main agent manages all work                    | Shared task list with self-coordination             |
| **Best for**     | Focused tasks where only the result matters    | Complex work requiring discussion and collaboration |
| **Token cost**   | Lower — results summarized back to main        | Higher — each teammate is a separate Claude instance|

**Rule of thumb:** Use subagents for quick, focused workers. Use agent teams when teammates need to share findings, debate theories, or coordinate on their own.

---

## When to Use Agent Teams

**Strong use cases (parallel exploration adds real value):**
- Research and review from multiple angles simultaneously
- New modules or features where each teammate owns a separate piece
- Debugging with competing hypotheses — teammates test different theories in parallel
- Cross-layer changes (frontend / backend / tests) each owned by a different teammate

**Avoid agent teams when:**
- Tasks are sequential
- Multiple teammates would edit the same files
- Work has many dependencies between steps
- The task is routine — a single session is more cost-effective

---

## Starting a Team

Tell Claude what you need in natural language:

```
Create an agent team to explore this CLI tool design from different angles:
one teammate on UX, one on technical architecture, one playing devil's advocate.
```

Claude will:
1. Create the team and shared task list
2. Spawn teammates for each role
3. Coordinate work and synthesize results
4. Attempt to clean up when finished

---

## Display Modes

| Mode           | How it works                                        | Requirement           |
| :------------- | :-------------------------------------------------- | :-------------------- |
| `in-process`   | All teammates run in main terminal. Shift+Down to cycle. | Any terminal     |
| `tmux`/split   | Each teammate gets its own pane. Click to interact. | tmux or iTerm2 + it2 |
| `auto`(default)| Split panes if inside tmux session, else in-process | —                    |

Set globally in `~/.claude.json`:
```json
{ "teammateMode": "in-process" }
```

Or override for a single session:
```bash
claude --teammate-mode in-process
```

**Keyboard shortcuts (in-process mode):**
- `Shift+Down` — cycle through teammates
- `Enter` — view a teammate's session
- `Escape` — interrupt current turn
- `Ctrl+T` — toggle task list

---

## Controlling the Team

### Specify teammates and models
```
Create a team with 4 teammates to refactor these modules in parallel.
Use Sonnet for each teammate.
```

### Require plan approval before implementation
```
Spawn an architect teammate to refactor the authentication module.
Require plan approval before they make any changes.
```
The teammate works read-only until the lead approves. The lead can approve or reject with feedback; rejections loop the teammate back to planning.

### Talk to a teammate directly
- **In-process**: Shift+Down to reach them, type your message
- **Split panes**: click into their pane

### Assign tasks
- **Lead assigns**: tell the lead which task goes to which teammate
- **Self-claim**: teammates pick up unassigned, unblocked tasks automatically

Task claiming uses file locking to prevent race conditions.

### Shut down a teammate
```
Ask the researcher teammate to shut down
```
The teammate can approve (exit) or reject with an explanation.

### Clean up the team
```
Clean up the team
```
**Always use the lead for cleanup.** This removes shared resources. Cleanup fails if active teammates are still running — shut them down first.

---

## Context and Communication

Each teammate:
- Has its own context window
- Loads the same project context as a regular session (CLAUDE.md, MCP servers, skills)
- Receives a spawn prompt from the lead
- Does **not** inherit the lead's conversation history

**Messaging types:**
- `message` — send to one specific teammate by name
- `broadcast` — send to all teammates simultaneously (use sparingly; cost scales with team size)

Teammate messages are delivered automatically. Idle notifications bubble up to the lead automatically when a teammate finishes.

---

## Subagent Definitions as Teammate Roles

Reference a named subagent type when spawning a teammate to reuse a predefined role:

```
Spawn a teammate using the security-reviewer agent type to audit the auth module.
```

The definition's `tools` allowlist and `model` are honored. Its body is appended to the teammate's system prompt. Team coordination tools (`SendMessage`, task tools) are always available regardless of `tools` restrictions.

> Note: `skills` and `mcpServers` frontmatter fields are **not** applied when running as a teammate. Teammates load these from project/user settings like a regular session.

---

## Hooks for Quality Gates

| Hook            | Trigger                                  | Exit 2 effect                          |
| :-------------- | :--------------------------------------- | :------------------------------------- |
| `TeammateIdle`  | Teammate is about to go idle             | Send feedback and keep teammate working|
| `TaskCreated`   | A task is being created                  | Prevent creation and send feedback     |
| `TaskCompleted` | A task is being marked complete          | Prevent completion and send feedback   |

---

## Permissions

- Teammates start with the lead's permission settings
- If lead runs with `--dangerously-skip-permissions`, all teammates do too
- Per-teammate modes can be changed after spawning, not at spawn time
- Pre-approve common operations before spawning to reduce permission prompt interruptions

---

## Token Cost Considerations

Token usage scales linearly with the number of active teammates — each has its own context window. Budget accordingly:

- **3–5 teammates** is the recommended range for most workflows
- **5–6 tasks per teammate** keeps everyone productive without excessive context switching
- More teammates = more coordination overhead + diminishing returns
- For routine tasks, a single session is more cost-effective

---

## Best Practices

### 1. Give teammates enough context in the spawn prompt
Teammates don't inherit conversation history. Be explicit:
```
Spawn a security reviewer with the prompt: "Review src/auth/ for vulnerabilities.
Focus on token handling, session management, and input validation. The app uses
JWT tokens in httpOnly cookies. Report issues with severity ratings."
```

### 2. Size tasks appropriately
- **Too small**: coordination overhead exceeds the benefit
- **Too large**: risk of wasted effort without check-ins
- **Just right**: self-contained units with a clear deliverable (a function, a test file, a review)

### 3. Avoid file conflicts
Two teammates editing the same file leads to overwrites. Give each teammate exclusive ownership of different files or modules.

### 4. Start with research/review tasks
Code review, library research, and bug investigation show the value of parallel exploration without the coordination challenges of parallel implementation.

### 5. Monitor and steer
Check in on progress, redirect approaches that aren't working, and synthesize findings as they arrive. Don't let teams run unattended too long.

### 6. Wait for teammates if the lead races ahead
```
Wait for your teammates to complete their tasks before proceeding
```

### 7. Name teammates explicitly
Give teammates predictable names in the spawn instruction so you can reference them in follow-up prompts.

---

## Use Case Examples

### Parallel code review
```
Create an agent team to review PR #142. Spawn three reviewers:
- One focused on security implications
- One checking performance impact
- One validating test coverage
Have them each review and report findings.
```

### Competing hypotheses debugging
```
Users report the app exits after one message instead of staying connected.
Spawn 5 agent teammates to investigate different hypotheses. Have them talk to
each other to try to disprove each other's theories, like a scientific debate.
Update the findings doc with whatever consensus emerges.
```

### Multi-perspective design exploration
```
I'm designing a CLI tool that helps developers track TODO comments across
their codebase. Create an agent team to explore this from different angles: one
teammate on UX, one on technical architecture, one playing devil's advocate.
```

---

## Troubleshooting

| Problem | Fix |
| :------ | :-- |
| Teammates not appearing | Press Shift+Down. Check tmux is in PATH (`which tmux`). Task may not have warranted a team. |
| Too many permission prompts | Pre-approve common operations in permission settings before spawning |
| Teammate stops on error | Check output via Shift+Down or pane click; give direct instructions or spawn a replacement |
| Lead shuts down before work is done | Tell it to keep going or wait for teammates |
| Stuck task (status not updated) | Check if work is done; tell lead to nudge the teammate or update status manually |
| Orphaned tmux sessions | `tmux ls` then `tmux kill-session -t <session-name>` |

---

## Known Limitations (Experimental)

- `/resume` and `/rewind` do **not** restore in-process teammates after session resumption
- Task status can lag — teammates sometimes fail to mark tasks complete, blocking dependents
- Shutdown can be slow (waits for current request/tool call to finish)
- One team per session — clean up before starting a new one
- No nested teams — only the lead can spawn or manage teammates
- Lead is fixed for the team's lifetime — no leadership transfer
- Per-teammate permission modes cannot be set at spawn time (only changed after)
- Split panes **not** supported in VS Code integrated terminal, Windows Terminal, or Ghostty

---

## Quick Reference Card

```
Enable:       CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 in settings.json
Version:      claude --version  (need v2.1.32+)
Cycle panes:  Shift+Down
Task list:    Ctrl+T
Cleanup:      "Clean up the team" (always via lead)
Team size:    3–5 teammates, 5–6 tasks per teammate
Storage:      ~/.claude/teams/   ~/.claude/tasks/
Display mode: ~/.claude.json → { "teammateMode": "in-process" }
```

---

## Related Features

- [Subagents](https://code.claude.com/docs/en/sub-agents) — lightweight delegation within a single session
- [Git worktrees](https://code.claude.com/docs/en/common-workflows#run-parallel-claude-code-sessions-with-git-worktrees) — manual parallel sessions without automated team coordination
- [Hooks](https://code.claude.com/docs/en/hooks) — enforce quality gates on teammate and task lifecycle events
- [Settings](https://code.claude.com/docs/en/settings) — configure env vars, permissions, and display modes
