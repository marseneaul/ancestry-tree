# Data Management & Validation System

This document describes the enhanced data management and validation system implemented for the ancestry tree application.

## Overview

The new system provides:
- **Type Safety**: Enhanced TypeScript interfaces with proper enums
- **Data Validation**: Comprehensive validation for Person objects
- **Standardized Missing Data**: Consistent handling of unknown/missing values
- **Data Versioning**: Change tracking and history management
- **Migration Tools**: Utilities to upgrade legacy data

## Key Components

### 1. Enhanced Person Interface (`src/interfaces/person.ts`)

```typescript
export interface Person {
  name: string;
  sex?: Sex;
  birthPlace?: string;
  deathPlace?: string;
  birthDate?: string;
  deathDate?: string;
  parents?: Person[];
  imageUrl?: string;
  story?: string;
  // Metadata for data management
  id?: string;
  version?: number;
  lastModified?: string;
  dataSource?: string;
  confidence?: ConfidenceLevel;
}
```

**New Features:**
- `Sex` enum for type-safe gender values
- `ConfidenceLevel` enum for data quality tracking
- Standardized missing data constants
- Metadata fields for versioning and tracking

### 2. Data Validation (`src/utils/data-validation.ts`)

Comprehensive validation system that checks:
- Required fields (name)
- Data type consistency
- Date format validation
- Date logic (death after birth)
- Age reasonableness
- Image URL validation
- Parent relationship validation

**Usage:**
```typescript
import { validatePerson } from '../utils/data-validation';

const person: Person = { /* ... */ };
const validation = validatePerson(person);

if (!validation.isValid) {
  console.error('Validation errors:', validation.errors);
}
```

### 3. Data Versioning (`src/utils/data-versioning.ts`)

Track all changes to family tree data:
- Change history for each person
- Version management
- Data quality metrics
- Export/import capabilities

**Usage:**
```typescript
import { DataVersionManager } from '../utils/data-versioning';

const versionManager = new DataVersionManager();
versionManager.recordChange(
  ChangeType.UPDATE,
  personId,
  'Updated birth date',
  'birthDate',
  oldValue,
  newValue,
  'user-123',
  'manual'
);
```

### 4. Data Migration (`src/utils/data-migration.ts`)

Migrate legacy data to new format:
- Standardize missing data values
- Fix type inconsistencies
- Add metadata
- Batch processing

**Usage:**
```typescript
import { migrateLegacyPersonData } from '../utils/data-migration';

const migratedData = migrateLegacyPersonData(legacyData, {
  source: 'legacy-import',
  addMetadata: true
});
```

## Standardized Missing Data

The system now uses consistent values for missing data:

```typescript
export const MISSING_DATA = {
  UNKNOWN: "Unknown",
  NOT_APPLICABLE: "N/A", 
  NOT_AVAILABLE: "Not Available"
} as const;
```

**Migration from legacy formats:**
- `"N/A"` → `"Unknown"`
- `null` → `"Unknown"`
- `undefined` → `"Unknown"`
- Empty strings → `"Unknown"`

## Data Quality Metrics

The system tracks data quality:

```typescript
interface DataQualityMetrics {
  totalPersons: number;
  personsWithCompleteData: number;
  personsWithMissingData: number;
  dataCompleteness: number; // percentage
  averageConfidence: number; // 0-3 scale
  validationIssues: number;
  lastValidated: string | null;
}
```

## Migration Guide

### For Existing Data

1. **Use the migration utility:**
   ```typescript
   import { migratedMaxArseneaultConfig } from './utils/migrate-existing-data';
   ```

2. **Update imports in main.ts:**
   ```typescript
   // Old
   import { maxArseneaultConfig } from "./data/configs/max-arseneault.config";
   
   // New
   import { migratedMaxArseneaultConfig } from "./utils/migrate-existing-data";
   ```

3. **Replace data references:**
   ```typescript
   // Old
   let rootPerson = maxArseneaultConfig;
   
   // New
   let rootPerson = migratedMaxArseneaultConfig;
   ```

### For New Data

1. **Use proper types:**
   ```typescript
   const person: Person = {
     name: "John Doe",
     sex: Sex.MALE, // Use enum, not string
     birthPlace: "New York, USA",
     birthDate: "15 March 1980",
     deathDate: MISSING_DATA.UNKNOWN, // Standardized missing data
     parents: []
   };
   ```

2. **Add metadata:**
   ```typescript
   import { addMetadata } from '../utils/data-validation';
   
   const personWithMetadata = addMetadata(person, 'manual-entry');
   ```

3. **Validate data:**
   ```typescript
   import { validatePerson } from '../utils/data-validation';
   
   const validation = validatePerson(person);
   if (!validation.isValid) {
     // Handle validation errors
   }
   ```

## Examples

See `src/examples/data-management-example.ts` for comprehensive examples of:
- Creating valid Person objects
- Migrating legacy data
- Using data versioning
- Assessing data quality
- Batch validation
- Standardizing data

## Benefits

1. **Type Safety**: Eliminates runtime errors from type mismatches
2. **Data Consistency**: Standardized missing data values
3. **Quality Tracking**: Monitor data completeness and accuracy
4. **Change History**: Track all modifications to family data
5. **Validation**: Catch data errors before they cause issues
6. **Migration**: Easy upgrade path from legacy formats

## Future Enhancements

- **Data Import/Export**: GEDCOM format support
- **Automated Validation**: Background validation of all data
- **Data Backup**: Automated backup with versioning
- **Collaborative Editing**: Multi-user change tracking
- **Data Analytics**: Advanced family tree analytics

## Troubleshooting

### Common Issues

1. **TypeScript Errors**: Ensure you're using the new enums (`Sex.MALE` instead of `"Male"`)
2. **Validation Failures**: Check that dates are in valid formats
3. **Migration Issues**: Use the provided migration utilities
4. **Missing Metadata**: Use `addMetadata()` function for new data

### Getting Help

- Check the examples in `src/examples/`
- Review validation errors for specific guidance
- Use the data quality metrics to identify issues
- Consult the change history for tracking modifications
