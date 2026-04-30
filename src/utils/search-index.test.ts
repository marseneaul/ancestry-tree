import { describe, expect, it } from 'vitest';
import { buildHierarchy } from './utils';
import { TreeSearchIndex } from './search-index';
import type { Person } from '../interfaces/person';

describe('TreeSearchIndex', () => {
  const rootPerson: Person = {
    name: 'Root Person',
    parents: [
      {
        name: 'Marie Example'
      },
      {
        name: 'Martin Example',
        parents: [
          {
            name: 'Marie Example'
          }
        ]
      }
    ]
  };

  it('returns unique display names for suggestions', () => {
    const index = TreeSearchIndex.fromRoot(buildHierarchy(rootPerson));

    expect(index.search('mar').suggestions).toEqual(['Marie Example', 'Martin Example']);
  });

  it('keeps all matching nodes for result counts and highlighting', () => {
    const index = TreeSearchIndex.fromRoot(buildHierarchy(rootPerson));
    const result = index.search('marie');

    expect(result.suggestions).toEqual(['Marie Example']);
    expect(result.matchingNodes).toHaveLength(2);
  });

  it('finds the first exact name match for centering', () => {
    const index = TreeSearchIndex.fromRoot(buildHierarchy(rootPerson));
    const node = index.findExact('Martin Example');

    expect(node?.data.name).toBe('Martin Example');
    expect(node?.depth).toBe(1);
  });

  it('returns empty results for blank queries', () => {
    const index = TreeSearchIndex.fromRoot(buildHierarchy(rootPerson));

    expect(index.search('   ')).toEqual({
      suggestions: [],
      matchingNodes: []
    });
  });
});
