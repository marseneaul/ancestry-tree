import { describe, expect, it } from 'vitest';
import { Person, Sex } from '../interfaces/person';
import { addMetadata, validateFamilyTree, validatePerson } from './data-validation';

describe('addMetadata', () => {
  it('generates deterministic IDs from stable person fields', () => {
    const person = {
      name: 'Marie Évangéline Arsenault',
      sex: Sex.FEMALE,
      birthDate: '1875',
      birthPlace: 'Prince Edward Island, Canada',
      deathDate: '1942'
    };

    const first = addMetadata(person, 'manual');
    const second = addMetadata(person, 'manual');

    expect(first.id).toBe(second.id);
    expect(first.id).toBe('person_marie-evangeline-arsenault-1875-prince-edward-island-canada-1942-female-manual');
  });

  it('preserves existing IDs when metadata already has one', () => {
    const person = {
      id: 'person_existing',
      name: 'Existing Person',
      sex: Sex.UNKNOWN
    };

    expect(addMetadata(person, 'manual').id).toBe('person_existing');
  });
});

describe('family tree validation', () => {
  it('detects parent cycles in validatePerson without overflowing the stack', () => {
    const root: Person = {
      name: 'Root',
      parents: []
    };
    root.parents = [root];

    const result = validatePerson(root);

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'parents[0].parents',
          message: 'Cycle detected in parent relationships'
        })
      ])
    );
  });

  it('detects parent cycles in validateFamilyTree without overflowing the stack', () => {
    const root: Person = {
      name: 'Root',
      parents: []
    };
    root.parents = [root];

    const result = validateFamilyTree(root);

    expect(result.isValid).toBe(false);
    expect(result.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          field: 'parents[0]',
          message: 'Cycle detected in parent relationships'
        })
      ])
    );
  });
});
