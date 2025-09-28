// src/components/stats-dashboard.ts

import * as d3 from "d3";
import { getCountry, calculateAgeAtDate } from "../utils/utils";

export interface StatsDashboardData {
  root: any;
  countrySvgs: { [key: string]: string };
}

export interface StatisticsData {
  totalPeople: number;
  maxDepth: number;
  countries: Map<string, number>;
  birthYears: number[];
  genderStats: { male: number; female: number; unknown: number };
  lifespanByGeneration: Map<number, number[]>;
  dnaBreakdown: Array<{generation: number, count: number, dnaPercent: number}>;
  migrationPatterns: Map<string, number>;
  dataCompleteness: {
    total: number;
    hasBirthDate: number;
    hasDeathDate: number;
    hasBirthPlace: number;
    hasDeathPlace: number;
    hasPhoto: number;
    hasStory: number;
    hasParents: number;
  };
  researchGaps: {
    missingBirthDate: any[];
    missingDeathDate: any[];
    missingBirthPlace: any[];
    missingParents: any[];
    noPhoto: any[];
  };
  averageAgeAtBirth: number | null;
  averageGenerationalGap: number | null;
  averageLifespan: number | null;
}

export class StatsDashboard {
  private container: HTMLElement;
  private data: StatsDashboardData;
  private statistics: StatisticsData | null = null;

  constructor(container: HTMLElement, data: StatsDashboardData) {
    this.container = container;
    this.data = data;
  }

  /**
   * Initialize the statistics dashboard with calculated data
   */
  public initialize(): void {
    this.calculateStatistics();
    this.renderDashboard();
    this.renderCharts();
  }

  /**
   * Calculate all statistics from the tree data
   */
  private calculateStatistics(): void {
    const allNodes = this.data.root.descendants();
    
    // Basic statistics
    const totalPeople = allNodes.length;
    const maxDepth = d3.max(allNodes, (d: any) => d.depth) || 0;
    const countries = new Map<string, number>();
    const birthYears = this.extractBirthYears(allNodes);
    
    // Count countries
    allNodes.forEach(node => {
      const country = getCountry(node.data.birthPlace);
      countries.set(country, (countries.get(country) || 0) + 1);
    });

    // Calculate DNA breakdown by generation
    const dnaBreakdown = this.calculateDnaBreakdown(allNodes, maxDepth as number);

    // Calculate additional statistics
    const genderStats = { male: 0, female: 0, unknown: 0 };
    const lifespanByGeneration = new Map<number, number[]>();
    const migrationPatterns = new Map<string, number>();
    const dataCompleteness = {
      total: 0,
      hasBirthDate: 0,
      hasDeathDate: 0,
      hasBirthPlace: 0,
      hasDeathPlace: 0,
      hasPhoto: 0,
      hasStory: 0,
      hasParents: 0
    };
    const researchGaps = {
      missingBirthDate: [] as any[],
      missingDeathDate: [] as any[],
      missingBirthPlace: [] as any[],
      missingParents: [] as any[],
      noPhoto: [] as any[]
    };

    // Process each node
    allNodes.forEach(node => {
      dataCompleteness.total++;
      
      // Data completeness tracking
      if (node.data.birthDate && node.data.birthDate !== "Unknown" && node.data.birthDate !== "UNKNOWN") dataCompleteness.hasBirthDate++;
      if (node.data.deathDate && node.data.deathDate !== "N/A" && node.data.deathDate !== "Unknown" && node.data.deathDate !== "UNKNOWN") dataCompleteness.hasDeathDate++;
      if (node.data.birthPlace && node.data.birthPlace !== "Unknown" && node.data.birthPlace !== "UNKNOWN") dataCompleteness.hasBirthPlace++;
      if (node.data.deathPlace && node.data.deathPlace !== "Unknown" && node.data.deathPlace !== "UNKNOWN") dataCompleteness.hasDeathPlace++;
      if (node.data.imageUrl) dataCompleteness.hasPhoto++;
      if (node.data.story && node.data.story !== "Stories coming soon...") dataCompleteness.hasStory++;
      if (node.data.parents && node.data.parents.length > 0) dataCompleteness.hasParents++;
      
      // Research gaps identification
      if (!node.data.birthDate || node.data.birthDate === "Unknown" || node.data.birthDate === "UNKNOWN") {
        researchGaps.missingBirthDate.push(node);
      }
      if (!node.data.deathDate || node.data.deathDate === "N/A" || node.data.deathDate === "Unknown" || node.data.deathDate === "UNKNOWN") {
        researchGaps.missingDeathDate.push(node);
      }
      if (!node.data.birthPlace || node.data.birthPlace === "Unknown" || node.data.birthPlace === "UNKNOWN") {
        researchGaps.missingBirthPlace.push(node);
      }
      if (!node.data.parents || node.data.parents.length === 0) {
        researchGaps.missingParents.push(node);
      }
      if (!node.data.imageUrl) {
        researchGaps.noPhoto.push(node);
      }
      
      // Gender distribution
      if (node.data.sex === "Male") genderStats.male++;
      else if (node.data.sex === "Female") genderStats.female++;
      else genderStats.unknown++;
      
      // Lifespan by generation
      if (node.data.birthDate && node.data.deathDate && node.data.deathDate !== "N/A") {
        const age = calculateAgeAtDate(node.data.birthDate, node.data.deathDate);
        if (age !== null && age > 0) {
          if (!lifespanByGeneration.has(node.depth)) {
            lifespanByGeneration.set(node.depth, []);
          }
          lifespanByGeneration.get(node.depth)!.push(age);
        }
      }
      
      // Migration patterns (parent-child country changes) - only for first 15 generations
      if (node.data.parents && node.depth <= 15) {
        const currentCountry = getCountry(node.data.birthPlace);
        node.data.parents.forEach(parent => {
          if (parent) {
            const parentCountry = getCountry(parent.birthPlace);
            if (currentCountry !== parentCountry) {
              const migrationKey = `${parentCountry} → ${currentCountry}`;
              migrationPatterns.set(migrationKey, (migrationPatterns.get(migrationKey) || 0) + 1);
            }
          }
        });
      }
    });

    // Calculate age at birth and generational gaps
    const { averageAgeAtBirth, averageGenerationalGap } = this.calculateAgeStatistics(allNodes);
    
    // Calculate average lifespan
    const averageLifespan = this.calculateAverageLifespan(allNodes);

    this.statistics = {
      totalPeople,
      maxDepth: maxDepth as number,
      countries,
      birthYears,
      genderStats,
      lifespanByGeneration,
      dnaBreakdown,
      migrationPatterns,
      dataCompleteness,
      researchGaps,
      averageAgeAtBirth,
      averageGenerationalGap,
      averageLifespan
    };
  }

  /**
   * Extract birth years from node data
   */
  private extractBirthYears(allNodes: any[]): number[] {
    return allNodes
      .map(d => d.data.birthDate)
      .filter(date => date && date !== "Unknown")
      .map(date => {
        // Handle different date formats: "13 August 1997", "1997-08-13", "circa 1850", "542", etc.
        // First try: match 4-digit years starting with 19 or 20 (modern dates)
        const modernYearMatch = date.match(/\b(19|20)\d{2}\b/);
        if (modernYearMatch) {
          return parseInt(modernYearMatch[0]);
        }
        // Second try: match any 4-digit number (including older dates like 542, 1200, etc.)
        const anyYearMatch = date.match(/\b\d{4}\b/);
        if (anyYearMatch) {
          const year = parseInt(anyYearMatch[0]);
          // Include reasonable years (500-2100) to cover ancient to modern dates
          if (year >= 500 && year <= 2100) {
            return year;
          }
        }
        // Third try: match 3-digit years (like 542)
        const threeDigitMatch = date.match(/\b\d{3}\b/);
        if (threeDigitMatch) {
          const year = parseInt(threeDigitMatch[0]);
          // Include 3-digit years (500-999)
          if (year >= 500 && year <= 999) {
            return year;
          }
        }
        return null;
      })
      .filter(year => year !== null) as number[];
  }

  /**
   * Calculate DNA breakdown by generation
   */
  private calculateDnaBreakdown(allNodes: any[], maxDepth: number): Array<{generation: number, count: number, dnaPercent: number}> {
    const dnaBreakdown = [];
    for (let depth = 0; depth <= maxDepth; depth++) {
      const nodesAtDepth = allNodes.filter(d => d.depth === depth);
      if (nodesAtDepth.length > 0) {
        const dnaPercent = (100 / Math.pow(2, depth)).toFixed(1);
        dnaBreakdown.push({
          generation: depth,
          count: nodesAtDepth.length,
          dnaPercent: parseFloat(dnaPercent)
        });
      }
    }
    return dnaBreakdown;
  }

  /**
   * Calculate age at birth and generational gap statistics
   */
  private calculateAgeStatistics(allNodes: any[]): { averageAgeAtBirth: number | null, averageGenerationalGap: number | null } {
    const ageAtBirthData: number[] = [];
    const generationalGaps: number[] = [];
    
    allNodes.forEach(node => {
      // Calculate age at birth (parent's age when child was born)
      if (node.data.parents && node.data.parents.length > 0 && node.data.birthDate) {
        node.data.parents.forEach(parent => {
          if (parent && parent.birthDate && parent.birthDate !== "Unknown" && parent.birthDate !== "UNKNOWN") {
            const parentBirthYear = this.extractBirthYear(parent.birthDate);
            const childBirthYear = this.extractBirthYear(node.data.birthDate);
            
            if (parentBirthYear && childBirthYear && childBirthYear > parentBirthYear) {
              const ageAtBirth = childBirthYear - parentBirthYear;
              // Reasonable age range for having children (15-60 years old)
              if (ageAtBirth >= 15 && ageAtBirth <= 60) {
                ageAtBirthData.push(ageAtBirth);
              }
            }
          }
        });
      }
      
      // Calculate generational gaps (time between generations)
      if (node.data.parents && node.data.parents.length > 0 && node.data.birthDate) {
        node.data.parents.forEach(parent => {
          if (parent && parent.birthDate && parent.birthDate !== "Unknown" && parent.birthDate !== "UNKNOWN") {
            const parentBirthYear = this.extractBirthYear(parent.birthDate);
            const childBirthYear = this.extractBirthYear(node.data.birthDate);
            
            if (parentBirthYear && childBirthYear && childBirthYear > parentBirthYear) {
              const generationalGap = childBirthYear - parentBirthYear;
              // Reasonable generational gap (15-50 years)
              if (generationalGap >= 15 && generationalGap <= 50) {
                generationalGaps.push(generationalGap);
              }
            }
          }
        });
      }
    });
    
    // Calculate averages
    const averageAgeAtBirth = ageAtBirthData.length > 0 
      ? Math.round(ageAtBirthData.reduce((sum, age) => sum + age, 0) / ageAtBirthData.length)
      : null;
    
    const averageGenerationalGap = generationalGaps.length > 0
      ? Math.round(generationalGaps.reduce((sum, gap) => sum + gap, 0) / generationalGaps.length)
      : null;

    return { averageAgeAtBirth, averageGenerationalGap };
  }

  /**
   * Calculate average lifespan
   */
  private calculateAverageLifespan(allNodes: any[]): number | null {
    const lifespanData: number[] = [];
    allNodes.forEach(node => {
      if (node.data.birthDate && node.data.deathDate && node.data.deathDate !== "N/A" && node.data.deathDate !== "Unknown" && node.data.deathDate !== "UNKNOWN") {
        const age = calculateAgeAtDate(node.data.birthDate, node.data.deathDate);
        if (age !== null && age > 0 && age <= 120) { // Reasonable lifespan range
          lifespanData.push(age);
        }
      }
    });
    
    return lifespanData.length > 0
      ? Math.round(lifespanData.reduce((sum, age) => sum + age, 0) / lifespanData.length)
      : null;
  }

  /**
   * Extract birth year from date string
   */
  private extractBirthYear(birthDate?: string): number | null {
    if (!birthDate || birthDate === "Unknown") return null;
    const yearMatch = birthDate.match(/\b(19|20)\d{2}\b/) || birthDate.match(/\b\d{4}\b/);
    return yearMatch ? parseInt(yearMatch[0]) : null;
  }

  /**
   * Render the main dashboard HTML
   */
  private renderDashboard(): void {
    if (!this.statistics) return;

    const { 
      totalPeople, 
      maxDepth, 
      countries, 
      birthYears, 
      averageGenerationalGap, 
      averageLifespan,
      dataCompleteness,
      researchGaps,
      migrationPatterns
    } = this.statistics;

    this.container.innerHTML = `
      <div class="stats-title">📊 Family Tree Statistics</div>
      
      <div class="stats-content">
      <div class="stats-section">
        <div class="stats-section-title collapsible" onclick="toggleSection('overview')">
          📈 Overview <span class="collapse-icon" onclick="event.stopPropagation(); toggleSection('overview');"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"></polyline></svg></span>
        </div>
        <div class="stats-section-content" id="overview">
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">${totalPeople}</div>
            <div class="stat-label">Total People</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${maxDepth + 1}</div>
            <div class="stat-label">Generations</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${countries.size}</div>
            <div class="stat-label">Countries</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${birthYears.length > 0 ? Math.min(...birthYears) : 'N/A'}</div>
            <div class="stat-label">Earliest Birth</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${averageGenerationalGap ? averageGenerationalGap + ' years' : 'N/A'}</div>
            <div class="stat-label">Avg Gen Gap</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">${averageLifespan ? averageLifespan + ' years' : 'N/A'}</div>
            <div class="stat-label">Avg Lifespan</div>
          </div>
        </div>
      </div>
      </div>

      <div class="stats-section">
        <div class="stats-section-title collapsible" onclick="toggleSection('data-completeness')">
          📋 Data Completeness <span class="collapse-icon" onclick="event.stopPropagation(); toggleSection('data-completeness');"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"></polyline></svg></span>
        </div>
        <div class="stats-section-content" id="data-completeness">
          <div class="dna-breakdown">
            <div class="dna-item">
              <span class="dna-label">📅 Birth Dates</span>
              <div class="dna-bar">
                <div class="dna-fill" style="width: ${(dataCompleteness.hasBirthDate / dataCompleteness.total) * 100}%"></div>
              </div>
              <span class="dna-percent">${((dataCompleteness.hasBirthDate / dataCompleteness.total) * 100).toFixed(1)}%</span>
            </div>
            <div class="dna-item">
              <span class="dna-label">💀 Death Dates</span>
              <div class="dna-bar">
                <div class="dna-fill" style="width: ${(dataCompleteness.hasDeathDate / dataCompleteness.total) * 100}%"></div>
              </div>
              <span class="dna-percent">${((dataCompleteness.hasDeathDate / dataCompleteness.total) * 100).toFixed(1)}%</span>
            </div>
            <div class="dna-item">
              <span class="dna-label">📍 Birth Places</span>
              <div class="dna-bar">
                <div class="dna-fill" style="width: ${(dataCompleteness.hasBirthPlace / dataCompleteness.total) * 100}%"></div>
              </div>
              <span class="dna-percent">${((dataCompleteness.hasBirthPlace / dataCompleteness.total) * 100).toFixed(1)}%</span>
            </div>
            <div class="dna-item">
              <span class="dna-label">📸 Photos</span>
              <div class="dna-bar">
                <div class="dna-fill" style="width: ${(dataCompleteness.hasPhoto / dataCompleteness.total) * 100}%"></div>
              </div>
              <span class="dna-percent">${((dataCompleteness.hasPhoto / dataCompleteness.total) * 100).toFixed(1)}%</span>
            </div>
            <div class="dna-item">
              <span class="dna-label">👨‍👩‍👧‍👦 Parents</span>
              <div class="dna-bar">
                <div class="dna-fill" style="width: ${(dataCompleteness.hasParents / dataCompleteness.total) * 100}%"></div>
              </div>
              <span class="dna-percent">${((dataCompleteness.hasParents / dataCompleteness.total) * 100).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-section-title collapsible" onclick="toggleSection('research-gaps')">
          🔍 Research Gaps <span class="collapse-icon" onclick="event.stopPropagation(); toggleSection('research-gaps');"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"></polyline></svg></span>
        </div>
        <div class="stats-section-content" id="research-gaps">
          <div class="dna-breakdown">
            <div class="dna-item">
              <span class="dna-label">❓ Missing Birth Dates</span>
              <div class="dna-bar">
                <div class="dna-fill" style="width: ${Math.min((researchGaps.missingBirthDate.length / dataCompleteness.total) * 100, 100)}%"></div>
              </div>
              <span class="dna-percent">${researchGaps.missingBirthDate.length}</span>
            </div>
            <div class="dna-item">
              <span class="dna-label">❓ Missing Death Dates</span>
              <div class="dna-bar">
                <div class="dna-fill" style="width: ${Math.min((researchGaps.missingDeathDate.length / dataCompleteness.total) * 100, 100)}%"></div>
              </div>
              <span class="dna-percent">${researchGaps.missingDeathDate.length}</span>
            </div>
            <div class="dna-item">
              <span class="dna-label">❓ Missing Birth Places</span>
              <div class="dna-bar">
                <div class="dna-fill" style="width: ${Math.min((researchGaps.missingBirthPlace.length / dataCompleteness.total) * 100, 100)}%"></div>
              </div>
              <span class="dna-percent">${researchGaps.missingBirthPlace.length}</span>
            </div>
            <div class="dna-item">
              <span class="dna-label">❓ Missing Parents</span>
              <div class="dna-bar">
                <div class="dna-fill" style="width: ${Math.min((researchGaps.missingParents.length / dataCompleteness.total) * 100, 100)}%"></div>
              </div>
              <span class="dna-percent">${researchGaps.missingParents.length}</span>
            </div>
            <div class="dna-item">
              <span class="dna-label">📷 No Photos</span>
              <div class="dna-bar">
                <div class="dna-fill" style="width: ${Math.min((researchGaps.noPhoto.length / dataCompleteness.total) * 100, 100)}%"></div>
              </div>
              <span class="dna-percent">${researchGaps.noPhoto.length}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-section-title collapsible" onclick="toggleSection('gender-distribution')">
          👥 Gender Distribution <span class="collapse-icon" onclick="event.stopPropagation(); toggleSection('gender-distribution');"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"></polyline></svg></span>
        </div>
        <div class="stats-section-content" id="gender-distribution">
          <!-- Gender Pie Chart -->
          <div id="gender-pie-chart">
            <div id="gender-pie-visualization" style="display: flex; align-items: center; gap: 20px;">
              <svg id="gender-pie-svg" width="200" height="200"></svg>
              <div id="gender-pie-legend" class="pie-legend">
                <!-- Legend will be populated by JavaScript -->
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-section-title collapsible" onclick="toggleSection('lifespan')">
          ⏰ Average Lifespan by Generation <span class="collapse-icon" onclick="event.stopPropagation(); toggleSection('lifespan');"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"></polyline></svg></span>
        </div>
        <div class="stats-section-content" id="lifespan">
          <div class="lifespan-chart-container">
            <div class="chart-header">
              <div class="chart-legend">
                <div class="legend-item">
                  <div class="legend-color" style="background: var(--accent-primary);"></div>
                  <span>Average Lifespan</span>
                </div>
                <div class="legend-item">
                  <div class="legend-color" style="background: rgba(123, 179, 240, 0.3);"></div>
                  <span>Range (Min-Max)</span>
                </div>
              </div>
            </div>
            <div class="line-chart-wrapper">
              <svg id="lifespan-line-chart" class="lifespan-line-chart"></svg>
            </div>
            <div class="chart-stats" id="lifespan-stats">
              <!-- Stats will be populated by JavaScript -->
            </div>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-section-title collapsible" onclick="toggleSection('migration')">
          🌍 Migration Patterns <span class="collapse-icon" onclick="event.stopPropagation(); toggleSection('migration');"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"></polyline></svg></span>
        </div>
        <div class="stats-section-content" id="migration" style="display: block;">
          <div class="migration-content">
            <div class="migration-stats">
              <div class="stat-item">
                <div class="stat-number" id="migration-locations-count">-</div>
                <div class="stat-label">Locations</div>
              </div>
              <div class="stat-item">
                <div class="stat-number" id="migration-routes-count">-</div>
                <div class="stat-label">Migration Routes</div>
              </div>
            </div>
            <div class="migration-map-container" id="migration-map"></div>
            <div class="migration-legend">
              <div class="legend-item">
                <div class="legend-dot migration-point"></div>
                <span>Birth/Death Locations</span>
              </div>
              <div class="legend-item">
                <div class="legend-line migration-route"></div>
                <span>Migration Routes</span>
              </div>
            </div>
            <div class="migration-patterns-breakdown">
              <h4>Migration Pattern Breakdown</h4>
              <div class="dna-breakdown">
                ${(() => {
                  const migrationEntries = Array.from(migrationPatterns.entries())
                    .sort((a, b) => b[1] - a[1])
                    .slice(0, 6);
                  const maxCount = migrationEntries.length > 0 ? Math.max(...migrationEntries.map(([, count]) => count)) : 1;
                  
                  return migrationEntries.map(([migration, count]) => `
                    <div class="dna-item">
                      <span class="dna-label">${migration}</span>
                      <div class="dna-bar">
                        <div class="dna-fill" style="width: ${(count / maxCount) * 100}%"></div>
                      </div>
                      <span class="dna-percent">${count}</span>
                    </div>
                  `).join('');
                })()}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-section-title collapsible" onclick="toggleSection('dna-inheritance')">
          🧬 DNA Inheritance by Generation <span class="collapse-icon" onclick="event.stopPropagation(); toggleSection('dna-inheritance');"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"></polyline></svg></span>
        </div>
        <div class="stats-section-content" id="dna-inheritance">
          <div class="lifespan-chart-container">
            <div class="chart-header">
              <div class="chart-legend">
                <div class="legend-item">
                  <div class="legend-color" style="background: var(--accent-primary);"></div>
                  <span>DNA Inheritance %</span>
                </div>
              </div>
            </div>
            <div class="line-chart-wrapper">
              <svg id="dna-inheritance-line-chart" class="lifespan-line-chart"></svg>
            </div>
            <div class="chart-stats" id="dna-inheritance-stats">
              <!-- Stats will be populated by JavaScript -->
            </div>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-section-title collapsible" onclick="toggleSection('countries-origin')">
          🌎 Countries of Origin <span class="collapse-icon" onclick="event.stopPropagation(); toggleSection('countries-origin');"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"></polyline></svg></span>
        </div>
        <div class="stats-section-content" id="countries-origin">
        <div class="dna-breakdown">
          ${Array.from(countries.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, 8)
            .map(([country, count]) => `
              <div class="dna-item">
                <span class="dna-label">${country}</span>
                <div class="dna-bar">
                  <div class="dna-fill" style="width: ${(count / totalPeople) * 100}%"></div>
                </div>
                <span class="dna-percent">${count}</span>
              </div>
            `).join('')}
          </div>
          
          <!-- Countries Pie Chart -->
          <div id="countries-pie-chart" style="margin-top: 20px;">
            <h4 style="margin: 0 0 16px; color: var(--text-primary); font-size: 16px; font-weight: 600;">Countries Distribution</h4>
            <div id="countries-pie-visualization" style="display: flex; align-items: center; gap: 20px;">
              <svg id="countries-pie-svg" width="200" height="200"></svg>
              <div id="countries-pie-legend" class="pie-legend"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-section-title collapsible" onclick="toggleSection('dna-ethnicity')">
          🧬 DNA Contribution by Ethnicity <span class="collapse-icon" onclick="event.stopPropagation(); toggleSection('dna-ethnicity');"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"></polyline></svg></span>
        </div>
        <div class="stats-section-content" id="dna-ethnicity">
        <div class="dna-breakdown">
          ${this.generateDnaEthnicityBreakdown()}
          </div>
          
          <!-- DNA Pie Chart -->
          <div id="dna-pie-chart" style="margin-top: 20px;">
            <h4 style="margin: 0 0 16px; color: var(--text-primary); font-size: 16px; font-weight: 600;">DNA Distribution</h4>
            <div id="dna-pie-visualization" style="display: flex; align-items: center; gap: 20px;">
              <svg id="dna-pie-svg" width="200" height="200"></svg>
              <div id="dna-pie-legend" class="pie-legend"></div>
            </div>
          </div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-section-title collapsible" onclick="toggleSection('archaic-ancestry')">
          🦴 Archaic Hominid Ancestry <span class="collapse-icon" onclick="event.stopPropagation(); toggleSection('archaic-ancestry');"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"></polyline></svg></span>
        </div>
        <div class="stats-section-content" id="archaic-ancestry">
          <div class="dna-breakdown">
            <div class="dna-item">
              <span class="dna-label">🧬 Neanderthal DNA</span>
              <div class="dna-bar">
                <div class="dna-fill" style="width: 2.1%; background: #8B4513;"></div>
              </div>
              <span class="dna-percent">2.1%</span>
            </div>
            <div class="dna-item">
              <span class="dna-label">🦴 Denisovan DNA</span>
              <div class="dna-bar">
                <div class="dna-fill" style="width: 0.05%; background: #A0522D;"></div>
              </div>
              <span class="dna-percent">0.05%</span>
            </div>
            <div class="dna-item">
              <span class="dna-label">👤 Other Archaic DNA</span>
              <div class="dna-bar">
                <div class="dna-fill" style="width: 0.1%; background: #CD853F;"></div>
              </div>
              <span class="dna-percent">0.1%</span>
            </div>
            <div class="dna-item">
              <span class="dna-label">🧑 Modern Human DNA</span>
              <div class="dna-bar">
                <div class="dna-fill" style="width: 97.75%; background: #4A90E2;"></div>
              </div>
              <span class="dna-percent">97.75%</span>
            </div>
          </div>
          
          <!-- Archaic Ancestry Pie Chart -->
          <div id="archaic-ancestry-pie-chart" style="margin-top: 20px;">
            <h4 style="margin: 0 0 16px; color: var(--text-primary); font-size: 16px; font-weight: 600;">Archaic Hominid DNA Distribution</h4>
            <div id="archaic-ancestry-pie-visualization" style="display: flex; align-items: center; gap: 20px;">
              <svg id="archaic-ancestry-pie-svg" width="200" height="200"></svg>
              <div id="archaic-ancestry-pie-legend" class="pie-legend"></div>
            </div>
          </div>
        </div>
      </div>
      </div>
    `;
  }

  /**
   * Generate DNA ethnicity breakdown HTML
   */
  private generateDnaEthnicityBreakdown(): string {
    if (!this.statistics) return '';

    const allNodes = this.data.root.descendants();
    const countryDnaContribution = new Map<string, number>();
    const visitedNodes = new Set<string>();
    
    // Function to trace ancestry and assign DNA contribution
    const traceAncestry = (node: any, depth: number) => {
      // Prevent infinite recursion
      if (visitedNodes.has(node.data.name) || depth > 20) {
        return;
      }
      visitedNodes.add(node.data.name);
      
      const country = getCountry(node.data.birthPlace);
      
      if (country !== "United States" && country !== "Canada") {
        // Found a non-US/Canada ancestor - assign DNA contribution and stop
        const dnaPercent = 100 / Math.pow(2, depth);
        countryDnaContribution.set(country, (countryDnaContribution.get(country) || 0) + dnaPercent);
      } else {
        // US/Canada ancestor - recurse to parents
        let hasParents = false;
        if (node.data.parents) {
          node.data.parents.forEach((parent: any) => {
            if (parent) {
              // Find the parent node in the tree by matching the data
              const parentNode = allNodes.find(n => 
                n.data.name === parent.name && 
                n.data.birthDate === parent.birthDate &&
                n.data.birthPlace === parent.birthPlace
              );
              if (parentNode && !visitedNodes.has(parentNode.data.name)) {
                hasParents = true;
                traceAncestry(parentNode, depth + 1);
              }
            }
          });
        }
        
        // If no parents found (dead end), count appropriately
        if (!hasParents) {
          const dnaPercent = 100 / Math.pow(2, depth);
          // Treating dead-end Canada as French for DNA calculation
          const deadEndCountry = country === "Canada" ? "France" : "Unknown";
          countryDnaContribution.set(deadEndCountry, (countryDnaContribution.get(deadEndCountry) || 0) + dnaPercent);
        }
      }
      
      visitedNodes.delete(node.data.name); // Clean up for other branches
    };
    
    // Start tracing from the root (you)
    const rootNode = allNodes.find(n => n.depth === 0);
    if (rootNode) {
      traceAncestry(rootNode, 0);
    }
    
    return Array.from(countryDnaContribution.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([country, dnaPercent]) => {
        const svgSrc = this.data.countrySvgs[country];
        const flagHtml = svgSrc 
          ? `<img src="${svgSrc}" style="width: 16px; height: 16px; display: inline-block; margin-right: 6px; object-fit: contain;">`
          : '';
        return `
          <div class="dna-item">
            <span class="dna-label">${flagHtml}${country}</span>
            <div class="dna-bar">
              <div class="dna-fill" style="width: ${Math.min(dnaPercent * 2, 100)}%"></div>
            </div>
            <span class="dna-percent">${dnaPercent.toFixed(1)}%</span>
          </div>
        `;
      }).join('');
  }

  /**
   * Render all charts after dashboard is created
   */
  private renderCharts(): void {
    if (!this.statistics) return;

    // Render charts after a short delay to ensure DOM is ready
    setTimeout(() => {
      this.createGenderPieChart();
      this.createCountriesPieChart();
      this.createDnaPieChart();
      this.createArchaicAncestryPieChart();
      this.renderLifespanChart();
      this.renderDnaInheritanceChart();
      
      // Populate stats sections
      const lifespanStatsElement = document.getElementById('lifespan-stats');
      if (lifespanStatsElement) {
        lifespanStatsElement.innerHTML = this.generateLifespanStats();
      }
      
      const dnaStatsElement = document.getElementById('dna-inheritance-stats');
      if (dnaStatsElement) {
        dnaStatsElement.innerHTML = this.generateDnaInheritanceStats();
      }
    }, 100);
  }

  /**
   * Create Gender pie chart visualization
   */
  private createGenderPieChart(): void {
    if (!this.statistics) return;

    const svg = d3.select("#gender-pie-svg");
    const legend = d3.select("#gender-pie-legend");
    
    // Clear previous content
    svg.selectAll("*").remove();
    legend.selectAll("*").remove();
    
    // Get the gender data from the stats
    const genderStats = this.statistics.genderStats;
    const pieData = [
      { gender: 'Male', count: genderStats.male, emoji: '👨' },
      { gender: 'Female', count: genderStats.female, emoji: '👩' }
    ];
    
    if (genderStats.unknown > 0) {
      pieData.push({ gender: 'Unknown', count: genderStats.unknown, emoji: '❓' });
    }
    
    if (pieData.length === 0) return;
    
    // Set up pie chart dimensions
    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2 - 10;
    
    // Create color scale
    const colorScale = d3.scaleOrdinal()
      .domain(pieData.map(d => d.gender))
      .range(['#4A90E2', '#E24A90', '#6B7280']);
    
    // Create pie generator
    const pie = d3.pie<any>()
      .value(d => d.count)
      .sort(null);
    
    // Create arc generator
    const arc = d3.arc<any>()
      .innerRadius(0)
      .outerRadius(radius);
    
    // Create the pie chart
    const g = svg.append("g")
      .attr("transform", `translate(${width/2}, ${height/2})`);
    
    const arcs = g.selectAll(".arc")
      .data(pie(pieData))
      .enter()
      .append("g")
      .attr("class", "arc");
    
    // Add pie slices
    arcs.append("path")
      .attr("d", (d: any) => arc(d) as string)
      .attr("fill", (d: any) => colorScale(d.data.gender) as string)
      .attr("stroke", "var(--bg-secondary)")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .attr("stroke-width", 3)
          .attr("stroke", "var(--accent-primary)");
        
        // Show tooltip
        const tooltip = d3.select("body").append("div")
          .attr("class", "chart-tooltip")
          .style("opacity", 0);
        
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        
        const percentage = ((d.data.count / (genderStats.male + genderStats.female + genderStats.unknown)) * 100).toFixed(1);
        tooltip.html(`
          <strong>${d.data.gender}</strong><br/>
          ${d.data.count} people (${percentage}%)
        `)
          .style("left", (event.pageX / 0.75 + 10) + "px")
          .style("top", (event.pageY / 0.75 - 28) + "px");
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .attr("stroke-width", 2)
          .attr("stroke", "var(--bg-secondary)");
        
        // Remove tooltip
        d3.selectAll(".chart-tooltip").remove();
      });
    
    // Create legend
    const legendItems = legend.selectAll(".legend-item")
      .data(pieData)
      .enter()
      .append("div")
      .attr("class", "legend-item")
      .style("display", "flex")
      .style("align-items", "center")
      .style("margin-bottom", "8px")
      .style("font-size", "12px");
    
    legendItems.append("div")
      .style("width", "12px")
      .style("height", "12px")
      .style("background-color", (d: any) => colorScale(d.gender) as string)
      .style("margin-right", "8px")
      .style("border-radius", "2px");
    
    legendItems.append("span")
      .text(d => `${d.emoji} ${d.gender} (${d.count})`)
      .style("color", "var(--text-primary)")
      .style("font-weight", "500");
  }

  /**
   * Create Countries pie chart visualization
   */
  private createCountriesPieChart(): void {
    if (!this.statistics) return;

    const svg = d3.select("#countries-pie-svg");
    const legend = d3.select("#countries-pie-legend");
    
    // Clear previous content
    svg.selectAll("*").remove();
    legend.selectAll("*").remove();
    
    // Get the countries data from the stats
    const countries = this.statistics.countries;
    const pieData = Array.from(countries.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([country, count]) => ({ country, count }));
    
    if (pieData.length === 0) return;
    
    // Set up pie chart dimensions
    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2 - 10;
    
    // Create color scale based on country flag colors
    const countryColors: { [key: string]: string } = {
      'France': '#002395',        // French blue
      'Germany': '#FFCC00',       // German gold/yellow
      'Ireland': '#169B62',       // Irish green
      'Scotland': '#0065BD',      // Scottish blue
      'England': '#C8102E',       // English red
      'Wales': '#D21034',         // Welsh red
      'Italy': '#009246',         // Italian green
      'Spain': '#C60B1E',         // Spanish red
      'Portugal': '#046A38',      // Portuguese green
      'Netherlands': '#21468B',   // Dutch blue
      'Belgium': '#ED2939',       // Belgian red
      'Switzerland': '#FF0000',   // Swiss red
      'Austria': '#ED2939',       // Austrian red
      'Hungary': '#CE2939',       // Hungarian red
      'Poland': '#DC143C',        // Polish red
      'Czech Republic': '#11457E', // Czech blue
      'Slovakia': '#0B4EA2',      // Slovak blue
      'Norway': '#EF2B2D',        // Norwegian red
      'Sweden': '#006AA7',        // Swedish blue
      'Denmark': '#C60C30',       // Danish red
      'Finland': '#003580',       // Finnish blue
      'Russia': '#0052CC',        // Russian blue
      'Ukraine': '#0057B8',       // Ukrainian blue
      'Romania': '#002B7F',       // Romanian blue
      'Bulgaria': '#00966E',      // Bulgarian green
      'Greece': '#0D5EAF',        // Greek blue
      'Turkey': '#E30A17',        // Turkish red
      'Lebanon': '#EE161F',       // Lebanese red
      'Syria': '#CE1126',         // Syrian red
      'Unknown': '#6B7280'        // Gray for unknown
    };
    
    const colorScale = d3.scaleOrdinal()
      .domain(pieData.map(d => d.country))
      .range(pieData.map(d => countryColors[d.country] || '#6B7280'));
    
    // Create pie generator
    const pie = d3.pie<any>()
      .value(d => d.count)
      .sort(null);
    
    // Create arc generator
    const arc = d3.arc<any>()
      .innerRadius(0)
      .outerRadius(radius);
    
    // Create the pie chart
    const g = svg.append("g")
      .attr("transform", `translate(${width/2}, ${height/2})`);
    
    const arcs = g.selectAll(".arc")
      .data(pie(pieData))
      .enter()
      .append("g")
      .attr("class", "arc");
    
    // Add pie slices
    arcs.append("path")
      .attr("d", (d: any) => arc(d) as string)
      .attr("fill", (d: any) => colorScale(d.data.country) as string)
      .attr("stroke", "var(--bg-secondary)")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .attr("stroke-width", 3)
          .attr("stroke", "var(--accent-primary)");
        
        // Show tooltip
        const tooltip = d3.select("body").append("div")
          .attr("class", "chart-tooltip")
          .style("opacity", 0);
        
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        
        const percentage = ((d.data.count / this.statistics!.totalPeople) * 100).toFixed(1);
        tooltip.html(`
          <strong>${d.data.country}</strong><br/>
          ${d.data.count} people (${percentage}%)
        `)
          .style("left", (event.pageX / 0.75 + 10) + "px")
          .style("top", (event.pageY / 0.75 - 28) + "px");
      }.bind(this))
      .on("mouseout", function(event, d) {
        d3.select(this)
          .attr("stroke-width", 2)
          .attr("stroke", "var(--bg-secondary)");
        
        // Remove tooltip
        d3.selectAll(".chart-tooltip").remove();
      });
    
    // Create legend
    const legendItems = legend.selectAll(".legend-item")
      .data(pieData)
      .enter()
      .append("div")
      .attr("class", "legend-item")
      .style("display", "flex")
      .style("align-items", "center")
      .style("margin-bottom", "8px")
      .style("font-size", "12px");
    
    legendItems.append("div")
      .style("width", "12px")
      .style("height", "12px")
      .style("background-color", (d: any) => colorScale(d.country) as string)
      .style("margin-right", "8px")
      .style("border-radius", "2px");
    
    legendItems.append("span")
      .text(d => `${d.country} (${d.count})`)
      .style("color", "var(--text-primary)")
      .style("font-weight", "500");
  }

  /**
   * Create DNA pie chart visualization
   */
  private createDnaPieChart(): void {
    if (!this.statistics) return;

    const svg = d3.select("#dna-pie-svg");
    const legend = d3.select("#dna-pie-legend");
    
    // Clear previous content
    svg.selectAll("*").remove();
    legend.selectAll("*").remove();
    
    // Get the DNA data (same calculation as in the HTML)
    const allNodes = this.data.root.descendants();
    const countryDnaContribution = new Map<string, number>();
    const visitedNodes = new Set<string>();
    
    const traceAncestry = (node: any, depth: number) => {
      if (visitedNodes.has(node.data.name) || depth > 20) {
        return;
      }
      visitedNodes.add(node.data.name);
      
      const country = getCountry(node.data.birthPlace);
      
      if (country !== "United States" && country !== "Canada") {
        const dnaPercent = 100 / Math.pow(2, depth);
        countryDnaContribution.set(country, (countryDnaContribution.get(country) || 0) + dnaPercent);
      } else {
        let hasParents = false;
        if (node.data.parents) {
          node.data.parents.forEach((parent: any) => {
            if (parent) {
              const parentNode = allNodes.find(n => 
                n.data.name === parent.name && 
                n.data.birthDate === parent.birthDate &&
                n.data.birthPlace === parent.birthPlace
              );
              if (parentNode && !visitedNodes.has(parentNode.data.name)) {
                hasParents = true;
                traceAncestry(parentNode, depth + 1);
              }
            }
          });
        }
        
        if (!hasParents) {
          const dnaPercent = 100 / Math.pow(2, depth);
          const deadEndCountry = country === "Canada" ? "France" : "Unknown";
          countryDnaContribution.set(deadEndCountry, (countryDnaContribution.get(deadEndCountry) || 0) + dnaPercent);
        }
      }
      
      visitedNodes.delete(node.data.name);
    };
    
    const rootNode = allNodes.find(n => n.depth === 0);
    if (rootNode) {
      traceAncestry(rootNode, 0);
    }
    
    // Prepare data for pie chart
    const pieData = Array.from(countryDnaContribution.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([country, value]) => ({ country, value }));
    
    if (pieData.length === 0) return;
    
    // Set up pie chart dimensions
    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2 - 10;
    
    // Create color scale based on country flag colors
    const countryColors: { [key: string]: string } = {
      'France': '#002395',        // French blue
      'Germany': '#FFCC00',       // German gold/yellow
      'Ireland': '#169B62',       // Irish green
      'Scotland': '#0065BD',      // Scottish blue
      'England': '#C8102E',       // English red
      'Wales': '#D21034',         // Welsh red
      'Italy': '#009246',         // Italian green
      'Spain': '#C60B1E',         // Spanish red
      'Portugal': '#046A38',      // Portuguese green
      'Netherlands': '#21468B',   // Dutch blue
      'Belgium': '#ED2939',       // Belgian red
      'Switzerland': '#FF0000',   // Swiss red
      'Austria': '#ED2939',       // Austrian red
      'Hungary': '#CE2939',       // Hungarian red
      'Poland': '#DC143C',        // Polish red
      'Czech Republic': '#11457E', // Czech blue
      'Slovakia': '#0B4EA2',      // Slovak blue
      'Norway': '#EF2B2D',        // Norwegian red
      'Sweden': '#006AA7',        // Swedish blue
      'Denmark': '#C60C30',       // Danish red
      'Finland': '#003580',       // Finnish blue
      'Russia': '#0052CC',        // Russian blue
      'Ukraine': '#0057B8',       // Ukrainian blue
      'Romania': '#002B7F',       // Romanian blue
      'Bulgaria': '#00966E',      // Bulgarian green
      'Greece': '#0D5EAF',        // Greek blue
      'Turkey': '#E30A17',        // Turkish red
      'Lebanon': '#EE161F',       // Lebanese red
      'Syria': '#CE1126',         // Syrian red
      'Unknown': '#6B7280'        // Gray for unknown
    };
    
    const colorScale = d3.scaleOrdinal()
      .domain(pieData.map(d => d.country))
      .range(pieData.map(d => countryColors[d.country] || '#6B7280'));
    
    // Create pie generator
    const pie = d3.pie<any>()
      .value(d => d.value)
      .sort(null);
    
    // Create arc generator
    const arc = d3.arc<any>()
      .innerRadius(0)
      .outerRadius(radius);
    
    // Create the pie chart
    const g = svg.append("g")
      .attr("transform", `translate(${width/2}, ${height/2})`);
    
    const arcs = g.selectAll(".arc")
      .data(pie(pieData))
      .enter()
      .append("g")
      .attr("class", "arc");
    
    // Add pie slices
    arcs.append("path")
      .attr("d", (d: any) => arc(d) as string)
      .attr("fill", (d: any) => colorScale(d.data.country) as string)
      .attr("stroke", "var(--bg-secondary)")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .attr("stroke-width", 3)
          .attr("stroke", "var(--accent-primary)");
        
        // Show tooltip
        const tooltip = d3.select("body").append("div")
          .attr("class", "chart-tooltip")
          .style("opacity", 0);
        
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        
        tooltip.html(`
          <strong>${d.data.country}</strong><br/>
          ${d.data.value.toFixed(1)}% DNA contribution
        `)
          .style("left", (event.pageX / 0.75 + 10) + "px")
          .style("top", (event.pageY / 0.75 - 28) + "px");
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .attr("stroke-width", 2)
          .attr("stroke", "var(--bg-secondary)");
        
        // Remove tooltip
        d3.selectAll(".chart-tooltip").remove();
      });
    
    // Create legend
    const legendItems = legend.selectAll(".legend-item")
      .data(pieData)
      .enter()
      .append("div")
      .attr("class", "legend-item")
      .style("display", "flex")
      .style("align-items", "center")
      .style("margin-bottom", "8px")
      .style("font-size", "12px");
    
    legendItems.append("div")
      .style("width", "12px")
      .style("height", "12px")
      .style("background-color", (d: any) => colorScale(d.country) as string)
      .style("margin-right", "8px")
      .style("border-radius", "2px");
    
    legendItems.append("span")
      .text(d => `${d.country} (${d.value.toFixed(1)}%)`)
      .style("color", "var(--text-primary)")
      .style("font-weight", "500");
  }

  /**
   * Create Archaic Ancestry pie chart visualization
   */
  private createArchaicAncestryPieChart(): void {
    const svg = d3.select("#archaic-ancestry-pie-svg");
    const legend = d3.select("#archaic-ancestry-pie-legend");
    
    // Clear previous content
    svg.selectAll("*").remove();
    legend.selectAll("*").remove();
    
    // Archaic ancestry data
    const pieData = [
      { ancestry: 'Neanderthal', percentage: 2.1, color: '#8B4513' },
      { ancestry: 'Denisovan', percentage: 0.05, color: '#A0522D' },
      { ancestry: 'Other Archaic', percentage: 0.1, color: '#CD853F' },
      { ancestry: 'Modern Human', percentage: 97.75, color: '#4A90E2' }
    ];
    
    // Set up pie chart dimensions
    const width = 200;
    const height = 200;
    const radius = Math.min(width, height) / 2 - 10;
    
    // Create color scale
    const colorScale = d3.scaleOrdinal()
      .domain(pieData.map(d => d.ancestry))
      .range(pieData.map(d => d.color));
    
    // Create pie generator
    const pie = d3.pie<any>()
      .value(d => d.percentage)
      .sort(null);
    
    // Create arc generator
    const arc = d3.arc<any>()
      .innerRadius(0)
      .outerRadius(radius);
    
    // Create the pie chart
    const g = svg.append("g")
      .attr("transform", `translate(${width/2}, ${height/2})`);
    
    const arcs = g.selectAll(".arc")
      .data(pie(pieData))
      .enter()
      .append("g")
      .attr("class", "arc");
    
    // Add pie slices
    arcs.append("path")
      .attr("d", (d: any) => arc(d) as string)
      .attr("fill", (d: any) => colorScale(d.data.ancestry) as string)
      .attr("stroke", "var(--bg-secondary)")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .attr("stroke-width", 3)
          .attr("stroke", "var(--accent-primary)");
        
        // Show tooltip
        const tooltip = d3.select("body").append("div")
          .attr("class", "chart-tooltip")
          .style("opacity", 0);
        
        tooltip.transition()
          .duration(200)
          .style("opacity", .9);
        
        tooltip.html(`
          <strong>${d.data.ancestry}</strong><br/>
          ${d.data.percentage}% DNA
        `)
          .style("left", (event.pageX / 0.75 + 10) + "px")
          .style("top", (event.pageY / 0.75 - 28) + "px");
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .attr("stroke-width", 2)
          .attr("stroke", "var(--bg-secondary)");
        
        // Remove tooltip
        d3.selectAll(".chart-tooltip").remove();
      });
    
    // Create legend
    const legendItems = legend.selectAll(".legend-item")
      .data(pieData)
      .enter()
      .append("div")
      .attr("class", "legend-item")
      .style("display", "flex")
      .style("align-items", "center")
      .style("margin-bottom", "8px")
      .style("font-size", "12px");
    
    legendItems.append("div")
      .style("width", "12px")
      .style("height", "12px")
      .style("background-color", (d: any) => colorScale(d.ancestry) as string)
      .style("margin-right", "8px")
      .style("border-radius", "2px");
    
    legendItems.append("span")
      .text(d => `${d.ancestry} (${d.percentage}%)`)
      .style("color", "var(--text-primary)")
      .style("font-weight", "500");
  }

  /**
   * Generate lifespan statistics for the chart
   */
  private generateLifespanStats(): string {
    if (!this.statistics) return '<div class="no-data">No data available</div>';

    const sortedGenerations = Array.from(this.statistics.lifespanByGeneration.entries()).sort((a, b) => a[0] - b[0]);
    if (sortedGenerations.length < 2) return '<div class="no-data">Insufficient data for trend analysis</div>';
    
    const ages = sortedGenerations.map(([_, ages]) => ages.reduce((sum, age) => sum + age, 0) / ages.length);
    const trend = ages[ages.length - 1] - ages[0];
    const trendDirection = trend > 0 ? 'increasing' : trend < 0 ? 'decreasing' : 'stable';
    const trendIcon = trend > 0 ? '📈' : trend < 0 ? '📉' : '➡️';
    
    const totalPeople = sortedGenerations.reduce((sum, [_, ages]) => sum + ages.length, 0);
    const overallAvg = sortedGenerations.reduce((sum, [_, ages]) => sum + ages.reduce((s, age) => s + age, 0), 0) / totalPeople;
    
    return `
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">${trendIcon} ${Math.abs(trend).toFixed(1)}</div>
          <div class="stat-label">${trendDirection} trend</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${overallAvg.toFixed(1)}</div>
          <div class="stat-label">Overall average</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${totalPeople}</div>
          <div class="stat-label">Total people</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${sortedGenerations.length}</div>
          <div class="stat-label">Generations</div>
        </div>
      </div>
    `;
  }

  /**
   * Generate DNA inheritance statistics
   */
  private generateDnaInheritanceStats(): string {
    if (!this.statistics) return '<div class="no-data">No data available</div>';

    if (this.statistics.dnaBreakdown.length === 0) {
      return '<div class="no-data">No DNA inheritance data available</div>';
    }
    
    const sortedData = this.statistics.dnaBreakdown.sort((a, b) => a.generation - b.generation);
    const maxDna = Math.max(...sortedData.map(d => d.dnaPercent));
    const minDna = Math.min(...sortedData.map(d => d.dnaPercent));
    const totalAncestors = sortedData.reduce((sum, d) => sum + d.count, 0);
    const generations = sortedData.length;
    
    return `
      <div class="stats-grid">
        <div class="stat-item">
          <div class="stat-value">${maxDna.toFixed(1)}%</div>
          <div class="stat-label">Max DNA %</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${minDna.toFixed(1)}%</div>
          <div class="stat-label">Min DNA %</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${totalAncestors}</div>
          <div class="stat-label">Total Ancestors</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">${generations}</div>
          <div class="stat-label">Generations</div>
        </div>
      </div>
    `;
  }

  /**
   * Render the lifespan line chart
   */
  private renderLifespanChart(): void {
    if (!this.statistics) return;

    const svg = document.getElementById('lifespan-line-chart');
    if (!svg) {
      console.log('SVG element not found');
      return;
    }
    
    const container = svg.parentElement;
    if (!container) {
      console.log('Container not found');
      return;
    }
    
    const containerRect = container.getBoundingClientRect();
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = Math.max(containerRect.width - margin.left - margin.right, 300);
    const height = 300;
    
    svg.setAttribute('width', String(width + margin.left + margin.right));
    svg.setAttribute('height', String(height + margin.top + margin.bottom));
    
    // Clear previous content
    svg.innerHTML = '';
    
    // Prepare data
    const sortedGenerations = Array.from(this.statistics.lifespanByGeneration.entries())
      .sort((a, b) => a[0] - b[0]);
    
    if (sortedGenerations.length === 0) {
      svg.innerHTML = '<text x="50%" y="50%" text-anchor="middle" fill="var(--text-secondary)">No lifespan data available</text>';
      return;
    }
    
    const chartData = sortedGenerations.map(([generation, ages]) => {
      const avgAge = ages.reduce((sum, age) => sum + age, 0) / ages.length;
      const minAge = Math.min(...ages);
      const maxAge = Math.max(...ages);
      return {
        generation,
        avgAge,
        minAge,
        maxAge,
        count: ages.length
      };
    });
    
    // Create scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(chartData, d => d.generation) as [number, number])
      .range([margin.left, width + margin.left]);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.maxAge) || 100])
      .range([height + margin.top, margin.top]);
    
    // Create line generator
    const line = d3.line<typeof chartData[0]>()
      .x(d => xScale(d.generation))
      .y(d => yScale(d.avgAge))
      .curve(d3.curveMonotoneX);
    
    // Create area generator for range
    const area = d3.area<typeof chartData[0]>()
      .x(d => xScale(d.generation))
      .y0(d => yScale(d.minAge))
      .y1(d => yScale(d.maxAge))
      .curve(d3.curveMonotoneX);
    
    // Create SVG group
    const g = d3.select(svg);
    
    // Add area for range
    g.append('path')
      .datum(chartData)
      .attr('fill', 'rgba(123, 179, 240, 0.3)')
      .attr('d', area);
    
    // Add line for average
    g.append('path')
      .datum(chartData)
      .attr('fill', 'none')
      .attr('stroke', 'var(--accent-primary)')
      .attr('stroke-width', 3)
      .attr('d', line);
    
    // Add dots for data points
    g.selectAll('.dot')
      .data(chartData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.generation))
      .attr('cy', d => yScale(d.avgAge))
      .attr('r', 4)
      .attr('fill', 'var(--accent-primary)')
      .attr('stroke', 'var(--bg-secondary)')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        // Show tooltip
        const tooltip = d3.select('body').append('div')
          .attr('class', 'chart-tooltip')
          .style('opacity', 0);
        
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        
        tooltip.html(`
          <strong>Generation ${d.generation}</strong><br/>
          Average: ${d.avgAge.toFixed(1)} years<br/>
          Range: ${d.minAge}-${d.maxAge} years<br/>
          People: ${d.count}
        `)
          .style('left', (event.pageX / 0.75 + 10) + 'px')
          .style('top', (event.pageY / 0.75 - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.selectAll('.chart-tooltip').remove();
      });
    
    // Add axes
    g.append('g')
      .attr('transform', `translate(0, ${height + margin.top})`)
      .call(d3.axisBottom(xScale).tickFormat(d => `Gen ${d}`))
      .style('color', 'var(--text-secondary)');
    
    g.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale).tickFormat(d => `${d}y`))
      .style('color', 'var(--text-secondary)');
    
    // Add axis labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', 'var(--text-secondary)')
      .text('Age (years)');
    
    g.append('text')
      .attr('transform', `translate(${width / 2 + margin.left}, ${height + margin.top + 40})`)
      .style('text-anchor', 'middle')
      .style('fill', 'var(--text-secondary)')
      .text('Generation');
  }

  /**
   * Render the DNA inheritance line chart
   */
  private renderDnaInheritanceChart(): void {
    if (!this.statistics) return;

    const svg = document.getElementById('dna-inheritance-line-chart');
    if (!svg) {
      console.log('DNA inheritance SVG element not found');
      return;
    }
    
    const container = svg.parentElement;
    if (!container) {
      console.log('Container not found');
      return;
    }
    
    const containerRect = container.getBoundingClientRect();
    const margin = { top: 20, right: 30, bottom: 50, left: 50 };
    const width = Math.max(containerRect.width - margin.left - margin.right, 300);
    const height = 300;
    
    svg.setAttribute('width', String(width + margin.left + margin.right));
    svg.setAttribute('height', String(height + margin.top + margin.bottom));
    
    // Clear previous content
    svg.innerHTML = '';
    
    // Prepare data
    const chartData = this.statistics.dnaBreakdown.sort((a, b) => a.generation - b.generation);
    
    if (chartData.length === 0) {
      svg.innerHTML = '<text x="50%" y="50%" text-anchor="middle" fill="var(--text-secondary)">No DNA inheritance data available</text>';
      return;
    }
    
    // Create scales
    const xScale = d3.scaleLinear()
      .domain(d3.extent(chartData, d => d.generation) as [number, number])
      .range([margin.left, width + margin.left]);
    
    const yScale = d3.scaleLinear()
      .domain([0, d3.max(chartData, d => d.dnaPercent) || 100])
      .range([height + margin.top, margin.top]);
    
    // Create line generator
    const line = d3.line<typeof chartData[0]>()
      .x(d => xScale(d.generation))
      .y(d => yScale(d.dnaPercent))
      .curve(d3.curveMonotoneX);
    
    // Create SVG group
    const g = d3.select(svg);
    
    // Add line
    g.append('path')
      .datum(chartData)
      .attr('fill', 'none')
      .attr('stroke', 'var(--accent-primary)')
      .attr('stroke-width', 3)
      .attr('d', line);
    
    // Add dots for data points
    g.selectAll('.dot')
      .data(chartData)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.generation))
      .attr('cy', d => yScale(d.dnaPercent))
      .attr('r', 4)
      .attr('fill', 'var(--accent-primary)')
      .attr('stroke', 'var(--bg-secondary)')
      .attr('stroke-width', 2)
      .style('cursor', 'pointer')
      .on('mouseover', function(event, d) {
        // Show tooltip
        const tooltip = d3.select('body').append('div')
          .attr('class', 'chart-tooltip')
          .style('opacity', 0);
        
        tooltip.transition()
          .duration(200)
          .style('opacity', .9);
        
        tooltip.html(`
          <strong>Generation ${d.generation}</strong><br/>
          DNA: ${d.dnaPercent.toFixed(1)}%<br/>
          Ancestors: ${d.count}
        `)
          .style('left', (event.pageX / 0.75 + 10) + 'px')
          .style('top', (event.pageY / 0.75 - 28) + 'px');
      })
      .on('mouseout', function() {
        d3.selectAll('.chart-tooltip').remove();
      });
    
    // Add axes
    g.append('g')
      .attr('transform', `translate(0, ${height + margin.top})`)
      .call(d3.axisBottom(xScale).tickFormat(d => `Gen ${d}`))
      .style('color', 'var(--text-secondary)');
    
    g.append('g')
      .attr('transform', `translate(${margin.left}, 0)`)
      .call(d3.axisLeft(yScale).tickFormat(d => `${d}%`))
      .style('color', 'var(--text-secondary)');
    
    // Add axis labels
    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - (height / 2))
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', 'var(--text-secondary)')
      .text('DNA %');
    
    g.append('text')
      .attr('transform', `translate(${width / 2 + margin.left}, ${height + margin.top + 40})`)
      .style('text-anchor', 'middle')
      .style('fill', 'var(--text-secondary)')
      .text('Generation');
  }

  /**
   * Update the statistics with new data
   */
  public updateData(newData: StatsDashboardData): void {
    this.data = newData;
    this.initialize();
  }

  /**
   * Get current statistics data
   */
  public getStatistics(): StatisticsData | null {
    return this.statistics;
  }
}
