// UI Controller for LocalURL

import {
  isValidUrl,
  generateRandomSlug,
  copyToClipboard,
  formatDate,
  formatNumber,
  debounce,
  showToast,
  confirmDialog,
  sortLinks,
  filterLinks,
  generateQRCode,
  downloadAsFile,
  readFileAsText
} from './utils.js';
import storage from './storage.js';
import router from './router.js';

class UIController {
  constructor() {
    this.currentLinks = [];
    this.filteredLinks = [];
    this.currentSort = 'created-desc';
    this.currentFilter = '';
    this.init();
  }

  async init() {
    // Set up event listeners
    this.setupFormListeners();
    this.setupNavigationListeners();
    this.setupModalListeners();
    this.setupSettingsListeners();

    // Initialize theme
    this.initializeTheme();
  }

  setupFormListeners() {
    // Create URL form
    const createForm = document.getElementById('createUrlForm');
    if (createForm) {
      createForm.addEventListener('submit', (e) => this.handleCreateLink(e));
    }

    // Random slug button
    const randomSlugBtn = document.getElementById('randomSlugBtn');
    if (randomSlugBtn) {
      randomSlugBtn.addEventListener('click', () => this.generateRandomSlug());
    }

    // Copy button
    const copyBtn = document.getElementById('copyBtn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyShortUrl());
    }

    // QR code button
    const qrBtn = document.getElementById('qrBtn');
    if (qrBtn) {
      qrBtn.addEventListener('click', () => this.toggleQRCode());
    }

    // Create another button
    const createAnotherBtn = document.getElementById('createAnotherBtn');
    if (createAnotherBtn) {
      createAnotherBtn.addEventListener('click', () => this.resetForm());
    }

    // URL input validation
    const urlInput = document.getElementById('originalUrl');
    if (urlInput) {
      urlInput.addEventListener('input', debounce((e) => this.validateUrl(e.target.value), 300));
    }

    // Custom slug input validation
    const slugInput = document.getElementById('customSlug');
    if (slugInput) {
      slugInput.addEventListener('input', (e) => this.validateSlug(e.target.value));
    }
  }

  setupNavigationListeners() {
    // Settings button
    const settingsBtn = document.getElementById('settingsBtn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', (e) => {
        e.preventDefault();
        this.openSettingsModal();
      });
    }
  }

  setupModalListeners() {
    // Settings modal
    const closeSettingsBtn = document.getElementById('closeSettingsBtn');
    const modalOverlay = document.getElementById('modalOverlay');

    if (closeSettingsBtn) {
      closeSettingsBtn.addEventListener('click', () => this.closeSettingsModal());
    }

    if (modalOverlay) {
      modalOverlay.addEventListener('click', () => this.closeSettingsModal());
    }

    // Edit modal
    const closeEditBtn = document.getElementById('closeEditBtn');
    const editModalOverlay = document.getElementById('editModalOverlay');
    const cancelEditBtn = document.getElementById('cancelEditBtn');

    if (closeEditBtn) {
      closeEditBtn.addEventListener('click', () => this.closeEditModal());
    }

    if (editModalOverlay) {
      editModalOverlay.addEventListener('click', () => this.closeEditModal());
    }

    if (cancelEditBtn) {
      cancelEditBtn.addEventListener('click', () => this.closeEditModal());
    }

    // Edit form
    const editForm = document.getElementById('editForm');
    if (editForm) {
      editForm.addEventListener('submit', (e) => this.handleEditLink(e));
    }
  }

  setupSettingsListeners() {
    // Dark mode toggle
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
      darkModeToggle.addEventListener('change', (e) => this.toggleDarkMode(e.target.checked));
    }

    // Export button
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
      exportBtn.addEventListener('click', () => this.exportLinks());
    }

    // Import button
    const importBtn = document.getElementById('importBtn');
    const importFile = document.getElementById('importFile');

    if (importBtn && importFile) {
      importBtn.addEventListener('click', () => importFile.click());
      importFile.addEventListener('change', (e) => this.importLinks(e.target.files[0]));
    }

    // Clear DB button
    const clearDbBtn = document.getElementById('clearDbBtn');
    if (clearDbBtn) {
      clearDbBtn.addEventListener('click', () => this.clearDatabase());
    }
  }

  async handleCreateLink(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const originalUrl = formData.get('originalUrl').trim();
    let customSlug = formData.get('customSlug').trim();

    // Validate URL
    if (!isValidUrl(originalUrl)) {
      this.showUrlError('Please enter a valid URL');
      return;
    }

    // Generate slug if not provided
    if (!customSlug) {
      customSlug = generateRandomSlug();
    }

    try {
      // Create link
      const link = await storage.createLink({
        slug: customSlug,
        originalUrl: originalUrl,
        customSlug: !!formData.get('customSlug').trim()
      });

      // Show result
      this.showResult(link);

      // Track event
      this.trackEvent('link_created', { slug: customSlug, custom: !!formData.get('customSlug').trim() });

    } catch (error) {
      console.error('Failed to create link:', error);
      if (error.message.includes('already exists')) {
        this.showUrlError('This slug is already taken. Please choose another one.');
      } else {
        showToast('Failed to create link. Please try again.');
      }
    }
  }

  showUrlError(message) {
    const errorElement = document.getElementById('urlError');
    if (errorElement) {
      errorElement.textContent = message;
    }
  }

  validateUrl(url) {
    const errorElement = document.getElementById('urlError');
    if (!url) {
      errorElement.textContent = '';
      return;
    }

    if (!isValidUrl(url)) {
      errorElement.textContent = 'Please enter a valid URL';
    } else {
      errorElement.textContent = '';
    }
  }

  validateSlug(slug) {
    // Add visual feedback for slug validity
    const input = document.getElementById('customSlug');
    const pattern = /^[a-zA-Z0-9_-]*$/;

    if (slug && !pattern.test(slug)) {
      input.setCustomValidity('Only letters, numbers, hyphens, and underscores allowed');
    } else {
      input.setCustomValidity('');
    }
  }

  generateRandomSlug() {
    const slugInput = document.getElementById('customSlug');
    if (slugInput) {
      slugInput.value = generateRandomSlug();
      slugInput.focus();
    }
  }

  showResult(link) {
    const resultSection = document.getElementById('resultSection');
    const shortUrlInput = document.getElementById('shortUrl');

    if (resultSection && shortUrlInput) {
      const shortUrl = router.generateShortUrl(link.slug);
      shortUrlInput.value = shortUrl;
      resultSection.classList.remove('hidden');

      // Scroll to result
      resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  async copyShortUrl() {
    const shortUrlInput = document.getElementById('shortUrl');
    if (shortUrlInput) {
      const success = await copyToClipboard(shortUrlInput.value);
      if (success) {
        showToast('Short link copied to clipboard!');
        this.trackEvent('link_copied');
      } else {
        showToast('Failed to copy link. Please copy manually.');
      }
    }
  }

  async toggleQRCode() {
    const qrCodeContainer = document.getElementById('qrCode');
    const qrBtn = document.getElementById('qrBtn');

    if (!qrCodeContainer) return;

    if (qrCodeContainer.classList.contains('hidden')) {
      const shortUrlInput = document.getElementById('shortUrl');
      if (shortUrlInput) {
        qrBtn.textContent = '📱 Hide QR Code';

        // Generate QR code
        try {
          const qrDataUrl = await generateQRCode(shortUrlInput.value);
          qrCodeContainer.innerHTML = `<img src="${qrDataUrl}" alt="QR Code for ${shortUrlInput.value}">`;
          qrCodeContainer.classList.remove('hidden');

          this.trackEvent('qr_code_generated');
        } catch (error) {
          console.error('Failed to generate QR code:', error);
          showToast('Failed to generate QR code');
        }
      }
    } else {
      qrCodeContainer.classList.add('hidden');
      qrBtn.textContent = '📱 Show QR Code';
    }
  }

  resetForm() {
    const form = document.getElementById('createUrlForm');
    const resultSection = document.getElementById('resultSection');
    const qrCode = document.getElementById('qrCode');

    if (form) form.reset();
    if (resultSection) resultSection.classList.add('hidden');
    if (qrCode) qrCode.classList.add('hidden');

    // Clear error
    const errorElement = document.getElementById('urlError');
    if (errorElement) errorElement.textContent = '';
  }

  async loadLinks() {
    try {
      // Get all links
      this.currentLinks = await storage.getAllLinks();
      this.filteredLinks = [...this.currentLinks];

      // Apply current sort and filter
      this.applySortAndFilter();

      // Update stats
      await this.updateStats();

    } catch (error) {
      console.error('Failed to load links:', error);
      showToast('Failed to load links');
    }
  }

  applySortAndFilter() {
    // Apply filter
    if (this.currentFilter) {
      this.filteredLinks = filterLinks(this.currentLinks, this.currentFilter);
    } else {
      this.filteredLinks = [...this.currentLinks];
    }

    // Apply sort
    this.filteredLinks = sortLinks(this.filteredLinks, this.currentSort);

    // Render links
    this.renderLinks();
  }

  renderLinks() {
    const linksList = document.getElementById('linksList');
    const emptyState = document.getElementById('emptyState');

    if (!linksList || !emptyState) return;

    if (this.filteredLinks.length === 0) {
      linksList.classList.add('hidden');
      emptyState.classList.remove('hidden');

      // Update empty state message if filtering
      if (this.currentFilter) {
        emptyState.querySelector('h3').textContent = 'No matching links';
        emptyState.querySelector('p').textContent = `No links found matching "${this.currentFilter}"`;
      }
    } else {
      emptyState.classList.add('hidden');
      linksList.classList.remove('hidden');

      // Render link items
      linksList.innerHTML = this.filteredLinks.map(link => this.createLinkItem(link)).join('');

      // Set up event listeners for link actions
      this.setupLinkActionListeners();
    }
  }

  createLinkItem(link) {
    const shortUrl = router.generateShortUrl(link.slug);

    return `
        <div class="link-item" data-link-id="${link.id}">
        <div class="link-header">
          <a href=${shortUrl}>
            <div class="link-slug">${link.slug}</div>
          </a>
          <div class="link-stats">
            <span>👁 ${formatNumber(link.clicks || 0)} clicks</span>
            <span>📅 ${formatDate(link.createdAt)}</span>
          </div>
        </div>
        <div class="link-url">${link.originalUrl}</div>
        <div class="link-actions">
          <button class="btn btn-sm btn-secondary copy-link-btn" data-url="${shortUrl}">📋 Copy</button>
          <button class="btn btn-sm btn-secondary edit-link-btn" data-id="${link.id}">✏️ Edit</button>
          <button class="btn btn-sm btn-danger delete-link-btn" data-id="${link.id}">🗑️ Delete</button>
        </div>
      </div>
    `;
  }

  setupLinkActionListeners() {
    // Copy buttons
    document.querySelectorAll('.copy-link-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const url = e.target.dataset.url;
        const success = await copyToClipboard(url);
        showToast(success ? 'Link copied!' : 'Failed to copy');
        if (success) this.trackEvent('link_copied_from_manage');
      });
    });

    // Edit buttons
    document.querySelectorAll('.edit-link-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const linkId = e.target.dataset.id;
        this.openEditModal(linkId);
      });
    });

    // QR buttons
    document.querySelectorAll('.qr-link-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const url = e.target.dataset.url;
        this.showQRModal(url);
      });
    });

    // Delete buttons
    document.querySelectorAll('.delete-link-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const linkId = e.target.dataset.id;
        this.deleteLink(linkId);
      });
    });
  }

  async openEditModal(linkId) {
    try {
      const link = await storage.getLinkById(linkId);
      if (!link) {
        showToast('Link not found');
        return;
      }

      const editModal = document.getElementById('editModal');
      const editId = document.getElementById('editId');
      const editSlug = document.getElementById('editSlug');
      const editUrl = document.getElementById('editUrl');

      if (editModal && editId && editSlug && editUrl) {
        editId.value = link.id;
        editSlug.value = link.slug;
        editUrl.value = link.originalUrl;

        editModal.classList.remove('hidden');
        editSlug.focus();
      }
    } catch (error) {
      console.error('Failed to open edit modal:', error);
      showToast('Failed to edit link');
    }
  }

  closeEditModal() {
    const editModal = document.getElementById('editModal');
    if (editModal) {
      editModal.classList.add('hidden');
    }
  }

  async handleEditLink(e) {
    e.preventDefault();

    const formData = new FormData(e.target);
    const id = formData.get('editId');
    const slug = formData.get('editSlug')?.trim() || '';
    const url = formData.get('editUrl')?.trim() || '';

    if (!slug || !url) {
      showToast('Please fill in all fields');
      return;
    }

    if (!isValidUrl(url)) {
      showToast('Please enter a valid URL');
      return;
    }

    try {
      await storage.updateLink(id, { slug, originalUrl: url });
      showToast('Link updated successfully!');
      this.closeEditModal();
      await this.loadLinks(); // Refresh the list
      this.trackEvent('link_updated');
    } catch (error) {
      console.error('Failed to update link:', error);
      if (error.message.includes('already exists')) {
        showToast('This slug is already taken');
      } else {
        showToast('Failed to update link');
      }
    }
  }

  async showQRModal(url) {
    // Simple QR code display - in a real app you might want a proper modal
    try {
      const qrDataUrl = await generateQRCode(url);
      const modal = document.createElement('div');
      modal.className = 'modal';
      modal.innerHTML = `
        <div class="modal-overlay"></div>
        <div class="modal-content">
          <div class="modal-header">
            <h2 class="modal-title">QR Code</h2>
            <button class="modal-close">✕</button>
          </div>
          <div class="modal-body" style="text-align: center;">
            <img src="${qrDataUrl}" alt="QR Code" style="max-width: 300px;">
            <p style="margin-top: 1rem; word-break: break-all;">${url}</p>
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

      this.trackEvent('qr_code_viewed');
    } catch (error) {
      console.error('Failed to show QR code:', error);
      showToast('Failed to generate QR code');
    }
  }

  async deleteLink(linkId) {
    if (!confirmDialog('Are you sure you want to delete this link? This action cannot be undone.')) {
      return;
    }

    try {
      await storage.deleteLink(linkId);
      showToast('Link deleted successfully!');
      await this.loadLinks(); // Refresh the list
      this.trackEvent('link_deleted');
    } catch (error) {
      console.error('Failed to delete link:', error);
      showToast('Failed to delete link');
    }
  }

  // Search functionality
  setupSearchListeners() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
      searchInput.addEventListener('input', debounce((e) => {
        this.currentFilter = e.target.value.trim();
        this.applySortAndFilter();
      }, 300));
    }

    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
      sortSelect.addEventListener('change', (e) => {
        this.currentSort = e.target.value;
        this.applySortAndFilter();
      });
    }
  }

  // Modal functions
  openSettingsModal() {
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
      settingsModal.classList.remove('hidden');
      this.updateStats();
    }
  }

  closeSettingsModal() {
    const settingsModal = document.getElementById('settingsModal');
    if (settingsModal) {
      settingsModal.classList.add('hidden');
    }
  }

  // Settings functions
  initializeTheme() {
    const savedTheme = localStorage.getItem('localurl_theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = savedTheme || (prefersDark ? 'dark' : 'light');

    this.setTheme(theme);

    // Set toggle state
    const darkModeToggle = document.getElementById('darkModeToggle');
    if (darkModeToggle) {
      darkModeToggle.checked = theme === 'dark';
    }
  }

  toggleDarkMode(isDark) {
    const theme = isDark ? 'dark' : 'light';
    this.setTheme(theme);
    localStorage.setItem('localurl_theme', theme);
    this.trackEvent('theme_changed', { theme });
  }

  setTheme(theme) {
    const html = document.documentElement;
    if (theme === 'dark') {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }

  async updateStats() {
    try {
      const stats = await storage.getStats();
      const totalLinksStat = document.getElementById('totalLinksStat');
      const totalClicksStat = document.getElementById('totalClicksStat');

      if (totalLinksStat) totalLinksStat.textContent = formatNumber(stats.totalLinks);
      if (totalClicksStat) totalClicksStat.textContent = formatNumber(stats.totalClicks);
    } catch (error) {
      console.error('Failed to update stats:', error);
    }
  }

  async exportLinks() {
    try {
      const exportData = await storage.exportLinks();
      const jsonStr = JSON.stringify(exportData, null, 2);
      const filename = `localurl-export-${new Date().toISOString().split('T')[0]}.json`;

      downloadAsFile(jsonStr, filename, 'application/json');
      showToast('Links exported successfully!');
      this.trackEvent('links_exported', { count: exportData.links.length });
    } catch (error) {
      console.error('Failed to export links:', error);
      showToast('Failed to export links');
    }
  }

  async importLinks(file) {
    if (!file) return;

    try {
      const jsonStr = await readFileAsText(file);
      const data = JSON.parse(jsonStr);

      const results = await storage.importLinks(data);

      if (results.errors.length > 0) {
        showToast(`Imported ${results.imported} links, skipped ${results.skipped}, ${results.errors.length} errors`);
        console.warn('Import errors:', results.errors);
      } else {
        showToast(`Successfully imported ${results.imported} links!`);
      }

      // Refresh the links list if we're on the manage page
      if (router.currentPage === 'manage') {
        await this.loadLinks();
      }

      this.trackEvent('links_imported', { count: results.imported });
    } catch (error) {
      console.error('Failed to import links:', error);
      showToast('Failed to import links. Please check the file format.');
    }
  }

  async clearDatabase() {
    const confirmMessage = 'Are you sure you want to delete ALL links? This action cannot be undone.';
    if (!confirmDialog(confirmMessage)) {
      return;
    }

    const finalConfirm = 'Please type "DELETE ALL" to confirm:';
    const confirmation = prompt(finalConfirm);
    if (confirmation !== 'DELETE ALL') {
      return;
    }

    try {
      await storage.clearAllLinks();
      showToast('All links deleted successfully!');

      // Refresh the links list if we're on the manage page
      if (router.currentPage === 'manage') {
        await this.loadLinks();
      }

      this.trackEvent('database_cleared');
    } catch (error) {
      console.error('Failed to clear database:', error);
      showToast('Failed to clear database');
    }
  }

  // Analytics tracking (local only)
  trackEvent(eventName, properties = {}) {
    // Store events locally for debugging/analysis
    const event = {
      name: eventName,
      properties,
      timestamp: new Date().toISOString(),
      page: router.currentPage
    };

    console.log('Event tracked:', event);

    // Store in localStorage for debugging
    const events = JSON.parse(localStorage.getItem('localurl_events') || '[]');
    events.push(event);

    // Keep only last 1000 events
    if (events.length > 1000) {
      events.splice(0, events.length - 1000);
    }

    localStorage.setItem('localurl_events', JSON.stringify(events));
  }
}

// Create and export UI controller instance
const ui = new UIController();

// Export functions that need to be accessible from other modules
export const loadLinks = () => ui.loadLinks();

// Make sure search listeners are set up when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  ui.setupSearchListeners();
});

export default ui;
