# Contributing to Cloudflare Status Dashboard

First off, thank you for considering contributing to the Cloudflare Status Dashboard! It's people like you that make this project better for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Pull Requests](#pull-requests)
- [Development Setup](#development-setup)
- [Style Guidelines](#style-guidelines)
- [Community](#community)

## Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior via [GitHub Issues](https://github.com/wbfoss/cf-status-dashboard/issues).

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the [existing issues](https://github.com/wbfoss/cf-status-dashboard/issues) as you might find that the issue has already been reported.

When creating a bug report, please include as many details as possible:

**Use the bug report template and include:**
- A clear and descriptive title
- Steps to reproduce the behavior
- Expected behavior vs actual behavior
- Screenshots if applicable
- Your environment (browser, OS, screen size)
- Any error messages from the browser console

### Suggesting Enhancements

Enhancement suggestions are tracked as [GitHub Issues](https://github.com/wbfoss/cf-status-dashboard/issues).

**When suggesting an enhancement:**
- Use a clear and descriptive title
- Provide a detailed description of the proposed feature
- Explain why this enhancement would be useful
- Include mockups or examples if possible

### Pull Requests

1. **Fork the repository** and create your branch from `main`
2. **Install dependencies**: `npm install`
3. **Make your changes** following our style guidelines
4. **Test your changes**: `npm run build`
5. **Commit your changes** with a descriptive commit message
6. **Push to your fork** and submit a pull request

**Pull Request Guidelines:**
- Fill in the pull request template
- Reference any related issues
- Include screenshots for UI changes
- Ensure the build passes
- Keep pull requests focused - one feature/fix per PR

## Development Setup

### Prerequisites

- Node.js 18 or higher
- npm, yarn, or pnpm

### Getting Started

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/cf-status-dashboard.git
cd cf-status-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |

### Project Structure

```
src/
├── app/                    # Next.js pages and layouts
├── components/            # React components
└── lib/                   # Utilities, types, and data
```

## Style Guidelines

### TypeScript

- Use TypeScript for all new code
- Define proper types/interfaces for all data structures
- Avoid `any` type when possible

### React

- Use functional components with hooks
- Keep components focused and reusable
- Use meaningful component and variable names

### CSS

- Use Tailwind CSS utility classes
- Use CSS custom properties for theme colors (defined in `globals.css`)
- Follow mobile-first responsive design

### Commit Messages

- Use present tense ("Add feature" not "Added feature")
- Use imperative mood ("Move cursor to..." not "Moves cursor to...")
- Keep the first line under 72 characters
- Reference issues and pull requests when relevant

**Examples:**
```
Add region filter to world map

Fix tooltip positioning on mobile

Update data center coordinates for Asia region
```

## Adding Data Center Coordinates

One valuable contribution is adding missing data center coordinates to `src/lib/datacenters.ts`:

```typescript
// Format: AIRPORT_CODE: [longitude, latitude]
NEW: [-73.7781, 40.6413],  // New York (example)
```

To find coordinates:
1. Search for the airport code on Google Maps
2. Right-click and select "What's here?"
3. Copy the coordinates (longitude first, then latitude)

## Community

- **Questions?** Open a [Discussion](https://github.com/wbfoss/cf-status-dashboard/discussions)
- **Found a bug?** Open an [Issue](https://github.com/wbfoss/cf-status-dashboard/issues)
- **Want to contribute?** Submit a [Pull Request](https://github.com/wbfoss/cf-status-dashboard/pulls)

## Recognition

Contributors will be recognized in:
- The GitHub contributors page
- Release notes for significant contributions

Thank you for contributing!

---

An open source project by [wbfoss.org](https://wbfoss.org)
