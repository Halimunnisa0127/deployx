# GitHub Integration Module

This module implements Phase 6.1 (GitHub Integration) of the DeployX backend. It enables users to securely connect their GitHub accounts via OAuth and retrieve their repositories and branches.

## Folder Responsibilities
- `constants/`: Configuration URLs, pagination, and sorting defaults.
- `controllers/`: Thin HTTP layer handling request extraction.
- `mappers/`: Normalizes GitHub API responses into a standard format.
- `models/`: Database schema for the GitHub account integration.
- `routes/`: Express router definitions.
- `services/`: Business logic.
- `validators/`: Zod schemas for query parameter validation.
- `webhooks/`: Placeholder for future incoming webhook processing.
- `tests/`: Module test suite.

## Authentication Flow
1. User requests `GET /integrations/github/connect`.
2. `githubAuth.service` generates a state token and returns the GitHub OAuth URL.
3. User authorizes via GitHub.
4. GitHub redirects back to `GET /integrations/github/callback` with `code` and `state`.
5. State is validated, code exchanged, and token encrypted using AES-256-GCM.

## Security Considerations
- Access tokens are encrypted using `GITHUB_TOKEN_ENCRYPTION_KEY`.
- OAuth state prevents CSRF via a TTL-indexed `OAuthState` model.

## Future GitHub App Support
The `GitHubAccount` schema contains `providerType`, `installationId`, and structured metadata to facilitate a smooth migration to GitHub Apps in the future.
