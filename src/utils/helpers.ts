// src/utils/helpers.ts

/**
 * Helper: make "Mi'kmaq Nation" -> "mikmaq-nation"
 * Converts a string to a URL-friendly slug format
 */
export const slugify = (s: string): string =>
  s.normalize("NFKD")
   .replace(/['']/g, "")           // drop apostrophes
   .replace(/\s+/g, "-")           // spaces -> hyphens
   .replace(/[^a-zA-Z0-9-]/g, "")  // remove other punctuation
  .toLowerCase();

/**
 * Helper: clean up "UNKNOWN" values for display
 * Returns null for empty, undefined, or "UNKNOWN" values
 */
export const cleanUnknown = (value: string | undefined | null): string | null => {
  if (!value || value.toUpperCase() === "UNKNOWN") {
    return null;
  }
  return value;
};
