import { describe, it, expect } from 'vitest';
import {
  buildHierarchy,
  tracePatrilineal,
  traceMatrilineal,
  calculateAgeAtDate,
  getCountry,
  countryColors,
  getGenerations,
  getInitials,
  getOrdinalFromNumber,
  getLeaves,
} from './utils';
import { Person } from '../interfaces/person';

describe('getCountry', () => {
  it('returns "France" for French locations', () => {
    expect(getCountry('Paris, France')).toBe('France');
    expect(getCountry('Some French colony')).toBe('France');
  });

  it('returns "United Kingdom" for British locations', () => {
    expect(getCountry('London, England')).toBe('United Kingdom');
    expect(getCountry('British Columbia')).toBe('United Kingdom');
    expect(getCountry('Manchester, United Kingdom')).toBe('United Kingdom');
  });

  it('returns "Ireland" for Irish locations', () => {
    expect(getCountry('Dublin, Ireland')).toBe('Ireland');
    expect(getCountry('Irish settlement')).toBe('Ireland');
  });

  it('returns "Germany" for German locations', () => {
    expect(getCountry('Berlin, Germany')).toBe('Germany');
    expect(getCountry('Prussia')).toBe('Germany');
    expect(getCountry('Deutschland')).toBe('Germany');
  });

  it('returns "Canada" for Canadian locations', () => {
    expect(getCountry('Toronto, Canada')).toBe('Canada');
    expect(getCountry('Canadian territory')).toBe('Canada');
  });

  it('returns "United States" for US locations', () => {
    expect(getCountry('New York, United States')).toBe('United States');
    expect(getCountry('California, USA')).toBe('United States');
    expect(getCountry('America')).toBe('United States');
  });

  it('returns indigenous nations correctly', () => {
    expect(getCountry("Mi'kmaq territory")).toBe("Mi'kmaq Nation");
    expect(getCountry('Micmac settlement')).toBe("Mi'kmaq Nation");
    expect(getCountry('Nipissing Nation lands')).toBe('Nipissing Nation');
  });

  it('returns "Unknown" for empty or unknown places', () => {
    expect(getCountry(undefined)).toBe('Unknown');
    expect(getCountry('')).toBe('Unknown');
    expect(getCountry('Unknown')).toBe('Unknown');
  });

  it('extracts country from comma-separated locations as fallback', () => {
    expect(getCountry('Some City, Some Province, Spain')).toBe('Spain');
    expect(getCountry('Madrid, SPAIN')).toBe('SPAIN');
  });
});

describe('countryColors', () => {
  it('has colors defined for major countries', () => {
    expect(countryColors['Germany']).toBeDefined();
    expect(countryColors['France']).toBeDefined();
    expect(countryColors['United Kingdom']).toBeDefined();
    expect(countryColors['Canada']).toBeDefined();
    expect(countryColors['United States']).toBeDefined();
    expect(countryColors['Unknown']).toBe('#808080');
  });
});

describe('getInitials', () => {
  it('returns initials from a full name', () => {
    expect(getInitials('John Smith')).toBe('JS');
    expect(getInitials('Mary Jane Watson')).toBe('MJ');
  });

  it('handles single names', () => {
    expect(getInitials('John')).toBe('J');
  });

  it('limits to 2 initials', () => {
    expect(getInitials('John Paul George Ringo')).toBe('JP');
  });

  it('handles undefined/empty names', () => {
    expect(getInitials(undefined)).toBe('?');
    expect(getInitials('')).toBe('?');
  });

  it('filters out non-letter initials', () => {
    expect(getInitials('123 Test')).toBe('T');
  });
});

describe('getOrdinalFromNumber', () => {
  it('returns correct ordinals for 1-3', () => {
    expect(getOrdinalFromNumber(1)).toBe('1st');
    expect(getOrdinalFromNumber(2)).toBe('2nd');
    expect(getOrdinalFromNumber(3)).toBe('3rd');
  });

  it('returns "th" for 4-20', () => {
    expect(getOrdinalFromNumber(4)).toBe('4th');
    expect(getOrdinalFromNumber(10)).toBe('10th');
    expect(getOrdinalFromNumber(11)).toBe('11th');
    expect(getOrdinalFromNumber(12)).toBe('12th');
    expect(getOrdinalFromNumber(13)).toBe('13th');
  });

  it('handles larger numbers correctly', () => {
    expect(getOrdinalFromNumber(21)).toBe('21st');
    expect(getOrdinalFromNumber(22)).toBe('22nd');
    expect(getOrdinalFromNumber(23)).toBe('23rd');
    expect(getOrdinalFromNumber(24)).toBe('24th');
    expect(getOrdinalFromNumber(111)).toBe('111th');
    expect(getOrdinalFromNumber(112)).toBe('112th');
    expect(getOrdinalFromNumber(113)).toBe('113th');
  });
});

describe('calculateAgeAtDate', () => {
  it('calculates age correctly for standard dates', () => {
    expect(calculateAgeAtDate('1990-01-01', '2020-01-01')).toBe(30);
    expect(calculateAgeAtDate('1990-06-15', '2020-06-14')).toBe(29);
    expect(calculateAgeAtDate('1990-06-15', '2020-06-15')).toBe(30);
  });

  it('handles approximate dates with ~ prefix', () => {
    expect(calculateAgeAtDate('~1990-01-01', '2020-01-01')).toBe(30);
  });

  it('handles dates with < or > prefix', () => {
    expect(calculateAgeAtDate('<1990-01-01', '2020-01-01')).toBe(30);
    expect(calculateAgeAtDate('>1990-01-01', '2020-01-01')).toBe(30);
  });

  it('returns null for invalid/empty dates', () => {
    expect(calculateAgeAtDate('', '2020-01-01')).toBeNull();
    expect(calculateAgeAtDate('invalid', '2020-01-01')).toBeNull();
  });

  it('parses dates with month names', () => {
    const age = calculateAgeAtDate('15 January 1990', '15 January 2020');
    expect(age).toBe(30);
  });

  it('extracts year from complex date strings', () => {
    const age = calculateAgeAtDate('29/30 September 1990', '1 January 2020');
    expect(age).toBe(29);
  });
});

describe('buildHierarchy', () => {
  it('creates a hierarchy from a single person', () => {
    const person: Person = { name: 'Test Person' };
    const hierarchy = buildHierarchy(person);
    expect(hierarchy.data.name).toBe('Test Person');
    expect(hierarchy.children).toBeUndefined();
  });

  it('creates hierarchy with parents sorted (female first)', () => {
    const person: Person = {
      name: 'Child',
      parents: [
        { name: 'Father', sex: 'Male' as any },
        { name: 'Mother', sex: 'Female' as any },
      ],
    };
    const hierarchy = buildHierarchy(person);
    expect(hierarchy.children).toHaveLength(2);
    expect(hierarchy.children![0].data.name).toBe('Mother');
    expect(hierarchy.children![1].data.name).toBe('Father');
  });

  it('handles deeply nested hierarchies', () => {
    const person: Person = {
      name: 'Child',
      parents: [
        {
          name: 'Mother',
          sex: 'Female' as any,
          parents: [
            { name: 'Grandmother', sex: 'Female' as any },
            { name: 'Grandfather', sex: 'Male' as any },
          ],
        },
        { name: 'Father', sex: 'Male' as any },
      ],
    };
    const hierarchy = buildHierarchy(person);
    expect(hierarchy.height).toBe(2);
  });
});

describe('tracePatrilineal', () => {
  it('traces father line (Y-chromosome)', () => {
    const person: Person = {
      name: 'Child',
      parents: [
        { name: 'Mother', sex: 'Female' as any },
        {
          name: 'Father',
          sex: 'Male' as any,
          parents: [
            { name: 'Grandmother', sex: 'Female' as any },
            {
              name: 'Grandfather',
              sex: 'Male' as any,
              parents: [
                { name: 'Great-Grandmother', sex: 'Female' as any },
                { name: 'Great-Grandfather', sex: 'Male' as any },
              ],
            },
          ],
        },
      ],
    };
    const path = tracePatrilineal(person);
    expect(path).toEqual(['Child', 'Father', 'Grandfather', 'Great-Grandfather']);
  });

  it('stops when no male parent found', () => {
    const person: Person = {
      name: 'Child',
      parents: [
        { name: 'Mother', sex: 'Female' as any },
        { name: 'Father', sex: 'Male' as any },
      ],
    };
    const path = tracePatrilineal(person);
    expect(path).toEqual(['Child', 'Father']);
  });

  it('handles person with no parents', () => {
    const person: Person = { name: 'Solo' };
    const path = tracePatrilineal(person);
    expect(path).toEqual(['Solo']);
  });
});

describe('traceMatrilineal', () => {
  it('traces mother line (mitochondrial)', () => {
    const person: Person = {
      name: 'Child',
      parents: [
        {
          name: 'Mother',
          sex: 'Female' as any,
          parents: [
            {
              name: 'Grandmother',
              sex: 'Female' as any,
              parents: [
                { name: 'Great-Grandmother', sex: 'Female' as any },
                { name: 'Great-Grandfather', sex: 'Male' as any },
              ],
            },
            { name: 'Grandfather', sex: 'Male' as any },
          ],
        },
        { name: 'Father', sex: 'Male' as any },
      ],
    };
    const path = traceMatrilineal(person);
    expect(path).toEqual(['Child', 'Mother', 'Grandmother', 'Great-Grandmother']);
  });

  it('stops when no female parent found', () => {
    const person: Person = {
      name: 'Child',
      parents: [
        { name: 'Mother', sex: 'Female' as any },
        { name: 'Father', sex: 'Male' as any },
      ],
    };
    const path = traceMatrilineal(person);
    expect(path).toEqual(['Child', 'Mother']);
  });
});

describe('getLeaves', () => {
  it('returns the person if they have no parents', () => {
    const person: Person = { name: 'Leaf' };
    const leaves = getLeaves(person);
    expect(leaves).toHaveLength(1);
    expect(leaves[0].name).toBe('Leaf');
  });

  it('returns all leaf ancestors', () => {
    const person: Person = {
      name: 'Child',
      parents: [
        {
          name: 'Mother',
          sex: 'Female' as any,
          parents: [
            { name: 'MG-Mother', sex: 'Female' as any },
            { name: 'MG-Father', sex: 'Male' as any },
          ],
        },
        {
          name: 'Father',
          sex: 'Male' as any,
          parents: [
            { name: 'PG-Mother', sex: 'Female' as any },
            { name: 'PG-Father', sex: 'Male' as any },
          ],
        },
      ],
    };
    const leaves = getLeaves(person);
    expect(leaves).toHaveLength(4);
    const names = leaves.map((l) => l.name);
    expect(names).toContain('MG-Mother');
    expect(names).toContain('MG-Father');
    expect(names).toContain('PG-Mother');
    expect(names).toContain('PG-Father');
  });

  it('handles mixed depth trees', () => {
    const person: Person = {
      name: 'Child',
      parents: [
        { name: 'Mother', sex: 'Female' as any }, // leaf
        {
          name: 'Father',
          sex: 'Male' as any,
          parents: [
            { name: 'Grandmother', sex: 'Female' as any },
            { name: 'Grandfather', sex: 'Male' as any },
          ],
        },
      ],
    };
    const leaves = getLeaves(person);
    expect(leaves).toHaveLength(3);
    const names = leaves.map((l) => l.name);
    expect(names).toContain('Mother');
    expect(names).toContain('Grandmother');
    expect(names).toContain('Grandfather');
  });
});

describe('getGenerations', () => {
  it('calculates generation statistics', () => {
    const person: Person = {
      name: 'Child',
      parents: [
        { name: 'Mother', sex: 'Female' as any },
        { name: 'Father', sex: 'Male' as any },
      ],
    };
    const hierarchy = buildHierarchy(person);
    const gens = getGenerations(hierarchy);

    expect(gens.get(0)?.count).toBe(1);
    expect(gens.get(0)?.dnaPercentEach).toBe(100);

    expect(gens.get(1)?.count).toBe(2);
    expect(gens.get(1)?.dnaPercentEach).toBe(50);
  });

  it('calculates DNA percentages correctly for deeper generations', () => {
    const person: Person = {
      name: 'Child',
      parents: [
        {
          name: 'Mother',
          parents: [
            { name: 'GM1' },
            { name: 'GF1' },
          ],
        },
        {
          name: 'Father',
          parents: [
            { name: 'GM2' },
            { name: 'GF2' },
          ],
        },
      ],
    };
    const hierarchy = buildHierarchy(person);
    const gens = getGenerations(hierarchy);

    expect(gens.get(2)?.count).toBe(4);
    expect(gens.get(2)?.dnaPercentEach).toBe(25);
  });
});
