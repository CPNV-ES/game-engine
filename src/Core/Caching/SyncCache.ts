/**
 * A generic, thread-safe, synchronous caching mechanism for storing and retrieving objects of type `<T>`.
 * This class is designed to cache objects that are expensive to create (e.g., textures, fonts, shaders)
 * and ensures that multiple requests for the same key are resolved efficiently without redundant operations.
 *
 * Features:
 * - Singleton instances for named caches.
 * - Synchronous creation of objects using a factory function.
 * - "Thread-safe" resolution of concurrent requests for the same key.
 * - Cache management (clear, remove).
 *
 * Usage:
 * 1. Use `SyncCache.getInstance<T>(cacheName)` to get or create a named cache instance.
 * 2. Use the `get` method to retrieve or create cached items.
 * 3. Optionally, use `clear` or `remove` to manage the cache.
 *
 * Example:
 * ```typescript
 * const textureCache = SyncCache.getInstance<GPUTexture>("textures");
 *
 * const texture = textureCache.get(url, () => {
 *   // Factory function to create the texture
 *   return createTexture(url);
 * });
 * ```
 *
 * @template T - The type of objects to cache.
 */
export class SyncCache<T> {
  /**
   * A static map to store named instances of `SyncCache`.
   * This allows multiple caches to coexist for different types of objects.
   */
  private static readonly _caches: Map<string, SyncCache<any>> = new Map();

  /**
   * A map to store cached items.
   * Keys are typically URLs or unique identifiers, and values are objects of type `<T>`.
   */
  private readonly _cachedItems: Map<RequestInfo | URL, T> = new Map();

  /**
   * Private constructor to enforce the singleton pattern.
   * Use `SyncCache.getInstance<T>(cacheName)` to get or create a cache instance.
   */
  private constructor() {}

  /**
   * Gets or creates a named cache instance.
   * If a cache with the specified name does not exist, it is created.
   *
   * @param cacheName - The name of the cache. Used to identify the cache instance.
   * @returns The cache instance for the specified name.
   *
   * Example:
   * ```typescript
   * const textureCache = SyncCache.getInstance<GPUTexture>("textures");
   * ```
   */
  public static getInstance<T>(cacheName: string): SyncCache<T> {
    if (!this._caches.has(cacheName)) {
      this._caches.set(cacheName, new SyncCache<T>());
    }
    return this._caches.get(cacheName)!;
  }

  /**
   * Retrieves a cached item or creates it using the provided factory function if it is not already cached.
   *
   * @param key - The key to identify the item (e.g., a URL or unique identifier).
   * @param factory - A function that creates the item synchronously if it is not cached.
   * @returns The cached or newly created item.
   *
   * Example:
   * ```typescript
   * const texture = textureCache.get(url, () => {
   *   // Factory function to create the texture
   *   return createTexture(url);
   * });
   * ```
   */
  public get(key: RequestInfo | URL, factory: () => T): T {
    if (this._cachedItems.has(key)) {
      return this._cachedItems.get(key)!;
    }

    const item = factory();
    this._cachedItems.set(key, item);

    return item;
  }

  /**
   * Clears all cached items.
   * Use this method to reset the cache.
   *
   * Example:
   * ```typescript
   * textureCache.clear();
   * ```
   */
  public clear(): void {
    this._cachedItems.clear();
  }

  /**
   * Removes a specific item from the cache.
   *
   * @param key - The key of the item to remove.
   *
   * Example:
   * ```typescript
   * textureCache.remove(url);
   * ```
   */
  public remove(key: RequestInfo | URL): void {
    this._cachedItems.delete(key);
  }
}
