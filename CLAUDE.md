# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LocalURL is a lightweight, privacy-first, fully local URL shortener that runs entirely in the browser. No backend, no tracking, data stored only in IndexedDB. This is a vanilla JavaScript application with zero dependencies.

## Architecture

### Core Components

1. **Storage Layer** (`src/js/storage.js`)
   - IndexedDB wrapper for URL data persistence
   - Handles CRUD operations for links
   - Manages data migration and versioning

2. **Router** (`src/js/router.js`)
   - Client-side routing for SPA experience
   - Handles routes: `/` (create), `/manage` (link manager), `/settings`, `/about`
   - Optional: `/go/:slug` for redirect handling

3. **Main App** (`src/js/app.js`)
   - Application entry point and initialization
   - Coordinates between components
   - Handles global state and events

4. **Modules**
   - `qr.js`: QR code generation (optional feature)
   - `utils.js`: Shared utility functions
   - `ui.js`: UI manipulation helpers

### Data Model

```javascript
// Link object stored in IndexedDB
{
  id: string,           // Unique identifier
  slug: string,         // Short URL identifier
  originalUrl: string,  // Destination URL
  createdAt: Date,      // Creation timestamp
  clicks: number,       // Click counter (local only)
  customSlug: boolean   // Whether slug is user-defined
}
```

## Development Commands

```bash
# Serve the application locally
python -m http.server 8000
# or
npx serve .

# Run tests
open tests/index.html in browser

# Build for production
npm run build  # Minifies CSS/JS if build tools are added

# Lint code
npm run lint   # If ESLint is configured
```

## Key Implementation Details

### CSS Architecture
- Uses CSS custom properties for theming (see `src/css/variables.css`)
- 4px grid system for spacing
- Mobile-first responsive design
- Dark mode support via `data-theme` attribute

### IndexedDB Schema
- Database name: `localurl_db`
- Version: 1
- Object store: `links`
- Indexes: `slug` (unique), `createdAt`

### State Management
- No external state library
- Uses custom events for component communication
- UI state managed through DOM attributes and classes

## Security Considerations

- All URL validation happens client-side
- Sanitize all URL inputs to prevent XSS
- No external network requests except for user URLs
- Clear error messages without exposing internals

## Testing Strategy

- Unit tests for storage operations
- Integration tests for routing
- Manual testing for IndexedDB persistence
- Cross-browser compatibility checks
- Lighthouse performance audits

## Deployment

This application can be deployed as:
1. Static files on any web server
2. Docker container with embedded HTTP server
3. Single HTML file (all inlined)
4. NPM package for embedding in other projects

## Important Constraints

- No external dependencies in production
- Must work offline once loaded
- All data remains local to the browser
- Single page application with no backend
- Minimum browser support: Modern browsers with IndexedDB