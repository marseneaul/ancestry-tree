// Example demonstrating the new data management and validation system
import { Person, Sex, ConfidenceLevel, MISSING_DATA } from '../interfaces/person';
import { validatePerson, standardizeMissingData, addMetadata } from '../utils/data-validation';
import { DataVersionManager, ChangeType } from '../utils/data-versioning';
import { migrateLegacyPersonData } from '../utils/data-migration';

/**
 * Example 1: Creating a new Person with proper validation
 */
export function createValidPersonExample(): Person {
  const person: Person = {
    name: "John Doe",
    sex: Sex.MALE,
    birthPlace: "New York, USA",
    birthDate: "15 March 1980",
    deathDate: MISSING_DATA.UNKNOWN, // Standardized missing data
    parents: [],
    imageUrl: "./images/john-doe.jpg",
    story: "A sample person for demonstration",
    // Metadata
    id: "person_123",
    version: 1,
    lastModified: new Date().toISOString(),
    dataSource: "manual-entry",
    confidence: ConfidenceLevel.HIGH
  };

  // Validate the person
  const validation = validatePerson(person);
  console.log('Person validation result:', validation);
  
  if (!validation.isValid) {
    console.error('Validation errors:', validation.errors);
  }
  
  if (validation.warnings.length > 0) {
    console.warn('Validation warnings:', validation.warnings);
  }

  return person;
}

/**
 * Example 2: Migrating legacy data
 */
export function migrateLegacyDataExample() {
  // Simulate legacy data with inconsistent formats
  const legacyData = {
    name: "Jane Smith",
    sex: "Female", // String instead of enum
    birthPlace: "N/A", // Inconsistent missing data
    deathPlace: "Unknown", // Different missing data format
    birthDate: "1985-05-20",
    deathDate: null, // null instead of standardized value
    parents: [
      {
        name: "Robert Smith",
        sex: "Male",
        birthPlace: "England",
        birthDate: "1950",
        deathDate: "N/A"
      }
    ]
  };

  console.log('Original legacy data:', legacyData);

  // Migrate the data
  const migratedData = migrateLegacyPersonData(legacyData, {
    source: 'legacy-import',
    addMetadata: true
  });

  console.log('Migrated data:', migratedData);

  // Validate the migrated data
  const validation = validatePerson(migratedData);
  console.log('Migration validation:', validation);

  return migratedData;
}

/**
 * Example 3: Using data versioning
 */
export function dataVersioningExample() {
  // Create a version manager
  const versionManager = new DataVersionManager();
  
  // Create initial person
  let person: Person = {
    name: "Alice Johnson",
    sex: Sex.FEMALE,
    birthPlace: "California, USA",
    birthDate: "1990-01-01",
    parents: []
  };

  // Add metadata
  person = addMetadata(person, 'initial-creation');
  
  // Record initial creation
  versionManager.recordChange(
    ChangeType.CREATE,
    person.id!,
    'Initial person creation',
    undefined,
    undefined,
    person,
    'user-1',
    'manual'
  );

  // Update the person
  const originalPerson = { ...person };
  person.birthPlace = "Los Angeles, California, USA";
  person.story = "Updated with more specific birth location";
  person.version = (person.version || 1) + 1;
  person.lastModified = new Date().toISOString();

  // Record the update
  versionManager.recordChange(
    ChangeType.UPDATE,
    person.id!,
    'Updated birth place and added story',
    'birthPlace',
    originalPerson.birthPlace,
    person.birthPlace,
    'user-1',
    'manual'
  );

  // Get change history
  const history = versionManager.getPersonHistory(person.id!);
  console.log('Change history for person:', history);

  // Get recent changes
  const recentChanges = versionManager.getRecentChanges(5);
  console.log('Recent changes:', recentChanges);

  return { person, versionManager };
}

/**
 * Example 4: Data quality assessment
 */
export function dataQualityExample() {
  // Create a sample family tree
  const rootPerson: Person = {
    name: "Root Person",
    sex: Sex.MALE,
    birthPlace: "USA",
    birthDate: "1950",
    parents: [
      {
        name: "Parent 1",
        sex: Sex.FEMALE,
        birthPlace: MISSING_DATA.UNKNOWN, // Missing data
        birthDate: "1920",
        parents: []
      },
      {
        name: "Parent 2", 
        sex: Sex.MALE,
        birthPlace: "Germany",
        birthDate: "1925",
        deathDate: "2000",
        parents: []
      }
    ]
  };

  // Create version manager and validate
  const versionManager = new DataVersionManager(rootPerson);
  const qualityMetrics = versionManager.getDataQualityMetrics(rootPerson);

  console.log('Data Quality Metrics:', qualityMetrics);
  
  return qualityMetrics;
}

/**
 * Example 5: Batch validation of multiple persons
 */
export function batchValidationExample() {
  const persons: Person[] = [
    {
      name: "Person 1",
      sex: Sex.MALE,
      birthPlace: "USA",
      birthDate: "1980",
      parents: []
    },
    {
      name: "Person 2",
      sex: Sex.FEMALE,
      birthPlace: MISSING_DATA.UNKNOWN,
      birthDate: "1985",
      parents: []
    },
    {
      name: "", // Invalid - empty name
      sex: Sex.MALE,
      birthPlace: "Canada",
      birthDate: "invalid-date", // Invalid date
      parents: []
    }
  ];

  const validationResults = persons.map((person, index) => {
    const validation = validatePerson(person);
    return {
      index,
      name: person.name,
      isValid: validation.isValid,
      errorCount: validation.errors.length,
      warningCount: validation.warnings.length,
      errors: validation.errors,
      warnings: validation.warnings
    };
  });

  console.log('Batch validation results:', validationResults);
  
  return validationResults;
}

/**
 * Example 6: Standardizing existing data
 */
export function standardizeDataExample() {
  const inconsistentData: Person = {
    name: "Test Person",
    sex: "Male" as any, // Wrong type
    birthPlace: "N/A", // Inconsistent missing data
    deathPlace: "Unknown", // Different format
    birthDate: "1980",
    deathDate: null, // null value
    parents: []
  };

  console.log('Before standardization:', inconsistentData);

  // Standardize the data
  const standardized = standardizeMissingData(inconsistentData);
  
  console.log('After standardization:', standardized);

  // Add metadata
  const withMetadata = addMetadata(standardized, 'standardization-example');
  
  console.log('With metadata:', withMetadata);

  return withMetadata;
}

/**
 * Run all examples
 */
export function runAllExamples() {
  console.log('=== Data Management Examples ===\n');
  
  console.log('1. Creating a valid person:');
  createValidPersonExample();
  
  console.log('\n2. Migrating legacy data:');
  migrateLegacyDataExample();
  
  console.log('\n3. Data versioning:');
  dataVersioningExample();
  
  console.log('\n4. Data quality assessment:');
  dataQualityExample();
  
  console.log('\n5. Batch validation:');
  batchValidationExample();
  
  console.log('\n6. Standardizing data:');
  standardizeDataExample();
  
  console.log('\n=== Examples completed ===');
}

// Functions are already exported with 'export function' declarations above
