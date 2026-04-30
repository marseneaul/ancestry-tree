import type { Person } from '../interfaces/person';

export type DataQualityIssueType =
  | 'duplicate-id'
  | 'cycle'
  | 'missing-id'
  | 'invalid-date-order'
  | 'parent-child-date-conflict'
  | 'too-many-parents';

export type DataQualitySeverity = 'error' | 'warning';

export interface DataQualityIssue {
  type: DataQualityIssueType;
  severity: DataQualitySeverity;
  path: string;
  personName: string;
  message: string;
}

export interface DataQualityReport {
  totalPersons: number;
  uniquePersons: number;
  issues: DataQualityIssue[];
  errors: DataQualityIssue[];
  warnings: DataQualityIssue[];
}

interface ObjectRecord {
  id?: string;
  paths: string[];
}

interface IdOwner {
  person: Person;
  paths: string[];
}

export function analyzeDataQuality(root: Person): DataQualityReport {
  const issues: DataQualityIssue[] = [];
  const activePath = new WeakSet<Person>();
  const objectRecords = new WeakMap<Person, ObjectRecord>();
  const idOwners = new Map<string, IdOwner[]>();
  let totalPersons = 0;
  let uniquePersons = 0;

  function addIssue(issue: DataQualityIssue): void {
    issues.push(issue);
  }

  function addIdOwner(person: Person, path: string): void {
    if (!person.id) return;

    const owners = idOwners.get(person.id) ?? [];
    owners.push({ person, paths: [path] });
    idOwners.set(person.id, owners);
  }

  function visit(person: Person, path: string): void {
    totalPersons++;

    if (activePath.has(person)) {
      addIssue({
        type: 'cycle',
        severity: 'error',
        path,
        personName: person.name || 'Unnamed person',
        message: `Cycle detected at ${path}; this branch points back to an ancestor already being visited.`
      });
      return;
    }

    const existingRecord = objectRecords.get(person);
    if (existingRecord) {
      existingRecord.paths.push(path);
      return;
    }

    uniquePersons++;
    objectRecords.set(person, { id: person.id, paths: [path] });
    addIdOwner(person, path);

    const personName = person.name || 'Unnamed person';

    if (!person.id) {
      addIssue({
        type: 'missing-id',
        severity: 'warning',
        path,
        personName,
        message: `${personName} does not have a stable ID.`
      });
    }

    if (person.parents && person.parents.length > 2) {
      addIssue({
        type: 'too-many-parents',
        severity: 'error',
        path,
        personName,
        message: `${personName} has ${person.parents.length} parents; expected no more than 2.`
      });
    }

    checkDateOrder(person, path, addIssue);

    activePath.add(person);
    person.parents?.forEach((parent, index) => {
      if (!parent) return;

      const parentPath = `${path}.parents[${index}]`;
      checkParentChildDates(parent, person, parentPath, path, addIssue);
      visit(parent, parentPath);
    });
    activePath.delete(person);
  }

  visit(root, 'root');

  idOwners.forEach((owners, id) => {
    if (owners.length < 2) return;

    const paths = owners.flatMap(owner => owner.paths);
    const firstOwner = owners[0];
    addIssue({
      type: 'duplicate-id',
      severity: 'error',
      path: firstOwner.paths[0],
      personName: firstOwner.person.name || 'Unnamed person',
      message: `Duplicate ID "${id}" is used by multiple people at ${paths.join(', ')}.`
    });
  });

  const errors = issues.filter(issue => issue.severity === 'error');
  const warnings = issues.filter(issue => issue.severity === 'warning');

  return {
    totalPersons,
    uniquePersons,
    issues,
    errors,
    warnings
  };
}

function checkDateOrder(
  person: Person,
  path: string,
  addIssue: (issue: DataQualityIssue) => void
): void {
  const birthYear = extractYear(person.birthDate);
  const deathYear = extractYear(person.deathDate);

  if (birthYear === null || deathYear === null || birthYear <= deathYear) return;

  const personName = person.name || 'Unnamed person';
  addIssue({
    type: 'invalid-date-order',
    severity: 'error',
    path,
    personName,
    message: `${personName} has a birth year (${birthYear}) after death year (${deathYear}).`
  });
}

function checkParentChildDates(
  parent: Person,
  child: Person,
  parentPath: string,
  childPath: string,
  addIssue: (issue: DataQualityIssue) => void
): void {
  const parentBirthYear = extractYear(parent.birthDate);
  const parentDeathYear = extractYear(parent.deathDate);
  const childBirthYear = extractYear(child.birthDate);

  if (childBirthYear === null) return;

  const parentName = parent.name || 'Unnamed parent';
  const childName = child.name || 'Unnamed child';

  if (parentBirthYear !== null) {
    const parentAgeAtBirth = childBirthYear - parentBirthYear;

    if (parentAgeAtBirth <= 0) {
      addIssue({
        type: 'parent-child-date-conflict',
        severity: 'error',
        path: parentPath,
        personName: parentName,
        message: `${parentName} is born in ${parentBirthYear}, which is not before ${childName}'s birth year (${childBirthYear}) at ${childPath}.`
      });
    } else if (parentAgeAtBirth < 12) {
      addIssue({
        type: 'parent-child-date-conflict',
        severity: 'warning',
        path: parentPath,
        personName: parentName,
        message: `${parentName} appears to be ${parentAgeAtBirth} years old when ${childName} is born.`
      });
    } else if (parentAgeAtBirth > 80) {
      addIssue({
        type: 'parent-child-date-conflict',
        severity: 'warning',
        path: parentPath,
        personName: parentName,
        message: `${parentName} appears to be ${parentAgeAtBirth} years old when ${childName} is born.`
      });
    }
  }

  if (parentDeathYear !== null && parentDeathYear < childBirthYear - 1) {
    addIssue({
      type: 'parent-child-date-conflict',
      severity: 'error',
      path: parentPath,
      personName: parentName,
      message: `${parentName} died in ${parentDeathYear}, before ${childName}'s birth year (${childBirthYear}).`
    });
  }
}

function extractYear(value?: string): number | null {
  if (!value || isMissingData(value)) return null;

  const matches = Array.from(value.matchAll(/\b(\d{1,5})\b/g), match => Number(match[1]));
  if (matches.length === 0) return null;

  const year = matches.find(match => match >= 100) ?? matches[matches.length - 1];
  const lowerValue = value.toLowerCase();

  return lowerValue.includes('bce') || lowerValue.includes('bc') ? -year : year;
}

function isMissingData(value: string): boolean {
  const normalized = value.trim().toLowerCase();

  return normalized === '' ||
    normalized === 'unknown' ||
    normalized === 'n/a' ||
    normalized === 'not available' ||
    normalized === 'not applicable' ||
    normalized === '?';
}
