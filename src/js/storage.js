// IndexedDB storage layer for LocalURL

const DB_NAME = 'localurl_db';
const DB_VERSION = 1;
const STORE_NAME = 'links';

class LocalURLStorage {
  constructor() {
    this.db = null;
    this.initPromise = null;
  }

  // Initialize IndexedDB
  async init() {
    if (this.initPromise) {
      return this.initPromise;
    }

    this.initPromise = new Promise((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onerror = () => {
        console.error('Failed to open IndexedDB:', request.error);
        reject(request.error);
      };

      request.onsuccess = () => {
        this.db = request.result;
        console.log('IndexedDB opened successfully');
        resolve(this.db);
      };

      request.onupgradeneeded = (event) => {
        const db = event.target.result;

        // Create links object store
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
          
          // Create indexes
          store.createIndex('slug', 'slug', { unique: true });
          store.createIndex('createdAt', 'createdAt');
          store.createIndex('clicks', 'clicks');
        }
      };
    });

    return this.initPromise;
  }

  // Ensure DB is initialized
  async ensureDb() {
    if (!this.db) {
      await this.init();
    }
    return this.db;
  }

  // Generate unique ID
  generateId() {
    return `link_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Create a new link
  async createLink(linkData) {
    await this.ensureDb();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      
      const link = {
        id: this.generateId(),
        slug: linkData.slug,
        originalUrl: linkData.originalUrl,
        createdAt: new Date().toISOString(),
        clicks: 0,
        customSlug: !!linkData.customSlug
      };

      const request = store.add(link);

      request.onsuccess = () => {
        console.log('Link created:', link);
        resolve(link);
      };

      request.onerror = () => {
        if (request.error.name === 'ConstraintError') {
          reject(new Error('Slug already exists'));
        } else {
          reject(request.error);
        }
      };

      transaction.oncomplete = () => {
        console.log('Transaction completed');
      };

      transaction.onerror = () => {
        console.error('Transaction failed:', transaction.error);
        reject(transaction.error);
      };
    });
  }

  // Get all links
  async getAllLinks() {
    await this.ensureDb();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const links = request.result || [];
        console.log(`Retrieved ${links.length} links`);
        resolve(links);
      };

      request.onerror = () => {
        console.error('Failed to get all links:', request.error);
        reject(request.error);
      };
    });
  }

  // Get link by slug
  async getLinkBySlug(slug) {
    await this.ensureDb();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const index = store.index('slug');
      const request = index.get(slug);

      request.onsuccess = () => {
        const link = request.result;
        if (link) {
          console.log('Link found by slug:', link.slug);
          resolve(link);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        console.error('Failed to get link by slug:', request.error);
        reject(request.error);
      };
    });
  }

  // Get link by ID
  async getLinkById(id) {
    await this.ensureDb();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.get(id);

      request.onsuccess = () => {
        const link = request.result;
        if (link) {
          console.log('Link found by ID:', link.id);
          resolve(link);
        } else {
          resolve(null);
        }
      };

      request.onerror = () => {
        console.error('Failed to get link by ID:', request.error);
        reject(request.error);
      };
    });
  }

  // Update link
  async updateLink(id, updates) {
    await this.ensureDb();
    
    return new Promise((resolve, reject) => {
      // First get the existing link
      this.getLinkById(id)
        .then(existingLink => {
          if (!existingLink) {
            reject(new Error('Link not found'));
            return;
          }

          const transaction = this.db.transaction([STORE_NAME], 'readwrite');
          const store = transaction.objectStore(STORE_NAME);
          
          const updatedLink = {
            ...existingLink,
            ...updates,
            id: existingLink.id, // Ensure ID doesn't change
            createdAt: existingLink.createdAt // Preserve creation time
          };

          const request = store.put(updatedLink);

          request.onsuccess = () => {
            console.log('Link updated:', updatedLink);
            resolve(updatedLink);
          };

          request.onerror = () => {
            if (request.error.name === 'ConstraintError' && updates.slug) {
              reject(new Error('Slug already exists'));
            } else {
              reject(request.error);
            }
          };

          transaction.oncomplete = () => {
            console.log('Update transaction completed');
          };

          transaction.onerror = () => {
            console.error('Update transaction failed:', transaction.error);
            reject(transaction.error);
          };
        })
        .catch(reject);
    });
  }

  // Delete link
  async deleteLink(id) {
    await this.ensureDb();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => {
        console.log('Link deleted:', id);
        resolve(true);
      };

      request.onerror = () => {
        console.error('Failed to delete link:', request.error);
        reject(request.error);
      };

      transaction.oncomplete = () => {
        console.log('Delete transaction completed');
      };

      transaction.onerror = () => {
        console.error('Delete transaction failed:', transaction.error);
        reject(transaction.error);
      };
    });
  }

  // Increment click count
  async incrementClicks(slug) {
    await this.ensureDb();
    
    return new Promise((resolve, reject) => {
      this.getLinkBySlug(slug)
        .then(link => {
          if (!link) {
            reject(new Error('Link not found'));
            return;
          }

          const updatedClicks = (link.clicks || 0) + 1;
          this.updateLink(link.id, { clicks: updatedClicks })
            .then(updatedLink => {
              console.log('Click count incremented:', updatedLink.clicks);
              resolve(updatedLink);
            })
            .catch(reject);
        })
        .catch(reject);
    });
  }

  // Get statistics
  async getStats() {
    await this.ensureDb();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const links = request.result || [];
        const totalLinks = links.length;
        const totalClicks = links.reduce((sum, link) => sum + (link.clicks || 0), 0);
        const customLinks = links.filter(link => link.customSlug).length;
        
        const stats = {
          totalLinks,
          totalClicks,
          customLinks,
          autoGeneratedLinks: totalLinks - customLinks
        };

        console.log('Stats retrieved:', stats);
        resolve(stats);
      };

      request.onerror = () => {
        console.error('Failed to get stats:', request.error);
        reject(request.error);
      };
    });
  }

  // Export all links as JSON
  async exportLinks() {
    const links = await this.getAllLinks();
    const exportData = {
      version: '1.0',
      exportedAt: new Date().toISOString(),
      links: links
    };
    
    console.log(`Exported ${links.length} links`);
    return exportData;
  }

  // Import links from JSON
  async importLinks(data) {
    await this.ensureDb();
    
    if (!data || !Array.isArray(data.links)) {
      throw new Error('Invalid import data format');
    }

    const results = {
      imported: 0,
      skipped: 0,
      errors: []
    };

    for (const linkData of data.links) {
      try {
        // Check if slug already exists
        const existing = await this.getLinkBySlug(linkData.slug);
        if (existing) {
          results.skipped++;
          continue;
        }

        // Validate required fields
        if (!linkData.slug || !linkData.originalUrl) {
          results.errors.push(`Invalid link data: missing slug or originalUrl`);
          continue;
        }

        // Create link with preserved metadata
        await this.createLink({
          slug: linkData.slug,
          originalUrl: linkData.originalUrl,
          customSlug: linkData.customSlug || false
        });

        results.imported++;
      } catch (error) {
        results.errors.push(`Failed to import link ${linkData.slug}: ${error.message}`);
      }
    }

    console.log('Import results:', results);
    return results;
  }

  // Clear all links
  async clearAllLinks() {
    await this.ensureDb();
    
    return new Promise((resolve, reject) => {
      const transaction = this.db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => {
        console.log('All links cleared');
        resolve(true);
      };

      request.onerror = () => {
        console.error('Failed to clear links:', request.error);
        reject(request.error);
      };

      transaction.oncomplete = () => {
        console.log('Clear transaction completed');
      };

      transaction.onerror = () => {
        console.error('Clear transaction failed:', transaction.error);
        reject(transaction.error);
      };
    });
  }

  // Search links
  async searchLinks(query) {
    const allLinks = await this.getAllLinks();
    
    if (!query || query.trim() === '') {
      return allLinks;
    }

    const searchTerm = query.toLowerCase().trim();
    
    return allLinks.filter(link => 
      link.slug.toLowerCase().includes(searchTerm) ||
      link.originalUrl.toLowerCase().includes(searchTerm)
    );
  }

  // Get links sorted by criteria
  async getSortedLinks(sortBy = 'created-desc') {
    const allLinks = await this.getAllLinks();
    
    switch (sortBy) {
      case 'created-desc':
        return allLinks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      case 'created-asc':
        return allLinks.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      case 'clicks-desc':
        return allLinks.sort((a, b) => (b.clicks || 0) - (a.clicks || 0));
      case 'clicks-asc':
        return allLinks.sort((a, b) => (a.clicks || 0) - (b.clicks || 0));
      case 'slug-asc':
        return allLinks.sort((a, b) => a.slug.localeCompare(b.slug));
      case 'slug-desc':
        return allLinks.sort((a, b) => b.slug.localeCompare(a.slug));
      default:
        return allLinks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
  }

  // Close database connection
  close() {
    if (this.db) {
      this.db.close();
      this.db = null;
      console.log('IndexedDB connection closed');
    }
  }
}

// Create and export singleton instance
const storage = new LocalURLStorage();
export default storage;