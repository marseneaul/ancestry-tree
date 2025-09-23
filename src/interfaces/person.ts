// Enhanced Person interface with better type safety and validation
export interface Person {
  name: string;
  sex?: Sex;
  birthPlace?: string;
  deathPlace?: string;
  birthDate?: string;
  deathDate?: string;
  parents?: Person[];  // Recursive for parents/grandparents
  imageUrl?: string;
  story?: string;
  // Metadata for data management
  id?: string;
  version?: number;
  lastModified?: string;
  dataSource?: string;
  confidence?: ConfidenceLevel;
}

// Enums for better type safety
export enum Sex {
  MALE = "Male",
  FEMALE = "Female",
  UNKNOWN = "Unknown"
}

export enum ConfidenceLevel {
  HIGH = "high",
  MEDIUM = "medium", 
  LOW = "low",
  UNKNOWN = "unknown"
}

// Standardized values for missing data
export const MISSING_DATA = {
  UNKNOWN: "Unknown",
  NOT_APPLICABLE: "N/A",
  NOT_AVAILABLE: "Not Available"
} as const;

// Type for standardized missing data values
export type MissingDataValue = typeof MISSING_DATA[keyof typeof MISSING_DATA];

// Validation result interface
export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationWarning {
  field: string;
  message: string;
  suggestion?: string;
}