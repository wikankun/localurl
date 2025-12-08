# LocalURL

<div align="center">

![LocalURL Logo](https://img.icons8.com/color/96/000000/link.png)

**Privacy-first, fully local URL shortener**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-blue.svg)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![HTML5](https://img.shields.io/badge/HTML5-Latest-orange.svg)](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5)
[![CSS3](https://img.shields.io/badge/CSS3-Modern-green.svg)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![CI](https://github.com/wikankun/localurl/workflows/CI/badge.svg)](https://github.com/wikankun/localurl/actions)
[![Release](https://github.com/wikankun/localurl/workflows/Release/badge.svg)](https://github.com/wikankun/localurl/releases)

</div>

## 🎯 About

LocalURL is a lightweight, privacy-first URL shortener that runs entirely in your browser. **No backend, no tracking, no cloud dependencies**. All your data is stored locally using IndexedDB, making it truly private and offline-capable.

### ✨ Key Features

- 🔒 **100% Private** - Everything stays in your browser
- ⚡ **Lightning Fast** - No network calls, instant link creation
- 📱 **Works Offline** - Once loaded, works completely offline
- 🎨 **Beautiful UI** - Modern neo-brutalism design with dark mode
- 🔍 **Search & Sort** - Find your links quickly
- 📊 **Click Tracking** - Local analytics only
- 📤 **Export/Import** - Backup your links as JSON
- 🐳 **Docker Ready** - Easy deployment

## 🚀 Quick Start

**Prerequisites**:
- Node.js 16+ or pnpm (for building CSS)
- Python 3 or Node.js (for local server)
- Git (for cloning)

### Method 1: Direct Download

1. Download the latest release from [Releases](https://github.com/wikankun/localurl/releases)
2. Extract the archive
3. Open `index.html` in your web browser
4. Done! 🎉

### Method 2: Using Python

```bash
# Clone the repository
git clone https://github.com/wikankun/localurl.git
cd localurl

# Install dependencies (required for CSS build)
npm install
# or using pnpm
pnpm install

# Build the CSS
npm run build-css
# or using pnpm
pnpm run build-css

# Start a local server
python -m http.server 8000

# Open http://localhost:8000 in your browser
```

### Method 3: Using Node.js

```bash
# Clone the repository
git clone https://github.com/wikankun/localurl.git
cd localurl

# Install dependencies (required for CSS build)
npm install
# or using pnpm
pnpm install

# Build the CSS
npm run build-css
# or using pnpm
pnpm run build-css

# Install serve globally (if not already installed)
npm install -g serve

# Start the server
serve .

# Open http://localhost:3000 in your browser
```

### Method 4: Docker

```bash
git clone https://github.com/wikankun/localurl.git
cd localurl
docker build -t localurl .
docker run -p 8000:8000 localurl
```

## 📱 Usage

### Creating Short Links

1. **Basic Link**: Enter any URL and click "Create Short Link"
2. **Custom Slug**: Optional - enter your preferred short identifier
3. **Random Slug**: Click the dice button for a random slug
4. **Copy Link**: Use the copy button

### Managing Links

1. **View All Links**: Navigate to the Manage page
2. **Search**: Find links by slug or URL
3. **Sort**: By date, clicks, or alphabetically
4. **Edit**: Modify slug or destination URL
5. **Delete**: Remove unwanted links
6. **Analytics**: View click counts and creation dates

### Settings & Data

- **Dark Mode**: Toggle between light and dark themes
- **Export Links**: Download all links as JSON backup
- **Import Links**: Restore from JSON file
- **Clear Data**: Delete all stored links
- **Statistics**: View total links and clicks

## 🏗️ Architecture

LocalURL is built with modern web technologies:

- **HTML5** - Semantic markup
- **Tailwind CSS** - Utility-first CSS with custom neo-brutalism design
- **JavaScript ES6+** - Modern JavaScript features
- **IndexedDB** - Client-side database for persistence
- **Service Worker** - Optional offline support

### File Structure

```
localurl/
├── index.html              # Main application file
├── src/
│   ├── css/
│   │   ├── input.css       # Tailwind input styles
│   │   ├── output.css      # Generated Tailwind styles
│   │   └── variables.css   # Legacy CSS custom properties (deprecated)
│   ├── js/
│   │   ├── utils.js        # Utility functions
│   │   ├── storage.js      # IndexedDB operations
│   │   ├── router.js       # Client-side routing
│   │   ├── ui.js           # UI controller
│   │   └── app.js          # Main application entry
│   └── assets/
│       └── icons/          # Icons and images
├── tailwind.config.js      # Tailwind configuration
├── postcss.config.js       # PostCSS configuration
├── package.json            # Node.js dependencies and scripts
├── Dockerfile              # Docker configuration
├── docker-compose.yml      # Docker Compose setup
└── README.md               # This file
```

## 🚀 Deployment

### Static Hosting

Deploy to any static hosting service:

- **Netlify**: Drag and drop the folder
- **Vercel**: Connect your GitHub repository
- **GitHub Pages**: Enable GitHub Pages in repository settings
- **Surge.sh**: `surge .` in the project directory
- **Firebase Hosting**: `firebase deploy`

### Docker

```bash
# Build image
docker build -t localurl .

# Run container
docker run -d -p 8000:8000 --name localurl localurl

# With Docker Compose
docker-compose up -d
```

### Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

### Self-Hosted Binary

For easy deployment without Docker:

```bash
# Using a simple HTTP server
python3 -m http.server 8000 --directory /path/to/localurl

# Or with Node.js serve
npx serve /path/to/localurl -p 8000
```

## 🔄 CI/CD

This project uses GitHub Actions for automated testing, releasing, and deployment:

### Workflow Overview

1. **CI Workflow** (`ci.yml`)
   - Runs on every push and pull request
   - Lints CSS with stylelint
   - Validates HTML and JavaScript syntax
   - Builds CSS to catch compilation errors
   - Performs security scans
   - Checks bundle sizes

2. **Release Workflow** (`release.yml`)
   - Automatically creates releases based on conventional commits
   - Generates version numbers (semantic versioning)
   - Creates detailed release notes from commit messages
   - Tags releases and uploads distribution files

3. **Deploy Workflow** (`deploy.yml`)
   - Deploys to GitHub Pages on release
   - Optimizes files for production
   - Sets up SPA routing with 404.html
   - Verifies deployment success

### Conventional Commits

Follow this format for automatic version bumping:

```
feat: add new feature           # Minor version bump
fix: resolve bug                # Patch version bump
feat!: breaking change          # Major version bump
chore: update dependencies      # No version bump
docs: update documentation      # No version bump
```

### Setup Instructions

For the workflows to function properly, ensure:

1. **Repository Settings**:
   - Go to Settings → Actions → General
   - Enable "Allow GitHub Actions to create and approve pull requests"
   - Enable "Allow GitHub Actions to run workflows and create comments"
   - Set "Workflow permissions" to "Read and write permissions"

2. **GitHub Pages** (for deployment):
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: `gh-pages` (will be created automatically)
   - Folder: `/ (root)`

3. **Branch Protection** (optional):
   - Go to Settings → Branches
   - Add rule for `main` branch
   - Require status checks to pass before merging
   - Include: `CI`, `Analyze Commits`

## 🔧 Development

### Prerequisites

- Modern web browser with IndexedDB support
- Local web server (see Quick Start)

### Development Setup

```bash
# Clone the repository
git clone https://github.com/wikankun/localurl.git
cd localurl

# Install Node.js dependencies
npm install

# Start development server (with live CSS compilation)
npm run dev
# or use Python directly
python -m http.server 8000

# Open http://localhost:8000
```

### Build for Production

```bash
# Build the CSS (required - the app uses Tailwind CSS)
npm run build-css

# The output.css file will be generated in src/css/output.css
# This file contains all the optimized Tailwind CSS
# Note: The application won't display correctly without this step
```

### Code Style

The project follows these conventions:

- **ES6+ JavaScript** with modern features
- **Tailwind CSS** with custom neo-brutalism design system
- **Custom Tailwind utilities** for neo-brutalism effects
- **Mobile-first responsive design**
- **Semantic HTML** wherever possible

### Browser Support

LocalURL works in all modern browsers that support:

- IndexedDB (for storage)
- ES6+ JavaScript features
- CSS Custom Properties
- Fetch API

## 📊 Data Storage

### IndexedDB Schema

```javascript
// Link Object
{
  id: "link_1640995200000_abc123def",
  slug: "my-link",
  originalUrl: "https://example.com/very/long/url",
  createdAt: "2022-01-01T00:00:00.000Z",
  clicks: 42,
  customSlug: false
}
```

### Export Format

```json
{
  "version": "1.0",
  "exportedAt": "2022-01-01T00:00:00.000Z",
  "links": [
    {
      "id": "link_...",
      "slug": "my-link",
      "originalUrl": "https://example.com",
      "createdAt": "2022-01-01T00:00:00.000Z",
      "clicks": 10,
      "customSlug": true
    }
  ]
}
```

## 🔒 Privacy

### What We Don't Do

- ❌ No tracking or analytics
- ❌ No data collection
- ❌ No external API calls
- ❌ No cookies
- ❌ No server-side processing
- ❌ No third-party dependencies

### What We Do

- ✅ Store data locally in IndexedDB
- ✅ Work offline once loaded
- ✅ Optional local event logging for debugging
- ✅ Transparent, open-source code

### Data Security

- All data remains in your browser
- IndexedDB is sandboxed per domain
- No network requests except for your URLs
- No server-side storage or processing

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guidelines](CONTRIBUTING.md) before getting started.

### How to Contribute

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly in multiple browsers
5. Commit your changes (`git commit -m 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

### Development Guidelines

- Keep it simple and lightweight
- No external dependencies in production
- Maintain browser compatibility
- Test your changes thoroughly
- Follow the existing code style

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) - Powerful client-side storage
- [CSS Custom Properties](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_custom_properties) - Dynamic theming
- [Service Workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API) - Offline capabilities
- The open-source community

## 🔗 Links

- [Homepage](https://github.com/wikankun/localurl)
- [Documentation](https://github.com/wikankun/localurl/wiki)
- [Issues](https://github.com/wikankun/localurl/issues)
- [Releases](https://github.com/wikankun/localurl/releases)

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/wikankun/localurl/issues) page
2. Search existing discussions
3. Create a new issue with details
4. Include browser version and steps to reproduce

---

<div align="center">

**Made with ❤️ for privacy-conscious users**

[⭐ Star this repo](https://github.com/wikankun/localurl) | [🐛 Report Issues](https://github.com/wikankun/localurl/issues) | [💡 Suggest Features](https://github.com/wikankun/localurl/discussions)

</div>
