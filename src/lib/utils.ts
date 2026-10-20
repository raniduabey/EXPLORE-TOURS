/**
 * Shared utility functions for Ceylon Explore Tours
 */

/**
 * Safely parses any numeric value, numeric string (including leading zeros, decimals,
 * and comma-separated thousands), and gracefully preserves null/fallback values.
 *
 * @param val The input value to parse
 * @param fallback Fallback number or null if the input is empty or invalid
 * @returns Parsed number or fallback
 */
export function parseSafeNum(val: any, fallback: number | null = null): number | null {
  if (val === undefined || val === null) return fallback;
  if (typeof val === "number") {
    return Number.isFinite(val) ? val : fallback;
  }
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (trimmed === "") return fallback;
    // Strip standard thousands grouping commas (e.g., "1,500.50" -> "1500.50")
    const sanitized = trimmed.replace(/,/g, "");
    const n = Number(sanitized);
    return Number.isFinite(n) ? n : fallback;
  }
  return fallback;
}
