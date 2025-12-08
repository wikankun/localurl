# Contributing to LocalURL

Thank you for your interest in contributing to LocalURL! This document provides guidelines and information for contributors.

## 🤝 Welcome!

LocalURL is a privacy-first, fully local URL shortener that runs entirely in the browser. We welcome contributions from the community and appreciate all forms of help.

## 📋 Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [How to Contribute](#how-to-contribute)
- [Code Guidelines](#code-guidelines)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)
- [Code of Conduct](#code-of-conduct)
- [Getting Help](#getting-help)

## 🚀 Getting Started

### Prerequisites

- A modern web browser with IndexedDB support
- Git installed locally
- Basic understanding of HTML, CSS, and JavaScript
- Node.js (>=16.0.0) for development tools

### First Time Setup

1. **Fork the Repository**
   ```bash
   # Fork the repository on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/localurl.git
   cd localurl
   ```

2. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/wikan/localurl.git
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Open in Browser**
   Navigate to `http://localhost:8000`

## 🛠️ Development Setup

### Local Development

The project uses a simple development setup with:

- **Tailwind CSS** for styling with live compilation
- **Python HTTP Server** for local serving
- **Concurrently** to run multiple processes

```bash
# Start development with CSS watching
npm run dev

# Or start the server manually
python3 -m http.server 8000
```

### Project Structure

```
localurl/
├── index.html              # Main application entry
├── src/
│   ├── css/
│   │   ├── input.css       # Tailwind input styles
│   │   └── output.css      # Generated styles (don't edit)
│   ├── js/
│   │   ├── app.js          # Main application logic
│   │   ├── storage.js      # IndexedDB operations
│   │   ├── router.js       # Client-side routing
│   │   ├── ui.js           # UI controllers
│   │   └── utils.js        # Utility functions
│   └── assets/
│       └── icons/          # Icons and images
├── .github/                # GitHub templates and configs
├── tailwind.config.js      # Tailwind configuration
└── package.json            # Project metadata
```

## 🎯 How to Contribute

### Reporting Issues

1. Check if the issue already exists
2. Use the [Bug Report](.github/issue_template/bug_report.md) template
3. Provide detailed reproduction steps
4. Include browser version and OS information

### Suggesting Features

1. Check for existing feature requests
2. Use the [Feature Request](.github/issue_template/feature_request.md) template
3. Explain the problem you're trying to solve
4. Consider alternative solutions

### Contributing Code

1. **Choose an Issue**
   - Look for issues labeled `good first issue` for beginners
   - For experienced contributors, look at `help wanted` or `bug` labels

2. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

3. **Make Your Changes**
   - Follow the [Code Guidelines](#code-guidelines)
   - Keep changes focused and minimal
   - Test thoroughly

4. **Test Your Changes**
   - Test in multiple browsers (Chrome, Firefox, Safari, Edge)
   - Test on mobile devices if possible
   - Verify existing functionality still works

5. **Commit Your Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

## 📝 Code Guidelines

### JavaScript Standards

- Use **ES6+** features (const/let, arrow functions, template literals)
- Follow **camelCase** naming convention for variables and functions
- Use **descriptive names** for functions and variables
- Add **JSDoc comments** for complex functions
- Keep functions **small and focused** (single responsibility)

Example:
```javascript
/**
 * Validates if a URL is properly formatted
 * @param {string} url - The URL to validate
 * @returns {boolean} - True if valid, false otherwise
 */
function isValidUrl(url) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}
```

### CSS Guidelines

- Use **Tailwind CSS** utilities whenever possible
- Avoid custom CSS unless absolutely necessary
- Follow **mobile-first** responsive design
- Use **semantic HTML** elements
- Maintain the **neo-brutalism** design system

### HTML Standards

- Use **semantic HTML5** elements
- Include **proper ARIA labels** for accessibility
- Ensure **keyboard navigation** support
- Add **alt attributes** to all images
- Use **proper heading hierarchy**

### File Naming

- Use **kebab-case** for file names
- Be descriptive but concise
- Group related files in directories

## 🧪 Testing

### Manual Testing Checklist

- [ ] Application loads without errors
- [ ] All navigation links work
- [ ] Create short link functionality works
- [ ] Custom slugs function correctly
- [ ] Search and filtering work
- [ ] Dark mode toggle works
- [ ] Export/Import functionality works
- [ ] Responsive design works on mobile
- [ ] Data persists after browser refresh

### Cross-Browser Testing

Test your changes in:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Android Chrome)

## 📤 Submitting Changes

### Pull Request Process

1. **Update Your Branch**
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

2. **Create Pull Request**
   - Use the [PR Template](.github/pull_request_template.md)
   - Fill in all required sections
   - Link related issues
   - Add screenshots for UI changes

3. **Code Review**
   - Respond to review comments promptly
   - Make requested changes
   - Be open to suggestions

4. **Merge**
   - Once approved, maintainers will merge your PR
   - Your contribution will be included in the next release

### Commit Message Format

Use conventional commits:

- `feat:` - New features
- `fix:` - Bug fixes
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code refactoring
- `test:` - Adding or updating tests
- `chore:` - Maintenance tasks

Examples:
```bash
git commit -m "feat: add keyboard shortcuts for power users"
git commit -m "fix: resolve slug validation edge case"
git commit -m "docs: update README with installation instructions"
```

## 📜 Code of Conduct

### Our Pledge

We are committed to making participation in our community a harassment-free experience for everyone, regardless of:

- Age, body size, disability, ethnicity, gender identity and expression
- Level of experience, nationality, personal appearance
- Race, religion, or sexual identity and expression

### Our Standards

**Positive Behavior:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints and experiences
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable Behavior:**
- Harassment, public or private
- Using sexualized language or imagery
- Trolling, insulting/derogatory comments
- Personal or political attacks
- Publishing private information without explicit permission

### Enforcement

Project maintainers have the right and responsibility to remove, edit, or reject comments, commits, code, wiki edits, issues, and other contributions that are not aligned with this Code of Conduct.

## 💡 Getting Help

### Resources

- **[Documentation](README.md)** - Main project documentation
- **[Issues](https://github.com/wikan/localurl/issues)** - Open issues and discussions
- **[Discussions](https://github.com/wikan/localurl/discussions)** - General discussions
- **[Wiki](https://github.com/wikan/localurl/wiki)** - Additional documentation

### Contact

- Create an issue for bugs or feature requests
- Start a discussion for general questions
- Tag maintainers for urgent matters

## 🎉 Recognition

Contributors are recognized in several ways:

- **Contributors list** in the README
- **Release notes** mention significant contributions
- **Special recognition** for major features
- **Community appreciation** through discussions and issues

## 📄 License

By contributing, you agree that your contributions will be licensed under the [MIT License](LICENSE).

---

Thank you for contributing to LocalURL! Your help makes this project better for everyone. 🙏