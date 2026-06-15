/**
 * Unified async storage adapter.
 *
 * Priority:
 *   1. Telegram CloudStorage — when running inside a real Telegram Mini App
 *      (window.Telegram.WebApp.initData is non-empty).
 *   2. window.localStorage — everywhere else (dev browser, preview, etc.).
 *
 * CloudStorage key rules (Telegram API):
 *   - 1–128 chars, only A–Z a–z 0–9 _ -
 *   - Value ≤ 4 096 chars
 */

const CLOUD_MAX_VALUE_SIZE = 4096;

// ─── Internal helpers ────────────────────────────────────────────────────────

function getCloudStorage() {
  if (typeof window === 'undefined') return null;
  return window?.Telegram?.WebApp?.CloudStorage ?? null;
}

/**
 * Returns true only when the app is running inside Telegram with a real session.
 * `initData` is an empty string in the browser outside Telegram.
 */
export function isCloudStorageAvailable() {
  const cs = getCloudStorage();
  const initData = window?.Telegram?.WebApp?.initData;
  return !!(cs && initData);
}

/**
 * CloudStorage allows only A–Z, a–z, 0–9, _ and -.
 * Replace any other character (e.g. the colon in our key names) with an underscore.
 */
function toCloudKey(key) {
  return key.replace(/[^A-Za-z0-9_-]/g, '_');
}

// ─── CloudStorage (promisified) ───────────────────────────────────────────────

function cloudGet(key) {
  return new Promise((resolve, reject) => {
    getCloudStorage().getItem(toCloudKey(key), (err, value) => {
      if (err) reject(new Error(String(err)));
      else resolve(value ?? null);
    });
  });
}

function cloudSet(key, value) {
  // If the serialized value exceeds the limit, fall back to localStorage silently.
  if (value.length > CLOUD_MAX_VALUE_SIZE) {
    console.warn(
      `[storage] Value for "${key}" is ${value.length} chars ` +
        `(limit ${CLOUD_MAX_VALUE_SIZE}). Falling back to localStorage.`,
    );
    return localSet(key, value);
  }
  return new Promise((resolve, reject) => {
    getCloudStorage().setItem(toCloudKey(key), value, (err, stored) => {
      if (err) reject(new Error(String(err)));
      else resolve(stored);
    });
  });
}

// ─── localStorage (sync wrapped in Promise) ───────────────────────────────────

function localGet(key) {
  try {
    const raw = window.localStorage.getItem(key);
    return Promise.resolve(raw);
  } catch {
    return Promise.resolve(null);
  }
}

function localSet(key, value) {
  try {
    window.localStorage.setItem(key, value);
    return Promise.resolve(true);
  } catch {
    return Promise.resolve(false);
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const storage = {
  /**
   * Read a value from the active storage backend.
   * @param {string} key
   * @returns {Promise<string | null>}
   */
  get(key) {
    return isCloudStorageAvailable() ? cloudGet(key) : localGet(key);
  },

  /**
   * Write a string value to the active storage backend.
   * @param {string} key
   * @param {string} value  Serialized JSON string.
   * @returns {Promise<boolean>}
   */
  set(key, value) {
    return isCloudStorageAvailable() ? cloudSet(key, value) : localSet(key, value);
  },

  /**
   * Describes which backend is currently active.
   * Useful for displaying a sync-status badge in the UI.
   * @returns {'cloud' | 'local'}
   */
  get type() {
    return isCloudStorageAvailable() ? 'cloud' : 'local';
  },
};
