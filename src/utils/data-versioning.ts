// Data versioning and change tracking utilities
import { Person, ValidationResult } from '../interfaces/person';
import { validatePerson, standardizeMissingData, addMetadata } from './data-validation';
import { analyzeDataQuality } from './data-quality';

export interface DataChange {
  id: string;
  timestamp: string;
  type: ChangeType;
  personId: string;
  field?: string;
  oldValue?: any;
  newValue?: any;
  description: string;
  author?: string;
  source: string;
}

export enum ChangeType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  MERGE = 'merge',
  SPLIT = 'split',
  VALIDATE = 'validate',
  MIGRATE = 'migrate'
}

export interface DataVersion {
  version: number;
  timestamp: string;
  description: string;
  changes: DataChange[];
  validationResult?: ValidationResult;
  author?: string;
}

export interface DataHistory {
  versions: DataVersion[];
  currentVersion: number;
  lastModified: string;
}

/**
 * Manages data versioning and change tracking for family tree data
 */
export class DataVersionManager {
  private history: DataHistory;
  private changeLog: DataChange[] = [];

  constructor(initialData?: Person) {
    this.history = {
      versions: [],
      currentVersion: 0,
      lastModified: new Date().toISOString()
    };

    if (initialData) {
      this.initializeWithData(initialData);
    }
  }

  /**
   * Initialize version manager with existing data
   */
  private initializeWithData(data: Person): void {
    const standardizedData = standardizeMissingData(data);
    const validatedData = addMetadata(standardizedData, 'initial');
    
    const validationResult = validatePerson(validatedData);
    
    const initialVersion: DataVersion = {
      version: 1,
      timestamp: new Date().toISOString(),
      description: 'Initial data load',
      changes: [{
        id: this.generateChangeId(),
        timestamp: new Date().toISOString(),
        type: ChangeType.CREATE,
        personId: validatedData.id || 'root',
        description: 'Initial family tree data loaded',
        source: 'initial'
      }],
      validationResult,
      author: 'system'
    };

    this.history.versions.push(initialVersion);
    this.history.currentVersion = 1;
    this.history.lastModified = initialVersion.timestamp;
  }

  /**
   * Create a new version with changes
   */
  createVersion(
    changes: DataChange[], 
    description: string, 
    author?: string
  ): DataVersion {
    const newVersion: DataVersion = {
      version: this.history.currentVersion + 1,
      timestamp: new Date().toISOString(),
      description,
      changes,
      author
    };

    this.history.versions.push(newVersion);
    this.history.currentVersion = newVersion.version;
    this.history.lastModified = newVersion.timestamp;
    this.changeLog.push(...changes);

    return newVersion;
  }

  /**
   * Record a single change
   */
  recordChange(
    type: ChangeType,
    personId: string,
    description: string,
    field?: string,
    oldValue?: any,
    newValue?: any,
    author?: string,
    source: string = 'manual'
  ): DataChange {
    const change: DataChange = {
      id: this.generateChangeId(),
      timestamp: new Date().toISOString(),
      type,
      personId,
      field,
      oldValue,
      newValue,
      description,
      author,
      source
    };

    this.changeLog.push(change);
    return change;
  }

  /**
   * Get change history for a specific person
   */
  getPersonHistory(personId: string): DataChange[] {
    return this.changeLog.filter(change => change.personId === personId);
  }

  /**
   * Get recent changes
   */
  getRecentChanges(limit: number = 10): DataChange[] {
    return this.changeLog
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }

  /**
   * Get version history
   */
  getVersionHistory(): DataVersion[] {
    return [...this.history.versions];
  }

  /**
   * Get current version info
   */
  getCurrentVersion(): DataVersion | null {
    return this.history.versions[this.history.versions.length - 1] || null;
  }

  /**
   * Export change log for backup/analysis
   */
  exportChangeLog(): string {
    return JSON.stringify({
      history: this.history,
      changeLog: this.changeLog
    }, null, 2);
  }

  /**
   * Import change log from backup
   */
  importChangeLog(changeLogData: string): void {
    try {
      const data = JSON.parse(changeLogData);
      this.history = data.history;
      this.changeLog = data.changeLog;
    } catch (error) {
      throw new Error('Invalid change log format');
    }
  }

  /**
   * Validate current data state
   */
  validateCurrentData(root: Person): ValidationResult {
    const validationResult = validatePerson(root);
    
    // Record validation change
    this.recordChange(
      ChangeType.VALIDATE,
      root.id || 'root',
      'Data validation performed',
      undefined,
      undefined,
      validationResult,
      undefined,
      'validation'
    );

    return validationResult;
  }

  /**
   * Get data quality metrics
   */
  getDataQualityMetrics(root: Person): DataQualityMetrics {
    const allPersons = this.collectAllPersons(root);
    const qualityReport = analyzeDataQuality(root);
    
    const metrics: DataQualityMetrics = {
      totalPersons: allPersons.length,
      personsWithCompleteData: 0,
      personsWithMissingData: 0,
      dataCompleteness: 0,
      averageConfidence: 0,
      validationIssues: 0,
      qualityIssues: qualityReport.issues.length,
      qualityErrors: qualityReport.errors.length,
      qualityWarnings: qualityReport.warnings.length,
      lastValidated: null
    };

    let totalConfidence = 0;
    let confidenceCount = 0;

    allPersons.forEach(person => {
      const hasCompleteData = this.hasCompleteData(person);
      if (hasCompleteData) {
        metrics.personsWithCompleteData++;
      } else {
        metrics.personsWithMissingData++;
      }

      if (person.confidence) {
        totalConfidence += this.confidenceToNumber(person.confidence);
        confidenceCount++;
      }
    });

    metrics.dataCompleteness = (metrics.personsWithCompleteData / metrics.totalPersons) * 100;
    metrics.averageConfidence = confidenceCount > 0 ? totalConfidence / confidenceCount : 0;

    // Count validation issues from recent validation
    const recentValidation = this.changeLog
      .filter(change => change.type === ChangeType.VALIDATE)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

    if (recentValidation && recentValidation.newValue) {
      const validationResult = recentValidation.newValue as ValidationResult;
      metrics.validationIssues = validationResult.errors.length + validationResult.warnings.length;
      metrics.lastValidated = recentValidation.timestamp;
    }

    return metrics;
  }

  private collectAllPersons(person: Person, seen = new WeakSet<Person>()): Person[] {
    if (seen.has(person)) return [];
    seen.add(person);

    const persons: Person[] = [person];
    
    if (person.parents) {
      person.parents.forEach(parent => {
        if (parent) {
          persons.push(...this.collectAllPersons(parent, seen));
        }
      });
    }
    
    return persons;
  }

  private hasCompleteData(person: Person): boolean {
    return !!(
      person.name &&
      person.sex &&
      person.birthDate &&
      person.birthPlace &&
      !this.isMissingData(person.birthDate) &&
      !this.isMissingData(person.birthPlace)
    );
  }

  private isMissingData(value: string | undefined | null): boolean {
    if (!value) return true;
    const lowerValue = value.toLowerCase();
    return lowerValue === 'unknown' || 
           lowerValue === 'n/a' || 
           lowerValue === 'not available' ||
           lowerValue === 'not applicable';
  }

  private confidenceToNumber(confidence: string): number {
    switch (confidence.toLowerCase()) {
      case 'high': return 3;
      case 'medium': return 2;
      case 'low': return 1;
      default: return 0;
    }
  }

  private generateChangeId(): string {
    return 'change_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
  }
}

export interface DataQualityMetrics {
  totalPersons: number;
  personsWithCompleteData: number;
  personsWithMissingData: number;
  dataCompleteness: number; // percentage
  averageConfidence: number; // 0-3 scale
  validationIssues: number;
  qualityIssues: number;
  qualityErrors: number;
  qualityWarnings: number;
  lastValidated: string | null;
}

/**
 * Utility function to create a version manager instance
 */
export function createDataVersionManager(initialData?: Person): DataVersionManager {
  return new DataVersionManager(initialData);
}

/**
 * Utility function to migrate legacy data with versioning
 */
export function migrateWithVersioning(legacyData: any, description: string = 'Legacy data migration'): {
  migratedData: Person;
  versionManager: DataVersionManager;
} {
  const migratedData = standardizeMissingData(legacyData);
  const versionManager = new DataVersionManager();
  
  // Record migration as initial version
  versionManager.recordChange(
    ChangeType.MIGRATE,
    migratedData.id || 'root',
    description,
    undefined,
    legacyData,
    migratedData,
    'system',
    'migration'
  );

  return { migratedData, versionManager };
}
