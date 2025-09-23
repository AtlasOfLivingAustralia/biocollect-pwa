/**
 * Handles both single string values and arrays of strings.
 * Arrays are coverted into repeated query parameters (e.g. fq=abc&fq=def).
 */
export function toQueryString(params: Record<string, string | string[] | undefined>) {
  const usp = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value == null) continue;
    if (Array.isArray(value)) {
      value.forEach(v => usp.append(key, v));
    } else {
      usp.set(key, value);
    }
  }
  return usp.toString();
}