const DB_NAME = 'line';
const STORE_NAME = 'cacheStore';
const DB_VERSION = 1;
const CACHE_TIMEOUT = 1000 * 60 * 60;

type CachedData = {
    key: string,
    timestamp: number,
    value: { [key: string]: string }[]
}

/**
 * Method to access indexedDB.
 * @returns 
 */
function openDB(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);
        request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
            const db = (event.target as IDBOpenDBRequest).result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME, { keyPath: 'key' });
            }
        };
        request.onsuccess = () => {
            resolve(request.result);
        };
        request.onerror = () => {
            reject('Failed to open IndexedDB');
        };
    });
}

/**
 * Method to validate cache.
 * @param timestamp 
 * @returns 
 */
export function isCacheValid(timestamp: number): boolean {
    const now = Date.now();
    return now - timestamp < CACHE_TIMEOUT;
}

/**
 * Method to store cache with timestamp.
 * @param key 
 * @param value 
 * @returns 
 */
export async function setCacheWithTimestamp<T>(key: string, value: T | T[]): Promise<void> {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.put({ key, value, timestamp: Date.now() });

    return new Promise((resolve, reject) => {
        request.onsuccess = () => resolve();
        request.onerror = () => reject('Failed to set cache with timestamp');
    });
}

/**
 * Method to get cache with timestamp.
 * @param key 
 * @returns 
 */
export async function getCacheWithTimestamp<T>(key: string): Promise<{ value: T | null, timestamp: number | null }> {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.get(key);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            const result = request.result;
            if (result) {
                resolve({ value: result.value, timestamp: result.timestamp });
            } else {
                resolve({ value: null, timestamp: null });
            }
        };
        request.onerror = () => reject('Failed to get cache with timestamp');
    });
}

/**
 * Method to clear cache.
 * @param key 
 * @returns 
 */
export async function removeCache(key: string): Promise<void> {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    const request = store.delete(key);

    return new Promise((resolve, reject) => {
        request.onsuccess = () => {
            resolve();
        };
        request.onerror = () => {
            reject('Failed to remove cache');
        };
    });
}

/**
 * Method to maintain cache.
 * @param maxEnteries 
 * @returns 
 */
export async function maintainCache(maxEnteries: number): Promise<void> {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const allEntriesRequest = store.getAll();

    return new Promise((resolve, reject) => {
        allEntriesRequest.onsuccess = async () => {
            const allEntries = allEntriesRequest.result;

            const now = Date.now();
            const outdatedKeys = allEntries
                .filter((entry: CachedData) => now - entry.timestamp >= CACHE_TIMEOUT)
                .map((entry: CachedData) => entry.key);

            const outdatedPromises = outdatedKeys.map(key => removeCache(key));
            await Promise.all(outdatedPromises);

            const validEntries = allEntries.filter((entry: CachedData) => now - entry.timestamp < CACHE_TIMEOUT);
            if (validEntries.length > maxEnteries) {
                validEntries.sort((a: CachedData, b: CachedData) => a.timestamp - b.timestamp);
                const excessKeys = validEntries.slice(0, validEntries.length - maxEnteries).map((entry: CachedData) => entry.key);
                const sizeLimitPromises = excessKeys.map(key => removeCache(key));
                await Promise.all(sizeLimitPromises);
            }

            resolve();
        };

        allEntriesRequest.onerror = () => reject('Failed to maintain cache');
    });
}