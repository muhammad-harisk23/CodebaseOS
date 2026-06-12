# Contributing to CodebaseOS

We welcome contributions from the community. Whether you're fixing a bug, adding a feature, or improving documentation, your help is appreciated.

---

## Code of Conduct

This project adheres to the [Contributor Covenant](https://www.contributor-covenant.org) code of conduct. By participating, you agree to maintain a respectful and inclusive environment.

---

## How to Contribute

### 1. Fork the Repository

```bash
git clone https://github.com/muhammad-harisk23/CodebaseOS.git
cd CodebaseOS
git checkout -b feature/your-feature-name
```

### 2. Set Up Development Environment

Follow the [SETUP.md](SETUP.md) guide to get the project running locally.

### 3. Make Your Changes

- Write clean, typed TypeScript.
- Follow existing code style (2-space indentation, meaningful variable names).
- Add comments for complex logic.
- Ensure no TypeScript compilation errors: `cd backend && npx tsc --noEmit`.

### 4. Test Your Changes

```bash
cd backend && npx tsc --noEmit
```

Verify the API works by running the server and testing endpoints.

### 5. Submit a Pull Request

1. Push your branch: `git push origin feature/your-feature-name`.
2. Open a pull request against `main`.
3. Describe what your changes do and why.
4. Link any related issues.

---

## Development Guidelines

### Project Structure

```
CodebaseOS/
├── backend/          # Node.js + Express + TypeScript API
│   ├── src/
│   │   ├── config/       # Environment, database config
│   │   ├── controllers/  # Express route handlers
│   │   ├── middleware/    # Error handling middleware
│   │   ├── models/       # Mongoose models
│   │   ├── routes/       # Express routes
│   │   ├── services/     # Business logic
│   │   └── utils/        # Logger, helpers
│   ├── docs/             # Technical documentation
│   └── uploads/          # ZIP upload storage
├── frontend/         # Next.js + TypeScript frontend
├── docs/             # Root documentation
│   (README.md, ARCHITECTURE.md, etc.)
└── screenshots/      # Demo screenshots
```

### Coding Standards

| Requirement | Standard |
|-------------|----------|
| Language | TypeScript |
| Indentation | 2 spaces |
| Semicolons | Required |
| Imports | Grouped: external → internal |
| Types | Prefer interfaces over `any` |
| Error handling | Use `AppError` class |
| Logging | Use `logger` from utils |

### Pull Request Checklist

- [ ] Code compiles without errors (`npx tsc --noEmit`)
- [ ] Follows existing code style
- [ ] Includes necessary tests/documentation
- [ ] PR description clearly explains the change

---

## Feature Requests

Open an issue with the label `enhancement`. Describe:

- What problem does it solve?
- How should it work?
- Any implementation ideas?

---

## Bug Reports

Open an issue with the label `bug`. Include:

- Steps to reproduce
- Expected behavior
- Actual behavior
- Environment (OS, Node version, browser)

---

## Documentation

Improvements to documentation are always welcome. This includes:

- README updates
- API documentation
- Architecture decisions
- Setup guides
- Comments in complex code

---

## Questions

Open a discussion or issue with the label `question`.

---

Thank you for contributing to CodebaseOS.