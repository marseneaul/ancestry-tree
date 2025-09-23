// Data migration utilities for standardizing existing family tree data
import { Person, Sex, ConfidenceLevel, MISSING_DATA } from '../interfaces/person';
import { standardizeMissingData, addMetadata, validatePerson } from './data-validation';
import { DataVersionManager, ChangeType } from './data-versioning';

/**
 * Migrates legacy Person data to the new standardized format
 */
export function migrateLegacyPersonData(legacyPerson: any, options: MigrationOptions = {}): Person {
  const migrated: Person = {
    name: legacyPerson.name || '',
    sex: standardizeSex(legacyPerson.sex),
    birthPlace: standardizePlace(legacyPerson.birthPlace),
    deathPlace: standardizePlace(legacyPerson.deathPlace),
    birthDate: standardizeDate(legacyPerson.birthDate),
    deathDate: standardizeDate(legacyPerson.deathDate),
    imageUrl: standardizeImageUrl(legacyPerson.imageUrl),
    story: legacyPerson.story,
    parents: legacyPerson.parents ? legacyPerson.parents.map((parent: any) => 
      parent ? migrateLegacyPersonData(parent, options) : parent
    ) : undefined
  };

  // Standardize missing data values
  const standardized = standardizeMissingData(migrated);
  
  // Add metadata if requested
  if (options.addMetadata !== false) {
    return addMetadata(standardized, options.source || 'migrated');
  }

  return standardized;
}

/**
 * Batch migration for multiple person configs
 */
export function migratePersonConfigs(configs: any[], options: MigrationOptions = {}): {
  migratedConfigs: Person[];
  migrationReport: MigrationReport;
} {
  const migratedConfigs: Person[] = [];
  const migrationReport: MigrationReport = {
    totalProcessed: configs.length,
    successful: 0,
    failed: 0,
    warnings: [],
    errors: []
  };

  configs.forEach((config, index) => {
    try {
      const migrated = migrateLegacyPersonData(config, options);
      migratedConfigs.push(migrated);
      migrationReport.successful++;
      
      // Validate the migrated data
      const validation = validatePerson(migrated);
      if (!validation.isValid) {
        migrationReport.warnings.push({
          index,
          name: migrated.name,
          message: `Validation issues found: ${validation.errors.length} errors, ${validation.warnings.length} warnings`
        });
      }
    } catch (error) {
      migrationReport.failed++;
      migrationReport.errors.push({
        index,
        name: config.name || 'Unknown',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  });

  return { migratedConfigs, migrationReport };
}

/**
 * Creates a migration script for existing config files
 */
export function generateMigrationScript(configPaths: string[]): string {
  const script = `// Auto-generated migration script
// Run this to migrate your existing config files to the new format

import { migrateLegacyPersonData } from '../utils/data-migration';
import { DataVersionManager } from '../utils/data-versioning';

// Original configs (replace with your actual imports)
${configPaths.map((path, index) => `import { originalConfig${index} } from '${path}';`).join('\n')}

// Migration function
export function migrateAllConfigs() {
  const versionManager = new DataVersionManager();
  
  // Migrate each config
${configPaths.map((_, index) => `  const migratedConfig${index} = migrateLegacyPersonData(originalConfig${index}, {
    source: 'config-migration',
    addMetadata: true
  });`).join('\n')}

  // Record migration
  versionManager.recordChange(
    'migrate',
    'all-configs',
    'Migrated all person configs to new format',
    undefined,
    'legacy-format',
    'new-format',
    'migration-script',
    'automated'
  );

  return {
${configPaths.map((_, index) => `    config${index}: migratedConfig${index}`).join(',\n')},
    versionManager
  };
}

// Export migrated configs
${configPaths.map((_, index) => `export const migratedConfig${index} = migrateLegacyPersonData(originalConfig${index});`).join('\n')}
`;

  return script;
}

// Helper functions for standardization

function standardizeSex(sex: any): Sex | undefined {
  if (!sex) return undefined;
  
  const sexStr = sex.toString().toLowerCase();
  if (sexStr === 'male' || sexStr === 'm') return Sex.MALE;
  if (sexStr === 'female' || sexStr === 'f') return Sex.FEMALE;
  if (sexStr === 'unknown' || sexStr === 'u') return Sex.UNKNOWN;
  
  return Sex.UNKNOWN;
}

function standardizePlace(place: any): string | undefined {
  if (!place) return undefined;
  
  const placeStr = place.toString().trim();
  if (placeStr === '' || placeStr.toLowerCase() === 'unknown' || placeStr === 'N/A') {
    return MISSING_DATA.UNKNOWN;
  }
  
  return placeStr;
}

function standardizeDate(date: any): string | undefined {
  if (!date) return undefined;
  
  const dateStr = date.toString().trim();
  if (dateStr === '' || dateStr.toLowerCase() === 'unknown' || dateStr === 'N/A') {
    return MISSING_DATA.UNKNOWN;
  }
  
  return dateStr;
}

function standardizeImageUrl(url: any): string | undefined {
  if (!url) return undefined;
  
  const urlStr = url.toString().trim();
  if (urlStr === '' || urlStr.toLowerCase() === 'unknown' || urlStr === 'N/A') {
    return undefined;
  }
  
  return urlStr;
}

// Types and interfaces

export interface MigrationOptions {
  addMetadata?: boolean;
  source?: string;
  validateAfterMigration?: boolean;
}

export interface MigrationReport {
  totalProcessed: number;
  successful: number;
  failed: number;
  warnings: MigrationWarning[];
  errors: MigrationError[];
}

export interface MigrationWarning {
  index: number;
  name: string;
  message: string;
}

export interface MigrationError {
  index: number;
  name: string;
  message: string;
}

/**
 * Utility to create a backup before migration
 */
export function createDataBackup(data: any, filename?: string): string {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupFilename = filename || `backup-${timestamp}.json`;
  
  const backup = {
    timestamp: new Date().toISOString(),
    version: '1.0',
    data: data,
    metadata: {
      backupType: 'pre-migration',
      originalFormat: 'legacy'
    }
  };
  
  // In a real application, you would save this to a file
  // For now, we'll return the JSON string
  return JSON.stringify(backup, null, 2);
}

/**
 * Validates that migration was successful
 */
export function validateMigration(originalData: any, migratedData: Person): ValidationResult {
  const issues: string[] = [];
  
  // Check that essential data is preserved
  if (originalData.name !== migratedData.name) {
    issues.push('Name changed during migration');
  }
  
  // Check that missing data is standardized
  if (originalData.birthPlace === 'N/A' && migratedData.birthPlace !== MISSING_DATA.UNKNOWN) {
    issues.push('Birth place not properly standardized');
  }
  
  if (originalData.deathDate === 'N/A' && migratedData.deathDate !== MISSING_DATA.UNKNOWN) {
    issues.push('Death date not properly standardized');
  }
  
  // Validate the migrated data
  const validation = validatePerson(migratedData);
  
  return {
    isValid: issues.length === 0 && validation.isValid,
    errors: [
      ...issues.map(issue => ({ field: 'migration', message: issue, severity: 'error' as const })),
      ...validation.errors
    ],
    warnings: validation.warnings
  };
}

export interface ValidationResult {
  isValid: boolean;
  errors: Array<{ field: string; message: string; severity: 'error' | 'warning' }>;
  warnings: Array<{ field: string; message: string; suggestion?: string }>;
}
