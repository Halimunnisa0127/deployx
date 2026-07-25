# Git Rules

## Purpose

Define the Git standards for DeployX.

Keep version history clean, meaningful, and easy to review.

---

# Branches

Follow the project's branching strategy.

Keep feature work isolated from the main development branch.

Never work directly on protected branches unless explicitly required.

---

# Commits

Always

- Write meaningful commit messages
- Keep commits focused on a single logical change
- Make commits small and reviewable
- Use consistent commit naming

Examples

- feat: add deployment sidebar
- fix: resolve authentication redirect
- refactor: extract reusable modal
- docs: update architecture
- chore: update dependencies

Never

- Mix unrelated changes in one commit
- Commit temporary debugging code
- Commit commented-out code

---

# Files

Never commit

- node_modules
- .env
- Build output
- Generated files
- Temporary files
- Local IDE configuration (unless shared by the project)

---

# Before Commit

Verify

- Code builds successfully
- No unnecessary files included
- No unused imports
- No debug statements
- Only intended files changed

---

# Before Push

Verify

- Build succeeds
- Lint passes (if configured)
- Tests pass (when available)
- Review changed files

---

# Pull Requests

Always

- Keep changes focused
- Provide a clear description
- Explain the purpose of the change
- Keep pull requests reasonably sized

Never

- Submit unrelated changes together
- Leave merge conflicts unresolved

---

# Rules

Always

- Keep history clean
- Prefer small commits
- Review changes before pushing
- Follow project conventions

Never

- Rewrite shared history without approval
- Commit secrets
- Commit unnecessary files