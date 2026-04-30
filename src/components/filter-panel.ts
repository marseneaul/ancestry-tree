import { getCountry, tracePatrilineal, traceMatrilineal } from "../utils/utils";
import { slugify } from "../utils/helpers";

export interface FilterPanelData {
  root: any; // d3.HierarchyNode<Person>
  migratedMaxArseneaultConfig: any;
  g: any; // d3.Selection for the tree visualization
  updateGridLayout: () => void;
}

export interface FilterState {
  maxGeneration: number;
  selectedCountries: Set<string>;
  birthYearRange: { min: number; max: number };
  originalBirthYearRange: { min: number; max: number };
  lifespanFilter: { min: number; max: number };
  selectedDataCompleteness: Set<string>;
  selectedRelationshipFilters: Set<string>;
  selectedResearchFilters: Set<string>;
  minDnaContribution: number;
  showDirectLineOnly: boolean;
}

export class FilterPanel {
  private container: HTMLElement;
  private data: FilterPanelData;
  private filterState: FilterState;

  constructor(container: HTMLElement, data: FilterPanelData) {
    this.container = container;
    this.data = data;
    this.filterState = {
      maxGeneration: 0,
      selectedCountries: new Set<string>(),
      birthYearRange: { min: 0, max: 2100 },
      originalBirthYearRange: { min: 0, max: 2100 },
      lifespanFilter: { min: 0, max: 120 },
      selectedDataCompleteness: new Set<string>(),
      selectedRelationshipFilters: new Set<string>(),
      selectedResearchFilters: new Set<string>(),
      minDnaContribution: 0,
      showDirectLineOnly: false
    };
  }

  /**
   * Initialize the filter panel with data
   */
  public initialize(): void {
    this.calculateInitialState();
    this.renderFilterPanel();
    this.setupEventListeners();
  }

  /**
   * Update the filter panel with new data
   */
  public updateData(newData: FilterPanelData): void {
    this.data = newData;
    this.calculateInitialState();
    this.renderFilterPanel();
  }

  /**
   * Get current filter state
   */
  public getFilterState(): FilterState {
    return { ...this.filterState };
  }

  /**
   * Calculate initial filter state from data
   */
  private calculateInitialState(): void {
    // Calculate max generation
    this.filterState.maxGeneration = Math.max(...this.data.root.descendants().map((d: any) => d.depth));
    
    // Get all countries and their counts
    const countryCounts = new Map<string, number>();
    this.data.root.descendants().forEach((d: any) => {
      const country = getCountry(d.data.birthPlace);
      countryCounts.set(country, (countryCounts.get(country) || 0) + 1);
    });

    // Initialize selected countries with all countries
    this.filterState.selectedCountries = new Set(countryCounts.keys());

    // Calculate birth year range
    const birthYears = this.data.root.descendants()
      .map((d: any) => {
        if (!d.data.birthDate || d.data.birthDate === "Unknown" || d.data.birthDate === "UNKNOWN") return null;
        const yearMatch = d.data.birthDate.match(/\b(19|20)\d{2}\b/) || d.data.birthDate.match(/\b\d{4}\b/);
        return yearMatch ? parseInt(yearMatch[0]) : null;
      })
      .filter((year: number | null) => year !== null && year >= 1000 && year <= 2100);

    const minBirthYear = birthYears.length > 0 ? Math.min(...birthYears) : 1000;
    const maxBirthYear = birthYears.length > 0 ? Math.max(...birthYears) : 2100;

    this.filterState.birthYearRange = { min: minBirthYear, max: maxBirthYear };
    this.filterState.originalBirthYearRange = { min: minBirthYear, max: maxBirthYear };
  }

  /**
   * Render the filter panel HTML
   */
  private renderFilterPanel(): void {
    // Get all countries and their counts
    const countryCounts = new Map<string, number>();
    this.data.root.descendants().forEach((d: any) => {
      const country = getCountry(d.data.birthPlace);
      countryCounts.set(country, (countryCounts.get(country) || 0) + 1);
    });

    const sortedCountries = Array.from(countryCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([country]) => country);
    const icons = {
      filters: `<svg class="panel-title-icon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 5h18"/><path d="M6 12h12"/><path d="M10 19h4"/></svg>`,
      basic: `<svg class="tab-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M18 8l-5 5-3-3-4 4"/></svg>`,
      time: `<svg class="tab-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>`,
      data: `<svg class="tab-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/><path d="M8 13h8"/><path d="M8 17h6"/></svg>`,
      lineage: `<svg class="tab-icon" aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="5" r="2"/><circle cx="6" cy="19" r="2"/><circle cx="18" cy="19" r="2"/><path d="M12 7v5"/><path d="M12 12l-6 5"/><path d="M12 12l6 5"/></svg>`,
      photo: `<svg class="checkbox-icon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 7h3l2-3h6l2 3h3v13H4z"/><circle cx="12" cy="13" r="4"/></svg>`,
      story: `<svg class="checkbox-icon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5z"/></svg>`,
      calendar: `<svg class="checkbox-icon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4"/><path d="M8 2v4"/><path d="M3 10h18"/></svg>`,
      death: `<svg class="checkbox-icon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11z"/><path d="M9 10h6"/><path d="M12 7v6"/></svg>`,
      place: `<svg class="checkbox-icon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 21s7-4.4 7-11a7 7 0 1 0-14 0c0 6.6 7 11 7 11z"/><circle cx="12" cy="10" r="2"/></svg>`,
      parents: `<svg class="checkbox-icon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="8" cy="8" r="3"/><circle cx="17" cy="8" r="3"/><path d="M2 20a6 6 0 0 1 12 0"/><path d="M11 20a6 6 0 0 1 11 0"/></svg>`,
      person: `<svg class="checkbox-icon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="7" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>`,
      male: `<svg class="checkbox-icon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="10" cy="14" r="5"/><path d="M14 10l6-6"/><path d="M15 4h5v5"/></svg>`,
      female: `<svg class="checkbox-icon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="5"/><path d="M12 13v8"/><path d="M9 18h6"/></svg>`,
      globe: `<svg class="checkbox-icon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18"/><path d="M12 3a14 14 0 0 0 0 18"/></svg>`,
      gap: `<svg class="checkbox-icon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 0 1 5 0c0 2-2.5 2-2.5 4"/><path d="M12 17h.01"/></svg>`,
      warning: `<svg class="checkbox-icon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>`,
      estimated: `<svg class="checkbox-icon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 16l3-3 3 2 4-6"/></svg>`,
      documented: `<svg class="checkbox-icon" aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6 9 17l-5-5"/></svg>`
    };

    this.container.innerHTML = `
      <div class="filter-header">
        <h3 class="filter-main-title">${icons.filters} Advanced Filters</h3>
        <div class="filter-summary" id="filter-summary">No filters active</div>
      </div>
      
      <div class="filter-tabs" role="tablist" aria-label="Filter categories">
        <button class="filter-tab active" data-tab="basic"
                role="tab" aria-selected="true" aria-controls="tab-basic" tabindex="0">
          ${icons.basic}
          <span class="tab-label">Basic</span>
        </button>
        <button class="filter-tab" data-tab="time"
                role="tab" aria-selected="false" aria-controls="tab-time" tabindex="-1">
          ${icons.time}
          <span class="tab-label">Time</span>
        </button>
        <button class="filter-tab" data-tab="data"
                role="tab" aria-selected="false" aria-controls="tab-data" tabindex="-1">
          ${icons.data}
          <span class="tab-label">Data</span>
        </button>
        <button class="filter-tab" data-tab="lineage"
                role="tab" aria-selected="false" aria-controls="tab-lineage" tabindex="-1">
          ${icons.lineage}
          <span class="tab-label">Lineage</span>
        </button>
      </div>
      
      <div class="filter-content">
        <!-- Basic Filters Tab -->
        <div class="filter-tab-content active" id="tab-basic" role="tabpanel" aria-labelledby="tab-basic" aria-hidden="false">
          <div class="filter-group">
            <div class="filter-group-header">
              <h4 class="filter-group-title">Generation Depth</h4>
              <div class="filter-group-description">Show ancestors up to generation</div>
            </div>
            <div class="slider-container">
              <input type="range" class="modern-slider" id="generation-slider" 
                     min="0" max="${this.filterState.maxGeneration}" value="${this.filterState.maxGeneration}" 
                     aria-label="Generation depth slider" aria-valuemin="0" aria-valuemax="${this.filterState.maxGeneration}" aria-valuenow="${this.filterState.maxGeneration}">
              <div class="slider-value">
                <span class="slider-value-number" id="generation-value">${this.filterState.maxGeneration}</span>
                <span class="slider-value-label">generations</span>
              </div>
            </div>
          </div>
          
          <div class="filter-group">
            <div class="filter-group-header">
              <h4 class="filter-group-title">Countries of Origin</h4>
              <div class="filter-group-description">Filter by birth countries</div>
            </div>
            <div class="country-grid">
              ${sortedCountries.map(country => `
                <div class="country-card">
                  <input type="checkbox" class="country-checkbox" 
                         id="country-${country.replace(/\s+/g, '-').toLowerCase()}" 
                         checked>
                  <label class="country-card-label" for="country-${country.replace(/\s+/g, '-').toLowerCase()}">
                    <div class="country-flag">
                      <img class="country-flag-img" src="./svgs/${slugify(country)}.svg" 
                           alt="${country}">
                    </div>
                    <div class="country-info">
                      <div class="country-name">${country}</div>
                      <div class="country-count">${countryCounts.get(country)} people</div>
                    </div>
                  </label>
                </div>
              `).join('')}
            </div>
            <div class="country-actions">
              <button class="action-btn secondary" data-filter-action="select-all-countries">
                Select All
              </button>
              <button class="action-btn secondary" data-filter-action="select-no-countries">
                Clear All
              </button>
            </div>
          </div>
        </div>
        
        <!-- Time Filters Tab -->
        <div class="filter-tab-content" id="tab-time" role="tabpanel" aria-labelledby="tab-time" aria-hidden="true">
          <div class="filter-group">
            <div class="filter-group-header">
              <h4 class="filter-group-title">Birth Year Range</h4>
              <div class="filter-group-description">Filter by birth year</div>
            </div>
            <div class="range-container">
              <div class="range-row">
                <div class="range-field">
                  <label class="range-label">From</label>
                  <input type="number" class="modern-input" id="birth-year-min" 
                         value="${this.filterState.birthYearRange.min}" 
                         min="${this.filterState.originalBirthYearRange.min}" 
                         max="${this.filterState.originalBirthYearRange.max}">
                </div>
                <div class="range-to">to</div>
                <div class="range-field">
                  <label class="range-label">To</label>
                  <input type="number" class="modern-input" id="birth-year-max" 
                         value="${this.filterState.birthYearRange.max}" 
                         min="${this.filterState.originalBirthYearRange.min}" 
                         max="${this.filterState.originalBirthYearRange.max}">
                </div>
              </div>
            </div>
          </div>
          
          <div class="filter-group">
            <div class="filter-group-header">
              <h4 class="filter-group-title">Lifespan Range</h4>
              <div class="filter-group-description">Filter by age at death</div>
            </div>
            <div class="range-container">
              <div class="range-row">
                <div class="range-field">
                  <label class="range-label">Min Age</label>
                  <input type="number" class="modern-input" id="lifespan-min" 
                         value="${this.filterState.lifespanFilter.min}" 
                         min="0" max="120">
                </div>
                <div class="range-to">to</div>
                <div class="range-field">
                  <label class="range-label">Max Age</label>
                  <input type="number" class="modern-input" id="lifespan-max" 
                         value="${this.filterState.lifespanFilter.max}" 
                         min="0" max="120">
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Data Completeness Tab -->
        <div class="filter-tab-content" id="tab-data" role="tabpanel" aria-labelledby="tab-data" aria-hidden="true">
          <div class="filter-group">
            <div class="filter-group-header">
              <h4 class="filter-group-title">Data Completeness</h4>
              <div class="filter-group-description">Filter by available data</div>
            </div>
            <div class="checkbox-grid">
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="has-photo">
                <label class="checkbox-label" for="has-photo">
                  ${icons.photo}
                  <div class="checkbox-text">
                    <div class="checkbox-title">Has Photo</div>
                    <div class="checkbox-description">Profile image available</div>
                  </div>
                </label>
              </div>
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="has-story">
                <label class="checkbox-label" for="has-story">
                  ${icons.story}
                  <div class="checkbox-text">
                    <div class="checkbox-title">Has Story</div>
                    <div class="checkbox-description">Biographical information</div>
                  </div>
                </label>
              </div>
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="has-birth-date">
                <label class="checkbox-label" for="has-birth-date">
                  ${icons.calendar}
                  <div class="checkbox-text">
                    <div class="checkbox-title">Birth Date</div>
                    <div class="checkbox-description">Known birth date</div>
                  </div>
                </label>
              </div>
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="has-death-date">
                <label class="checkbox-label" for="has-death-date">
                  ${icons.death}
                  <div class="checkbox-text">
                    <div class="checkbox-title">Death Date</div>
                    <div class="checkbox-description">Known death date</div>
                  </div>
                </label>
              </div>
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="has-birth-place">
                <label class="checkbox-label" for="has-birth-place">
                  ${icons.place}
                  <div class="checkbox-text">
                    <div class="checkbox-title">Birth Place</div>
                    <div class="checkbox-description">Known birth location</div>
                  </div>
                </label>
              </div>
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="has-parents">
                <label class="checkbox-label" for="has-parents">
                  ${icons.parents}
                  <div class="checkbox-text">
                    <div class="checkbox-title">Has Parents</div>
                    <div class="checkbox-description">Parent information available</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Lineage & Research Tab -->
        <div class="filter-tab-content" id="tab-lineage" role="tabpanel" aria-labelledby="tab-lineage" aria-hidden="true">
          <div class="filter-group">
            <div class="filter-group-header">
              <h4 class="filter-group-title">Lineage Filters</h4>
              <div class="filter-group-description">Filter by family relationships</div>
            </div>
            <div class="checkbox-grid">
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="direct-line-only">
                <label class="checkbox-label" for="direct-line-only">
                  ${icons.person}
                  <div class="checkbox-text">
                    <div class="checkbox-title">Direct Line Only</div>
                    <div class="checkbox-description">Direct ancestors only</div>
                  </div>
                </label>
              </div>
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="patrilineal-line">
                <label class="checkbox-label" for="patrilineal-line">
                  ${icons.male}
                  <div class="checkbox-text">
                    <div class="checkbox-title">Patrilineal Line</div>
                    <div class="checkbox-description">Father's line only</div>
                  </div>
                </label>
              </div>
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="matrilineal-line">
                <label class="checkbox-label" for="matrilineal-line">
                  ${icons.female}
                  <div class="checkbox-text">
                    <div class="checkbox-title">Matrilineal Line</div>
                    <div class="checkbox-description">Mother's line only</div>
                  </div>
                </label>
              </div>
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="migration-patterns">
                <label class="checkbox-label" for="migration-patterns">
                  ${icons.globe}
                  <div class="checkbox-text">
                    <div class="checkbox-title">Migration Patterns</div>
                    <div class="checkbox-description">Cross-country movements</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
          
          <div class="filter-group">
            <div class="filter-group-header">
              <h4 class="filter-group-title">DNA Contribution</h4>
              <div class="filter-group-description">Minimum DNA contribution percentage</div>
            </div>
            <div class="slider-container">
              <input type="range" class="modern-slider" id="dna-contribution-slider" 
                     min="0" max="50" step="0.1" value="${this.filterState.minDnaContribution}"
                     aria-label="DNA contribution slider">
              <div class="slider-value">
                <span class="slider-value-number" id="dna-contribution-value">${this.filterState.minDnaContribution}%</span>
                <span class="slider-value-label">minimum</span>
              </div>
            </div>
          </div>
          
          <div class="filter-group">
            <div class="filter-group-header">
              <h4 class="filter-group-title">Research Quality</h4>
              <div class="filter-group-description">Filter by research completeness</div>
            </div>
            <div class="checkbox-grid">
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="research-gaps">
                <label class="checkbox-label" for="research-gaps">
                  ${icons.gap}
                  <div class="checkbox-text">
                    <div class="checkbox-title">Research Gaps</div>
                    <div class="checkbox-description">Missing information</div>
                  </div>
                </label>
              </div>
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="missing-data">
                <label class="checkbox-label" for="missing-data">
                  ${icons.warning}
                  <div class="checkbox-text">
                    <div class="checkbox-title">Missing Critical Data</div>
                    <div class="checkbox-description">Essential info missing</div>
                  </div>
                </label>
              </div>
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="estimated-dates">
                <label class="checkbox-label" for="estimated-dates">
                  ${icons.estimated}
                  <div class="checkbox-text">
                    <div class="checkbox-title">Estimated Dates</div>
                    <div class="checkbox-description">Approximate dates only</div>
                  </div>
                </label>
              </div>
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="well-documented">
                <label class="checkbox-label" for="well-documented">
                  ${icons.documented}
                  <div class="checkbox-text">
                    <div class="checkbox-title">Well Documented</div>
                    <div class="checkbox-description">Complete information</div>
                  </div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div class="filter-footer">
        <button class="action-btn primary" data-filter-action="reset-all">
          Reset All Filters
        </button>
        <div class="filter-stats" id="filter-stats">
          <span class="filter-count">All people visible</span>
        </div>
      </div>
    `;
  }

  /**
   * Setup event listeners for the filter panel
   */
  private setupEventListeners(): void {
    this.addFilterControlListeners();
    this.addFilterKeyboardNavigation();
  }

  private addFilterControlListeners(): void {
    this.container.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const tab = target.closest('.filter-tab') as HTMLElement | null;
      if (tab) {
        const tabName = tab.getAttribute('data-tab');
        if (tabName) this.switchFilterTab(tabName);
        return;
      }

      const actionButton = target.closest('[data-filter-action]') as HTMLElement | null;
      if (!actionButton) return;

      const action = actionButton.getAttribute('data-filter-action');
      if (action === 'select-all-countries') {
        this.selectAllCountries();
      } else if (action === 'select-no-countries') {
        this.selectNoCountries();
      } else if (action === 'reset-all') {
        this.resetAllFilters();
      }
    });

    this.container.addEventListener('input', (event) => {
      const target = event.target as HTMLInputElement;
      if (target.id === 'generation-slider') {
        this.updateGenerationFilter(target.value);
      } else if (target.id === 'dna-contribution-slider') {
        this.updateDnaContributionFilter(target.value);
      }
    });

    this.container.addEventListener('change', (event) => {
      const target = event.target as HTMLInputElement;
      if (target.classList.contains('country-checkbox')) {
        this.updateCountryFilter();
      } else if (target.id === 'birth-year-min' || target.id === 'birth-year-max') {
        this.updateBirthYearRange();
      } else if (target.id === 'lifespan-min' || target.id === 'lifespan-max') {
        this.updateLifespanFilter();
      } else if (target.closest('#tab-data')) {
        this.updateDataCompletenessFilter();
      } else if (['direct-line-only', 'patrilineal-line', 'matrilineal-line', 'migration-patterns'].includes(target.id)) {
        this.updateRelationshipFilter();
      } else if (['research-gaps', 'missing-data', 'estimated-dates', 'well-documented'].includes(target.id)) {
        this.updateResearchFilter();
      }
    });

    this.container.addEventListener('error', (event) => {
      const target = event.target as HTMLElement;
      if (target.classList.contains('country-flag-img')) {
        target.style.display = 'none';
      }
    }, true);
  }

  /**
   * Add keyboard navigation for filter tabs
   */
  private addFilterKeyboardNavigation(): void {
    const filterTabs = this.container.querySelectorAll('.filter-tab');
    filterTabs.forEach((tab, index) => {
      tab.addEventListener('keydown', (e) => {
        const key = (e as KeyboardEvent).key;
        let targetIndex = index;
        
        if (key === 'ArrowLeft') {
          targetIndex = index > 0 ? index - 1 : filterTabs.length - 1;
        } else if (key === 'ArrowRight') {
          targetIndex = index < filterTabs.length - 1 ? index + 1 : 0;
        } else if (key === 'Enter' || key === ' ') {
          e.preventDefault();
          const tabName = (tab as HTMLElement).getAttribute('data-tab');
          if (tabName) this.switchFilterTab(tabName);
          return;
        }
        
        if (targetIndex !== index) {
          (filterTabs[targetIndex] as HTMLElement).focus();
        }
      });
    });
  }

  // Filter update functions
  public updateGenerationFilter(value: string): void {
    const generationValue = document.getElementById("generation-value") as HTMLSpanElement;
    if (generationValue) generationValue.textContent = value;
    this.applyFilters();
    this.updateFilterSummary();
  }

  public updateCountryFilter(): void {
    const checkboxes = this.container.querySelectorAll('.country-checkbox') as NodeListOf<HTMLInputElement>;
    this.filterState.selectedCountries.clear();
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        const country = checkbox.id.replace('country-', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        this.filterState.selectedCountries.add(country);
      }
    });
    this.applyFilters();
    this.updateFilterSummary();
  }

  public selectAllCountries(): void {
    const checkboxes = this.container.querySelectorAll('.country-checkbox') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(checkbox => {
      checkbox.checked = true;
    });
    this.filterState.selectedCountries = new Set(Array.from(checkboxes).map(cb => 
      cb.id.replace('country-', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    ));
    this.applyFilters();
    this.updateFilterSummary();
  }

  public selectNoCountries(): void {
    const checkboxes = this.container.querySelectorAll('.country-checkbox') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    this.filterState.selectedCountries.clear();
    this.applyFilters();
    this.updateFilterSummary();
  }

  public updateBirthYearRange(): void {
    const minInput = document.getElementById("birth-year-min") as HTMLInputElement;
    const maxInput = document.getElementById("birth-year-max") as HTMLInputElement;
    if (minInput && maxInput) {
      this.filterState.birthYearRange.min = parseInt(minInput.value);
      this.filterState.birthYearRange.max = parseInt(maxInput.value);
    }
    this.applyFilters();
    this.updateFilterSummary();
  }

  public updateLifespanFilter(): void {
    const minInput = document.getElementById("lifespan-min") as HTMLInputElement;
    const maxInput = document.getElementById("lifespan-max") as HTMLInputElement;
    if (minInput && maxInput) {
      this.filterState.lifespanFilter.min = parseInt(minInput.value);
      this.filterState.lifespanFilter.max = parseInt(maxInput.value);
    }
    this.applyFilters();
    this.updateFilterSummary();
  }

  public updateDataCompletenessFilter(): void {
    this.filterState.selectedDataCompleteness.clear();
    const checkboxes = this.container.querySelectorAll('#tab-data .modern-checkbox') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        this.filterState.selectedDataCompleteness.add(checkbox.id);
      }
    });
    this.applyFilters();
    this.updateFilterSummary();
  }

  public updateRelationshipFilter(): void {
    this.filterState.selectedRelationshipFilters.clear();
    const relationshipCheckboxes = this.container.querySelectorAll('#direct-line-only, #patrilineal-line, #matrilineal-line, #migration-patterns') as NodeListOf<HTMLInputElement>;
    relationshipCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        this.filterState.selectedRelationshipFilters.add(checkbox.id);
      }
    });
    this.filterState.showDirectLineOnly = this.filterState.selectedRelationshipFilters.has('direct-line-only');
    this.applyFilters();
    this.updateFilterSummary();
  }

  public updateDnaContributionFilter(value: string): void {
    this.filterState.minDnaContribution = parseFloat(value);
    const valueDisplay = document.getElementById("dna-contribution-value") as HTMLSpanElement;
    if (valueDisplay) valueDisplay.textContent = `${this.filterState.minDnaContribution}%`;
    this.applyFilters();
    this.updateFilterSummary();
  }

  public updateResearchFilter(): void {
    this.filterState.selectedResearchFilters.clear();
    const researchCheckboxes = this.container.querySelectorAll('#research-gaps, #missing-data, #estimated-dates, #well-documented') as NodeListOf<HTMLInputElement>;
    researchCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        this.filterState.selectedResearchFilters.add(checkbox.id);
      }
    });
    this.applyFilters();
    this.updateFilterSummary();
  }

  public resetAllFilters(): void {
    // Reset all filter states
    this.filterState.selectedCountries = new Set();
    this.filterState.selectedDataCompleteness.clear();
    this.filterState.selectedRelationshipFilters.clear();
    this.filterState.selectedResearchFilters.clear();
    this.filterState.minDnaContribution = 0;
    this.filterState.showDirectLineOnly = false;
    
    // Reset UI elements
    const generationSlider = document.getElementById("generation-slider") as HTMLInputElement;
    if (generationSlider) generationSlider.value = this.filterState.maxGeneration.toString();
    
    const generationValue = document.getElementById("generation-value") as HTMLSpanElement;
    if (generationValue) generationValue.textContent = this.filterState.maxGeneration.toString();
    
    // Reset all checkboxes except countries
    const checkboxes = this.container.querySelectorAll('.modern-checkbox') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    
    // Reset country checkboxes to checked
    const countryCheckboxes = this.container.querySelectorAll('.country-checkbox') as NodeListOf<HTMLInputElement>;
    countryCheckboxes.forEach(checkbox => {
      checkbox.checked = true;
      const country = checkbox.id.replace('country-', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      this.filterState.selectedCountries.add(country);
    });
    
    // Reset range inputs
    const birthYearMin = document.getElementById("birth-year-min") as HTMLInputElement;
    const birthYearMax = document.getElementById("birth-year-max") as HTMLInputElement;
    if (birthYearMin) birthYearMin.value = this.filterState.originalBirthYearRange.min.toString();
    if (birthYearMax) birthYearMax.value = this.filterState.originalBirthYearRange.max.toString();
    this.filterState.birthYearRange = { ...this.filterState.originalBirthYearRange };
    
    const lifespanMin = document.getElementById("lifespan-min") as HTMLInputElement;
    const lifespanMax = document.getElementById("lifespan-max") as HTMLInputElement;
    if (lifespanMin) lifespanMin.value = "0";
    if (lifespanMax) lifespanMax.value = "120";
    
    const dnaSlider = document.getElementById("dna-contribution-slider") as HTMLInputElement;
    const dnaValue = document.getElementById("dna-contribution-value") as HTMLSpanElement;
    if (dnaSlider) dnaSlider.value = "0";
    if (dnaValue) dnaValue.textContent = "0%";
    
    this.applyFilters();
    this.updateFilterSummary();
  }

  public switchFilterTab(tabName: string): void {
    // Remove active class from all tabs and content
    document.querySelectorAll('.filter-tab').forEach(tab => {
      tab.classList.remove('active');
      tab.setAttribute('aria-selected', 'false');
      tab.setAttribute('tabindex', '-1');
    });
    
    document.querySelectorAll('.filter-tab-content').forEach(content => {
      content.classList.remove('active');
      content.setAttribute('aria-hidden', 'true');
    });
    
    // Add active class to selected tab and content
    const selectedTab = document.querySelector(`[data-tab="${tabName}"]`);
    const selectedContent = document.getElementById(`tab-${tabName}`);
    
    if (selectedTab) {
      selectedTab.classList.add('active');
      selectedTab.setAttribute('aria-selected', 'true');
      selectedTab.setAttribute('tabindex', '0');
    }
    
    if (selectedContent) {
      selectedContent.classList.add('active');
      selectedContent.setAttribute('aria-hidden', 'false');
    }
  }

  public updateFilterSummary(): void {
    const summary = document.getElementById('filter-summary');
    const stats = document.getElementById('filter-stats');
    if (!summary || !stats) return;
    
    const activeFilters: string[] = [];
    
    if (this.filterState.selectedCountries.size < this.data.root.descendants().length) {
      activeFilters.push(`${this.filterState.selectedCountries.size} countries`);
    }
    
    if (this.filterState.selectedDataCompleteness.size > 0) {
      activeFilters.push(`${this.filterState.selectedDataCompleteness.size} data filters`);
    }
    
    if (this.filterState.selectedRelationshipFilters.size > 0) {
      activeFilters.push(`${this.filterState.selectedRelationshipFilters.size} lineage filters`);
    }
    
    if (this.filterState.selectedResearchFilters.size > 0) {
      activeFilters.push(`${this.filterState.selectedResearchFilters.size} research filters`);
    }
    
    if (this.filterState.minDnaContribution > 0) {
      activeFilters.push(`DNA > ${this.filterState.minDnaContribution}%`);
    }
    
    if (activeFilters.length === 0) {
      summary.textContent = "No filters active";
      stats.textContent = "All people visible";
    } else {
      summary.textContent = `${activeFilters.length} filter${activeFilters.length > 1 ? 's' : ''} active`;
      stats.textContent = `${activeFilters.join(', ')}`;
    }
  }


  public applyFilters(): void {
    const maxGen = parseInt((document.getElementById("generation-slider") as HTMLInputElement)?.value || this.filterState.maxGeneration.toString());
    
    // Get lineage data for filtering
    const patrilinealNames = tracePatrilineal(this.data.migratedMaxArseneaultConfig);
    const matrilinealNames = traceMatrilineal(this.data.migratedMaxArseneaultConfig);
    const directLineNames = new Set([...patrilinealNames, ...matrilinealNames]);
    
    // Filter nodes based on all criteria
    this.data.g.selectAll(".node")
      .style("opacity", (d: any) => {
        return this.isNodeVisible(d as any, maxGen, patrilinealNames, matrilinealNames, directLineNames) ? 1 : 0.1;
      });
    
    // Filter links
    this.data.g.selectAll(".link")
      .style("opacity", (d: any) => {
        const link = d as any;
        const sourceVisible = this.isNodeVisible(link.source, maxGen, patrilinealNames, matrilinealNames, directLineNames);
        const targetVisible = this.isNodeVisible(link.target, maxGen, patrilinealNames, matrilinealNames, directLineNames);
        return (sourceVisible && targetVisible) ? 1 : 0.1;
      });
    
    // Update grid layout if needed
    if (this.data.updateGridLayout) {
      this.data.updateGridLayout();
    }
  }

  private isNodeVisible(
    node: any,
    maxGen: number,
    patrilinealNames: string[],
    matrilinealNames: string[],
    directLineNames: Set<string>
  ): boolean {
    const country = getCountry(node.data.birthPlace);
    
    // Basic filters
    const isGenerationVisible = node.depth <= maxGen;
    const isCountryVisible = this.filterState.selectedCountries.has(country);
    
    // Time filters
    let isBirthYearVisible = true;
    if (node.data.birthDate && node.data.birthDate !== "Unknown" && node.data.birthDate !== "UNKNOWN") {
      const yearMatch = node.data.birthDate.match(/\b(19|20)\d{2}\b/) || node.data.birthDate.match(/\b\d{4}\b/);
      if (yearMatch) {
        const year = parseInt(yearMatch[0]);
        isBirthYearVisible = year >= this.filterState.birthYearRange.min && year <= this.filterState.birthYearRange.max;
      }
    }
    
    // Lifespan filter
    let isLifespanVisible = true;
    if (node.data.birthDate && node.data.deathDate && 
        node.data.birthDate !== "Unknown" && node.data.deathDate !== "Unknown") {
      const birthYear = node.data.birthDate.match(/\b(19|20)\d{2}\b/) || node.data.birthDate.match(/\b\d{4}\b/);
      const deathYear = node.data.deathDate.match(/\b(19|20)\d{2}\b/) || node.data.deathDate.match(/\b\d{4}\b/);
      if (birthYear && deathYear) {
        const age = parseInt(deathYear[0]) - parseInt(birthYear[0]);
        isLifespanVisible = age >= this.filterState.lifespanFilter.min && age <= this.filterState.lifespanFilter.max;
      }
    }
    
    // Data completeness filters
    let isDataCompletenessVisible = true;
    if (this.filterState.selectedDataCompleteness.size > 0) {
      isDataCompletenessVisible = Array.from(this.filterState.selectedDataCompleteness).some(filter => {
        switch (filter) {
          case 'has-photo': return node.data.imageUrl;
          case 'has-story': return node.data.story && node.data.story !== "Stories coming soon...";
          case 'has-birth-date': return node.data.birthDate && node.data.birthDate !== "Unknown";
          case 'has-death-date': return node.data.deathDate && node.data.deathDate !== "Unknown";
          case 'has-birth-place': return node.data.birthPlace && node.data.birthPlace !== "Unknown";
          case 'has-parents': return node.data.parents && node.data.parents.length > 0;
          default: return false;
        }
      });
    }
    
    // Relationship filters
    let isRelationshipVisible = true;
    if (this.filterState.selectedRelationshipFilters.size > 0) {
      isRelationshipVisible = Array.from(this.filterState.selectedRelationshipFilters).some(filter => {
        switch (filter) {
          case 'direct-line-only': return directLineNames.has(node.data.name);
          case 'patrilineal-line': return patrilinealNames.includes(node.data.name);
          case 'matrilineal-line': return matrilinealNames.includes(node.data.name);
          case 'migration-patterns': return this.hasMigrationPattern(node);
          default: return false;
        }
      });
    }
    
    // Research filters
    let isResearchVisible = true;
    if (this.filterState.selectedResearchFilters.size > 0) {
      isResearchVisible = Array.from(this.filterState.selectedResearchFilters).some(filter => {
        switch (filter) {
          case 'research-gaps': return this.hasResearchGaps(node);
          case 'missing-data': return this.hasMissingData(node);
          case 'estimated-dates': return this.hasEstimatedDates(node);
          case 'well-documented': return this.isWellDocumented(node);
          default: return false;
        }
      });
    }
    
    // DNA contribution filter
    let isDnaVisible = true;
    if (this.filterState.minDnaContribution > 0) {
      const dnaContribution = Math.pow(0.5, node.depth) * 100;
      isDnaVisible = dnaContribution >= this.filterState.minDnaContribution;
    }
    
    return isGenerationVisible && isCountryVisible && isBirthYearVisible && 
           isLifespanVisible && isDataCompletenessVisible && isRelationshipVisible && 
           isResearchVisible && isDnaVisible;
  }

  private hasMigrationPattern(node: any): boolean {
    if (!node.data.parents || node.data.parents.length === 0) return false;
    const currentCountry = getCountry(node.data.birthPlace);
    return node.data.parents.some((parent: any) => {
      if (!parent) return false;
      const parentCountry = getCountry(parent.birthPlace);
      return currentCountry !== parentCountry;
    });
  }

  private hasResearchGaps(node: any): boolean {
    return !node.data.birthDate || node.data.birthDate === "Unknown" ||
           !node.data.birthPlace || node.data.birthPlace === "Unknown" ||
           !node.data.story || node.data.story === "Stories coming soon...";
  }

  private hasMissingData(node: any): boolean {
    return !node.data.birthDate || node.data.birthDate === "Unknown" ||
           !node.data.birthPlace || node.data.birthPlace === "Unknown" ||
           !node.data.imageUrl;
  }

  private hasEstimatedDates(node: any): boolean {
    return node.data.birthDate && node.data.birthDate.includes("est.") ||
           node.data.deathDate && node.data.deathDate.includes("est.");
  }

  private isWellDocumented(node: any): boolean {
    return node.data.birthDate && node.data.birthDate !== "Unknown" &&
           node.data.birthPlace && node.data.birthPlace !== "Unknown" &&
           node.data.imageUrl &&
           node.data.story && node.data.story !== "Stories coming soon...";
  }
}
