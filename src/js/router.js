// Client-side router for LocalURL SPA

class Router {
  constructor() {
    this.routes = new Map();
    this.currentPage = null;
    this.defaultRoute = 'home';
    this.init();
  }

  init() {
    // Set up hash change listener
    window.addEventListener('hashchange', () => this.handleRoute());
    window.addEventListener('load', () => this.handleRoute());
  }

  // Register a route
  register(path, handler) {
    this.routes.set(path, handler);
  }

  // Handle current route
  async handleRoute() {
    const hash = window.location.hash.slice(1); // Remove #
    const path = hash || '/';
    
    // Parse path
    const segments = path.split('/').filter(Boolean);
    
    // Check for redirect route first
    if (segments[0] === 'go' && segments[1]) {
      await this.handleRedirect(segments[1]);
      return;
    }
    
    // Determine which page to show
    let page = this.defaultRoute;
    
    if (segments.length === 0 || segments[0] === '') {
      page = 'home';
    } else if (segments[0] === 'manage') {
      page = 'manage';
    } else if (segments[0] === 'about') {
      page = 'about';
    } else if (segments[0] === 'settings') {
      page = 'settings';
    } else {
      // Default to home for unknown routes
      page = 'home';
    }
    
    // Show the page
    await this.showPage(page);
    
    // Update active navigation
    this.updateActiveNav(page);
    
    // Call route handler if registered
    if (this.routes.has(page)) {
      const handler = this.routes.get(page);
      if (typeof handler === 'function') {
        try {
          await handler();
        } catch (error) {
          console.error(`Route handler error for ${page}:`, error);
        }
      }
    }
  }

  // Show a specific page
  async showPage(pageName) {
    // Hide all pages
    const allPages = document.querySelectorAll('.page');
    allPages.forEach(page => page.classList.remove('active'));
    
    // Show target page
    const targetPage = document.getElementById(`${pageName}Page`);
    if (targetPage) {
      targetPage.classList.add('active');
      this.currentPage = pageName;
    } else {
      console.error(`Page not found: ${pageName}Page`);
    }
  }

  // Update active navigation
  updateActiveNav(pageName) {
    // Remove active class from all nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to current page link
    const activeLink = document.querySelector(`[data-page="${pageName}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
  }

  // Handle URL redirect
  async handleRedirect(slug) {
    try {
      // Import storage dynamically to avoid circular dependencies
      const { default: storage } = await import('./storage.js');
      
      // Get link by slug
      const link = await storage.getLinkBySlug(slug);
      
      if (link) {
        // Increment click count
        await storage.incrementClicks(slug);
        
        // Redirect to original URL
        window.location.href = link.originalUrl;
      } else {
        // Link not found - show error or redirect to home
        this.showPage('home');
        this.updateActiveNav('home');
        window.location.hash = '#/';
        
        // Show error message
        const { showToast } = await import('./utils.js');
        showToast(`Link not found: ${slug}`);
      }
    } catch (error) {
      console.error('Redirect error:', error);
      this.showPage('home');
      this.updateActiveNav('home');
      window.location.hash = '#/';
      
      const { showToast } = await import('./utils.js');
      showToast('Error redirecting to link');
    }
  }

  // Navigate to a route
  navigate(path) {
    if (path.startsWith('#')) {
      window.location.hash = path;
    } else {
      window.location.hash = `#${path}`;
    }
  }

  // Get current route info
  getCurrentRoute() {
    const hash = window.location.hash.slice(1);
    const path = hash || '/';
    const segments = path.split('/').filter(Boolean);
    
    return {
      path,
      segments,
      page: this.currentPage
    };
  }

  // Generate URL for a slug
  generateShortUrl(slug) {
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}#/go/${slug}`;
  }

  // Initialize with default routes
  setupDefaultRoutes() {
    // Home route
    this.register('home', () => {
      // Reset form when showing home page
      const form = document.getElementById('createUrlForm');
      if (form) {
        form.reset();
        document.getElementById('resultSection').classList.add('hidden');
        document.getElementById('qrCode').classList.add('hidden');
      }
    });

    // Manage route
    this.register('manage', async () => {
      // Load links when showing manage page
      const { loadLinks } = await import('./ui.js');
      await loadLinks();
    });

    // About route
    this.register('about', () => {
      // No special handling needed for about page
    });
  }
}

// Create and export singleton instance
const router = new Router();

// Initialize default routes
router.setupDefaultRoutes();

export default router;