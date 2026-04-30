// Migration script for existing family tree data
import { Sex, MISSING_DATA } from '../interfaces/person';
import { migrateLegacyPersonData } from './data-migration';
import { DataVersionManager, ChangeType } from './data-versioning';
import { measureSync } from './performance';

// Import existing configs
import { maxArseneaultConfig } from '../data/configs/max-arseneault.config';

/**
 * Migrates the existing maxArseneaultConfig to the new format
 */
export function migrateMaxArseneaultConfig() {
  console.log('Starting migration of maxArseneaultConfig...');
  
  // Create version manager
  const versionManager = new DataVersionManager();
  
  // Migrate the data
  const migratedData = migrateLegacyPersonData(maxArseneaultConfig, {
    source: 'config-migration',
    addMetadata: true
  });
  
  // Record the migration
  versionManager.recordChange(
    ChangeType.MIGRATE,
    migratedData.id || 'max-arseneault',
    'Migrated maxArseneaultConfig to new format',
    undefined,
    maxArseneaultConfig,
    migratedData,
    'migration-script',
    'automated'
  );
  
  console.log('Migration completed successfully');
  console.log('Migration report:', versionManager.getRecentChanges(1));
  
  return {
    migratedData,
    versionManager
  };
}

/**
 * Utility function to fix sex values in existing data
 */
export function fixSexValues(data: any): any {
  if (typeof data === 'object' && data !== null) {
    const fixed = { ...data };
    
    // Fix sex values
    if (fixed.sex === 'Male') {
      fixed.sex = Sex.MALE;
    } else if (fixed.sex === 'Female') {
      fixed.sex = Sex.FEMALE;
    } else if (fixed.sex === 'Unknown' || !fixed.sex) {
      fixed.sex = Sex.UNKNOWN;
    }
    
    // Recursively fix parents
    if (fixed.parents && Array.isArray(fixed.parents)) {
      fixed.parents = fixed.parents.map((parent: any) => 
        parent ? fixSexValues(parent) : parent
      );
    }
    
    return fixed;
  }
  
  return data;
}

/**
 * Utility function to standardize missing data values
 */
export function standardizeMissingValues(data: any): any {
  if (typeof data === 'object' && data !== null) {
    const standardized = { ...data };
    
    // Standardize missing data values
    if (standardized.birthPlace === 'N/A' || standardized.birthPlace === 'Unknown') {
      standardized.birthPlace = MISSING_DATA.UNKNOWN;
    }
    if (standardized.deathPlace === 'N/A' || standardized.deathPlace === 'Unknown') {
      standardized.deathPlace = MISSING_DATA.UNKNOWN;
    }
    if (standardized.birthDate === 'N/A' || standardized.birthDate === 'Unknown') {
      standardized.birthDate = MISSING_DATA.UNKNOWN;
    }
    if (standardized.deathDate === 'N/A' || standardized.deathDate === 'Unknown') {
      standardized.deathDate = MISSING_DATA.UNKNOWN;
    }
    
    // Recursively standardize parents
    if (standardized.parents && Array.isArray(standardized.parents)) {
      standardized.parents = standardized.parents.map((parent: any) => 
        parent ? standardizeMissingValues(parent) : parent
      );
    }
    
    return standardized;
  }
  
  return data;
}

export interface CompleteMigrationOptions {
  log?: boolean;
  trackVersion?: boolean;
}

/**
 * Complete migration function that fixes all issues
 */
export function completeDataMigration(options: CompleteMigrationOptions = {}) {
  const shouldLog = options.log ?? false;
  const shouldTrackVersion = options.trackVersion ?? false;
  const log = (...args: unknown[]) => {
    if (shouldLog) console.log(...args);
  };

  log('Starting complete data migration...');
  
  // Step 1: Fix sex values
  const sexFixed = fixSexValues(maxArseneaultConfig);
  log('Fixed sex values');
  
  // Step 2: Standardize missing data
  const standardized = standardizeMissingValues(sexFixed);
  log('Standardized missing data values');
  
  // Step 3: Full migration with metadata
  const migrated = migrateLegacyPersonData(standardized, {
    source: 'complete-migration',
    addMetadata: true
  });
  log('Applied full migration with metadata');
  
  // Step 4: Create version manager and record changes
  const versionManager = shouldTrackVersion ? new DataVersionManager() : null;
  if (versionManager) {
    versionManager.recordChange(
      ChangeType.MIGRATE,
      migrated.id || 'max-arseneault',
      'Complete data migration - fixed sex values, standardized missing data, added metadata',
      undefined,
      maxArseneaultConfig,
      migrated,
      'migration-script',
      'automated'
    );
    log('Recorded migration in version manager');
  }
  
  log('Complete migration finished successfully');
  
  return {
    originalData: maxArseneaultConfig,
    migratedData: migrated,
    versionManager
  };
}

// Export the migrated data for use in main.ts
export const migratedMaxArseneaultConfig = measureSync(
  'data.completeMigration',
  () => completeDataMigration({ log: false, trackVersion: false }).migratedData
);
