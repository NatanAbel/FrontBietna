/* Example usage:
 * - User types in search box: "house"
 * - Without debounce: 5 API calls (h, ho, hou, hous, house)
 * - With debounce: 1 API call after user stops typing for 300ms
 */
export function debounce(func, wait) {
    let timeout;
    return function(...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
