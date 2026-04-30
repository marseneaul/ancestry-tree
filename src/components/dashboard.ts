// src/components/dashboard.ts

/**
 * Creates the main dashboard structure including container, header, sidebars, and main content area
 */
export function createDashboard(): {
  dashboardContainer: HTMLElement;
  header: HTMLElement;
  leftSidebar: HTMLElement;
  mainContent: HTMLElement;
  rightSidebar: HTMLElement;
  filterPanel: HTMLElement;
  statsDashboard: HTMLElement;
  timelinePanel: HTMLElement;
  legend: HTMLElement;
} {
  // Create Dashboard Container
  const dashboardContainer = document.createElement("div");
  dashboardContainer.className = "dashboard-container";

  // Add Professional Header
  const header = createHeader();
  dashboardContainer.appendChild(header);

  // Create Left Sidebar
  const leftSidebar = document.createElement("div");
  leftSidebar.className = "dashboard-sidebar-left";

  // Create Filter Panel
  const filterPanel = document.createElement("div");
  filterPanel.className = "filter-panel";
  filterPanel.id = "filter-panel";

  // Create and append the statistics dashboard
  const statsDashboard = document.createElement("div");
  statsDashboard.className = "stats-dashboard hidden";
  statsDashboard.id = "stats-dashboard";

  // Create Timeline Panel
  const timelinePanel = document.createElement("div");
  timelinePanel.className = "timeline-panel hidden";
  timelinePanel.id = "timeline-panel";

  // Add panels to left sidebar (only one visible at a time)
  leftSidebar.appendChild(filterPanel);
  leftSidebar.appendChild(statsDashboard);
  leftSidebar.appendChild(timelinePanel);

  // Create Main Content Area
  const mainContent = document.createElement("div");
  mainContent.className = "dashboard-main";

  const container = document.createElement("div");
  container.id = "tree-container";
  mainContent.appendChild(container);

  // Create Right Sidebar
  const rightSidebar = document.createElement("div");
  rightSidebar.className = "dashboard-sidebar-right";

  // Legend
  const legend = createLegend();
  rightSidebar.appendChild(legend);

  // Assemble dashboard
  dashboardContainer.appendChild(leftSidebar);
  dashboardContainer.appendChild(mainContent);
  dashboardContainer.appendChild(rightSidebar);

  return {
    dashboardContainer,
    header,
    leftSidebar,
    mainContent,
    rightSidebar,
    filterPanel,
    statsDashboard,
    timelinePanel,
    legend
  };
}

/**
 * Creates the professional header with logo, search, and controls
 */
function createHeader(): HTMLElement {
  const header = document.createElement("header");
  header.className = "main-header dashboard-header";
  header.innerHTML = `
    <div class="header-content">
      <div class="header-left">
        <div class="logo-section">
          <svg class="logo-icon" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M12 2L2 7l10 5 10-5-10-5z"/>
            <path d="M2 17l10 5 10-5"/>
            <path d="M2 12l10 5 10-5"/>
          </svg>
          <div class="title-section">
            <h1>Arseneault Family Tree</h1>
            <p class="subtitle">Explore Your Ancestry</p>
          </div>
        </div>
      </div>
      
      <div class="header-center">
        <div class="search-container">
          <div class="search-input-wrapper">
            <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input type="text" id="search-input" placeholder="Search for ancestors..." autocomplete="off">
            <button class="search-clear-btn" id="search-clear-btn" aria-label="Clear search">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <div class="search-results-count" id="search-results-count"></div>
        </div>
      </div>
      
      <div class="header-right">
        <div class="header-controls">
          <div class="control-group">
            <button type="button" class="header-btn" id="stats-toggle-btn" title="Statistics Dashboard" aria-label="Statistics Dashboard" aria-pressed="false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3v18h18"/>
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
              </svg>
              <span class="btn-label">Stats</span>
            </button>
            
            <button type="button" class="header-btn" id="timeline-toggle-btn" title="Timeline View" aria-label="Timeline View" aria-pressed="false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span class="btn-label">Timeline</span>
            </button>
            
            <button type="button" class="header-btn" id="filter-toggle-btn" title="Filter Options" aria-label="Filter Options" aria-pressed="false">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
              </svg>
              <span class="btn-label">Filters</span>
            </button>
            
          </div>
          
          <div class="control-group">
            <button type="button" class="header-btn" id="export-btn" title="Export to GEDCOM" aria-label="Export to GEDCOM">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7,10 12,15 17,10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              <span class="btn-label">Export</span>
            </button>
            
            <button type="button" class="header-btn" id="legend-toggle-btn" title="Toggle Legend" aria-label="Toggle Legend" aria-pressed="true">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
              <span class="btn-label">Legend</span>
            </button>
            
            <button type="button" class="header-btn" id="theme-toggle-btn" title="Toggle Dark Mode" aria-label="Toggle Dark Mode" aria-pressed="false">
              <svg class="theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
              <span class="btn-label">Theme</span>
            </button>
          </div>
        </div>
      </div>
    </div> 
  `;
  return header;
}

/**
 * Creates the legend component for the right sidebar
 */
function createLegend(): HTMLElement {
  const legend = document.createElement("div");
  legend.id = "legend";
  legend.innerHTML = `<h3>Legend</h3>
    <div class="legend-item">
      <svg width="20" height="20"><rect x="2" y="2" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1"/></svg>
      Male
    </div>
    <div class="legend-item">
      <svg width="20" height="20"><circle cx="10" cy="10" r="8" fill="none" stroke="currentColor" stroke-width="1"/></svg>
      Female
    </div>
    <div class="legend-item">
      <span class="line-sample blue-dash"></span> Y-Chromosome (Patrilineal)
    </div>
    <div class="legend-item">
      <span class="line-sample pink-dash"></span> Mitochondrial (Matrilineal)
    </div>
    <div class="legend-section">Countries:</div>
    <ul id="color-legend"></ul>
  `;
  return legend;
}

/**
 * Adds simple button interactions with highlight effect
 */
export function addButtonInteractions(): void {
  const headerButtons = document.querySelectorAll('.header-btn');
  
  headerButtons.forEach(button => {
    // Add simple highlight effect on click
    button.addEventListener('click', () => {
      // Add highlight class temporarily
      button.classList.add('clicked');
      setTimeout(() => {
        button.classList.remove('clicked');
      }, 200);
    });
  });
}
