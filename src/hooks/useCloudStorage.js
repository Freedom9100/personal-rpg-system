import { useCallback, useEffect, useRef, useState } from 'react';
import { storage } from '../lib/storage.js';

/**
 * Status enum for the async storage lifecycle.
 *
 * LOADING → initial read in progress (show skeleton)
 * READY   → data is loaded and in sync
 * ERROR   → load or save failed (show error UI)
 */
export const StorageStatus = /** @type {const} */ ({
  LOADING: 'loading',
  READY: 'ready',
  ERROR: 'error',
});

/**
 * Async storage hook — drop-in upgrade for `useLocalStorage`.
 *
 * Differences from the sync version:
 *   - Returns a third element `status` (one of StorageStatus).
 *   - Returns a fourth element `error` (null or Error).
 *   - On first mount, `value` starts as `initialValue` while storage is being
 *     read; once ready, it updates to the persisted value (or keeps
 *     `initialValue` if nothing was stored yet).
 *   - Every state change after the initial load is automatically written back
 *     to the active backend (CloudStorage or localStorage).
 *
 * @template T
 * @param {string} key
 * @param {T} initialValue
 * @returns {[T, (updater: T | ((prev: T) => T)) => void, string, Error | null]}
 */
export function useCloudStorage(key, initialValue) {
  const [value, _setValue] = useState(initialValue);
  const [status, setStatus] = useState(StorageStatus.LOADING);
  const [error, setError] = useState(null);

  /**
   * Tracks whether the initial async load has completed.
   * Using a ref (not state) so the write effect can check it without
   * creating a dependency cycle.
   */
  const isLoadedRef = useRef(false);

  // ── Initial load ────────────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false;

    setStatus(StorageStatus.LOADING);
    isLoadedRef.current = false;

    storage
      .get(key)
      .then((raw) => {
        if (cancelled) return;

        if (raw !== null && raw !== undefined && raw !== '') {
          try {
            _setValue(JSON.parse(raw));
          } catch (parseErr) {
            // Corrupted stored value — silently fall back to initialValue.
            console.warn(
              `[useCloudStorage] Could not parse stored value for "${key}". Using initial value.`,
              parseErr,
            );
          }
        }

        isLoadedRef.current = true;
        setStatus(StorageStatus.READY);
      })
      .catch((loadErr) => {
        if (cancelled) return;
        console.error(`[useCloudStorage] Failed to load "${key}":`, loadErr);
        setError(loadErr instanceof Error ? loadErr : new Error(String(loadErr)));
        // Mark as loaded so the app can still function with the initial value.
        isLoadedRef.current = true;
        setStatus(StorageStatus.ERROR);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // ── Persist on change ───────────────────────────────────────────────────────

  useEffect(() => {
    // Skip writes that happen before or during the initial load.
    if (!isLoadedRef.current) return;

    const serialized = JSON.stringify(value);
    storage.set(key, serialized).catch((saveErr) => {
      console.error(`[useCloudStorage] Failed to persist "${key}":`, saveErr);
      setError(saveErr instanceof Error ? saveErr : new Error(String(saveErr)));
    });
  }, [key, value]);

  // ── Stable setter ───────────────────────────────────────────────────────────

  const setValue = useCallback((updater) => {
    _setValue((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  }, []);

  return [value, setValue, status, error];
}
