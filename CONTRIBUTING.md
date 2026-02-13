# Contributing to AIT Smart Campus Management System

Thank you for your interest in contributing to the **AIT Smart Campus Management System**! We welcome contributions from students, faculty, and developers to make this platform better for everyone.

## 🚀 Getting Started

1.  **Fork the Repository**: Click the "Fork" button on the top right of the GitHub repository.
2.  **Clone your Fork**:
    ```bash
    git clone https://github.com/YOUR_USERNAME/AIT_CMS.git
    cd AIT_CMS
    ```
3.  **Set Up Development Environment**:
    - Follow the setup instructions in the [README.md](./README.md).
    - Ensure you have Node.js (v20+), Docker, and npm/pnpm installed.

## 🛠️ Development Workflow

1.  **Create a Branch**: Always create a new branch for your changes.
    ```bash
    git checkout -b feature/amazing-feature
    # or
    git checkout -b fix/critical-bug
    ```
2.  **Make Changes**: Write clean, maintainable code.
    - **Frontend**: React 19, TypeScript, TailwindCSS.
    - **Backend**: NestJS, Prisma, TypeScript.
3.  **Commit Changes**: Use descriptive commit messages.
    ```bash
    git commit -m "feat: add real-time notification support"
    ```
4.  **Push and Pull Request**:
    ```bash
    git push origin feature/amazing-feature
    ```

    - Open a Pull Request (PR) on the main repository.
    - Describe your changes clearly and link any related issues.

## 📐 Coding Standards

### General

- **TypeScript**: Use strict typing. Avoid `any` whenever possible.
- **Formatting**: We use Prettier. Run `npm run format` locally if unsure.
- **Linting**: Ensure `npm run lint` passes before pushing.

### Backend (NestJS)

- Follow the modular architecture (e.g., `src/modules/xyz`).
- Use DTOs (Data Transfer Objects) for all API payloads.
- Add appropriate decorators (`@Roles`, `@Get`, etc.) for controllers.

### Frontend (React)

- Use Functional Components with Hooks.
- Keep components small and reusable.
- Use Tailwind utility classes for styling.

## 🐞 Reporting Bugs

If you find a bug, please open an issue on GitHub with:

1.  **Description**: What went wrong?
2.  **Steps to Reproduce**: How can we see it too?
3.  **Expected Behavior**: What should have happened?
4.  **Screenshots**: Visual proof is always helpful.

## 💡 Feature Requests

Have an idea? Open an issue with the **Enhancement** label. Describe the feature and why it would be useful for the AIT campus.

---

**Happy Coding!** 🎓
