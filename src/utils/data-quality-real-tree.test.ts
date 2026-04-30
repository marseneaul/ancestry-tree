import { describe, expect, it } from 'vitest';
import { migratedMaxArseneaultConfig } from './migrate-existing-data';
import { analyzeDataQuality } from './data-quality';

describe('production tree data quality', () => {
  it('can analyze the shipped tree without structural recursion issues', () => {
    const report = analyzeDataQuality(migratedMaxArseneaultConfig);

    expect(report.totalPersons).toBeGreaterThan(0);
    expect(report.uniquePersons).toBeGreaterThan(0);
    expect(report.errors.filter(issue => issue.type === 'cycle')).toHaveLength(0);
    expect(report.errors.filter(issue => issue.type === 'too-many-parents')).toHaveLength(0);
  });
});
