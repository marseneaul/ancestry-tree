import type { HierarchyNode } from 'd3-hierarchy';
import type { Person } from '../interfaces/person';

export interface TreeSearchResult {
  suggestions: string[];
  matchingNodes: HierarchyNode<Person>[];
}

interface SearchEntry {
  name: string;
  normalizedName: string;
  node: HierarchyNode<Person>;
}

export class TreeSearchIndex {
  private entries: SearchEntry[];
  private uniqueNames: string[];
  private exactNameLookup: Map<string, HierarchyNode<Person>>;

  private constructor(entries: SearchEntry[]) {
    this.entries = entries;
    this.uniqueNames = Array.from(new Set(entries.map(entry => entry.name)));
    this.exactNameLookup = new Map();

    entries.forEach(entry => {
      if (!this.exactNameLookup.has(entry.name)) {
        this.exactNameLookup.set(entry.name, entry.node);
      }
    });
  }

  static fromRoot(root: HierarchyNode<Person>): TreeSearchIndex {
    const entries = root.descendants().map(node => {
      const name = node.data.name || 'Unknown';

      return {
        name,
        normalizedName: normalizeSearchText(name),
        node
      };
    });

    return new TreeSearchIndex(entries);
  }

  getAllNames(): string[] {
    return this.uniqueNames;
  }

  findExact(name: string): HierarchyNode<Person> | null {
    return this.exactNameLookup.get(name) ?? null;
  }

  search(query: string, suggestionLimit = 10): TreeSearchResult {
    const normalizedQuery = normalizeSearchText(query);

    if (!normalizedQuery) {
      return {
        suggestions: [],
        matchingNodes: []
      };
    }

    const matchingEntries = this.entries.filter(entry => entry.normalizedName.includes(normalizedQuery));
    const suggestions = Array.from(new Set(matchingEntries.map(entry => entry.name))).slice(0, suggestionLimit);

    return {
      suggestions,
      matchingNodes: matchingEntries.map(entry => entry.node)
    };
  }
}

function normalizeSearchText(value: string): string {
  return value.trim().toLowerCase();
}
