import { describe, it, expect } from 'vitest';
import { Sex, ConfidenceLevel, MISSING_DATA } from './person';

describe('Sex enum', () => {
  it('has correct values', () => {
    expect(Sex.MALE).toBe('Male');
    expect(Sex.FEMALE).toBe('Female');
    expect(Sex.UNKNOWN).toBe('Unknown');
  });

  it('can be used for comparison', () => {
    const personSex = 'Male';
    expect(personSex === Sex.MALE).toBe(true);
  });
});

describe('ConfidenceLevel enum', () => {
  it('has correct values', () => {
    expect(ConfidenceLevel.HIGH).toBe('high');
    expect(ConfidenceLevel.MEDIUM).toBe('medium');
    expect(ConfidenceLevel.LOW).toBe('low');
    expect(ConfidenceLevel.UNKNOWN).toBe('unknown');
  });
});

describe('MISSING_DATA constants', () => {
  it('has standardized missing data values', () => {
    expect(MISSING_DATA.UNKNOWN).toBe('Unknown');
    expect(MISSING_DATA.NOT_APPLICABLE).toBe('N/A');
    expect(MISSING_DATA.NOT_AVAILABLE).toBe('Not Available');
  });

  it('is readonly (const assertion)', () => {
    // This is a compile-time check, but we can verify the values exist
    const keys = Object.keys(MISSING_DATA);
    expect(keys).toContain('UNKNOWN');
    expect(keys).toContain('NOT_APPLICABLE');
    expect(keys).toContain('NOT_AVAILABLE');
  });
});
