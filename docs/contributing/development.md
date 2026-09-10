# Contributor Guide: Development Workflows

Thank you for contributing to DeployX! This guide outlines the development environment, Git workflows, and pull request standards.

---

## 🛠️ Setting Up Your Local Fork

1. **Fork and Clone**:
   ```bash
   git clone https://github.com/<your-username>/deployx.git
   cd deployx
   ```

2. **Install Dependencies**:
   ```bash
   # Install backend dependencies
   cd backend && npm install && cd ..
   
   # Install frontend dependencies
   cd frontend && npm install && cd ..
   ```

3. **Configure Environment Files**:
   - Create `backend/.env` with local MongoDB (`mongodb://127.0.0.1:27017/deployx`) and Redis (`127.0.0.1:6379`) settings.
   - Create `frontend/.env` with `VITE_API_BASE_URL=http://localhost:5000`.

---

## 🌿 Branching Strategy & Git Workflow

- **Main Branch (`main`)**: Production-ready code.
- **Feature Branches (`feat/<feature-name>`)**: New features and capabilities.
- **Bugfix Branches (`fix/<issue-name>`)**: Bug repairs.
- **Documentation Branches (`docs/<topic-name>`)**: Documentation updates.

### Commit Message Conventions
Follow Conventional Commits format:
```text
<type>(<scope>): <short summary>

[optional body]
```
- `feat(deployments)`: add support for yarn package manager
- `fix(domains)`: correct DNS TXT flattening logic
- `docs(api)`: update projects endpoint examples
- `test(admin)`: add integration test for user suspension

---

## 🚀 Submitting a Pull Request

1. Ensure all tests pass locally:
   ```bash
   cd backend && npm test
   cd ../frontend && npm test
   ```
2. Run linter:
   ```bash
   cd frontend && npm run lint
   ```
3. Open a Pull Request against `main` on GitHub with a clear description of the changes and testing performed.
