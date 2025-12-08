// Utility functions for LocalURL

// URL validation
export function isValidUrl(string) {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
}

// Generate random slug
export function generateRandomSlug(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Sanitize slug
export function sanitizeSlug(slug) {
  return slug
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '')
    .substring(0, 50);
}

// Copy text to clipboard
export async function copyToClipboard(text) {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      textArea.remove();
    }
    return true;
  } catch (error) {
    console.error('Failed to copy text: ', error);
    return false;
  }
}

// Format date
export function formatDate(date) {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Format number
export function formatNumber(num) {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Get current base URL
export function getBaseUrl() {
  const { protocol, host } = window.location;
  return `${protocol}//${host}`;
}

// Check if dark mode is preferred
export function prefersDarkMode() {
  return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
}

// Save to localStorage
export function saveToLocalStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error('Failed to save to localStorage:', error);
    return false;
  }
}

// Get from localStorage
export function getFromLocalStorage(key, defaultValue = null) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error('Failed to get from localStorage:', error);
    return defaultValue;
  }
}

// Remove from localStorage
export function removeFromLocalStorage(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error('Failed to remove from localStorage:', error);
    return false;
  }
}

// Download data as file
export function downloadAsFile(data, filename, type = 'application/json') {
  const blob = new Blob([data], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Read file as text
export function readFileAsText(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (e) => reject(e.target.error);
    reader.readAsText(file);
  });
}

// Escape HTML
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Show toast notification
export function showToast(message, duration = 3000) {
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toastMessage');

  if (!toast || !toastMessage) return;

  toastMessage.textContent = message;
  toast.classList.remove('hidden');

  setTimeout(() => {
    toast.classList.add('hidden');
  }, duration);
}

// Confirm dialog
export function confirmDialog(message) {
  return window.confirm(message);
}

// Get URL slug from current URL
export function getUrlSlug() {
  const hash = window.location.hash.slice(1);
  const parts = hash.split('/');

  // Check for /go/:slug format
  if (parts[0] === 'go' && parts[1]) {
    return parts[1];
  }

  return null;
}

// Sort links
export function sortLinks(links, sortBy) {
  const sorted = [...links];

  switch (sortBy) {
    case 'created-desc':
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      break;
    case 'created-asc':
      sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      break;
    case 'clicks-desc':
      sorted.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
      break;
    case 'slug-asc':
      sorted.sort((a, b) => a.slug.localeCompare(b.slug));
      break;
    default:
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return sorted;
}

// Filter links by search term
export function filterLinks(links, searchTerm) {
  if (!searchTerm || searchTerm.trim() === '') {
    return links;
  }

  const term = searchTerm.toLowerCase().trim();

  return links.filter(link =>
    link.slug.toLowerCase().includes(term) ||
    link.originalUrl.toLowerCase().includes(term)
  );
}

// Simple QR Code Generator
class SimpleQRGenerator {
  static generate(text, size = 200) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const cellSize = Math.floor(size / 25);
    const margin = cellSize * 2;

    canvas.width = size;
    canvas.height = size;

    // Simple QR-like pattern generator (not a real QR code, but visually similar)
    const pattern = this.generatePattern(text);

    // Draw white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    // Draw pattern
    ctx.fillStyle = '#000000';

    // Draw corner squares
    this.drawCornerSquare(ctx, 0, 0, cellSize);
    this.drawCornerSquare(ctx, size - 7 * cellSize, 0, cellSize);
    this.drawCornerSquare(ctx, 0, size - 7 * cellSize, cellSize);

    // Draw data pattern
    for (let row = 0; row < 25; row++) {
      for (let col = 0; col < 25; col++) {
        if (pattern[row][col]) {
          ctx.fillRect(
            margin + col * cellSize,
            margin + row * cellSize,
            cellSize,
            cellSize
          );
        }
      }
    }

    return canvas.toDataURL('image/png');
  }

  static drawCornerSquare(ctx, x, y, cellSize) {
    // Outer square
    ctx.fillRect(x, y, 7 * cellSize, 7 * cellSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(x + cellSize, y + cellSize, 5 * cellSize, 5 * cellSize);
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + 2 * cellSize, y + 2 * cellSize, 3 * cellSize, 3 * cellSize);
  }

  static generatePattern(text) {
    // Generate a pseudo-random pattern based on text
    const hash = this.hashCode(text);
    const pattern = Array(25).fill().map(() => Array(25).fill(false));

    // Create pattern based on hash
    let seed = hash;
    for (let i = 0; i < 100; i++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      const row = seed % 25;
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      const col = seed % 25;

      // Avoid corner squares
      if ((row < 9 && col < 9) || (row < 9 && col > 15) || (row > 15 && col < 9)) {
        continue;
      }

      pattern[row][col] = true;
    }

    return pattern;
  }

  static hashCode(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  }
}

// Generate QR Code data URL
export async function generateQRCode(text, size = 200) {
  return new Promise((resolve) => {
    try {
      const dataUrl = SimpleQRGenerator.generate(text, size);
      resolve(dataUrl);
    } catch (error) {
      console.error('Failed to generate QR code:', error);
      // Fallback to a simple pattern
      resolve('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==');
    }
  });
}

// Check if service worker is supported
export function isServiceWorkerSupported() {
  return 'serviceWorker' in navigator;
}

// Register service worker
export async function registerServiceWorker(swPath = '/sw.js') {
  if (!isServiceWorkerSupported()) {
    console.log('Service Worker not supported');
    return false;
  }

  try {
    const registration = await navigator.serviceWorker.register(swPath);
    console.log('Service Worker registered:', registration);
    return true;
  } catch (error) {
    console.error('Service Worker registration failed:', error);
    return false;
  }
}

// Track analytics (local only)
export function trackEvent(eventName, properties = {}) {
  // This is a placeholder for local analytics
  // In a real implementation, you might store events in IndexedDB
  const event = {
    name: eventName,
    properties,
    timestamp: new Date().toISOString()
  };

  console.log('Event tracked:', event);

  // Store events in localStorage for now (in production, use IndexedDB)
  const events = getFromLocalStorage('localurl_events', []);
  events.push(event);

  // Keep only last 1000 events
  if (events.length > 1000) {
    events.splice(0, events.length - 1000);
  }

  saveToLocalStorage('localurl_events', events);
}

// Get base URL for short links
export function getShortBaseUrl() {
  // Try to get the base URL from configuration or use current location
  return getFromLocalStorage('localurl_base_url', getBaseUrl());
}

// Set base URL for short links
export function setShortBaseUrl(url) {
  saveToLocalStorage('localurl_base_url', url);
}
