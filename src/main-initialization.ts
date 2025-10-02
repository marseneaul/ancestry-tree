import * as d3 from "d3";
import { Person } from "./interfaces/person";
import { migratedMaxArseneaultConfig } from "./utils/migrate-existing-data";
import { buildHierarchy, countryColors } from "./utils/utils";
import { createModal, showPersonModal, closeModal } from "./components/modal";
import { createDashboard, addButtonInteractions } from "./components/dashboard";
import { StatsDashboard } from "./components/stats-dashboard";
import { TimelinePanel } from "./components/timeline-panel";
import { FilterPanel } from "./components/filter-panel";
import { createViewControls } from "./components/view-controls";
import { TreeVisualization, TreeVisualizationConfig } from "./visualization/tree-visualization";
import { TooltipSystem } from "./visualization/tooltips";
import { setupAllEventHandlers, EventHandlerDependencies } from "./handlers/event-handlers";
import { exportPersonToGEDCOM, downloadGEDCOM } from "./utils/gedcom-export";

// Types for initialization
export interface InitializationConfig {
  countrySvgs: Record<string, string>;
  width: number;
  height: number;
}

export interface InitializationResult {
  // Core elements
  app: HTMLElement;
  dashboardContainer: HTMLElement;
  header: HTMLElement;
  leftSidebar: HTMLElement;
  mainContent: HTMLElement;
  rightSidebar: HTMLElement;
  filterPanel: HTMLElement;
  statsDashboard: HTMLElement;
  timelinePanel: HTMLElement;
  legend: HTMLElement;
  
  // Button elements
  statsToggleBtn: HTMLButtonElement;
  timelineToggleBtn: HTMLButtonElement;
  filterToggleBtn: HTMLButtonElement;
  exportBtn: HTMLButtonElement;
  themeToggleBtn: HTMLButtonElement;
  legendToggleBtn: HTMLButtonElement;
  searchInput: HTMLInputElement;
  searchClearBtn: HTMLButtonElement;
  searchResultsCount: HTMLDivElement;
  
  // D3 elements
  svg: any;
  g: any;
  zoom: any;
  
  // Data
  root: any;
  allNames: string[];
  dropdown: HTMLElement;
  
  // State
  isStatsDashboardVisible: boolean;
  isTimelinePanelVisible: boolean;
  isFilterPanelVisible: boolean;
  currentTheme: string;
  
  // Functions
  showPersonModal: (person: Person, depth: number) => void;
  closeModal: () => void;
  updateTree: () => void;
  updateGridLayout: () => void;
  initializeStatsDashboard: () => void;
  initializeTimelinePanel: () => void;
  initializeFilterPanel: () => void;
  initializeMigrationContent: () => void;
  closeStatsDashboard: () => void;
  closeTimelinePanel: () => void;
  applyTheme: (theme: string) => void;
  updateThemeButton: () => void;
  initializeTheme: () => void;
  exportPersonToGEDCOM: (person: any, options: any) => string;
  downloadGEDCOM: (content: string, filename: string) => void;
  rootPerson: any;
}

/**
 * Initialize the main application
 */
export function initializeMainApplication(): InitializationResult {
  const app = document.querySelector("#app") as HTMLElement;
  if (!app) {
    throw new Error("App element not found");
  }

  // Create modal structure
  createModal();

  // Create dashboard using extracted component
  const {
    dashboardContainer,
    header,
    leftSidebar,
    mainContent,
    rightSidebar,
    filterPanel,
    statsDashboard,
    timelinePanel,
    legend
  } = createDashboard();

  // Add view controls to main content
  const viewControls = createViewControls();
  mainContent.appendChild(viewControls);

  // Add dashboard to app
  app.appendChild(dashboardContainer);

  // Add button interactions
  addButtonInteractions();

  // Get references to the header buttons after they're in the DOM
  const statsToggleBtn = document.getElementById("stats-toggle-btn") as HTMLButtonElement;
  const timelineToggleBtn = document.getElementById("timeline-toggle-btn") as HTMLButtonElement;
  const filterToggleBtn = document.getElementById("filter-toggle-btn") as HTMLButtonElement;
  const exportBtn = document.getElementById("export-btn") as HTMLButtonElement;
  const themeToggleBtn = document.getElementById("theme-toggle-btn") as HTMLButtonElement;
  const legendToggleBtn = document.getElementById("legend-toggle-btn") as HTMLButtonElement;
  const searchInput = document.getElementById("search-input") as HTMLInputElement;
  const searchClearBtn = document.getElementById("search-clear-btn") as HTMLButtonElement;
  const searchResultsCount = document.getElementById("search-results-count") as HTMLDivElement;

  // Country SVGs configuration
  const countrySvgs: Record<string, string> = {
    "France": "./svgs/france.svg",
    "United Kingdom": "./svgs/united-kingdom.svg",
    "Ireland": "./svgs/ireland.svg",
    "Germany": "./svgs/germany.svg",
    "Canada": "./svgs/canada.svg",
    "United States": "./svgs/united-states.svg",
    "Switzerland": "./svgs/switzerland.svg",
    "Belgium": "./svgs/belgium.svg",
    "Austria": "./svgs/austria.svg",
    "Norway": "./svgs/norway.svg",
    "Luxembourg": "./svgs/luxembourg.svg",
    "Netherlands": "./svgs/netherlands.svg",
    "Italy": "./svgs/italy.svg",
    "Hungary": "./svgs/hungary.svg",
    "Mi'kmaq Nation": "./svgs/mikmaq-nation.svg",
    "Nipissing Nation": "./svgs/nipissing-nation.svg",
    "Unknown": "./svgs/unknown.svg"
  };

  // Populate Color Legend Dynamically with SVGs instead of colors
  const colorLegend = document.getElementById("color-legend");
  Object.entries(countryColors).forEach(([country, color]) => {
    const li = document.createElement("li");
    const svgSrc = countrySvgs[country];
    const iconHtml = svgSrc 
      ? `<img src="${svgSrc}" style="width: 20px; height: 20px; display: inline-block; margin-right: 5px; object-fit: contain;">`
      : `<span style="background: ${color}; width: 20px; height: 20px; display: inline-block; margin-right: 5px;"></span>`;
    li.innerHTML = `${iconHtml}${country}`;
    colorLegend?.appendChild(li);
  });

  // Responsive dimensions
  let width = window.innerWidth * 0.8;
  let height = window.innerHeight;

  // Initialize Tree Visualization
  const treeVizConfig: TreeVisualizationConfig = {
    container: "#tree-container",
    width,
    height,
    countrySvgs,
    originalPersonData: migratedMaxArseneaultConfig,
    onNodeClick: (person, depth) => {
      showPersonModal(person, depth);
    },
    onNodeHover: (person, depth, element, event) => {
      showPersonTooltip(person, depth, element, event);
    },
    onNodeHoverOut: () => {
      hidePersonTooltip();
    }
  };

  const treeVisualization = new TreeVisualization(treeVizConfig);
  treeVisualization.initialize();

  // Get references to the visualization elements
  const svg = treeVisualization.getSVG();
  const g = svg.select("g");
  const zoom = treeVisualization.getCurrentTransform();

  let rootPerson = migratedMaxArseneaultConfig;
  
  // Tooltip system
  const tooltipSystem = new TooltipSystem();
  
  function showPersonTooltip(person: Person, depth: number, element: any, event?: any) {
    tooltipSystem.showPersonTooltip(person, depth, element, event);
  }
  
  function hidePersonTooltip() {
    tooltipSystem.hidePersonTooltip();
  }
  
  function updateTreeWithNewData(newRoot: any) {
    // Update the root reference
    root = newRoot;
    
    // Update tree visualization
    treeVisualization.updateTree(newRoot);
  }
  
  let root = buildHierarchy(rootPerson);

  // State variables
  let maxGeneration = 0;
  let isFilterPanelVisible = true;
  let isStatsDashboardVisible = false;
  let isTimelinePanelVisible = false;
  let statsDashboardInstance: StatsDashboard | null = null;
  let timelinePanelInstance: TimelinePanel | null = null;
  let filterPanelInstance: FilterPanel | null = null;
  let migrationMapViz: any = null;
  let currentTheme = localStorage.getItem('theme') || 'light';

  // Initialize statistics dashboard
  function initializeStatsDashboard() {
    if (!statsDashboardInstance) {
      statsDashboardInstance = new StatsDashboard(statsDashboard, {
        root: root,
        countrySvgs: countrySvgs
      });
    }
    statsDashboardInstance.initialize();
  }

  // Close statistics dashboard function
  function closeStatsDashboard() {
    isStatsDashboardVisible = false;
    statsDashboard.classList.add("hidden");
    statsToggleBtn.classList.remove("active");
  }

  // Initialize timeline panel
  function initializeTimelinePanel() {
    if (!timelinePanelInstance) {
      timelinePanelInstance = new TimelinePanel(timelinePanel, {
        root: root
      });
    }
    timelinePanelInstance.initialize();
  }

  // Close timeline panel function
  function closeTimelinePanel() {
    isTimelinePanelVisible = false;
    timelinePanel.classList.add("hidden");
    timelineToggleBtn.classList.remove("active");
  }

  // Initialize migration content in stats section
  function initializeMigrationContent() {
    // Only initialize if not already done
    const mapContainer = document.getElementById('migration-map');
    if (!mapContainer || mapContainer.innerHTML.trim() !== '') {
      return;
    }

    // Import the migration utilities
    import('./utils/migration-patterns.js').then(({ extractMigrationPatterns }) => {
      import('./utils/migration-visualization.js').then(({ MigrationMapVisualization }) => {
        // Extract migration patterns from the current tree data
        const patterns = extractMigrationPatterns(root.data);
        
        // Update the migration stats in the stats section
        const locationsCountEl = document.getElementById('migration-locations-count');
        const routesCountEl = document.getElementById('migration-routes-count');
        
        console.log('Stats elements found:', { locationsCountEl: !!locationsCountEl, routesCountEl: !!routesCountEl });
        if (locationsCountEl) locationsCountEl.textContent = patterns.points.length.toString();
        if (routesCountEl) routesCountEl.textContent = patterns.routes.length.toString();
        
        // Create the migration map visualization
        if (mapContainer && patterns.points.length > 0) {
          migrationMapViz = new MigrationMapVisualization({
            width: 400,
            height: 300,
            container: mapContainer,
            showRoutes: true,
            showPoints: true
          });
          
          // Update the map with migration patterns
          migrationMapViz.updatePatterns(patterns);
        } else if (mapContainer) {
          mapContainer.innerHTML = `
            <div class="no-migration-data">
              <div class="no-data-icon">📍</div>
              <div class="no-data-text">No migration data available</div>
              <div class="no-data-subtext">Add birth and death locations to see migration patterns</div>
            </div>
          `;
        }
      }).catch(error => {
        console.error('Failed to load migration visualization:', error);
        if (mapContainer) {
          mapContainer.innerHTML = `
            <div class="migration-error">
              <div class="error-icon">⚠️</div>
              <div class="error-text">Failed to load migration visualization</div>
            </div>
          `;
        }
      });
    }).catch(error => {
      console.error('Failed to load migration patterns:', error);
      if (mapContainer) {
        mapContainer.innerHTML = `
          <div class="migration-error">
            <div class="error-icon">⚠️</div>
            <div class="error-text">Failed to load migration data</div>
          </div>
        `;
      }
    });
  }

  // Initialize Filter Panel
  function initializeFilterPanel() {
    if (!filterPanelInstance) {
      filterPanelInstance = new FilterPanel(filterPanel, {
        root: root,
        migratedMaxArseneaultConfig: migratedMaxArseneaultConfig,
        g: g,
        updateGridLayout: updateGridLayout
      });
    }
    filterPanelInstance.initialize();
  }

  // Function to update grid layout based on visible panels
  function updateGridLayout() {
    const leftPanelVisible = !filterPanel.classList.contains("hidden") || 
                            !statsDashboard.classList.contains("hidden") || 
                            !timelinePanel.classList.contains("hidden");
    const rightPanelVisible = !legend.classList.contains("hidden");
    
    let gridColumns;
    if (leftPanelVisible && rightPanelVisible) {
      gridColumns = "1fr 3fr 1fr";
    } else if (leftPanelVisible && !rightPanelVisible) {
      gridColumns = "1fr 4fr 0fr";
    } else if (!leftPanelVisible && rightPanelVisible) {
      gridColumns = "0fr 4fr 1fr";
    } else {
      gridColumns = "0fr 1fr 0fr";
    }
    
    dashboardContainer.style.gridTemplateColumns = gridColumns;
  }

  // Theme management functions
  function applyTheme(theme: string) {
    currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }

  function updateThemeButton() {
    // Update the SVG icon based on theme
    const themeIcon = document.querySelector('#theme-toggle-btn .theme-icon');
    if (themeIcon) {
      if (currentTheme === 'dark') {
        // Sun icon for dark mode (to switch to light)
        themeIcon.innerHTML = `
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/>
          <line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/>
          <line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        `;
      } else {
        // Moon icon for light mode (to switch to dark)
        themeIcon.innerHTML = `
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        `;
      }
    }
  }

  function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    const theme = savedTheme || systemTheme;
    applyTheme(theme);
    updateThemeButton();
  }

  // Toggle section functionality
  (window as any).toggleSection = function(sectionId: string) {
    // Look specifically for the stats section content, not filter checkboxes
    const content = document.querySelector(`.stats-section-content#${sectionId}`) as HTMLElement;
    if (!content) {
      console.error(`Stats section content with id '${sectionId}' not found`);
      return;
    }
    
    // Try multiple approaches to find the title element
    let title = null;
    let icon = null;
    
    // Approach 1: Look for previous sibling
    title = content.previousElementSibling;
    if (title && title.classList.contains('stats-section-title')) {
      icon = title.querySelector('.collapse-icon');
    }
    
    // Approach 2: Look for parent stats-section
    if (!title || !icon) {
      const statsSection = content.closest('.stats-section');
      if (statsSection) {
        title = statsSection.querySelector('.stats-section-title.collapsible');
        if (title) {
          icon = title.querySelector('.collapse-icon');
        }
      }
    }
    
    // Approach 3: Look for any element with the onclick attribute containing the sectionId
    if (!title || !icon) {
      const titleElements = document.querySelectorAll('.stats-section-title.collapsible');
      for (const element of titleElements) {
        if (element.getAttribute('onclick')?.includes(sectionId)) {
          title = element;
          icon = element.querySelector('.collapse-icon');
          break;
        }
      }
    }
    
    if (!title || !icon) {
      console.error(`Title element or icon not found for section '${sectionId}'`);
      console.log('Content element:', content);
      console.log('Content parent:', content.parentElement);
      console.log('Available title elements:', document.querySelectorAll('.stats-section-title.collapsible'));
      return;
    }
    
    // Debug: Log current state
    console.log('Current display style:', content.style.display);
    console.log('Current computed display:', window.getComputedStyle(content).display);
    console.log('Content element:', content);
    
    if (content.style.display === 'none') {
      console.log('Expanding section...');
      content.style.display = 'block';
      icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"></polyline></svg>';
      
      // Initialize migration content when migration section is expanded
      if (sectionId === 'migration') {
        setTimeout(() => {
          initializeMigrationContent();
        }, 100);
      }
    } else {
      console.log('Collapsing section...');
      content.style.display = 'none';
      icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"></polyline></svg>';
    }
    
    // Debug: Log new state
    console.log('New display style:', content.style.display);
    console.log('New computed display:', window.getComputedStyle(content).display);
  };

  // Make functions globally available
  (window as any).closeStatsDashboard = closeStatsDashboard;

  function updateTree() {
    treeVisualization.updateTree(root);
  }

  updateTree();

  // Collect unique names from the tree (run once after updateTree)
  const allNames = [...new Set(root.descendants().map((d: any) => d.data.name || "Unknown"))];

  // Initialize Filter Panel
  initializeFilterPanel();

  // Create custom dropdown instead of datalist for better control
  const dropdown = document.createElement("div");
  dropdown.id = "name-suggestions";
  dropdown.className = "custom-dropdown";
  dropdown.style.display = "none";
  
  // Append to body for maximum z-index control
  document.body.appendChild(dropdown);

  // Clear search function (now that dropdown and g are defined)
  (window as any).clearSearch = function() {
    searchInput.value = "";
    searchClearBtn.classList.remove("visible");
    searchResultsCount.textContent = "";
    searchResultsCount.classList.remove("highlighted");
    dropdown.style.display = "none";
    dropdown.innerHTML = ""; // Clear old suggestions
    g.selectAll(".node").classed("highlighted", false);
  };

  // Set initial active state for filter button since panel is open by default
  filterToggleBtn.classList.add("active");

  // Initialize theme on load
  initializeTheme();
  
  // Initialize grid layout
  updateGridLayout();

  // Set up all event handlers using the extracted module
  const eventHandlerDeps: EventHandlerDependencies = {
    // Search elements
    searchInput,
    searchClearBtn,
    searchResultsCount,
    dropdown,
    
    // Button elements
    statsToggleBtn,
    timelineToggleBtn,
    filterToggleBtn,
    exportBtn,
    themeToggleBtn,
    legendToggleBtn,
    
    // Panel elements
    filterPanel,
    statsDashboard,
    timelinePanel,
    leftSidebar,
    rightSidebar,
    legendElement: document.getElementById('legend') as HTMLElement,
    
    // Modal elements
    modal: document.getElementById("detail-modal") as HTMLElement,
    
    // D3 elements
    svg,
    g,
    zoom,
    
    // Data and functions
    root,
    allNames,
    width,
    height,
    
    // State variables
    isStatsDashboardVisible,
    isTimelinePanelVisible,
    isFilterPanelVisible,
    legendVisible: true,
    currentTheme,
    
    // Callback functions
    showPersonModal,
    closeModal,
    applyTheme,
    updateThemeButton,
    initializeTheme,
    updateGridLayout,
    initializeStatsDashboard,
    initializeTimelinePanel,
    initializeFilterPanel,
    initializeMigrationContent,
    closeStatsDashboard,
    closeTimelinePanel,
    updateTree,
    exportPersonToGEDCOM,
    downloadGEDCOM,
    rootPerson
  };

  setupAllEventHandlers(eventHandlerDeps);

  // Return all the initialized components and state
  return {
    // Core elements
    app,
    dashboardContainer,
    header,
    leftSidebar,
    mainContent,
    rightSidebar,
    filterPanel,
    statsDashboard,
    timelinePanel,
    legend,
    
    // Button elements
    statsToggleBtn,
    timelineToggleBtn,
    filterToggleBtn,
    exportBtn,
    themeToggleBtn,
    legendToggleBtn,
    searchInput,
    searchClearBtn,
    searchResultsCount,
    
    // D3 elements
    svg,
    g,
    zoom,
    
    // Data
    root,
    allNames,
    dropdown,
    
    // State
    isStatsDashboardVisible,
    isTimelinePanelVisible,
    isFilterPanelVisible,
    currentTheme,
    
    // Functions
    showPersonModal,
    closeModal,
    updateTree,
    updateGridLayout,
    initializeStatsDashboard,
    initializeTimelinePanel,
    initializeFilterPanel,
    initializeMigrationContent,
    closeStatsDashboard,
    closeTimelinePanel,
    applyTheme,
    updateThemeButton,
    initializeTheme,
    exportPersonToGEDCOM,
    downloadGEDCOM,
    rootPerson
  };
}
