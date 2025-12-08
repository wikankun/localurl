// Main application entry point for LocalURL

import storage from './storage.js';
import router from './router.js';
import ui from './ui.js';

class LocalURLApp {
  constructor() {
    this.isInitialized = false;
    this.initPromise = null;
  }

  async init() {
    // Prevent multiple initializations
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = this._doInit();
    return this.initPromise;
  }

  async _doInit() {
    try {
      console.log('🚀 Initializing LocalURL...');
      
      // Show loading state
      this.showLoadingState();
      
      // Initialize storage
      console.log('📦 Initializing storage...');
      await storage.init();
      
      // Check for redirect handler
      await this.checkForRedirect();
      
      // Initialize UI
      console.log('🎨 Initializing UI...');
      // UI is automatically initialized when ui.js is imported
      
      // Set up global error handlers
      this.setupErrorHandlers();
      
      // Set up keyboard shortcuts
      this.setupKeyboardShortcuts();
      
      // Hide loading state
      this.hideLoadingState();
      
      this.isInitialized = true;
      console.log('✅ LocalURL initialized successfully!');
      
      // Track app initialization
      this.trackEvent('app_initialized');
      
    } catch (error) {
      console.error('❌ Failed to initialize LocalURL:', error);
      this.showErrorState(error);
      throw error;
    }
  }

  async checkForRedirect() {
    const hash = window.location.hash.slice(1);
    const segments = hash.split('/').filter(Boolean);
    
    // Handle direct redirects on page load
    if (segments[0] === 'go' && segments[1]) {
      console.log(`🔗 Handling redirect to slug: ${segments[1]}`);
      // Router will handle this automatically
    }
  }

  showLoadingState() {
    // You could add a loading spinner here if needed
    document.body.classList.add('loading');
  }

  hideLoadingState() {
    document.body.classList.remove('loading');
  }

  showErrorState(error) {
    const errorHtml = `
      <div style="
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #fee;
        border: 2px solid #fcc;
        border-radius: 8px;
        padding: 20px;
        max-width: 400px;
        text-align: center;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
      ">
        <h2 style="color: #c33; margin-bottom: 10px;">⚠️ Oops! Something went wrong</h2>
        <p style="color: #666; margin-bottom: 15px;">LocalURL failed to initialize properly.</p>
        <details style="text-align: left; margin-bottom: 15px;">
          <summary style="cursor: pointer; color: #369;">Technical details</summary>
          <pre style="margin-top: 10px; padding: 10px; background: #f5f5f5; border-radius: 4px; overflow-x: auto; font-size: 12px;">${error.stack || error.message}</pre>
        </details>
        <button onclick="location.reload()" style="
          background: #3b82f6;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
        ">Reload Page</button>
      </div>
    `;
    
    document.body.innerHTML = errorHtml;
  }

  setupErrorHandlers() {
    // Global error handler
    window.addEventListener('error', (event) => {
      console.error('Global error:', event.error);
      this.trackEvent('javascript_error', {
        message: event.error.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason);
      this.trackEvent('promise_rejection', {
        reason: event.reason?.message || event.reason
      });
    });
  }

  setupKeyboardShortcuts() {
    document.addEventListener('keydown', (event) => {
      // Only handle shortcuts when not typing in inputs
      if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
        return;
      }

      // Ctrl/Cmd + K for search (when on manage page)
      if ((event.ctrlKey || event.metaKey) && event.key === 'k') {
        event.preventDefault();
        if (router.getCurrentRoute().page === 'manage') {
          const searchInput = document.getElementById('searchInput');
          if (searchInput) {
            searchInput.focus();
          }
        }
      }

      // Ctrl/Cmd + N for new link (when not on home page)
      if ((event.ctrlKey || event.metaKey) && event.key === 'n') {
        event.preventDefault();
        if (router.getCurrentRoute().page !== 'home') {
          router.navigate('/');
          const urlInput = document.getElementById('originalUrl');
          if (urlInput) {
            setTimeout(() => urlInput.focus(), 100);
          }
        }
      }

      // Escape to close modals
      if (event.key === 'Escape') {
        const openModal = document.querySelector('.modal:not(.hidden)');
        if (openModal) {
          const closeBtn = openModal.querySelector('.modal-close');
          if (closeBtn) {
            closeBtn.click();
          }
        }
      }

      // ? for keyboard shortcuts help
      if (event.key === '?' && !event.shiftKey) {
        event.preventDefault();
        this.showKeyboardShortcuts();
      }
    });
  }

  showKeyboardShortcuts() {
    const shortcuts = [
      ['Ctrl/Cmd + K', 'Search links (Manage page)'],
      ['Ctrl/Cmd + N', 'New link (when not on Home)'],
      ['Escape', 'Close modal'],
      ['?', 'Show this help']
    ];

    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h2 class="modal-title">⌨️ Keyboard Shortcuts</h2>
          <button class="modal-close">✕</button>
        </div>
        <div class="modal-body">
          <div style="display: grid; gap: 12px;">
            ${shortcuts.map(([key, desc]) => `
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid var(--color-border);">
                <code style="background: var(--color-surface-2); padding: 4px 8px; border-radius: 4px; font-family: var(--font-family-mono);">${key}</code>
                <span style="color: var(--color-text-secondary);">${desc}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    // Set up close handlers
    const overlay = modal.querySelector('.modal-overlay');
    const closeBtn = modal.querySelector('.modal-close');

    const closeModal = () => {
      document.body.removeChild(modal);
    };

    overlay.addEventListener('click', closeModal);
    closeBtn.addEventListener('click', closeModal);
  }

  trackEvent(eventName, properties = {}) {
    // This method uses the UI controller's tracking
    if (window.ui && window.ui.trackEvent) {
      window.ui.trackEvent(eventName, properties);
    } else {
      console.log('Event tracked:', { name: eventName, properties });
    }
  }

  // Get app version (you could update this manually)
  getVersion() {
    return '1.0.0';
  }

  // Get app info
  getInfo() {
    return {
      name: 'LocalURL',
      version: this.getVersion(),
      description: 'Privacy-first, fully local URL shortener',
      author: 'LocalURL Team',
      repository: 'https://github.com/your-repo/localurl'
    };
  }
}

// Create global app instance
const app = new LocalURLApp();

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => app.init());
} else {
  app.init();
}

// Make app available globally for debugging
window.app = app;
window.LocalURLApp = LocalURLApp;

// Export for module usage
export default app;