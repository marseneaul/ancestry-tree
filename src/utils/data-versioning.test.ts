import { describe, expect, it } from 'vitest';
import type { Person } from '../interfaces/person';
import { DataVersionManager } from './data-versioning';

describe('DataVersionManager', () => {
  it('includes cycle-safe data quality metrics', () => {
    const root: Person = {
      id: 'person_root',
      name: 'Root',
      parents: []
    };
    root.parents = [root];

    const manager = new DataVersionManager();
    const metrics = manager.getDataQualityMetrics(root);

    expect(metrics.totalPersons).toBe(1);
    expect(metrics.qualityIssues).toBeGreaterThanOrEqual(1);
    expect(metrics.qualityErrors).toBeGreaterThanOrEqual(1);
    expect(metrics.qualityWarnings).toBe(0);
  });
});
