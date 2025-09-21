export interface TimePeriod {
  name: string;
  startYear: number; // BCE years (negative for BCE)
  endYear: number;
  color: string;
  description: string;
  characteristics: string[];
  migrationEvents?: MigrationEvent[];
}

export interface MigrationEvent {
  name: string;
  year: number; // BCE years
  description: string;
  fromRegion: string;
  toRegion: string;
  significance: string;
}

export interface DeepAncestor extends Person {
  timePeriod: TimePeriod;
  isNeanderthal?: boolean;
  isDenisovan?: boolean;
  migrationPath?: string[];
  estimatedLocation?: string;
  culturalGroup?: string;
  dnaContribution?: number; // Percentage of DNA contributed to modern humans
}

export interface Person {
  name: string;
  sex?: string;
  birthPlace?: string;
  deathPlace?: string;
  birthDate?: string;
  deathDate?: string;
  parents?: Person[];
  imageUrl?: string;
  story?: string;
}

export interface DeepAncestryConfig {
  enabled: boolean;
  maxGenerations: number;
  showMigrationPaths: boolean;
  showEducationalOverlays: boolean;
  highlightNeanderthalAdmixture: boolean;
}
