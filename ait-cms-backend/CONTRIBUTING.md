# Contributing to AIT Smart Campus

Thank you for your interest in contributing to AIT Smart Campus! This document provides guidelines and instructions for contributing.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Commit Messages](#commit-messages)

## Code of Conduct

This project adheres to a Code of Conduct that all contributors are expected to follow. Please be respectful and constructive in all interactions.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/ait-cms-backend.git
   cd ait-cms-backend
   ```
3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/ORIGINAL_OWNER/ait-cms-backend.git
   ```
4. **Install dependencies**:
   ```bash
   npm install
   ```
5. **Set up your environment**:
   ```bash
   cp .env.example .env
   docker-compose up -d
   npm run db:push
   npm run db:seed
   ```

## Development Workflow

1. **Sync with upstream**:

   ```bash
   git fetch upstream
   git checkout main
   git merge upstream/main
   ```

2. **Create a feature branch**:

   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes** and ensure:
   - Code compiles without errors (`npm run build`)
   - Linter passes (`npm run lint`)
   - Tests pass (`npm run test`)

4. **Commit your changes** following our [commit message guidelines](#commit-messages)

5. **Push to your fork**:

   ```bash
   git push origin feature/your-feature-name
   ```

6. **Open a Pull Request** against the `main` branch

## Pull Request Process

1. **Title**: Use a clear, descriptive title
2. **Description**: Explain what changes you made and why
3. **Screenshots**: Include if there are visual changes
4. **Testing**: Describe how you tested your changes
5. **Breaking changes**: Clearly mark if your PR contains breaking changes

### PR Checklist

- [ ] Code follows the project's coding standards
- [ ] Self-review completed
- [ ] Code compiles without warnings
- [ ] Tests added/updated as needed
- [ ] Documentation updated if needed
- [ ] Commit messages follow guidelines

## Coding Standards

### TypeScript

- Use **TypeScript strict mode**
- Prefer **interfaces** over type aliases for object shapes
- Use **async/await** over raw promises
- Avoid `any` type — use `unknown` and type guards instead

### NestJS

- Follow NestJS module structure
- Use **dependency injection**
- Keep controllers thin — business logic in services
- Use **DTOs** with class-validator for input validation

### Formatting

- **Prettier** handles code formatting
- **ESLint** handles linting
- Run `npm run lint` before committing

### File Naming

- Use **kebab-case** for file names: `user-profile.service.ts`
- Use **PascalCase** for classes: `UserProfileService`
- Use **camelCase** for variables and functions

## Commit Messages

We follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Types

| Type       | Description                |
| ---------- | -------------------------- |
| `feat`     | New feature                |
| `fix`      | Bug fix                    |
| `docs`     | Documentation only         |
| `style`    | Formatting, no code change |
| `refactor` | Code restructuring         |
| `test`     | Adding tests               |
| `chore`    | Maintenance tasks          |

### Examples

```
feat(auth): add refresh token rotation
fix(attendance): resolve bulk marking race condition
docs(readme): update installation instructions
refactor(users): extract validation logic to guard
```

---

## Questions?

If you have questions, feel free to:

- Open a **Discussion** on GitHub
- Create an **Issue** for bugs or feature requests

Thank you for contributing! 🎉
