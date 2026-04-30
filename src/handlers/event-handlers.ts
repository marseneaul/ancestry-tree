import * as d3 from 'd3';
import { UIState } from '../state/ui-state';
import { getGEDCOMExportSummary } from '../utils/gedcom-export';
import type { GEDCOMExportOptions, LivingPersonPrivacy } from '../utils/gedcom-export';

function setPressed(button: HTMLButtonElement, pressed: boolean): void {
  button.setAttribute('aria-pressed', String(pressed));
}

// Types for event handler parameters
export interface EventHandlerDependencies {
  // Search elements
  searchInput: HTMLInputElement;
  searchClearBtn: HTMLButtonElement;
  searchResultsCount: HTMLDivElement;
  dropdown: HTMLElement;
  
  // Button elements
  statsToggleBtn: HTMLButtonElement;
  timelineToggleBtn: HTMLButtonElement;
  filterToggleBtn: HTMLButtonElement;
  exportBtn: HTMLButtonElement;
  themeToggleBtn: HTMLButtonElement;
  legendToggleBtn: HTMLButtonElement;
  
  // Panel elements
  filterPanel: HTMLElement;
  statsDashboard: HTMLElement;
  timelinePanel: HTMLElement;
  leftSidebar: HTMLElement;
  rightSidebar: HTMLElement;
  legendElement: HTMLElement;
  
  // Modal elements
  modal: HTMLElement;
  
  // D3 elements
  svg: any;
  g: any;
  zoom: any;
  treeVisualization?: {
    expandToPersonName: (name: string) => any | null;
    updateDimensions: (width: number, height: number) => void;
  };
  
  // Data and functions
  root: any;
  allNames: string[];
  width: number;
  height: number;
  
  // State
  uiState: UIState;
  
  // Callback functions
  showPersonModal: (person: any, depth: number) => void;
  closeModal: () => void;
  applyTheme: (theme: string) => void;
  updateThemeButton: () => void;
  initializeTheme: () => void;
  updateGridLayout: () => void;
  initializeStatsDashboard: () => void;
  initializeTimelinePanel: () => void;
  initializeFilterPanel: () => void;
  initializeMigrationContent: () => void;
  closeStatsDashboard: () => void;
  closeTimelinePanel: () => void;
  updateTree: () => void;
  exportPersonToGEDCOM: (person: any, options: GEDCOMExportOptions) => string;
  downloadGEDCOM: (content: string, filename: string) => void;
  clearSearch: () => void;
  rootPerson: any;
}

const exportButtonDefaultHtml = `
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7,10 12,15 17,10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
  <span class="btn-label">Export</span>
`;

function resetExportButton(exportBtn: HTMLButtonElement): void {
  exportBtn.disabled = false;
  exportBtn.innerHTML = exportButtonDefaultHtml;
}

function positionExportMenu(menu: HTMLElement, anchor: HTMLElement): void {
  const anchorRect = anchor.getBoundingClientRect();
  const menuWidth = Math.min(320, window.innerWidth - 24);
  const left = Math.min(
    Math.max(12, anchorRect.right - menuWidth),
    window.innerWidth - menuWidth - 12
  );
  const top = Math.min(anchorRect.bottom + 8, window.innerHeight - 24);

  menu.style.width = `${menuWidth}px`;
  menu.style.left = `${left}px`;
  menu.style.top = `${top}px`;
}

function pluralize(count: number, singular: string, plural = `${singular}s`): string {
  return `${count} ${count === 1 ? singular : plural}`;
}

function getExportOptionsFromMenu(menu: HTMLElement): GEDCOMExportOptions {
  const privacySelect = menu.querySelector<HTMLSelectElement>('#export-privacy-mode');
  const includeStories = menu.querySelector<HTMLInputElement>('#export-include-stories');
  const includeImages = menu.querySelector<HTMLInputElement>('#export-include-images');

  return {
    includeStories: includeStories?.checked ?? true,
    includeImages: includeImages?.checked ?? false,
    livingPersonPrivacy: (privacySelect?.value ?? 'redact-details') as LivingPersonPrivacy,
    sourceName: 'Ancestry Tree',
    sourceVersion: '1.0'
  };
}

function updateExportSummary(menu: HTMLElement, deps: EventHandlerDependencies): void {
  const summary = getGEDCOMExportSummary(deps.rootPerson, getExportOptionsFromMenu(menu));
  const peopleSummary = menu.querySelector<HTMLElement>('[data-export-summary="people"]');
  const livingSummary = menu.querySelector<HTMLElement>('[data-export-summary="living"]');
  const extrasSummary = menu.querySelector<HTMLElement>('[data-export-summary="extras"]');

  if (peopleSummary) {
    peopleSummary.textContent = `${pluralize(summary.exportedPeople, 'person', 'people')} exported`;
    if (summary.exportedPeople !== summary.totalPeople) {
      peopleSummary.textContent += ` from ${pluralize(summary.totalPeople, 'person', 'people')}`;
    }
  }

  if (livingSummary) {
    if (summary.livingPeople === 0) {
      livingSummary.textContent = 'No living-person records detected.';
    } else if (summary.excludedLivingPeople > 0) {
      livingSummary.textContent = `${pluralize(summary.excludedLivingPeople, 'living record')} excluded.`;
    } else if (summary.nameOnlyLivingPeople > 0) {
      livingSummary.textContent = `${pluralize(summary.nameOnlyLivingPeople, 'living record')} exported with names only.`;
    } else if (summary.redactedLivingPeople > 0) {
      livingSummary.textContent = `${pluralize(summary.redactedLivingPeople, 'living record')} exported with details redacted.`;
    } else {
      livingSummary.textContent = `${pluralize(summary.includedLivingPeople, 'living record')} exported with full details.`;
    }
  }

  if (extrasSummary) {
    extrasSummary.textContent = `${pluralize(summary.storyRecords, 'story', 'stories')} and ${pluralize(summary.imageRecords, 'image path')} included.`;
  }
}

function createExportMenu(deps: EventHandlerDependencies): HTMLElement {
  const menu = document.createElement('div');
  menu.className = 'export-menu hidden';
  menu.id = 'export-options-menu';
  menu.setAttribute('role', 'dialog');
  menu.setAttribute('aria-label', 'GEDCOM export options');

  menu.innerHTML = `
    <div class="export-menu-header">
      <h2>GEDCOM Export</h2>
      <button type="button" class="export-menu-close" aria-label="Close export options">×</button>
    </div>

    <label class="export-field" for="export-privacy-mode">
      <span>Living people</span>
      <select id="export-privacy-mode">
        <option value="redact-details" selected>Redact details</option>
        <option value="name-only">Name only</option>
        <option value="exclude">Exclude</option>
        <option value="include">Include all</option>
      </select>
    </label>

    <label class="export-checkbox">
      <input type="checkbox" id="export-include-stories" checked>
      <span>Include stories</span>
    </label>

    <label class="export-checkbox">
      <input type="checkbox" id="export-include-images">
      <span>Include image paths</span>
    </label>

    <div class="export-summary" aria-live="polite">
      <div data-export-summary="people"></div>
      <div data-export-summary="living"></div>
      <div data-export-summary="extras"></div>
    </div>

    <div class="export-menu-actions">
      <button type="button" class="export-menu-secondary" data-export-action="cancel">Cancel</button>
      <button type="button" class="export-menu-primary" data-export-action="export">Export</button>
    </div>
  `;

  const closeMenu = () => {
    menu.classList.add('hidden');
    deps.exportBtn.setAttribute('aria-expanded', 'false');
  };

  const runExport = () => {
    closeMenu();
    executeGEDCOMExport(deps, getExportOptionsFromMenu(menu));
  };

  menu.querySelector('.export-menu-close')?.addEventListener('click', closeMenu);
  menu.querySelector('[data-export-action="cancel"]')?.addEventListener('click', closeMenu);
  menu.querySelector('[data-export-action="export"]')?.addEventListener('click', runExport);
  menu.querySelectorAll('select, input').forEach(control => {
    control.addEventListener('change', () => updateExportSummary(menu, deps));
  });
  menu.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      closeMenu();
      deps.exportBtn.focus();
    }
  });

  document.addEventListener('mousedown', (event) => {
    const target = event.target as Node;
    if (menu.classList.contains('hidden')) return;
    if (menu.contains(target) || deps.exportBtn.contains(target)) return;
    closeMenu();
  });

  document.body.appendChild(menu);
  updateExportSummary(menu, deps);
  return menu;
}

function executeGEDCOMExport(deps: EventHandlerDependencies, options: GEDCOMExportOptions): void {
  try {
    deps.exportBtn.disabled = true;
    deps.exportBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <path d="M21 12a9 9 0 11-6.219-8.56"/>
      </svg>
      <span class="btn-label">Exporting...</span>
    `;
    
    const gedcomContent = deps.exportPersonToGEDCOM(deps.rootPerson, options);
    const now = new Date();
    const dateStr = now.toISOString().split('T')[0];
    const filename = `ancestry-tree-${dateStr}.ged`;
    
    deps.downloadGEDCOM(gedcomContent, filename);
    
    setTimeout(() => {
      deps.exportBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="20,6 9,17 4,12"/>
        </svg>
        <span class="btn-label">Exported!</span>
      `;
      
      setTimeout(() => resetExportButton(deps.exportBtn), 2000);
    }, 500);
  } catch (error) {
    console.error('Export failed:', error);
    
    deps.exportBtn.innerHTML = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <line x1="15" y1="9" x2="9" y2="15"/>
        <line x1="9" y1="9" x2="15" y2="15"/>
      </svg>
      <span class="btn-label">Error</span>
    `;
    
    setTimeout(() => resetExportButton(deps.exportBtn), 3000);
  }
}

/**
 * Sets up all keyboard shortcuts
 */
export function setupKeyboardShortcuts(deps: EventHandlerDependencies): void {
  document.addEventListener("keydown", (e) => {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      deps.searchInput.focus();
      deps.searchInput.select();
    }
    
    // ESC to clear search or close modal
    if (e.key === "Escape") {
      if (document.activeElement === deps.searchInput) {
        deps.clearSearch();
      } else {
        const modal = document.getElementById("detail-modal");
        if (modal && !modal.classList.contains("hidden")) {
          deps.closeModal();
        }
      }
    }
    
    // Enter to search (if dropdown is visible)
    if (e.key === "Enter" && document.activeElement === deps.searchInput) {
      const firstOption = document.querySelector('.dropdown-option');
      if (firstOption) {
        (firstOption as HTMLElement).click();
      }
    }
  });
}

/**
 * Sets up search input event handlers
 */
export function setupSearchHandlers(deps: EventHandlerDependencies): void {
  deps.searchClearBtn.addEventListener('click', deps.clearSearch);

  // Enhanced search input interactions
  deps.searchInput.addEventListener('input', function() {
    const hasValue = this.value.length > 0;
    deps.searchClearBtn.classList.toggle('visible', hasValue);
    
    // Add search animation
    if (hasValue) {
      this.style.background = 'var(--bg-secondary)';
    } else {
      this.style.background = 'var(--bg-tertiary)';
    }
  });

  // Simple focus/blur without scaling animation
  deps.searchInput.addEventListener('focus', function() {
    // Just ensure proper focus styling without scaling
  });

  deps.searchInput.addEventListener('blur', function() {
    // Reset any focus styling
  });

  // Enhanced Search Functionality with Autocomplete, Results Count, and Zoom
  deps.searchInput.addEventListener("input", (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();

    // Show/hide clear button
    if (query.length > 0) {
      deps.searchClearBtn.classList.add("visible");
    } else {
      deps.searchClearBtn.classList.remove("visible");
    }

    // Clear existing suggestions
    deps.dropdown.innerHTML = "";

    // Filter names containing the substring (case-insensitive)
    const suggestions = deps.allNames.filter(name => name.toLowerCase().includes(query));
    const matchingNodes = deps.root.descendants().filter((d: any) => 
      query && (d.data.name?.toLowerCase().includes(query) ?? false)
    );

    // Update results count
    if (query.length > 0) {
      deps.searchResultsCount.textContent = `${matchingNodes.length} result${matchingNodes.length !== 1 ? 's' : ''}`;
      deps.searchResultsCount.classList.add("highlighted");
    } else {
      deps.searchResultsCount.textContent = "";
      deps.searchResultsCount.classList.remove("highlighted");
    }

    // Show/hide dropdown
    if (query.length > 0 && suggestions.length > 0) {
      deps.dropdown.style.display = "block";
      
      // Add up to 10 suggestions
      suggestions.slice(0, 10).forEach(name => {
        const option = document.createElement("div");
        option.className = "dropdown-option";
        option.textContent = name;
        option.addEventListener("click", () => {
          deps.searchInput.value = name;
          deps.dropdown.style.display = "none";
          // Trigger the change event to zoom to the person
          const event = new Event("change");
          deps.searchInput.dispatchEvent(event);
        });
        deps.dropdown.appendChild(option);
      });
      
      // Position dropdown immediately and after a small delay to ensure DOM update
      positionDropdown(deps);
      setTimeout(() => positionDropdown(deps), 0);
    } else {
      deps.dropdown.style.display = "none";
      deps.dropdown.innerHTML = ""; // Clear old suggestions
    }

    // Highlight matching nodes (keep current behavior)
    deps.g.selectAll(".node")
      .classed("highlighted", (d: any) => query && ((d as any).data.name?.toLowerCase().includes(query) ?? false));
  });

  // On selection (change event fires when picking from datalist)
  deps.searchInput.addEventListener("change", (e) => {
    const selectedName = (e.target as HTMLInputElement).value;
    if (!selectedName) return;

    // Find the visible node, expanding collapsed ancestors when needed.
    const selectedNode = deps.treeVisualization?.expandToPersonName(selectedName) ??
      deps.root.descendants().find((d: any) => d.data.name === selectedName);
    if (!selectedNode) return;

    // Remove highlights
    deps.g.selectAll(".node").classed("highlighted", false);

    // Zoom/Center: Compute transform to center the node at scale 1
    const k = 1;  // Fixed scale; adjust if you want to zoom in (e.g., 2)
    const tx = (deps.width / 2) - (selectedNode.x ?? 0) * k;
    const ty = (deps.height / 2) - (selectedNode.y ?? 0) * k;

    // Transition smoothly
    deps.svg.transition().duration(750).call(
      deps.zoom.transform,
      d3.zoomIdentity.translate(tx, ty).scale(k)
    );

    // Optionally clear input after selection
    deps.searchInput.value = "";
  });

  // Bonus: Handle Enter key for manual input (if not using datalist pick)
  deps.searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const event = new Event("change");
      deps.searchInput.dispatchEvent(event);  // Trigger the change handler
    }
  });
}

/**
 * Sets up button click handlers
 */
export function setupButtonHandlers(deps: EventHandlerDependencies): void {
  // Toggle statistics dashboard visibility
  deps.statsToggleBtn.addEventListener("click", () => {
    const shouldShowStats = deps.statsDashboard.classList.contains("hidden");

    // Hide other panels first
    deps.filterPanel.classList.add("hidden");
    deps.timelinePanel.classList.add("hidden");
    deps.filterToggleBtn.classList.remove("active");
    deps.timelineToggleBtn.classList.remove("active");
    setPressed(deps.filterToggleBtn, false);
    setPressed(deps.timelineToggleBtn, false);
    deps.uiState.isFilterPanelVisible = false;
    deps.uiState.isTimelinePanelVisible = false;
    
    // Toggle stats panel
    deps.uiState.isStatsDashboardVisible = shouldShowStats;
    deps.statsDashboard.classList.toggle("hidden", !deps.uiState.isStatsDashboardVisible);
    deps.statsToggleBtn.classList.toggle("active", deps.uiState.isStatsDashboardVisible);
    setPressed(deps.statsToggleBtn, deps.uiState.isStatsDashboardVisible);
    
    // Update grid layout
    deps.updateGridLayout();
    
    // On mobile, toggle the left sidebar visibility
    if (window.innerWidth <= 768) {
      deps.leftSidebar.classList.toggle('active', deps.uiState.isStatsDashboardVisible);
    }
    
    if (deps.uiState.isStatsDashboardVisible) {
      deps.initializeStatsDashboard();
      // Charts are now rendered by the StatsDashboard component
      // Initialize migration content when stats dashboard is opened
      deps.initializeMigrationContent();
    }
  });

  // Toggle timeline panel visibility
  deps.timelineToggleBtn.addEventListener("click", () => {
    const shouldShowTimeline = deps.timelinePanel.classList.contains("hidden");

    // Hide other panels first
    deps.filterPanel.classList.add("hidden");
    deps.statsDashboard.classList.add("hidden");
    deps.filterToggleBtn.classList.remove("active");
    deps.statsToggleBtn.classList.remove("active");
    setPressed(deps.filterToggleBtn, false);
    setPressed(deps.statsToggleBtn, false);
    deps.uiState.isFilterPanelVisible = false;
    deps.uiState.isStatsDashboardVisible = false;
    
    // Toggle timeline panel
    deps.uiState.isTimelinePanelVisible = shouldShowTimeline;
    deps.timelinePanel.classList.toggle("hidden", !deps.uiState.isTimelinePanelVisible);
    deps.timelineToggleBtn.classList.toggle("active", deps.uiState.isTimelinePanelVisible);
    setPressed(deps.timelineToggleBtn, deps.uiState.isTimelinePanelVisible);
    
    // Update grid layout
    deps.updateGridLayout();
    
    // On mobile, toggle the left sidebar visibility
    if (window.innerWidth <= 768) {
      deps.leftSidebar.classList.toggle('active', deps.uiState.isTimelinePanelVisible);
    }
    
    if (deps.uiState.isTimelinePanelVisible) {
      deps.initializeTimelinePanel();
    }
  });

  // Toggle filter panel visibility
  deps.filterToggleBtn.addEventListener("click", () => {
    const shouldShowFilter = deps.filterPanel.classList.contains("hidden");

    // Hide other panels first
    deps.statsDashboard.classList.add("hidden");
    deps.timelinePanel.classList.add("hidden");
    deps.statsToggleBtn.classList.remove("active");
    deps.timelineToggleBtn.classList.remove("active");
    setPressed(deps.statsToggleBtn, false);
    setPressed(deps.timelineToggleBtn, false);
    deps.uiState.isStatsDashboardVisible = false;
    deps.uiState.isTimelinePanelVisible = false;
    
    // Toggle filter panel
    deps.uiState.isFilterPanelVisible = shouldShowFilter;
    deps.filterPanel.classList.toggle("hidden", !deps.uiState.isFilterPanelVisible);
    deps.filterToggleBtn.classList.toggle("active", deps.uiState.isFilterPanelVisible);
    setPressed(deps.filterToggleBtn, deps.uiState.isFilterPanelVisible);
    
    // Update grid layout
    deps.updateGridLayout();
    
    // On mobile, toggle the left sidebar visibility
    if (window.innerWidth <= 768) {
      deps.leftSidebar.classList.toggle('active', deps.uiState.isFilterPanelVisible);
    }
    
    if (deps.uiState.isFilterPanelVisible) {
      deps.initializeFilterPanel();
    }
  });

  // Export to GEDCOM
  const exportMenu = createExportMenu(deps);
  deps.exportBtn.setAttribute('aria-haspopup', 'dialog');
  deps.exportBtn.setAttribute('aria-expanded', 'false');
  deps.exportBtn.addEventListener("click", () => {
    const shouldOpen = exportMenu.classList.contains('hidden');
    exportMenu.classList.toggle('hidden', !shouldOpen);
    deps.exportBtn.setAttribute('aria-expanded', String(shouldOpen));

    if (shouldOpen) {
      updateExportSummary(exportMenu, deps);
      positionExportMenu(exportMenu, deps.exportBtn);
      exportMenu.querySelector<HTMLSelectElement>('#export-privacy-mode')?.focus();
    }
  });

  // Toggle theme
  deps.themeToggleBtn.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    deps.applyTheme(newTheme);
    deps.updateThemeButton();
  });

  // Legend toggle functionality
  deps.legendToggleBtn.addEventListener('click', () => {
    deps.uiState.isLegendVisible = !deps.uiState.isLegendVisible;
    if (deps.legendElement) {
      deps.legendElement.classList.toggle('hidden', !deps.uiState.isLegendVisible);
    }
    deps.legendToggleBtn.style.opacity = deps.uiState.isLegendVisible ? '1' : '0.5';
    setPressed(deps.legendToggleBtn, deps.uiState.isLegendVisible);
    
    // Update grid layout
    deps.updateGridLayout();
    
    // On mobile, toggle the right sidebar visibility
    if (window.innerWidth <= 768) {
      deps.rightSidebar.classList.toggle('active', deps.uiState.isLegendVisible);
    }
  });
}

/**
 * Sets up modal event handlers
 */
export function setupModalHandlers(deps: EventHandlerDependencies): void {
  // Modal click-outside-to-close functionality
  if (deps.modal) {
    deps.modal.addEventListener("click", (e) => {
      if (e.target === deps.modal) {
        deps.closeModal();
      }
    });
  }
}

/**
 * Sets up touch and mobile gesture handlers
 */
export function setupTouchHandlers(deps: EventHandlerDependencies): void {
  // Mobile-specific enhancements
  function isMobile() {
    return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }

  // Touch gesture support for mobile
  let touchStartTime = 0;
  let touchStartDistance = 0;
  let lastTouchDistance = 0;
  let isPinching = false;

  deps.svg.on("touchstart", function(event: any) {
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

  deps.svg.on("touchmove", function(event: any) {
    event.preventDefault(); // Prevent scrolling
    
    const touches = event.touches;
    
    if (touches.length === 2 && isPinching) {
      // Handle pinch zoom
      const dx = touches[0].clientX - touches[1].clientX;
      const dy = touches[0].clientY - touches[1].clientY;
      const currentDistance = Math.sqrt(dx * dx + dy * dy);
      
      if (lastTouchDistance > 0) {
        const scale = currentDistance / lastTouchDistance;
        const currentTransform = d3.zoomTransform(deps.svg.node()!);
        const newScale = Math.max(0.1, Math.min(5, currentTransform.k * scale));
        
        // Center the zoom on the midpoint of the two touches
        const midX = (touches[0].clientX + touches[1].clientX) / 2;
        const midY = (touches[0].clientY + touches[1].clientY) / 2;
        const rect = deps.svg.node()!.getBoundingClientRect();
        const x = midX - rect.left;
        const y = midY - rect.top;
        
        deps.svg.call(deps.zoom.transform, d3.zoomIdentity
          .translate(x - (x - currentTransform.x) * (newScale / currentTransform.k), 
                    y - (y - currentTransform.y) * (newScale / currentTransform.k))
          .scale(newScale));
      }
      
      lastTouchDistance = currentDistance;
    }
  });

  deps.svg.on("touchend", function(event: any) {
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

  deps.g.selectAll(".node")
    .on("click", function(_event: any, d: any) {
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
              deps.showPersonModal(d.data, d.depth);
            }
          }, 300);
        } else if (tapCount === 2) {
          // Double tap - zoom to node
          tapCount = 0;
          const currentTransform = d3.zoomTransform(deps.svg.node()!);
          const scale = Math.min(currentTransform.k * 2, 3);
          const tx = deps.width / 2 - (d.x ?? 0) * scale;
          const ty = deps.height / 2 - (d.y ?? 0) * scale;
          
          deps.svg.transition().duration(300).call(
            deps.zoom.transform,
            d3.zoomIdentity.translate(tx, ty).scale(scale)
          );
        }
      } else {
        // Desktop behavior
        deps.showPersonModal(d.data, d.depth);
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
          deps.closeModal();
        }
      });
    }
  }

  // Initialize mobile enhancements
  if (isMobile()) {
    enhanceModalForMobile();
    
    // Add mobile-specific classes
    document.body.classList.add('mobile-device');
    
    // Optimize zoom behavior for mobile
    deps.zoom.scaleExtent([0.1, 3]); // Reduce max zoom on mobile
    
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
}

/**
 * Sets up view control button handlers
 */
export function setupViewControlHandlers(deps: EventHandlerDependencies): void {
  const zoomInBtn = document.getElementById("zoom-in-btn");
  const zoomOutBtn = document.getElementById("zoom-out-btn");
  const fitScreenBtn = document.getElementById("fit-screen-btn");
  const resetViewBtn = document.getElementById("reset-view-btn");

  // Zoom In
  zoomInBtn?.addEventListener("click", () => {
    deps.svg.transition().duration(300).call(
      deps.zoom.scaleBy, 1.5
    );
  });

  // Zoom Out
  zoomOutBtn?.addEventListener("click", () => {
    deps.svg.transition().duration(300).call(
      deps.zoom.scaleBy, 1 / 1.5
    );
  });

  // Fit to Screen
  fitScreenBtn?.addEventListener("click", () => {
    const bounds = deps.g.node().getBBox();
    const fullWidth = deps.svg.node().clientWidth;
    const fullHeight = deps.svg.node().clientHeight;
    const width = bounds.width;
    const height = bounds.height;
    const midX = bounds.x + width / 2;
    const midY = bounds.y + height / 2;
    
    if (width === 0 || height === 0) return;
    
    const scale = 0.8 / Math.max(width / fullWidth, height / fullHeight);
    const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];
    
    deps.svg.transition()
      .duration(750)
      .call(deps.zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
  });

  // Reset View
  resetViewBtn?.addEventListener("click", () => {
    deps.svg.transition()
      .duration(750)
      .call(deps.zoom.transform, d3.zoomIdentity);
  });
}

/**
 * Sets up window event handlers
 */
export function setupWindowHandlers(deps: EventHandlerDependencies): void {
  // Close statistics dashboard when clicking outside
  document.addEventListener("click", (event) => {
    if (!deps.statsDashboard.classList.contains("hidden") && 
        !deps.statsDashboard.contains(event.target as Node) && 
        !deps.statsToggleBtn.contains(event.target as Node)) {
      deps.closeStatsDashboard();
      deps.uiState.isStatsDashboardVisible = false;
    }
    if (!deps.timelinePanel.classList.contains("hidden") && 
        !deps.timelinePanel.contains(event.target as Node) && 
        !deps.timelineToggleBtn.contains(event.target as Node)) {
      deps.closeTimelinePanel();
      deps.uiState.isTimelinePanelVisible = false;
    }
  });

  // Listen for system theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
      const newTheme = e.matches ? 'dark' : 'light';
      deps.applyTheme(newTheme);
      deps.updateThemeButton();
    }
  });

  // Click outside to close dropdown
  document.addEventListener("click", (e) => {
    if (!deps.searchInput.contains(e.target as Node) && !deps.dropdown.contains(e.target as Node)) {
      deps.dropdown.style.display = "none";
      deps.dropdown.innerHTML = ""; // Clear old suggestions
    }
  });

  // Debounced positioning function for resize events
  let resizeTimeout: number;
  const debouncedPositionDropdown = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => positionDropdown(deps), 100) as any;
  };

  // Reposition dropdown on window resize (debounced)
  window.addEventListener("resize", debouncedPositionDropdown);
  
  // Reposition dropdown on scroll
  window.addEventListener("scroll", () => positionDropdown(deps));

  // Handle orientation change
  window.addEventListener('orientationchange', function() {
    setTimeout(() => {
      // Recalculate dimensions and update tree
      const container = document.getElementById('tree-container');
      if (container) {
        const rect = container.getBoundingClientRect();
        deps.width = rect.width;
        deps.height = Math.max(rect.height, 400);
        
        // Update tree visualization dimensions
        deps.treeVisualization?.updateDimensions(deps.width, deps.height);
        deps.updateTree();
      }
    }, 100);
  });

  // Handle window resize for mobile
  window.addEventListener('resize', function() {
    function isMobile() {
      return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    if (isMobile()) {
      setTimeout(() => {
        const container = document.getElementById('tree-container');
        if (container) {
          const rect = container.getBoundingClientRect();
          deps.width = rect.width;
          deps.height = Math.max(rect.height, 400);
          
          // Update tree visualization dimensions
          deps.treeVisualization?.updateDimensions(deps.width, deps.height);
          deps.updateTree();
        }
      }, 100);
    }
  });
}

/**
 * Helper function to position dropdown relative to search input
 */
function positionDropdown(deps: EventHandlerDependencies): void {
  if (deps.dropdown.style.display === "block") {
    const inputRectFixed = deps.searchInput.getBoundingClientRect();
    
    // Position fixed to escape stacking context
    deps.dropdown.style.position = 'fixed';
    deps.dropdown.style.top = `${inputRectFixed.bottom + 2}px`;
    deps.dropdown.style.left = `${inputRectFixed.left}px`;
    deps.dropdown.style.width = `${inputRectFixed.width}px`;
    deps.dropdown.style.minWidth = `${inputRectFixed.width}px`;
    deps.dropdown.style.zIndex = '999999'; // Very high z-index
    
    // Append to body to escape the transform stacking context
    document.body.appendChild(deps.dropdown);
  }
}

/**
 * Sets up all event handlers
 */
export function setupAllEventHandlers(deps: EventHandlerDependencies): void {
  setupKeyboardShortcuts(deps);
  setupSearchHandlers(deps);
  setupButtonHandlers(deps);
  setupModalHandlers(deps);
  setupTouchHandlers(deps);
  setupViewControlHandlers(deps);
  setupWindowHandlers(deps);
}
