// src/main.ts
import "./style.css";
import * as d3 from "d3";
import { Person, Sex } from "./interfaces/person";
import { migratedMaxArseneaultConfig } from "./utils/migrate-existing-data";
import { buildHierarchy, getGenerations, tracePatrilineal, traceMatrilineal, getCountry, calculateAgeAtDate, countryColors, getInitials, getOrdinalFromNumber, estimateAncientBirthDate, getLeaves } from "./utils/utils";
import { exportPersonToGEDCOM, downloadGEDCOM } from "./utils/gedcom-export";
import { slugify, cleanUnknown } from "./utils/helpers";
import { createModal, showPersonModal, closeModal, setupGlobalModalFunctions } from "./components/modal";
import { extendWithNeanderthal } from "./utils/neanderthal-extension";
import { createDashboard, addButtonInteractions } from "./components/dashboard";
import { StatsDashboard } from "./components/stats-dashboard";
import { TimelinePanel } from "./components/timeline-panel";
import { FilterPanel } from "./components/filter-panel";
import { createViewControls, setupViewControlListeners } from "./components/view-controls";
import { setupSearchFunctionality, setupSearchKeyboardShortcuts, setupSearchInputInteractions } from "./components/search";
import { TreeVisualization, TreeVisualizationConfig } from "./visualization/tree-visualization";
import { TooltipSystem } from "./visualization/tooltips";






// Setup global modal functions
setupGlobalModalFunctions();


document.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector("#app");
  if (!app) return;

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



  // Now get references to the header buttons after they're in the DOM
  const statsToggleBtn = document.getElementById("stats-toggle-btn") as HTMLButtonElement;
  const timelineToggleBtn = document.getElementById("timeline-toggle-btn") as HTMLButtonElement;
  const filterToggleBtn = document.getElementById("filter-toggle-btn") as HTMLButtonElement;
  const exportBtn = document.getElementById("export-btn") as HTMLButtonElement;
  const themeToggleBtn = document.getElementById("theme-toggle-btn") as HTMLButtonElement;
  const legendToggleBtn = document.getElementById("legend-toggle-btn") as HTMLButtonElement;
  const searchInput = document.getElementById("search-input") as HTMLInputElement;
  const searchClearBtn = document.getElementById("search-clear-btn") as HTMLButtonElement;
  const searchResultsCount = document.getElementById("search-results-count") as HTMLDivElement;

  // Clear search function will be defined after dropdown and g variables are created

  // Enhanced keyboard shortcuts and search functionality
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
    // ESC to clear search
    if (e.key === "Escape" && document.activeElement === searchInput) {
      (window as any).clearSearch();
    }
    // Enter to search (if dropdown is visible)
    if (e.key === "Enter" && document.activeElement === searchInput) {
      const firstOption = document.querySelector('.dropdown-option');
      if (firstOption) {
        (firstOption as HTMLElement).click();
      }
    }
  });

  // Enhanced search input interactions
  searchInput.addEventListener('input', function() {
    const hasValue = this.value.length > 0;
    searchClearBtn.classList.toggle('visible', hasValue);
    
    // Add search animation
    if (hasValue) {
      this.style.background = 'var(--bg-secondary)';
    } else {
      this.style.background = 'var(--bg-tertiary)';
    }
  });

  // Simple focus/blur without scaling animation
  searchInput.addEventListener('focus', function() {
    // Just ensure proper focus styling without scaling
  });

  searchInput.addEventListener('blur', function() {
    // Reset any focus styling
  });

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
    "Unknown": "./svgs/unknown.svg"  // Optional; if no SVG, will fallback to gray in nodes
  };

  // Populate Color Legend Dynamically with SVGs instead of colors
  const colorLegend = document.getElementById("color-legend");
  Object.entries(countryColors).forEach(([country, color]) => {
    const li = document.createElement("li");
    const svgSrc = countrySvgs[country];
    const iconHtml = svgSrc 
      ? `<img src="${svgSrc}" style="width: 20px; height: 20px; display: inline-block; margin-right: 5px; object-fit: contain;">`
      : `<span style="background: ${color}; width: 20px; height: 20px; display: inline-block; margin-right: 5px;"></span>`;  // Fallback to color if no SVG
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
      // Clear any pending hover timeout to prevent conflicts
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
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
  const zoom = treeVisualization.getZoom();
  let currentTransform = treeVisualization.getCurrentTransform();

  // Minimap is now handled by TreeVisualization class

  // Minimap functions are now handled by TreeVisualization class

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

  // Migration content will be initialized when stats dashboard is opened

  // Tree layout is now handled by TreeVisualization class

  // Filter state
  let maxGeneration = 0;
  let isFilterPanelVisible = true;

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

  // Filter functions




  // Statistics dashboard state
  let isStatsDashboardVisible = false;
  let statsDashboardInstance: StatsDashboard | null = null;
  
  // Timeline panel state
  let isTimelinePanelVisible = false;
  let timelinePanelInstance: TimelinePanel | null = null;
  
  // Filter panel state
  let filterPanelInstance: FilterPanel | null = null;

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

  // Chart functions have been moved to the StatsDashboard component
  // Close statistics dashboard function
  function closeStatsDashboard() {
    isStatsDashboardVisible = false;
    statsDashboard.classList.add("hidden");
    statsToggleBtn.classList.remove("active");
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

  // Toggle statistics dashboard visibility
  statsToggleBtn.addEventListener("click", () => {
    // Hide other panels first
    filterPanel.classList.add("hidden");
    timelinePanel.classList.add("hidden");
    filterToggleBtn.classList.remove("active");
    timelineToggleBtn.classList.remove("active");
    
    // Toggle stats panel
    isStatsDashboardVisible = !isStatsDashboardVisible;
    statsDashboard.classList.toggle("hidden", !isStatsDashboardVisible);
    statsToggleBtn.classList.toggle("active", isStatsDashboardVisible);
    
    // Update grid layout
    updateGridLayout();
    
    // On mobile, toggle the left sidebar visibility
    if (window.innerWidth <= 768) {
      leftSidebar.classList.toggle('active', isStatsDashboardVisible);
    }
    
    if (isStatsDashboardVisible) {
      initializeStatsDashboard();
      // Charts are now rendered by the StatsDashboard component
        // Initialize migration content when stats dashboard is opened
        console.log('Initializing migration content...');
        initializeMigrationContent();
    }
  });

  // Initialize timeline panel
  function initializeTimelinePanel() {
    if (!timelinePanelInstance) {
      timelinePanelInstance = new TimelinePanel(timelinePanel, {
        root: root
      });
    }
    timelinePanelInstance.initialize();
  }

  // Global migration visualization instance
  let migrationMapViz: any = null;

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


  // Refresh migration data when tree is updated
  function refreshMigrationData() {
    if (root && root.data) {
      import('./utils/migration-patterns.js').then(({ extractMigrationPatterns }) => {
        const patterns = extractMigrationPatterns(root.data);
        
        // Update the migration stats in the stats section
        const locationsCountEl = document.getElementById('migration-locations-count');
        const routesCountEl = document.getElementById('migration-routes-count');
        
        if (locationsCountEl) locationsCountEl.textContent = patterns.points.length.toString();
        if (routesCountEl) routesCountEl.textContent = patterns.routes.length.toString();
        
        // Update the map visualization if it exists
        if (migrationMapViz) {
          migrationMapViz.updatePatterns(patterns);
        }
      });
    }
  }

  // Close statistics dashboard when clicking outside
  document.addEventListener("click", (event) => {
    if (isStatsDashboardVisible && 
        !statsDashboard.contains(event.target as Node) && 
        !statsToggleBtn.contains(event.target as Node)) {
      closeStatsDashboard();
    }
    if (isTimelinePanelVisible && 
        !timelinePanel.contains(event.target as Node) && 
        !timelineToggleBtn.contains(event.target as Node)) {
      closeTimelinePanel();
    }
  });

  // Close timeline panel function
  function closeTimelinePanel() {
    isTimelinePanelVisible = false;
    timelinePanel.classList.add("hidden");
    timelineToggleBtn.classList.remove("active");
  }


  // Toggle timeline panel visibility
  timelineToggleBtn.addEventListener("click", () => {
    // Hide other panels first
    filterPanel.classList.add("hidden");
    statsDashboard.classList.add("hidden");
    filterToggleBtn.classList.remove("active");
    statsToggleBtn.classList.remove("active");
    
    // Toggle timeline panel
    isTimelinePanelVisible = !isTimelinePanelVisible;
    timelinePanel.classList.toggle("hidden", !isTimelinePanelVisible);
    timelineToggleBtn.classList.toggle("active", isTimelinePanelVisible);
    
    // Update grid layout
    updateGridLayout();
    
    // On mobile, toggle the left sidebar visibility
    if (window.innerWidth <= 768) {
      leftSidebar.classList.toggle('active', isTimelinePanelVisible);
    }
    
    if (isTimelinePanelVisible) {
      initializeTimelinePanel();
    }
  });

  // Toggle filter panel visibility
  filterToggleBtn.addEventListener("click", () => {
    // Hide other panels first
    statsDashboard.classList.add("hidden");
    timelinePanel.classList.add("hidden");
    statsToggleBtn.classList.remove("active");
    timelineToggleBtn.classList.remove("active");
    
    // Toggle filter panel
    isFilterPanelVisible = !isFilterPanelVisible;
    filterPanel.classList.toggle("hidden", !isFilterPanelVisible);
    filterToggleBtn.classList.toggle("active", isFilterPanelVisible);
    
    // Update grid layout
    updateGridLayout();
    
    // On mobile, toggle the left sidebar visibility
    if (window.innerWidth <= 768) {
      leftSidebar.classList.toggle('active', isFilterPanelVisible);
    }
  });

  // Set initial active state for filter button since panel is open by default
  filterToggleBtn.classList.add("active");


  // Theme management
  let currentTheme = localStorage.getItem('theme') || 'light';
  
  // Initialize theme
  function initializeTheme() {
    // Check for system preference if no saved theme
    if (!localStorage.getItem('theme')) {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      currentTheme = prefersDark ? 'dark' : 'light';
    }
    
    applyTheme(currentTheme);
    updateThemeButton();
  }
  
  function applyTheme(theme: string) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    currentTheme = theme;
    
    // Update minimap colors when theme changes
    updateMinimapTheme();
  }
  
  function updateMinimapTheme() {
    // Minimap theme updates are now handled by TreeVisualization class
    // This function is kept for compatibility but does nothing
  }
  
  function updateThemeButton() {
    // Update the SVG icon based on theme
    const themeIcon = themeToggleBtn.querySelector('.theme-icon');
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
  
  // Export to GEDCOM
  exportBtn.addEventListener("click", () => {
    try {
      // Show loading state
      exportBtn.disabled = true;
      exportBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12a9 9 0 11-6.219-8.56"/>
        </svg>
        <span class="btn-label">Exporting...</span>
      `;
      
      // Export the data
      const gedcomContent = exportPersonToGEDCOM(rootPerson, {
        includeStories: true,
        includeImages: false,
        sourceName: 'Ancestry Tree',
        sourceVersion: '1.0'
      });
      
      // Generate filename with current date
      const now = new Date();
      const dateStr = now.toISOString().split('T')[0]; // YYYY-MM-DD format
      const filename = `ancestry-tree-${dateStr}.ged`;
      
      // Download the file
      downloadGEDCOM(gedcomContent, filename);
      
      // Show success message
      setTimeout(() => {
        exportBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="20,6 9,17 4,12"/>
          </svg>
          <span class="btn-label">Exported!</span>
        `;
        
        // Reset button after 2 seconds
        setTimeout(() => {
          exportBtn.disabled = false;
          exportBtn.innerHTML = `
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7,10 12,15 17,10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
            <span class="btn-label">Export</span>
          `;
        }, 2000);
      }, 500);
      
    } catch (error) {
      console.error('Export failed:', error);
      
      // Show error state
      exportBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <line x1="15" y1="9" x2="9" y2="15"/>
          <line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        <span class="btn-label">Error</span>
      `;
      
      // Reset button after 3 seconds
      setTimeout(() => {
        exportBtn.disabled = false;
        exportBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7,10 12,15 17,10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span class="btn-label">Export</span>
        `;
      }, 3000);
    }
  });

  // Toggle theme
  themeToggleBtn.addEventListener("click", () => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(newTheme);
    updateThemeButton();
  });
  
  
  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      applyTheme(newTheme);
      updateThemeButton();
    }
  });
  
  // Initialize theme on load
  initializeTheme();
  
  // Initialize grid layout
  updateGridLayout();

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
  const allNames = [...new Set(root.descendants().map(d => d.data.name || "Unknown"))];

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

  // Enhanced Search Functionality with Autocomplete, Results Count, and Zoom
  searchInput.addEventListener("input", (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();

    // Show/hide clear button
    if (query.length > 0) {
      searchClearBtn.classList.add("visible");
    } else {
      searchClearBtn.classList.remove("visible");
    }

    // Clear existing suggestions
    dropdown.innerHTML = "";

    // Filter names containing the substring (case-insensitive)
    const suggestions = allNames.filter(name => name.toLowerCase().includes(query));
    const matchingNodes = root.descendants().filter(d => 
      query && (d.data.name?.toLowerCase().includes(query) ?? false)
    );

    // Update results count
    if (query.length > 0) {
      searchResultsCount.textContent = `${matchingNodes.length} result${matchingNodes.length !== 1 ? 's' : ''}`;
      searchResultsCount.classList.add("highlighted");
    } else {
      searchResultsCount.textContent = "";
      searchResultsCount.classList.remove("highlighted");
    }

    // Show/hide dropdown
    if (query.length > 0 && suggestions.length > 0) {
      dropdown.style.display = "block";
      
      // Add up to 10 suggestions
      suggestions.slice(0, 10).forEach(name => {
        const option = document.createElement("div");
        option.className = "dropdown-option";
        option.textContent = name;
        option.addEventListener("click", () => {
          searchInput.value = name;
          dropdown.style.display = "none";
          // Trigger the change event to zoom to the person
          const event = new Event("change");
          searchInput.dispatchEvent(event);
        });
        dropdown.appendChild(option);
      });
      
      // Position dropdown immediately and after a small delay to ensure DOM update
      positionDropdown();
      setTimeout(positionDropdown, 0);
    } else {
      dropdown.style.display = "none";
      dropdown.innerHTML = ""; // Clear old suggestions
    }

    // Highlight matching nodes (keep current behavior)
    g.selectAll(".node")
      .classed("highlighted", d => query && ((d as any).data.name?.toLowerCase().includes(query) ?? false));
  });

  // On selection (change event fires when picking from datalist)
  searchInput.addEventListener("change", (e) => {
    const selectedName = (e.target as HTMLInputElement).value;
    if (!selectedName) return;

    // Find the node with exact name match (assume unique names; if not, take first)
    const selectedNode = root.descendants().find(d => d.data.name === selectedName);
    if (!selectedNode) return;

    // Remove highlights
    g.selectAll(".node").classed("highlighted", false);

    // Zoom/Center: Compute transform to center the node at scale 1
    const k = 1;  // Fixed scale; adjust if you want to zoom in (e.g., 2)
    const tx = (width / 2) - (selectedNode.x ?? 0) * k;
    const ty = (height / 2) - (selectedNode.y ?? 0) * k;

    // Transition smoothly
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity.translate(tx, ty).scale(k)
    );

    // Optionally clear input after selection
    searchInput.value = "";
  });

  // Bonus: Handle Enter key for manual input (if not using datalist pick)
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const event = new Event("change");
      searchInput.dispatchEvent(event);  // Trigger the change handler
    }
  });

  // Modal click-outside-to-close functionality
  const modal = document.getElementById("detail-modal");
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeModal();
      }
    });
  }

  // ESC key to close modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const modal = document.getElementById("detail-modal");
      if (modal && !modal.classList.contains("hidden")) {
        closeModal();
      }
    }
  });

  // Click outside to close dropdown
  document.addEventListener("click", (e) => {
    if (!searchInput.contains(e.target as Node) && !dropdown.contains(e.target as Node)) {
      dropdown.style.display = "none";
      dropdown.innerHTML = ""; // Clear old suggestions
    }
  });

  // Function to position dropdown relative to search input
  const positionDropdown = () => {
    if (dropdown.style.display === "block") {
      const inputRect = searchInput.getBoundingClientRect();
      
      console.log('Input rect for positioning:', inputRect);
      console.log('Dropdown will be positioned at:', {
        top: `${inputRect.bottom + 2}px`,
        left: `${inputRect.left}px`,
        width: `${inputRect.width}px`
      });
      
      // Use fixed positioning to escape the body's transform stacking context
      const inputRectFixed = searchInput.getBoundingClientRect();
      
      // Position fixed relative to viewport, accounting for the body's scale transform
      const scale = 0.75; // The body's scale transform
      const adjustedTop = (inputRectFixed.bottom + 2) / scale;
      const adjustedLeft = inputRectFixed.left / scale; // No offset - align with input edge
      const adjustedWidth = inputRectFixed.width / scale;
      
      console.log('Fixed positioning with scale compensation:', {
        originalRect: inputRectFixed,
        scale: scale,
        adjustedTop: adjustedTop,
        adjustedLeft: adjustedLeft,
        adjustedWidth: adjustedWidth
      });
      
      // Position fixed to escape stacking context
      dropdown.style.position = 'fixed';
      dropdown.style.top = `${adjustedTop}px`;
      dropdown.style.left = `${adjustedLeft}px`;
      dropdown.style.width = `${adjustedWidth}px`;
      dropdown.style.minWidth = `${adjustedWidth}px`;
      dropdown.style.zIndex = '999999'; // Very high z-index
      
      // Append to body to escape the transform stacking context
      document.body.appendChild(dropdown);
    }
  };

  // Debounced positioning function for resize events
  let resizeTimeout: number;
  const debouncedPositionDropdown = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(positionDropdown, 100) as any;
  };

  // Reposition dropdown on window resize (debounced)
  window.addEventListener("resize", debouncedPositionDropdown);
  
  // Reposition dropdown on scroll
  window.addEventListener("scroll", positionDropdown);

  // View Controls functionality
  const zoomInBtn = document.getElementById("zoom-in-btn");
  const zoomOutBtn = document.getElementById("zoom-out-btn");
  const fitScreenBtn = document.getElementById("fit-screen-btn");
  const resetViewBtn = document.getElementById("reset-view-btn");

  zoomInBtn?.addEventListener("click", () => {
    const currentTransform = d3.zoomTransform(svg.node()!);
    const newScale = Math.min(currentTransform.k * 1.5, 5); // Max zoom 5x
    svg.transition().duration(300).call(
      zoom.transform,
      d3.zoomIdentity.translate(currentTransform.x, currentTransform.y).scale(newScale)
    );
  });

  zoomOutBtn?.addEventListener("click", () => {
    const currentTransform = d3.zoomTransform(svg.node()!);
    const newScale = Math.max(currentTransform.k / 1.5, 0.1); // Min zoom 0.1x
    svg.transition().duration(300).call(
      zoom.transform,
      d3.zoomIdentity.translate(currentTransform.x, currentTransform.y).scale(newScale)
    );
  });

  fitScreenBtn?.addEventListener("click", () => {
    // Calculate bounds of all visible nodes
    const nodes = root.descendants();
    const xs = nodes.map(d => d.x ?? 0);
    const ys = nodes.map(d => d.y ?? 0);
    
    const x0 = Math.min(...xs);
    const x1 = Math.max(...xs);
    const y0 = Math.min(...ys);
    const y1 = Math.max(...ys);
    
    const boundsWidth = x1 - x0;
    const boundsHeight = y1 - y0;
    
    const scale = Math.min(width / boundsWidth, height / boundsHeight) * 0.8;
    const tx = (width - (x0 + x1) * scale) / 2;
    const ty = (height - (y0 + y1) * scale) / 2;
    
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity.translate(tx, ty).scale(scale)
    );
  });

  resetViewBtn?.addEventListener("click", () => {
    svg.transition().duration(750).call(
      zoom.transform,
      d3.zoomIdentity
    );
  });

  // Mobile-specific enhancements
  function isMobile() {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Touch gesture support for mobile
  let touchStartTime = 0;
  let touchStartDistance = 0;
  let lastTouchDistance = 0;
  let isPinching = false;

  svg.on("touchstart", function(event) {
    touchStartTime = Date.now();
    const touches = event.touches;
    
    if (touches.length === 2) {
      // Pinch gesture
      isPinching = true;
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      touchStartDistance = Math.sqrt(dx * dx + dy * dy);
      lastTouchDistance = touchStartDistance;
    } else if (touches.length === 1) {
      // Single touch - prepare for potential double tap
      isPinching = false;
    }
  });

  svg.on("touchmove", function(event) {
    event.preventDefault(); // Prevent scrolling
    
    const touches = event.touches;
    
    if (touches.length === 2 && isPinching) {
      // Handle pinch zoom
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      const currentDistance = Math.sqrt(dx * dx + dy * dy);
      
      if (lastTouchDistance > 0) {
        const scale = currentDistance / lastTouchDistance;
        const currentTransform = d3.zoomTransform(svg.node()!);
        const newScale = Math.max(0.1, Math.min(5, currentTransform.k * scale));
        
        // Center the zoom on the midpoint of the two touches
        const midX = (touches[0].clientX + touches[1].clientX) / 2;
        const midY = (touches[0].clientY + touches[1].clientY) / 2;
        const rect = svg.node()!.getBoundingClientRect();
        const x = midX - rect.left;
        const y = midY - rect.top;
        
        svg.call(zoom.transform, d3.zoomIdentity
          .translate(x - (x - currentTransform.x) * (newScale / currentTransform.k), 
                    y - (y - currentTransform.y) * (newScale / currentTransform.k))
          .scale(newScale));
      }
      
      lastTouchDistance = currentDistance;
    }
  });

  svg.on("touchend", function(event) {
    const touchDuration = Date.now() - touchStartTime;
    const touches = event.changedTouches;
    
    if (touches.length === 1 && touchDuration < 300 && !isPinching) {
      // Potential double tap - we'll handle this in the click event
      setTimeout(() => {
        // Check if this was a double tap by looking for another touchstart
        // This is a simplified approach - in production you might want more sophisticated detection
      }, 300);
    }
    
    isPinching = false;
    lastTouchDistance = 0;
  });

  // Enhanced node interactions for mobile
  let lastTapTime = 0;
  let tapCount = 0;
  let hoverTimeout: number | null = null;

  // Override the existing node click behavior for mobile
  const originalNodeClick = g.selectAll(".node").on("click");
  
  g.selectAll(".node")
    .on("click", function(event, d) {
      // Clear any pending hover timeout to prevent conflicts
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
        hoverTimeout = null;
      }
      
      if (isMobile()) {
        const currentTime = Date.now();
        const timeDiff = currentTime - lastTapTime;
        
        if (timeDiff < 500) {
          tapCount++;
        } else {
          tapCount = 1;
        }
        
        lastTapTime = currentTime;
        
        if (tapCount === 1) {
          // Single tap - show modal after a short delay to allow for double tap
          setTimeout(() => {
            if (tapCount === 1) {
              showPersonModal((d as any).data, (d as any).depth);
            }
          }, 300);
        } else if (tapCount === 2) {
          // Double tap - zoom to node
          tapCount = 0;
          const currentTransform = d3.zoomTransform(svg.node()!);
          const scale = Math.min(currentTransform.k * 2, 3);
          const tx = width / 2 - ((d as any).x ?? 0) * scale;
          const ty = height / 2 - ((d as any).y ?? 0) * scale;
          
          svg.transition().duration(300).call(
            zoom.transform,
            d3.zoomIdentity.translate(tx, ty).scale(scale)
          );
        }
      } else {
        // Desktop behavior
        showPersonModal((d as any).data, (d as any).depth);
      }
    });

  // Mobile panel management
  function closeAllPanels() {
    const panels = [
      document.querySelector('.filter-panel'),
      document.querySelector('.stats-dashboard'),
      document.querySelector('.timeline-panel')
    ];
    
    panels.forEach(panel => {
      if (panel && !panel.classList.contains('hidden')) {
        panel.classList.add('hidden');
      }
    });
  }

  // Add swipe gestures for panel navigation
  let startX = 0;
  let startY = 0;
  let isSwipeGesture = false;

  document.addEventListener('touchstart', function(e) {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    isSwipeGesture = true;
  });

  document.addEventListener('touchmove', function(e) {
    if (!isSwipeGesture) return;
    
    const currentX = e.touches[0].clientX;
    const currentY = e.touches[0].clientY;
    const diffX = startX - currentX;
    const diffY = startY - currentY;
    
    // Check if this is a horizontal swipe (more horizontal than vertical movement)
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
      if (diffX > 0) {
        // Swipe left - close panels
        closeAllPanels();
      }
      isSwipeGesture = false;
    }
  });

  document.addEventListener('touchend', function() {
    isSwipeGesture = false;
  });

  // Mobile-specific modal improvements
  function enhanceModalForMobile() {
    const modal = document.getElementById('detail-modal');
    if (modal && isMobile()) {
      // Add swipe-to-close for modal
      let modalStartY = 0;
      
      modal.addEventListener('touchstart', function(e) {
        modalStartY = e.touches[0].clientY;
      });
      
      modal.addEventListener('touchmove', function(e) {
        const currentY = e.touches[0].clientY;
        const diffY = currentY - modalStartY;
        
        if (diffY > 100) {
          // Swipe down to close
          closeModal();
        }
      });
    }
  }

  // Legend toggle functionality
  const legendElement = document.getElementById('legend');
  let legendVisible = true; // Start visible on both desktop and mobile
  
  // Set initial state
  if (legendElement) {
    legendElement.classList.remove('hidden');
  }
  legendToggleBtn.style.opacity = '1';
  
  legendToggleBtn.addEventListener('click', () => {
    legendVisible = !legendVisible;
    if (legendElement) {
      legendElement.classList.toggle('hidden', !legendVisible);
    }
    legendToggleBtn.style.opacity = legendVisible ? '1' : '0.5';
    
    // Update grid layout
    updateGridLayout();
    
    // On mobile, toggle the right sidebar visibility
    if (window.innerWidth <= 768) {
      rightSidebar.classList.toggle('active', legendVisible);
    }
  });

  // Initialize mobile enhancements
  if (isMobile()) {
    enhanceModalForMobile();
    
    // Add mobile-specific classes
    document.body.classList.add('mobile-device');
    
    // Optimize zoom behavior for mobile
    zoom.scaleExtent([0.1, 3]); // Reduce max zoom on mobile
    
    // Add haptic feedback for supported devices
    function hapticFeedback() {
      if ('vibrate' in navigator) {
        navigator.vibrate(50);
      }
    }
    
    // Add haptic feedback to button interactions
    document.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', hapticFeedback);
    });
  }

  // Handle orientation change
  window.addEventListener('orientationchange', function() {
    setTimeout(() => {
      // Recalculate dimensions and update tree
      const container = document.getElementById('tree-container');
      if (container) {
        const rect = container.getBoundingClientRect();
        width = rect.width;
        height = Math.max(rect.height, 400);
        
        treeVisualization.updateDimensions(width, height);
        updateTree();
      }
    }, 100);
  });

  // Handle window resize for mobile
  window.addEventListener('resize', function() {
    if (isMobile()) {
      setTimeout(() => {
        const container = document.getElementById('tree-container');
        if (container) {
          const rect = container.getBoundingClientRect();
          width = rect.width;
          height = Math.max(rect.height, 400);
          
          treeVisualization.updateDimensions(width, height);
          updateTree();
        }
      }, 100);
    }
  });

  // Chart functions have been moved to the StatsDashboard component

});
