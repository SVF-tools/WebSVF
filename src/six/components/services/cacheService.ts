// Cache service for storing and retrieving CodeGPT responses
export interface CacheEntry {
  question: string;
  answer: string;
  timestamp: number;
  sessionId: string;
}

export interface CacheStats {
  totalEntries: number;
  hitRate: number;
  totalHits: number;
  totalMisses: number;
}

class CacheService {
  private static instance: CacheService;
  private readonly CACHE_KEY = 'websvf-codegpt-cache';
  private readonly MAX_CACHE_SIZE = 100; // Maximum number of entries per session
  private readonly CACHE_EXPIRY_DAYS = 7; // Cache entries expire after 7 days

  // In-memory stats (not persisted)
  private stats = {
    totalHits: 0,
    totalMisses: 0,
  };

  private constructor() {
    // Singleton pattern - no initialization needed
  }

  public static getInstance(): CacheService {
    if (!CacheService.instance) {
      CacheService.instance = new CacheService();
    }
    return CacheService.instance;
  }

  /**
   * Normalize question text for consistent cache key generation
   */
  private normalizeQuestion(question: string): string {
    return question
      .toLowerCase()
      .trim()
      .replace(/\s+/g, ' ') // Replace multiple spaces with single space
      .replace(/[^\w\s]/g, ''); // Remove punctuation for better matching
  }

  /**
   * Generate cache key from question and session
   */
  private generateCacheKey(question: string, sessionId: string): string {
    const normalizedQuestion = this.normalizeQuestion(question);
    return `${sessionId}:${normalizedQuestion}`;
  }

  /**
   * Get all cache entries from localStorage
   */
  private getAllCacheEntries(): Map<string, CacheEntry> {
    try {
      const cacheData = localStorage.getItem(this.CACHE_KEY);
      if (!cacheData) {
        return new Map();
      }

      const entries: [string, CacheEntry][] = JSON.parse(cacheData);
      return new Map(entries);
    } catch (error) {
      console.warn('Failed to load cache from localStorage:', error);
      return new Map();
    }
  }

  /**
   * Save all cache entries to localStorage
   */
  private saveAllCacheEntries(cache: Map<string, CacheEntry>): void {
    try {
      const entries = Array.from(cache.entries());
      localStorage.setItem(this.CACHE_KEY, JSON.stringify(entries));
    } catch (error) {
      console.warn('Failed to save cache to localStorage:', error);
    }
  }

  /**
   * Clean expired entries from cache
   */
  private cleanExpiredEntries(cache: Map<string, CacheEntry>): Map<string, CacheEntry> {
    const now = Date.now();
    const expiryTime = this.CACHE_EXPIRY_DAYS * 24 * 60 * 60 * 1000;

    for (const [key, entry] of cache.entries()) {
      if (now - entry.timestamp > expiryTime) {
        cache.delete(key);
      }
    }

    return cache;
  }

  /**
   * Implement LRU eviction for a specific session
   */
  private evictOldestForSession(cache: Map<string, CacheEntry>, sessionId: string): void {
    // Get all entries for this session
    const sessionEntries = Array.from(cache.entries())
      .filter(([_, entry]) => entry.sessionId === sessionId)
      .sort((a, b) => a[1].timestamp - b[1].timestamp); // Sort by timestamp (oldest first)

    // Remove oldest entries if we exceed the limit
    while (sessionEntries.length >= this.MAX_CACHE_SIZE) {
      const oldestEntry = sessionEntries.shift();
      if (oldestEntry) {
        const [oldestKey] = oldestEntry;
        cache.delete(oldestKey);
      }
    }
  }

  /**
   * Get cached response for a question
   */
  public getCachedResponse(question: string, sessionId: string): string | null {
    const cacheKey = this.generateCacheKey(question, sessionId);
    let cache = this.getAllCacheEntries();

    // Clean expired entries
    cache = this.cleanExpiredEntries(cache);

    const entry = cache.get(cacheKey);

    if (entry) {
      this.stats.totalHits++;
      console.log('Cache HIT for question:', question.substring(0, 50) + '...');
      return entry.answer;
    }

    this.stats.totalMisses++;
    console.log('Cache MISS for question:', question.substring(0, 50) + '...');
    return null;
  }

  /**
   * Store response in cache
   */
  public setCachedResponse(question: string, answer: string, sessionId: string): void {
    const cacheKey = this.generateCacheKey(question, sessionId);
    let cache = this.getAllCacheEntries();

    // Clean expired entries
    cache = this.cleanExpiredEntries(cache);

    // Evict oldest entries for this session if needed
    this.evictOldestForSession(cache, sessionId);

    // Add new entry
    const entry: CacheEntry = {
      question,
      answer,
      timestamp: Date.now(),
      sessionId,
    };

    cache.set(cacheKey, entry);
    this.saveAllCacheEntries(cache);

    console.log('Cached response for question:', question.substring(0, 50) + '...');
  }

  /**
   * Clear cache for a specific session
   */
  public clearSessionCache(sessionId: string): void {
    const cache = this.getAllCacheEntries();

    // Remove all entries for this session
    for (const [key, entry] of cache.entries()) {
      if (entry.sessionId === sessionId) {
        cache.delete(key);
      }
    }

    this.saveAllCacheEntries(cache);
    console.log('Cleared cache for session:', sessionId);
  }

  /**
   * Clear all cache
   */
  public clearAllCache(): void {
    localStorage.removeItem(this.CACHE_KEY);
    console.log('Cleared all cache');
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): CacheStats {
    const cache = this.getAllCacheEntries();
    const totalRequests = this.stats.totalHits + this.stats.totalMisses;

    return {
      totalEntries: cache.size,
      hitRate: totalRequests > 0 ? (this.stats.totalHits / totalRequests) * 100 : 0,
      totalHits: this.stats.totalHits,
      totalMisses: this.stats.totalMisses,
    };
  }

  /**
   * Get cache entries for a specific session
   */
  public getSessionCacheEntries(sessionId: string): CacheEntry[] {
    const cache = this.getAllCacheEntries();
    return Array.from(cache.values())
      .filter((entry) => entry.sessionId === sessionId)
      .sort((a, b) => b.timestamp - a.timestamp); // Sort by newest first
  }
}

export default CacheService;
