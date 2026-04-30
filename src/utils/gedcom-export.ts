import { Person, Sex } from '../interfaces/person';

/**
 * GEDCOM Export Utility
 * Converts Person data structure to GEDCOM 5.5.1 format
 */

export interface GEDCOMExportOptions {
  includeStories?: boolean;
  includeImages?: boolean;
  encoding?: string;
  sourceName?: string;
  sourceVersion?: string;
  livingPersonPrivacy?: LivingPersonPrivacy;
  currentYear?: number;
  livingAgeThreshold?: number;
}

export type LivingPersonPrivacy = 'include' | 'redact-details' | 'name-only' | 'exclude';

export interface GEDCOMExportSummary {
  totalPeople: number;
  exportedPeople: number;
  livingPeople: number;
  includedLivingPeople: number;
  redactedLivingPeople: number;
  nameOnlyLivingPeople: number;
  excludedLivingPeople: number;
  storyRecords: number;
  imageRecords: number;
}

interface NormalizedGEDCOMExportOptions {
  includeStories: boolean;
  includeImages: boolean;
  encoding: string;
  sourceName: string;
  sourceVersion: string;
  livingPersonPrivacy: LivingPersonPrivacy;
  currentYear: number;
  livingAgeThreshold: number;
}

function normalizeOptions(options: GEDCOMExportOptions = {}): NormalizedGEDCOMExportOptions {
  return {
    includeStories: true,
    includeImages: false,
    encoding: 'UTF-8',
    sourceName: 'Ancestry Tree Export',
    sourceVersion: '1.0',
    livingPersonPrivacy: 'include',
    currentYear: new Date().getFullYear(),
    livingAgeThreshold: 110,
    ...options
  };
}

function collectUniquePersons(rootPerson: Person): Person[] {
  const persons: Person[] = [];
  const visited = new Set<Person>();
  
  const collectRecursive = (person: Person) => {
    if (visited.has(person)) return;
    visited.add(person);
    persons.push(person);
    
    person.parents?.forEach(parent => collectRecursive(parent));
  };
  
  collectRecursive(rootPerson);
  return persons;
}

function getPrivacyMode(person: Person, options: NormalizedGEDCOMExportOptions): LivingPersonPrivacy {
  if (!isLivingPerson(person, options)) return 'include';
  return options.livingPersonPrivacy;
}

function isLivingPerson(person: Person, options: NormalizedGEDCOMExportOptions): boolean {
  if (person.deathDate && !isMissingGEDCOMData(person.deathDate)) return false;

  const birthYear = extractGEDCOMYear(person.birthDate);
  if (birthYear === null) return true;

  return options.currentYear - birthYear <= options.livingAgeThreshold;
}

function extractGEDCOMYear(value?: string): number | null {
  if (!value || isMissingGEDCOMData(value)) return null;

  const matches = Array.from(value.matchAll(/\b(\d{1,5})\b/g), match => Number(match[1]));
  if (matches.length === 0) return null;

  const year = matches.find(match => match >= 100) ?? matches[matches.length - 1];
  const lowerValue = value.toLowerCase();

  return lowerValue.includes('bce') || lowerValue.includes('bc') ? -year : year;
}

function isMissingGEDCOMData(value: string): boolean {
  const normalized = value.trim().toLowerCase();

  return normalized === '' ||
    normalized === 'unknown' ||
    normalized === 'n/a' ||
    normalized === 'not available' ||
    normalized === 'not applicable' ||
    normalized === '?';
}

export function getGEDCOMExportSummary(rootPerson: Person, options: GEDCOMExportOptions = {}): GEDCOMExportSummary {
  const normalizedOptions = normalizeOptions(options);
  const allPersons = collectUniquePersons(rootPerson);
  const summary: GEDCOMExportSummary = {
    totalPeople: allPersons.length,
    exportedPeople: 0,
    livingPeople: 0,
    includedLivingPeople: 0,
    redactedLivingPeople: 0,
    nameOnlyLivingPeople: 0,
    excludedLivingPeople: 0,
    storyRecords: 0,
    imageRecords: 0
  };

  allPersons.forEach(person => {
    const privacyMode = getPrivacyMode(person, normalizedOptions);
    const isExcluded = privacyMode === 'exclude';
    const isRedacted = privacyMode === 'redact-details' || privacyMode === 'name-only';
    const isLiving = isLivingPerson(person, normalizedOptions);

    if (isLiving) {
      summary.livingPeople++;
      if (privacyMode === 'include') summary.includedLivingPeople++;
      if (privacyMode === 'redact-details') summary.redactedLivingPeople++;
      if (privacyMode === 'name-only') summary.nameOnlyLivingPeople++;
      if (privacyMode === 'exclude') summary.excludedLivingPeople++;
    }

    if (isExcluded) return;

    summary.exportedPeople++;
    if (!isRedacted && normalizedOptions.includeStories && person.story) summary.storyRecords++;
    if (!isRedacted && normalizedOptions.includeImages && person.imageUrl) summary.imageRecords++;
  });

  return summary;
}

export class GEDCOMExporter {
  private personIdMap = new Map<Person, string>();
  private familyIdMap = new Map<string, string>();
  private nextPersonId = 1;
  private nextFamilyId = 1;
  private options: NormalizedGEDCOMExportOptions;

  constructor(options: GEDCOMExportOptions = {}) {
    this.options = normalizeOptions(options);
  }

  /**
   * Export a person and their entire family tree to GEDCOM format
   */
  exportToGEDCOM(rootPerson: Person): string {
    // Reset state for new export
    this.personIdMap.clear();
    this.familyIdMap.clear();
    this.nextPersonId = 1;
    this.nextFamilyId = 1;

    const lines: string[] = [];
    
    // Add GEDCOM header
    lines.push(...this.generateHeader());
    
    // Add source record
    lines.push(...this.generateSourceRecord());
    
    // Collect all persons and families
    const allPersons = this.collectAllPersons(rootPerson)
      .filter(person => !this.shouldExcludePerson(person));
    const families = this.collectFamilies(allPersons);
    
    // Add individual records
    allPersons.forEach(person => {
      lines.push(...this.generateIndividualRecord(person));
    });
    
    // Add family records
    families.forEach(family => {
      lines.push(...this.generateFamilyRecord(family));
    });
    
    // Add trailer
    lines.push('0 TRLR');
    
    return lines.join('\n');
  }

  /**
   * Generate GEDCOM header
   */
  private generateHeader(): string[] {
    const lines: string[] = [];
    lines.push('0 HEAD');
    lines.push('1 SOUR ' + this.options.sourceName);
    lines.push('2 VERS ' + this.options.sourceVersion);
    lines.push('2 NAME ' + this.options.sourceName);
    lines.push('1 DEST ANY');
    lines.push('1 DATE ' + this.formatDate(new Date()));
    lines.push('2 TIME ' + this.formatTime(new Date()));
    lines.push('1 GEDC');
    lines.push('2 VERS 5.5.1');
    lines.push('2 FORM LINEAGE-LINKED');
    lines.push('1 CHAR ' + this.options.encoding);
    lines.push('1 LANG English');
    lines.push('1 SUBM @SUBM@');
    lines.push('0 @SUBM@ SUBM');
    lines.push('1 NAME ' + this.options.sourceName);
    return lines;
  }

  /**
   * Generate source record
   */
  private generateSourceRecord(): string[] {
    const lines: string[] = [];
    lines.push('0 @SOUR@ SOUR');
    lines.push('1 TITL ' + this.options.sourceName);
    lines.push('1 ABBR ' + this.options.sourceName);
    lines.push('1 PUBL ' + this.options.sourceName);
    return lines;
  }

  /**
   * Collect all persons in the family tree
   */
  private collectAllPersons(rootPerson: Person): Person[] {
    return collectUniquePersons(rootPerson);
  }

  /**
   * Collect family relationships
   */
  private collectFamilies(persons: Person[]): Array<{husband?: Person, wife?: Person, children: Person[]}> {
    const familyMap = new Map<string, {husband?: Person, wife?: Person, children: Person[]}>();
    const includedPersons = new Set(persons);
    
    persons.forEach(person => {
      if (person.parents && person.parents.length > 0) {
        // Find the family this person belongs to
        const parents = person.parents;
        const husband = parents.find(p => includedPersons.has(p) && p.sex === Sex.MALE);
        const wife = parents.find(p => includedPersons.has(p) && p.sex === Sex.FEMALE);
        if (!husband && !wife) return;
        
        // Create a unique key for this family
        const familyKey = this.getFamilyKey(husband, wife);
        
        if (!familyMap.has(familyKey)) {
          familyMap.set(familyKey, { husband, wife, children: [] });
        }
        
        familyMap.get(familyKey)!.children.push(person);
      }
    });
    
    return Array.from(familyMap.values());
  }

  /**
   * Generate unique family key
   */
  private getFamilyKey(husband?: Person, wife?: Person): string {
    const husbandName = husband ? husband.name : 'unknown';
    const wifeName = wife ? wife.name : 'unknown';
    return `${husbandName}|${wifeName}`;
  }

  /**
   * Generate individual record
   */
  private generateIndividualRecord(person: Person): string[] {
    const lines: string[] = [];
    const personId = this.getPersonId(person);
    const privacy = this.getPrivacyMode(person);
    const shouldRedactDetails = privacy === 'redact-details' || privacy === 'name-only';
    const shouldExportNameOnly = privacy === 'name-only';
    
    lines.push(`0 @${personId}@ INDI`);
    
    // Name
    const nameParts = this.parseName(person.name);
    lines.push(`1 NAME ${nameParts.given} /${nameParts.surname}/`);
    if (nameParts.suffix) {
      lines.push(`2 NPFX ${nameParts.suffix}`);
    }
    
    // Sex
    if (person.sex && !shouldExportNameOnly) {
      const sexCode = person.sex === Sex.MALE ? 'M' : person.sex === Sex.FEMALE ? 'F' : 'U';
      lines.push(`1 SEX ${sexCode}`);
    }
    
    // Birth
    if (!shouldRedactDetails && (person.birthDate || person.birthPlace)) {
      lines.push('1 BIRT');
      if (person.birthDate) {
        lines.push(`2 DATE ${this.formatGEDCOMDate(person.birthDate)}`);
      }
      if (person.birthPlace) {
        lines.push(`2 PLAC ${person.birthPlace}`);
      }
    }
    
    // Death
    if (!shouldRedactDetails && (person.deathDate || person.deathPlace)) {
      lines.push('1 DEAT');
      if (person.deathDate) {
        lines.push(`2 DATE ${this.formatGEDCOMDate(person.deathDate)}`);
      }
      if (person.deathPlace) {
        lines.push(`2 PLAC ${person.deathPlace}`);
      }
    }
    
    // Story/Notes
    if (!shouldRedactDetails && person.story && this.options.includeStories) {
      lines.push('1 NOTE');
      const storyLines = person.story.split('\n');
      storyLines.forEach(line => {
        lines.push(`2 CONT ${line}`);
      });
    }
    
    // Image
    if (!shouldRedactDetails && person.imageUrl && this.options.includeImages) {
      lines.push('1 OBJE');
      lines.push('2 FILE ' + person.imageUrl);
      lines.push('2 FORM jpeg');
    }
    
    // Source reference
    lines.push('1 SOUR @SOUR@');
    
    return lines;
  }

  /**
   * Generate family record
   */
  private generateFamilyRecord(family: {husband?: Person, wife?: Person, children: Person[]}): string[] {
    const lines: string[] = [];
    const familyId = this.getFamilyId(family);
    
    lines.push(`0 @${familyId}@ FAM`);
    
    // Husband
    if (family.husband) {
      const husbandId = this.getPersonId(family.husband);
      lines.push(`1 HUSB @${husbandId}@`);
    }
    
    // Wife
    if (family.wife) {
      const wifeId = this.getPersonId(family.wife);
      lines.push(`1 WIFE @${wifeId}@`);
    }
    
    // Children
    family.children.forEach(child => {
      const childId = this.getPersonId(child);
      lines.push(`1 CHIL @${childId}@`);
    });
    
    // Source reference
    lines.push('1 SOUR @SOUR@');
    
    return lines;
  }

  /**
   * Get or create person ID
   */
  private getPersonId(person: Person): string {
    if (!this.personIdMap.has(person)) {
      const id = `I${this.nextPersonId.toString().padStart(4, '0')}`;
      this.personIdMap.set(person, id);
      this.nextPersonId++;
    }
    return this.personIdMap.get(person)!;
  }

  /**
   * Get or create family ID
   */
  private getFamilyId(family: {husband?: Person, wife?: Person, children: Person[]}): string {
    const familyKey = this.getFamilyKey(family.husband, family.wife);
    if (!this.familyIdMap.has(familyKey)) {
      const id = `F${this.nextFamilyId.toString().padStart(4, '0')}`;
      this.familyIdMap.set(familyKey, id);
      this.nextFamilyId++;
    }
    return this.familyIdMap.get(familyKey)!;
  }

  private shouldExcludePerson(person: Person): boolean {
    return this.getPrivacyMode(person) === 'exclude';
  }

  private getPrivacyMode(person: Person): LivingPersonPrivacy {
    return getPrivacyMode(person, this.options);
  }

  /**
   * Parse name into given and surname
   */
  private parseName(fullName: string): {given: string, surname: string, suffix?: string} {
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) {
      return { given: parts[0], surname: '' };
    }
    
    const lastPart = parts[parts.length - 1];
    const isSuffix = /^(Jr|Sr|III|IV|V|VI|VII|VIII|IX|X)$/i.test(lastPart);
    
    if (isSuffix && parts.length > 2) {
      return {
        given: parts.slice(0, -2).join(' '),
        surname: parts[parts.length - 2],
        suffix: lastPart
      };
    }
    
    return {
      given: parts.slice(0, -1).join(' '),
      surname: parts[parts.length - 1]
    };
  }

  /**
   * Format date for GEDCOM
   */
  private formatGEDCOMDate(dateStr: string): string {
    const trimmedDate = dateStr.trim();
    const monthNames = ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN',
                       'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'];
    const monthLookup = new Map([
      ['january', 'JAN'],
      ['february', 'FEB'],
      ['march', 'MAR'],
      ['april', 'APR'],
      ['may', 'MAY'],
      ['june', 'JUN'],
      ['july', 'JUL'],
      ['august', 'AUG'],
      ['september', 'SEP'],
      ['october', 'OCT'],
      ['november', 'NOV'],
      ['december', 'DEC']
    ]);

    if (/^\d{4}$/.test(trimmedDate)) {
      return trimmedDate;
    }

    const isoDateMatch = trimmedDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    if (isoDateMatch) {
      const [, year, month, day] = isoDateMatch;
      const monthIndex = Number(month) - 1;
      if (monthNames[monthIndex]) {
        return `${day} ${monthNames[monthIndex]} ${year}`;
      }
    }

    const writtenDateMatch = trimmedDate.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
    if (writtenDateMatch) {
      const [, day, monthName, year] = writtenDateMatch;
      const gedcomMonth = monthLookup.get(monthName.toLowerCase());
      if (gedcomMonth) {
        return `${day.padStart(2, '0')} ${gedcomMonth} ${year}`;
      }
    }

    const circaMatch = trimmedDate.match(/^(?:circa|c\.)\s*(\d{4})$/i);
    if (circaMatch) {
      return `ABT ${circaMatch[1]}`;
    }

    return trimmedDate;
  }

  /**
   * Format current date for header
   */
  private formatDate(date: Date): string {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day} ${month} ${year}`;
  }

  /**
   * Format current time for header
   */
  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
}

/**
 * Convenience function to export person data to GEDCOM
 */
export function exportPersonToGEDCOM(person: Person, options?: GEDCOMExportOptions): string {
  const exporter = new GEDCOMExporter(options);
  return exporter.exportToGEDCOM(person);
}

/**
 * Download GEDCOM file
 */
export function downloadGEDCOM(gedcomContent: string, filename: string = 'family-tree.ged'): void {
  const blob = new Blob([gedcomContent], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
