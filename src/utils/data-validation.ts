// Data validation utilities for Person objects
import { Person, Sex, ConfidenceLevel, ValidationResult, ValidationError, ValidationWarning, MISSING_DATA } from '../interfaces/person';
import { slugify } from './helpers';

/**
 * Validates a Person object and returns detailed validation results
 */
export function validatePerson(person: Person, options: ValidationOptions = {}): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const activePath = options.activePath ?? new WeakSet<Person>();

  if (activePath.has(person)) {
    return {
      isValid: false,
      errors: [{
        field: 'parents',
        message: 'Cycle detected in parent relationships',
        severity: 'error'
      }],
      warnings: []
    };
  }

  activePath.add(person);
  
  // Required field validation
  if (!person.name || person.name.trim() === '') {
    errors.push({
      field: 'name',
      message: 'Name is required',
      severity: 'error'
    });
  }

  // Sex validation
  if (person.sex && !Object.values(Sex).includes(person.sex as Sex)) {
    errors.push({
      field: 'sex',
      message: `Invalid sex value: ${person.sex}. Must be one of: ${Object.values(Sex).join(', ')}`,
      severity: 'error'
    });
  }

  // Date validation
  if (person.birthDate && !isValidDate(person.birthDate)) {
    errors.push({
      field: 'birthDate',
      message: `Invalid birth date format: ${person.birthDate}`,
      severity: 'error'
    });
  }

  if (person.deathDate && !isValidDate(person.deathDate)) {
    errors.push({
      field: 'deathDate',
      message: `Invalid death date format: ${person.deathDate}`,
      severity: 'error'
    });
  }

  // Date logic validation
  if (person.birthDate && person.deathDate && isValidDate(person.birthDate) && isValidDate(person.deathDate)) {
    const birthYear = extractYear(person.birthDate);
    const deathYear = extractYear(person.deathDate);
    
    if (birthYear && deathYear && birthYear > deathYear) {
      errors.push({
        field: 'deathDate',
        message: 'Death date cannot be before birth date',
        severity: 'error'
      });
    }
  }

  // Age validation
  if (person.birthDate && person.deathDate && isValidDate(person.birthDate) && isValidDate(person.deathDate)) {
    const age = calculateAge(person.birthDate, person.deathDate);
    if (age && age > 150) {
      warnings.push({
        field: 'deathDate',
        message: `Unusually long lifespan: ${age} years`,
        suggestion: 'Please verify birth and death dates'
      });
    }
  }

  // Place validation
  if (person.birthPlace && isMissingData(person.birthPlace)) {
    warnings.push({
      field: 'birthPlace',
      message: 'Birth place marked as unknown/missing',
      suggestion: 'Consider researching or marking as unknown'
    });
  }

  if (person.deathPlace && isMissingData(person.deathPlace)) {
    warnings.push({
      field: 'deathPlace',
      message: 'Death place marked as unknown/missing',
      suggestion: 'Consider researching or marking as unknown'
    });
  }

  // Parents validation
  if (person.parents) {
    if (person.parents.length > 2) {
      errors.push({
        field: 'parents',
        message: 'Person cannot have more than 2 parents',
        severity: 'error'
      });
    }

    // Validate parent relationships
    person.parents.forEach((parent, index) => {
      if (parent) {
        const parentValidation = validatePerson(parent, {
          ...options,
          activePath,
          depth: (options.depth || 0) + 1
        });
        if (!parentValidation.isValid) {
          parentValidation.errors.forEach(error => {
            errors.push({
              ...error,
              field: `parents[${index}].${error.field}`
            });
          });
        }
        parentValidation.warnings.forEach(warning => {
          warnings.push({
            ...warning,
            field: `parents[${index}].${warning.field}`
          });
        });
      }
    });
  }

  // Image URL validation
  if (person.imageUrl && !isValidImageUrl(person.imageUrl)) {
    warnings.push({
      field: 'imageUrl',
      message: 'Invalid image URL format',
      suggestion: 'Check if the image path is correct'
    });
  }

  // Metadata validation
  if (person.confidence && !Object.values(ConfidenceLevel).includes(person.confidence)) {
    errors.push({
      field: 'confidence',
      message: `Invalid confidence level: ${person.confidence}`,
      severity: 'error'
    });
  }

  activePath.delete(person);

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Standardizes missing data values across the application
 */
export function standardizeMissingData(person: Person): Person {
  const standardized = { ...person };

  // Standardize missing data values
  if (isMissingData(standardized.birthPlace)) {
    standardized.birthPlace = MISSING_DATA.UNKNOWN;
  }
  if (isMissingData(standardized.deathPlace)) {
    standardized.deathPlace = MISSING_DATA.UNKNOWN;
  }
  if (isMissingData(standardized.birthDate)) {
    standardized.birthDate = MISSING_DATA.UNKNOWN;
  }
  if (isMissingData(standardized.deathDate)) {
    standardized.deathDate = MISSING_DATA.UNKNOWN;
  }
  if (isMissingData(standardized.sex)) {
    standardized.sex = Sex.UNKNOWN;
  }

  // Recursively standardize parents
  if (standardized.parents) {
    standardized.parents = standardized.parents.map(parent => 
      parent ? standardizeMissingData(parent) : parent
    );
  }

  return standardized;
}

/**
 * Adds metadata to a Person object
 */
export function addMetadata(person: Person, source: string = 'manual'): Person {
  return {
    ...person,
    id: person.id || generateId(person, source),
    version: person.version || 1,
    lastModified: new Date().toISOString(),
    dataSource: source,
    confidence: person.confidence || ConfidenceLevel.UNKNOWN
  };
}

/**
 * Validates and migrates legacy Person data to new format
 */
export function migratePersonData(legacyPerson: any): Person {
  const migrated: Person = {
    name: legacyPerson.name || '',
    sex: legacyPerson.sex as Sex,
    birthPlace: legacyPerson.birthPlace,
    deathPlace: legacyPerson.deathPlace,
    birthDate: legacyPerson.birthDate,
    deathDate: legacyPerson.deathDate,
    imageUrl: legacyPerson.imageUrl,
    story: legacyPerson.story,
    parents: legacyPerson.parents ? legacyPerson.parents.map((parent: any) => 
      parent ? migratePersonData(parent) : parent
    ) : undefined
  };

  // Standardize missing data
  const standardized = standardizeMissingData(migrated);
  
  // Add metadata
  return addMetadata(standardized, 'migrated');
}

// Helper functions

interface ValidationOptions {
  depth?: number;
  maxDepth?: number;
  activePath?: WeakSet<Person>;
}

function isValidDate(dateStr: string): boolean {
  if (!dateStr || isMissingData(dateStr)) return false;
  
  // Handle various date formats
  const patterns = [
    /^\d{1,2}\s+\w+\s+\d{4}$/, // "13 August 1997"
    /^\d{4}-\d{2}-\d{2}$/, // "1997-08-13"
    /^\d{4}$/, // "1997"
    /^circa\s+\d{4}/i, // "circa 1997"
    /^c\.\s*\d{4}/i, // "c. 1997"
    /^\d{4}\s+BCE?$/i, // "1997 BCE"
    /^\d{4}\s+CE?$/i // "1997 CE"
  ];
  
  return patterns.some(pattern => pattern.test(dateStr.trim()));
}

function extractYear(dateStr: string): number | null {
  if (!dateStr) return null;
  
  const yearMatch = dateStr.match(/\b(\d{4})\b/);
  if (yearMatch) {
    const year = parseInt(yearMatch[1]);
    // Handle BCE dates
    if (dateStr.toLowerCase().includes('bce') || dateStr.toLowerCase().includes('bc')) {
      return -year;
    }
    return year;
  }
  
  return null;
}

function calculateAge(birthDate: string, deathDate: string): number | null {
  const birthYear = extractYear(birthDate);
  const deathYear = extractYear(deathDate);
  
  if (birthYear && deathYear) {
    return Math.abs(deathYear - birthYear);
  }
  
  return null;
}

function isMissingData(value: string | undefined | null): boolean {
  if (!value) return true;
  const lowerValue = value.toLowerCase();
  return lowerValue === 'unknown' || 
         lowerValue === 'n/a' || 
         lowerValue === 'not available' ||
         lowerValue === 'not applicable' ||
         lowerValue === '?' ||
         lowerValue === '';
}

function isValidImageUrl(url: string): boolean {
  if (!url) return false;
  
  // Check for common image extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg'];
  const hasImageExtension = imageExtensions.some(ext => 
    url.toLowerCase().includes(ext)
  );
  
  // Check for valid URL format
  try {
    new URL(url);
    return true;
  } catch {
    // If not a full URL, check if it's a relative path
    return hasImageExtension && url.startsWith('./') || url.startsWith('/');
  }
}

function generateId(person: Person, source: string): string {
  const keyParts = [
    person.name,
    person.birthDate,
    person.birthPlace,
    person.deathDate,
    person.sex,
    source
  ].filter(Boolean);

  const stableKey = slugify(keyParts.join('-'));
  return `person_${stableKey || 'unknown'}`;
}

/**
 * Validates an entire family tree
 */
export function validateFamilyTree(root: Person): ValidationResult {
  const errors: ValidationError[] = [];
  const warnings: ValidationWarning[] = [];
  const activePath = new WeakSet<Person>();
  
  function validateNode(person: Person, path: string = ''): void {
    if (activePath.has(person)) {
      errors.push({
        field: path || 'parents',
        message: 'Cycle detected in parent relationships',
        severity: 'error'
      });
      return;
    }

    activePath.add(person);
    const result = validatePerson(person);
    
    result.errors.forEach(error => {
      errors.push({
        ...error,
        field: path ? `${path}.${error.field}` : error.field
      });
    });
    
    result.warnings.forEach(warning => {
      warnings.push({
        ...warning,
        field: path ? `${path}.${warning.field}` : warning.field
      });
    });
    
    // Recursively validate parents
    if (person.parents) {
      person.parents.forEach((parent, index) => {
        if (parent) {
          validateNode(parent, `${path}parents[${index}]`);
        }
      });
    }

    activePath.delete(person);
  }
  
  validateNode(root);
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}
