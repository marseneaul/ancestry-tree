import { describe, expect, it } from 'vitest';
import type { Person } from '../interfaces/person';
import { Sex } from '../interfaces/person';
import { analyzeDataQuality } from './data-quality';

describe('analyzeDataQuality', () => {
  it('returns an empty issue set for a consistent tree', () => {
    const root: Person = {
      id: 'person_child',
      name: 'Child',
      sex: Sex.UNKNOWN,
      birthDate: '2000',
      parents: [
        {
          id: 'person_parent_1',
          name: 'Parent One',
          sex: Sex.FEMALE,
          birthDate: '1970'
        },
        {
          id: 'person_parent_2',
          name: 'Parent Two',
          sex: Sex.MALE,
          birthDate: '1968'
        }
      ]
    };

    const report = analyzeDataQuality(root);

    expect(report.totalPersons).toBe(3);
    expect(report.uniquePersons).toBe(3);
    expect(report.issues).toHaveLength(0);
  });

  it('flags duplicate IDs across distinct people', () => {
    const root: Person = {
      id: 'person_child',
      name: 'Child',
      birthDate: '2000',
      parents: [
        {
          id: 'person_duplicate',
          name: 'Parent One',
          birthDate: '1970'
        },
        {
          id: 'person_duplicate',
          name: 'Parent Two',
          birthDate: '1968'
        }
      ]
    };

    const report = analyzeDataQuality(root);

    expect(report.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'duplicate-id',
          severity: 'error'
        })
      ])
    );
  });

  it('detects cycles without recursing forever', () => {
    const root: Person = {
      id: 'person_root',
      name: 'Root',
      birthDate: '2000',
      parents: []
    };
    root.parents = [root];

    const report = analyzeDataQuality(root);

    expect(report.totalPersons).toBe(2);
    expect(report.uniquePersons).toBe(1);
    expect(report.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'cycle',
          path: 'root.parents[0]'
        })
      ])
    );
  });

  it('flags impossible birth and death date ordering', () => {
    const root: Person = {
      id: 'person_bad_dates',
      name: 'Bad Dates',
      birthDate: '1900',
      deathDate: '1850'
    };

    const report = analyzeDataQuality(root);

    expect(report.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          type: 'invalid-date-order',
          personName: 'Bad Dates'
        })
      ])
    );
  });

  it('flags parent and child date conflicts', () => {
    const root: Person = {
      id: 'person_child',
      name: 'Child',
      birthDate: '1900',
      parents: [
        {
          id: 'person_parent',
          name: 'Parent',
          birthDate: '1905',
          deathDate: '1890'
        }
      ]
    };

    const report = analyzeDataQuality(root);

    expect(report.errors.filter(issue => issue.type === 'parent-child-date-conflict')).toHaveLength(2);
  });

  it('warns about missing stable IDs and unusual parent ages', () => {
    const root: Person = {
      id: 'person_child',
      name: 'Child',
      birthDate: '1900',
      parents: [
        {
          name: 'Young Parent',
          birthDate: '1890'
        }
      ]
    };

    const report = analyzeDataQuality(root);

    expect(report.warnings).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ type: 'missing-id' }),
        expect.objectContaining({ type: 'parent-child-date-conflict' })
      ])
    );
  });
});
