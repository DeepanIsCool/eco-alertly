
// Counter for generating unique IDs
let count = 0;

// Default toast timeout in milliseconds
export const TOAST_TIMEOUT = 5000;

/**
 * Generates a unique ID for toasts
 */
export function generateId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}
