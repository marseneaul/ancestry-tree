import { getCountry, tracePatrilineal, traceMatrilineal } from "../utils/utils";

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
    this.makeFunctionsGloballyAvailable();
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
      .map(([country]) => country);

    this.container.innerHTML = `
      <div class="filter-header">
        <h3 class="filter-main-title">🔍 Advanced Filters</h3>
        <div class="filter-summary" id="filter-summary">No filters active</div>
      </div>
      
      <div class="filter-tabs" role="tablist" aria-label="Filter categories">
        <button class="filter-tab active" data-tab="basic" onclick="switchFilterTab('basic')" 
                role="tab" aria-selected="true" aria-controls="tab-basic" tabindex="0">
          <span class="tab-icon" aria-hidden="true">📊</span>
          <span class="tab-label">Basic</span>
        </button>
        <button class="filter-tab" data-tab="time" onclick="switchFilterTab('time')" 
                role="tab" aria-selected="false" aria-controls="tab-time" tabindex="-1">
          <span class="tab-icon" aria-hidden="true">📅</span>
          <span class="tab-label">Time</span>
        </button>
        <button class="filter-tab" data-tab="data" onclick="switchFilterTab('data')" 
                role="tab" aria-selected="false" aria-controls="tab-data" tabindex="-1">
          <span class="tab-icon" aria-hidden="true">📋</span>
          <span class="tab-label">Data</span>
        </button>
        <button class="filter-tab" data-tab="lineage" onclick="switchFilterTab('lineage')" 
                role="tab" aria-selected="false" aria-controls="tab-lineage" tabindex="-1">
          <span class="tab-icon" aria-hidden="true">🧬</span>
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
                     oninput="updateGenerationFilter(this.value)"
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
                         checked onchange="updateCountryFilter()">
                  <label class="country-card-label" for="country-${country.replace(/\s+/g, '-').toLowerCase()}">
                    <div class="country-flag">
                      <img src="./svgs/${country.toLowerCase().replace(/\s+/g, '-')}.svg" 
                           alt="${country}" onerror="this.style.display='none'">
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
              <button class="action-btn secondary" onclick="selectAllCountries()">
                <span class="btn-icon">✓</span>
                Select All
              </button>
              <button class="action-btn secondary" onclick="selectNoCountries()">
                <span class="btn-icon">✗</span>
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
                         max="${this.filterState.originalBirthYearRange.max}" 
                         onchange="updateBirthYearRange()">
                </div>
                <div class="range-to">to</div>
                <div class="range-field">
                  <label class="range-label">To</label>
                  <input type="number" class="modern-input" id="birth-year-max" 
                         value="${this.filterState.birthYearRange.max}" 
                         min="${this.filterState.originalBirthYearRange.min}" 
                         max="${this.filterState.originalBirthYearRange.max}" 
                         onchange="updateBirthYearRange()">
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
                         min="0" max="120" onchange="updateLifespanFilter()">
                </div>
                <div class="range-to">to</div>
                <div class="range-field">
                  <label class="range-label">Max Age</label>
                  <input type="number" class="modern-input" id="lifespan-max" 
                         value="${this.filterState.lifespanFilter.max}" 
                         min="0" max="120" onchange="updateLifespanFilter()">
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
                <input type="checkbox" class="modern-checkbox" id="has-photo" onchange="updateDataCompletenessFilter()">
                <label class="checkbox-label" for="has-photo">
                  <div class="checkbox-icon">📸</div>
                  <div class="checkbox-text">
                    <div class="checkbox-title">Has Photo</div>
                    <div class="checkbox-description">Profile image available</div>
                  </div>
                </label>
              </div>
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="has-story" onchange="updateDataCompletenessFilter()">
                <label class="checkbox-label" for="has-story">
                  <div class="checkbox-icon">📖</div>
                  <div class="checkbox-text">
                    <div class="checkbox-title">Has Story</div>
                    <div class="checkbox-description">Biographical information</div>
                  </div>
                </label>
              </div>
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="has-birth-date" onchange="updateDataCompletenessFilter()">
                <label class="checkbox-label" for="has-birth-date">
                  <div class="checkbox-icon">📅</div>
                  <div class="checkbox-text">
                    <div class="checkbox-title">Birth Date</div>
                    <div class="checkbox-description">Known birth date</div>
                  </div>
                </label>
              </div>
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="has-death-date" onchange="updateDataCompletenessFilter()">
                <label class="checkbox-label" for="has-death-date">
                  <div class="checkbox-icon">💀</div>
                  <div class="checkbox-text">
                    <div class="checkbox-title">Death Date</div>
                    <div class="checkbox-description">Known death date</div>
                  </div>
                </label>
              </div>
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="has-birth-place" onchange="updateDataCompletenessFilter()">
                <label class="checkbox-label" for="has-birth-place">
                  <div class="checkbox-icon">📍</div>
                  <div class="checkbox-text">
                    <div class="checkbox-title">Birth Place</div>
                    <div class="checkbox-description">Known birth location</div>
                  </div>
                </label>
              </div>
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="has-parents" onchange="updateDataCompletenessFilter()">
                <label class="checkbox-label" for="has-parents">
                  <div class="checkbox-icon">👨‍👩‍👧‍👦</div>
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
                <input type="checkbox" class="modern-checkbox" id="direct-line-only" onchange="updateRelationshipFilter()">
                <label class="checkbox-label" for="direct-line-only">
                  <div class="checkbox-icon">👤</div>
                  <div class="checkbox-text">
                    <div class="checkbox-title">Direct Line Only</div>
                    <div class="checkbox-description">Direct ancestors only</div>
                  </div>
                </label>
              </div>
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="patrilineal-line" onchange="updateRelationshipFilter()">
                <label class="checkbox-label" for="patrilineal-line">
                  <div class="checkbox-icon">👨</div>
                  <div class="checkbox-text">
                    <div class="checkbox-title">Patrilineal Line</div>
                    <div class="checkbox-description">Father's line only</div>
                  </div>
                </label>
              </div>
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="matrilineal-line" onchange="updateRelationshipFilter()">
                <label class="checkbox-label" for="matrilineal-line">
                  <div class="checkbox-icon">👩</div>
                  <div class="checkbox-text">
                    <div class="checkbox-title">Matrilineal Line</div>
                    <div class="checkbox-description">Mother's line only</div>
                  </div>
                </label>
              </div>
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="migration-patterns" onchange="updateRelationshipFilter()">
                <label class="checkbox-label" for="migration-patterns">
                  <div class="checkbox-icon">🌍</div>
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
                     oninput="updateDnaContributionFilter(this.value)"
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
                <input type="checkbox" class="modern-checkbox" id="research-gaps" onchange="updateResearchFilter()">
                <label class="checkbox-label" for="research-gaps">
                  <div class="checkbox-icon">❓</div>
                  <div class="checkbox-text">
                    <div class="checkbox-title">Research Gaps</div>
                    <div class="checkbox-description">Missing information</div>
                  </div>
                </label>
              </div>
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="missing-data" onchange="updateResearchFilter()">
                <label class="checkbox-label" for="missing-data">
                  <div class="checkbox-icon">⚠️</div>
                  <div class="checkbox-text">
                    <div class="checkbox-title">Missing Critical Data</div>
                    <div class="checkbox-description">Essential info missing</div>
                  </div>
                </label>
              </div>
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="estimated-dates" onchange="updateResearchFilter()">
                <label class="checkbox-label" for="estimated-dates">
                  <div class="checkbox-icon">📊</div>
                  <div class="checkbox-text">
                    <div class="checkbox-title">Estimated Dates</div>
                    <div class="checkbox-description">Approximate dates only</div>
                  </div>
                </label>
              </div>
              <div class="checkbox-card">
                <input type="checkbox" class="modern-checkbox" id="well-documented" onchange="updateResearchFilter()">
                <label class="checkbox-label" for="well-documented">
                  <div class="checkbox-icon">✅</div>
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
        <button class="action-btn primary" onclick="resetAllFilters()">
          <span class="btn-icon">↺</span>
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
    this.addFilterKeyboardNavigation();
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

  /**
   * Make filter functions globally available
   */
  private makeFunctionsGloballyAvailable(): void {
    (window as any).updateGenerationFilter = (value: string) => this.updateGenerationFilter(value);
    (window as any).updateCountryFilter = () => this.updateCountryFilter();
    (window as any).selectAllCountries = () => this.selectAllCountries();
    (window as any).selectNoCountries = () => this.selectNoCountries();
    (window as any).updateBirthYearRange = () => this.updateBirthYearRange();
    (window as any).updateLifespanFilter = () => this.updateLifespanFilter();
    (window as any).updateDataCompletenessFilter = () => this.updateDataCompletenessFilter();
    (window as any).updateRelationshipFilter = () => this.updateRelationshipFilter();
    (window as any).updateDnaContributionFilter = (value: string) => this.updateDnaContributionFilter(value);
    (window as any).updateResearchFilter = () => this.updateResearchFilter();
    (window as any).resetAllFilters = () => this.resetAllFilters();
    (window as any).switchFilterTab = (tabName: string) => this.switchFilterTab(tabName);
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
    
    const activeFilters = [];
    
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
    
    // Filter nodes based on all criteria
    this.data.g.selectAll(".node")
      .style("opacity", d => {
        const node = d as any;
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
              case 'direct-line-only': return this.filterState.showDirectLineOnly;
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
        
        const isVisible = isGenerationVisible && isCountryVisible && isBirthYearVisible && 
                         isLifespanVisible && isDataCompletenessVisible && isRelationshipVisible && 
                         isResearchVisible && isDnaVisible;
        
        return isVisible ? 1 : 0.1;
      });
    
    // Filter links
    this.data.g.selectAll(".link")
      .style("opacity", d => {
        const link = d as any;
        const sourceCountry = getCountry(link.source.data.birthPlace);
        const targetCountry = getCountry(link.target.data.birthPlace);
        const sourceVisible = link.source.depth <= maxGen && this.filterState.selectedCountries.has(sourceCountry);
        const targetVisible = link.target.depth <= maxGen && this.filterState.selectedCountries.has(targetCountry);
        return (sourceVisible && targetVisible) ? 1 : 0.1;
      });
    
    // Update grid layout if needed
    if (this.data.updateGridLayout) {
      this.data.updateGridLayout();
    }
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
