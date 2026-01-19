import { describe, it, expect } from 'vitest';
import { slugify, cleanUnknown } from './helpers';

describe('slugify', () => {
  it('converts spaces to hyphens', () => {
    expect(slugify('Hello World')).toBe('hello-world');
  });

  it('converts to lowercase', () => {
    expect(slugify('UPPERCASE')).toBe('uppercase');
    expect(slugify('MixedCase')).toBe('mixedcase');
  });

  it('removes apostrophes', () => {
    expect(slugify("Mi'kmaq Nation")).toBe('mikmaq-nation');
    expect(slugify("O'Brien")).toBe('obrien');
    expect(slugify("it's")).toBe('its');
  });

  it('removes special characters except hyphens', () => {
    expect(slugify('Hello, World!')).toBe('hello-world');
    expect(slugify('Test@#$%Name')).toBe('testname');
  });

  it('handles unicode normalization', () => {
    expect(slugify('Café')).toBe('cafe');
    expect(slugify('naïve')).toBe('naive');
  });

  it('collapses multiple spaces into single hyphen', () => {
    expect(slugify('Hello   World')).toBe('hello-world');
  });

  it('handles empty string', () => {
    expect(slugify('')).toBe('');
  });

  it('handles numbers', () => {
    expect(slugify('Test 123')).toBe('test-123');
    expect(slugify('123')).toBe('123');
  });
});

describe('cleanUnknown', () => {
  it('returns null for "UNKNOWN" (case insensitive)', () => {
    expect(cleanUnknown('UNKNOWN')).toBeNull();
    expect(cleanUnknown('unknown')).toBeNull();
    expect(cleanUnknown('Unknown')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(cleanUnknown('')).toBeNull();
  });

  it('returns null for undefined', () => {
    expect(cleanUnknown(undefined)).toBeNull();
  });

  it('returns null for null', () => {
    expect(cleanUnknown(null)).toBeNull();
  });

  it('returns the value for valid strings', () => {
    expect(cleanUnknown('John Smith')).toBe('John Smith');
    expect(cleanUnknown('Paris, France')).toBe('Paris, France');
  });

  it('does not treat partial matches as unknown', () => {
    expect(cleanUnknown('Unknown Person')).toBe('Unknown Person');
    expect(cleanUnknown('The Unknown')).toBe('The Unknown');
  });
});
