// src/main.ts
// @ts-nocheck
import "./style.css";
import * as d3 from "d3";
import { maxArseneaultConfig } from "./data/configs/max-arseneault.config";
import { Person } from "./interfaces/person";
import { buildHierarchy, getGenerations, tracePatrilineal, traceMatrilineal, getCountry, calculateAgeAtDate, countryColors, getInitials, getOrdinalFromNumber, estimateAncientBirthDate, getLeaves } from "./utils/utils";

// Create modal HTML structure dynamically
function createModal() {
  const modal = document.createElement('div');
  modal.id = 'detail-modal';
  modal.className = 'hidden';
  modal.style.background = 'var(--overlay)';
  
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content rounded-lg shadow-lg w-full p-6 relative';
  modalContent.style.background = 'var(--bg-secondary)';
  modalContent.style.border = '1px solid var(--border-secondary)';
  
  const modalInnerContent = document.createElement('div');
  modalInnerContent.id = 'modal-inner-content';
  
  modalContent.appendChild(modalInnerContent);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  return modal;
}

// Helper: make "Mi'kmaq Nation" -> "mikmaq-nation"
const slugify = (s) =>
  s.normalize("NFKD")
   .replace(/['']/g, "")           // drop apostrophes
   .replace(/\s+/g, "-")           // spaces -> hyphens
   .replace(/[^a-zA-Z0-9-]/g, "")  // remove other punctuation
  .toLowerCase();

// Helper: clean up "UNKNOWN" values for display
const cleanUnknown = (value: string | undefined | null): string | null => {
  if (!value || value.toUpperCase() === "UNKNOWN") {
    return null;
  }
  return value;
};

// Add this new function to extend a random chain with Neanderthal
function extendWithNeanderthal(ancient: Person) {
  // Parse ancient's birth year if available (fallback to 1800 for estimation)
  let baseYear = 1800;
  if (ancient.birthDate) {
    const match = ancient.birthDate.match(/\d{4}/);
    if (match) baseYear = parseInt(match[0]);
  }

  // Create Neanderthal node
  const neanderthal: Person = {
    name: "Neanderthal Woman",
    sex: "Female",
    birthPlace: "Eurasia",
    birthDate: "circa 40000 BCE",
    deathDate: "N/A",
    parents: [],
    story: "Symbolic representation of Neanderthal admixture in modern humans, from interbreeding ~40,000 years ago."
  };

  // Number of unknown ancestors in the trail (adjust for longer/shorter trail)
  const numUnknowns = 1747;
  let last: Person = neanderthal;

  for (let i = numUnknowns; i > 0; i--) {
    const sex = Math.random() > 0.5 ? "Male" : "Female";
    const unk: Person = {
      name: "Unknown Ancestor",
      sex: sex,
      birthPlace: "Unknown",
      birthDate: estimateAncientBirthDate(baseYear, numUnknowns - i + 20), // Offset to go deeper
      deathDate: "N/A",
      parents: []
    };
    const isMotherLine = Math.random() > 0.5;
    if (isMotherLine) {
      unk.parents = [last];
    } else {
      unk.parents = [undefined, last];
    }
    last = unk;
  }

  // Attach the chain to the ancient ancestor
  const isMotherAttach = Math.random() > 0.5;
  if (isMotherAttach) {
    ancient.parents = [last, ...(ancient.parents || [])];
  } else {
    ancient.parents = [...(ancient.parents || []), last];
  }
}

/** Enhanced modal with better design and close functionality */
function showPersonModal(d: Person, depth: number) {
  const modal = document.getElementById("detail-modal")!;
  const content = document.getElementById("modal-inner-content")!;
  if (!modal || !content) return;

  const initials = getInitials(d?.name);
  const isDeceased = d.deathDate !== "N/A";
  const age = isDeceased 
    ? calculateAgeAtDate(d.birthDate ?? "", d.deathDate ?? "") 
    : calculateAgeAtDate(d.birthDate ?? "");

  // Prefer a large image if available, fall back to avatar
  const imgSrc = (d as any)?.largeImageUrl || d.imageUrl || null;

  // Image HTML (hidden on error and reveals placeholder)
  const imageHtml = imgSrc
    ? `<img
         src="${imgSrc}"
         alt="${(d.name || "Person").replace(/"/g, "&quot;")}"
         style="width: min(80vw, 320px); height: min(80vw, 320px); max-width:320px; max-height:320px; object-fit:cover; border-radius:12px; box-shadow:0 6px 18px rgba(0,0,0,0.15);"
         onerror="this.style.display='none'; const p=this.parentElement.querySelector('.modal-placeholder'); if(p) p.style.display='flex';"
       />`
    : "";

  // Placeholder (shown when no image available or when image fails)
  const placeholderHtml = `
    <div class="modal-placeholder"
         style="width: min(80vw, 320px); height: min(80vw, 320px); max-width:320px; max-height:320px; border-radius:12px; background:#f2f2f2; display:${imgSrc ? "none" : "flex"}; align-items:center; justify-content:center; font-size:48px; color:#666;">
      ${initials}
    </div>`;

  let relation = "";
  if (depth === 0) {
    relation = "You";
  } else if (depth === 1) {
    relation = d.sex === "Female" ? "Mother" : "Father";
  } else if (depth === 2) {
    relation = d.sex === "Female" ? "Grandmother" : "Grandfather";
  } else {
    const ordinal = getOrdinalFromNumber(depth - 2);
    const greats = `${depth === 3 ? "" : ordinal + " "}Great-`;
    relation = `${greats}Grand${d.sex === "Female" ? "mother" : "father"}`;
  }
  if (depth !== 0) relation += ` (${depth} generation${depth > 1 ? "s" : ""} back)`;

  // Clean up data for display
  const cleanName = cleanUnknown(d.name);
  const cleanBirthDate = cleanUnknown(d.birthDate);
  const cleanBirthPlace = cleanUnknown(d.birthPlace);
  const cleanDeathDate = cleanUnknown(d.deathDate);
  const cleanDeathPlace = cleanUnknown(d.deathPlace);
  const cleanStory = cleanUnknown((d as Person).story);

  content.innerHTML = `
    <button class="modal-close-btn" onclick="closeModal()" aria-label="Close modal">×</button>
    <div style="display:flex; flex-direction:column; align-items:center; gap:16px; text-align:center; padding:8px;">
      ${imageHtml}
      ${placeholderHtml}
      <h2 style="margin:0; font-size:20px; font-weight:700; color: var(--text-primary);">${cleanName || "Name not available"}</h2>
      ${relation ? `<div style="color: var(--text-secondary);"><strong>Relation:</strong> ${relation}</div>` : ""}
      ${cleanBirthDate || cleanBirthPlace ? `<div style="color: var(--text-secondary);">${cleanBirthDate ? `<strong>Born:</strong> ${cleanBirthDate}` : ""} ${cleanBirthPlace ? `${cleanBirthDate ? " " : ""}(${cleanBirthPlace})` : ""}</div>` : ""}
      <div style="color: var(--text-secondary);"><strong>Died:</strong> ${cleanDeathDate || "—"} ${age !== null && isDeceased ? `(age ${age})` : ""}</div>
      ${age !== null && !isDeceased ? `<div style="color: var(--text-secondary);"><strong>Age:</strong> ${age}</div>` : ""}
      ${cleanStory ? `<div style="margin-top:8px; color: var(--text-tertiary); font-style:italic; max-width:70vw">${cleanStory}</div>` : ""}
    </div>
  `;

  modal.classList.remove("hidden");
}

/** Close modal function */
function closeModal() {
  const modal = document.getElementById("detail-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

// Make closeModal and showPersonModal globally available
(window as any).closeModal = closeModal;
(window as any).showPersonModal = showPersonModal;


document.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector("#app");
  if (!app) return;

  // Create modal structure
  createModal();

  // Create Dashboard Container
  const dashboardContainer = document.createElement("div");
  dashboardContainer.className = "dashboard-container";

  // Add Professional Header
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
            <button class="search-clear-btn" id="search-clear-btn" onclick="clearSearch()" aria-label="Clear search">
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
            <button class="header-btn" id="stats-toggle-btn" title="Statistics Dashboard">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M3 3v18h18"/>
                <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
              </svg>
              <span class="btn-label">Stats</span>
            </button>
            
            <button class="header-btn" id="timeline-toggle-btn" title="Timeline View">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                <line x1="16" y1="2" x2="16" y2="6"/>
                <line x1="8" y1="2" x2="8" y2="6"/>
                <line x1="3" y1="10" x2="21" y2="10"/>
              </svg>
              <span class="btn-label">Timeline</span>
            </button>
            
            <button class="header-btn" id="filter-toggle-btn" title="Filter Options">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polygon points="22,3 2,3 10,12.46 10,19 14,21 14,12.46"/>
              </svg>
              <span class="btn-label">Filters</span>
            </button>
          </div>
          
          <div class="control-group">
            <button class="header-btn" id="legend-toggle-btn" title="Toggle Legend">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
              <span class="btn-label">Legend</span>
            </button>
            
            <button class="header-btn" id="theme-toggle-btn" title="Toggle Dark Mode">
              <svg class="theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
              <span class="btn-label">Theme</span>
            </button>
          </div>
        </div>
      </div>
    </div> 
  `;
  dashboardContainer.appendChild(header);

  // Note: Button references will be set after DOM elements are created

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
  const legend = document.createElement("div");
  legend.id = "legend";
  legend.innerHTML = `<h3>Legend</h3>
    <div class="legend-item">
      <svg width="20" height="20"><rect x="2" y="2" width="16" height="16" fill="none" stroke="black" stroke-width="1"/></svg>
      Male
    </div>
    <div class="legend-item">
      <svg width="20" height="20"><circle cx="10" cy="10" r="8" fill="none" stroke="black" stroke-width="1"/></svg>
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
  rightSidebar.appendChild(legend);

  // Simple button interactions with just highlight effect
  function addButtonInteractions() {
    const headerButtons = document.querySelectorAll('.header-btn');
    
    headerButtons.forEach(button => {
      // Add simple highlight effect on click
      button.addEventListener('click', function() {
        // Add highlight class temporarily
        this.classList.add('clicked');
        setTimeout(() => {
          this.classList.remove('clicked');
        }, 200);
      });
    });
  }

  // Initialize button interactions
  addButtonInteractions();

  // Add same click effect to view control buttons
  function addViewControlInteractions() {
    const viewControlButtons = document.querySelectorAll('.view-control-btn');
    
    viewControlButtons.forEach(button => {
      button.addEventListener('click', function() {
        this.classList.add('clicked');
        setTimeout(() => {
          this.classList.remove('clicked');
        }, 200);
      });
    });
  }

  // Initialize view control interactions
  addViewControlInteractions();

  // Add View Controls (Zoom and Navigation)
  const viewControls = document.createElement("div");
  viewControls.className = "view-controls";
  viewControls.innerHTML = `
    <div class="zoom-controls">
      <button class="view-control-btn" id="zoom-in-btn" title="Zoom In">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="11" y1="8" x2="11" y2="14"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      </button>
      <button class="view-control-btn" id="zoom-out-btn" title="Zoom Out">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          <line x1="8" y1="11" x2="14" y2="11"/>
        </svg>
      </button>
      <button class="view-control-btn" id="fit-screen-btn" title="Fit to Screen">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
        </svg>
      </button>
      <button class="view-control-btn" id="reset-view-btn" title="Reset View">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <polyline points="1,4 1,10 7,10"/>
          <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/>
        </svg>
      </button>
    </div>
  `;

  // Search input references will be set after DOM elements are created

  // Enhanced keyboard shortcuts and search functionality will be set after variables are defined

  // Enhanced search input interactions will be set after variables are defined

  // Add view controls to main content
  mainContent.appendChild(viewControls);

  // Assemble dashboard
  dashboardContainer.appendChild(leftSidebar);
  dashboardContainer.appendChild(mainContent);
  dashboardContainer.appendChild(rightSidebar);

  // Add dashboard to app
  app.appendChild(dashboardContainer);

  // Now get references to the header buttons after they're in the DOM
  const statsToggleBtn = document.getElementById("stats-toggle-btn") as HTMLButtonElement;
  const timelineToggleBtn = document.getElementById("timeline-toggle-btn") as HTMLButtonElement;
  const filterToggleBtn = document.getElementById("filter-toggle-btn") as HTMLButtonElement;
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

  // Responsive SVG
  let width = window.innerWidth * 0.8;
  let height = window.innerHeight;
  const margin = { top: 50, right: 150, bottom: 50, left: 150 };

  const svg = d3.select("#tree-container").append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .attr("viewBox", `${-margin.left} ${-margin.top} ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const g = svg.append("g");

  // Defs for patterns (for images and now country SVGs)
  const defs = svg.append("defs");  // Moved up here so it's global

  // Define country SVG patterns once
  Object.entries(countrySvgs).forEach(([country, url]) => {
    const patternId = `country-pattern-${slugify(country)}`;
    const href = url ?? `${assetBase}/${slugify(country)}.svg`;

    const pattern = defs.append("pattern")
      .attr("id", patternId)
      .attr("width", 1)
      .attr("height", 1)
      .attr("patternContentUnits", "objectBoundingBox");
    pattern.append("image")
      .attr("xlink:href", href)
      .attr("width", 1)
      .attr("height", 1)
      .attr("preserveAspectRatio", "xMidYMid slice");
  });

  // Minimap needs access to the current zoom transform:
  let currentTransform = d3.zoomIdentity;

  const zoom = d3.zoom().on("zoom", (event) => {
    currentTransform = event.transform;
    g.attr("transform", currentTransform);
    updateMinimapViewport(); // keep minimap viewport in sync
  });

  svg.call(zoom);

    // ───────────────── MINIMAP: setup ─────────────────
  const miniW = 220;
  const miniH = 150;
  const miniPad = 8;

  // Container (fixed, bottom-right). Style here so you don't need to touch CSS.
  const miniWrap = document.createElement("div");
  miniWrap.id = "minimap";
  miniWrap.className = "minimap-container";
  Object.assign(miniWrap.style, {
    position: "fixed",
    right: "16px",
    bottom: "16px",
    width: `${miniW + 2 * miniPad}px`,
    height: `${miniH + 2 * miniPad}px`,
    border: "1px solid var(--border-secondary)",
    background: "var(--bg-secondary)",
    borderRadius: "8px",
    boxShadow: "0 4px 8px var(--shadow-light)",
    zIndex: "1000",
    userSelect: "none",
    transition: "background-color 0.3s ease, border-color 0.3s ease",
  });
  app.appendChild(miniWrap);

  const miniSvg = d3
    .select(miniWrap)
    .append("svg")
    .attr("width", miniW + 2 * miniPad)
    .attr("height", miniH + 2 * miniPad);

  const miniG = miniSvg.append("g").attr("transform", `translate(${miniPad},${miniPad})`);
  const miniLinksG = miniG.append("g").attr("class", "minimap-links");
  const miniNodesG = miniG.append("g").attr("class", "minimap-nodes");
  const miniViewport = miniG
    .append("rect")
    .attr("class", "minimap-viewport")
    .attr("fill", "none")
    .attr("stroke", "var(--text-primary)")
    .attr("stroke-width", 1.5)
    .attr("pointer-events", "all"); // needed for drag

  // Bounds/scales for minimap
  let treeBounds = { x0: 0, y0: 0, x1: 1, y1: 1 };
  let miniScale = 1;

  // Helpers to map main coords → minimap coords
  const mx = (x: number) => (x - treeBounds.x0) * miniScale;
  const my = (y: number) => (y - treeBounds.y0) * miniScale;

  // Drag to pan main view from the minimap
  const dragViewport = d3
    .drag<SVGRectElement, unknown>()
    .on("drag", (event) => {
      // convert minimap rect top-left back to main coords
      const x0 = event.x; // in minimap group coords (already inside miniG with translate)
      const y0 = event.y;

      const mainX0 = x0 / miniScale + treeBounds.x0;
      const mainY0 = y0 / miniScale + treeBounds.y0;

      const k = currentTransform.k;
      const tx = -mainX0 * k;
      const ty = -mainY0 * k;

      svg.call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(k));
    });
  miniViewport.call(dragViewport);

  // Draw/update minimap content
  function updateMinimap() {
    // Compute tree bounds from current layout (after you assign d.x/d.y)
    const nodes = root.descendants();
    const xs = nodes.map((d) => d.x);
    const ys = nodes.map((d) => d.y);

    const x0 = Math.min(...xs);
    const x1 = Math.max(...xs);
    const y0 = Math.min(...ys);
    const y1 = Math.max(...ys);

    // pad bounds slightly
    const pad = 20;
    treeBounds = { x0: x0 - pad, x1: x1 + pad, y0: y0 - pad, y1: y1 + pad };

    const bw = treeBounds.x1 - treeBounds.x0;
    const bh = treeBounds.y1 - treeBounds.y0;

    miniScale = Math.min(miniW / Math.max(bw, 1), miniH / Math.max(bh, 1));

    // Links (draw as straight lines; simple & fast)
    const miniLinks = miniLinksG
      .selectAll<SVGLineElement, any>("line")
      .data(root.links(), (d: any) => `${d.source.data.name}-${d.target.data.name}`);

    miniLinks
      .join(
        (enter) =>
          enter
            .append("line")
            .attr("x1", (d) => mx(d.source.x))
            .attr("y1", (d) => my(d.source.y))
            .attr("x2", (d) => mx(d.target.x))
            .attr("y2", (d) => my(d.target.y))
            .attr("stroke", "var(--text-tertiary)")
            .attr("stroke-width", 1),
        (update) =>
          update
            .attr("x1", (d) => mx(d.source.x))
            .attr("y1", (d) => my(d.source.y))
            .attr("x2", (d) => mx(d.target.x))
            .attr("y2", (d) => my(d.target.y)),
        (exit) => exit.remove()
      );

    // Nodes (tiny dots/squares; no images)
    const miniNodes = miniNodesG
      .selectAll<SVGCircleElement | SVGRectElement, any>("circle,rect")
      .data(nodes, (d: any) => d.data.id || d.data.name + d.depth);

    miniNodes.exit().remove();

    const maleNodes = miniNodesG
      .selectAll<SVGRectElement, any>("rect.minimap-male")
      .data(nodes.filter((d) => d.data.sex === "Male"), (d: any) => d.data.id || d.data.name + d.depth);
    maleNodes
      .join(
        (enter) =>
          enter
            .append("rect")
            .attr("class", "minimap-male")
            .attr("width", 3)
            .attr("height", 3)
            .attr("x", (d) => mx(d.x) - 1.5)
            .attr("y", (d) => my(d.y) - 1.5)
            .attr("fill", (d) => countryColors[getCountry(d.data.birthPlace)] || "#808080"),
        (update) =>
          update
            .attr("x", (d) => mx(d.x) - 1.5)
            .attr("y", (d) => my(d.y) - 1.5)
            .attr("fill", (d) => countryColors[getCountry(d.data.birthPlace)] || "#808080")
      );
    
    const femaleNodes = miniNodesG
      .selectAll<SVGCircleElement, any>("circle.minimap-female")
      .data(nodes.filter((d) => d.data.sex !== "Male"), (d: any) => d.data.id || d.data.name + d.depth);
    femaleNodes
      .join(
        (enter) =>
          enter
            .append("circle")
            .attr("class", "minimap-female")
            .attr("r", 1.5)
            .attr("cx", (d) => mx(d.x))
            .attr("cy", (d) => my(d.y))
            .attr("fill", (d) => countryColors[getCountry(d.data.birthPlace)] || "#808080"),
        (update) => update
          .attr("cx", (d) => mx(d.x))
          .attr("cy", (d) => my(d.y))
          .attr("fill", (d) => countryColors[getCountry(d.data.birthPlace)] || "#808080")
      );

    updateMinimapViewport(); // sync viewport rect
  }

  // Update the viewport rectangle in the minimap
  function updateMinimapViewport() {
    // visible region in content coords (approximate: use layout width/height)
    const k = currentTransform.k;
    const x0 = -currentTransform.x / k; // top-left in main coords
    const y0 = -currentTransform.y / k;
    const vw = width / k;
    const vh = height / k;

    // Convert to minimap coords
    const rx = mx(x0);
    const ry = my(y0);
    const rw = vw * miniScale;
    const rh = vh * miniScale;

    miniViewport
      .attr("x", rx)
      .attr("y", ry)
      .attr("width", Math.max(10, rw)) // keep visible
      .attr("height", Math.max(10, rh));
  }

  const rootPerson = maxArseneaultConfig;
  // const leaves = getLeaves(rootPerson);
  // if (leaves.length > 0) {
  //   const randomLeaf = leaves[Math.floor(Math.random() * leaves.length)];
  //   extendWithNeanderthal(randomLeaf);
  // }
  const root = buildHierarchy(rootPerson);

  const treeLayout = d3.tree<Person>().size([width, height - 100]).nodeSize([180, 200]);  // Increased horizontal spacing to prevent text overlap

  // Filter state
  let maxGeneration = 0;
  let selectedCountries = new Set<string>();
  let isFilterPanelVisible = true;
  
  // Advanced filter states
  let birthYearRange = { min: 0, max: 2100 };
  let originalBirthYearRange = { min: 0, max: 2100 };
  let lifespanFilter = { min: 0, max: 120 };
  let selectedDataCompleteness = new Set<string>();
  let selectedRelationshipFilters = new Set<string>();
  let selectedResearchFilters = new Set<string>();
  let minDnaContribution = 0;
  let showDirectLineOnly = false;

  // Initialize Filter Panel
  function initializeFilterPanel() {
    // Calculate max generation
    maxGeneration = Math.max(...root.descendants().map(d => d.depth));
    
    // Get all countries and their counts
    const countryCounts = new Map<string, number>();
    root.descendants().forEach(d => {
      const country = getCountry(d.data.birthPlace);
      countryCounts.set(country, (countryCounts.get(country) || 0) + 1);
    });

    // Calculate birth year range from data
    const birthYears = root.descendants()
      .map(d => d.data.birthDate)
      .filter(date => date && date !== "Unknown")
      .map(date => {
        const yearMatch = date.match(/\b(19|20)\d{2}\b/) || date.match(/\b\d{4}\b/);
        return yearMatch ? parseInt(yearMatch[0]) : null;
      })
      .filter(year => year !== null && year >= 1000 && year <= 2100) as number[];
    
    const minBirthYear = birthYears.length > 0 ? Math.min(...birthYears) : 1800;
    const maxBirthYear = birthYears.length > 0 ? Math.max(...birthYears) : 2024;
    birthYearRange = { min: minBirthYear, max: maxBirthYear };
    originalBirthYearRange = { min: minBirthYear, max: maxBirthYear };

    // Create filter panel HTML with improved design
    filterPanel.innerHTML = `
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
                     min="0" max="${maxGeneration}" value="${maxGeneration}" 
                     oninput="updateGenerationFilter(this.value)"
                     aria-label="Generation depth slider" aria-valuemin="0" aria-valuemax="${maxGeneration}" aria-valuenow="${maxGeneration}">
              <div class="slider-value">
                <span class="slider-value-number" id="generation-value">${maxGeneration}</span>
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
              ${Array.from(countryCounts.entries())
                .sort((a, b) => b[1] - a[1])
                .slice(0, 8)
                .map(([country, count]) => `
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
                        <div class="country-count">${count} people</div>
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
        
        <!-- Time-Based Filters Tab -->
        <div class="filter-tab-content" id="tab-time" role="tabpanel" aria-labelledby="tab-time" aria-hidden="true">
          <div class="filter-group">
            <div class="filter-group-header">
              <h4 class="filter-group-title">Birth Year Range</h4>
              <div class="filter-group-description">Filter by birth year period</div>
            </div>
            <div class="range-container">
              <div class="range-inputs">
                <div class="range-input">
                  <label class="range-label">From</label>
                  <input type="number" class="modern-input" id="birth-year-min" 
                         value="${minBirthYear}" min="${minBirthYear}" max="${maxBirthYear}" 
                         onchange="updateBirthYearRange()">
                </div>
                <div class="range-separator">to</div>
                <div class="range-input">
                  <label class="range-label">To</label>
                  <input type="number" class="modern-input" id="birth-year-max" 
                         value="${maxBirthYear}" min="${minBirthYear}" max="${maxBirthYear}" 
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
              <div class="range-inputs">
                <div class="range-input">
                  <label class="range-label">Min Age</label>
                  <input type="number" class="modern-input" id="lifespan-min" 
                         value="0" min="0" max="120" onchange="updateLifespanFilter()">
                </div>
                <div class="range-separator">to</div>
                <div class="range-input">
                  <label class="range-label">Max Age</label>
                  <input type="number" class="modern-input" id="lifespan-max" 
                         value="120" min="0" max="120" onchange="updateLifespanFilter()">
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
              <div class="filter-group-description">Filter by available information</div>
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
              <h4 class="filter-group-title">Relationship Types</h4>
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
                     min="0" max="50" value="0" step="0.1" oninput="updateDnaContributionFilter(this.value)"
                     aria-label="DNA contribution percentage slider">
              <div class="slider-value">
                <span class="slider-value-number" id="dna-contribution-value">0%</span>
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
        <div class="filter-actions">
          <button class="action-btn primary" onclick="resetAllFilters()">
            <span class="btn-icon">↺</span>
            Reset All Filters
          </button>
        </div>
        <div class="filter-stats" id="filter-stats">
          <span class="filter-count">All people visible</span>
        </div>
      </div>
    `;

    // Initialize all countries as selected
    selectedCountries = new Set(countryCounts.keys());
    
    // Initialize filter summary and keyboard navigation
    setTimeout(() => {
      updateFilterSummary();
      addFilterKeyboardNavigation();
    }, 100);
  }

  // Filter functions
  function updateGenerationFilter(value: string) {
    const generationValue = document.getElementById("generation-value") as HTMLSpanElement;
    generationValue.textContent = value;
    applyFilters();
    updateFilterSummary();
  }

  function updateCountryFilter() {
    const checkboxes = filterPanel.querySelectorAll('.country-checkbox') as NodeListOf<HTMLInputElement>;
    selectedCountries.clear();
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        const country = checkbox.id.replace('country-', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        selectedCountries.add(country);
      }
    });
    applyFilters();
    updateFilterSummary();
  }

  function selectAllCountries() {
    const checkboxes = filterPanel.querySelectorAll('.country-checkbox') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(checkbox => {
      checkbox.checked = true;
    });
    selectedCountries = new Set(Array.from(checkboxes).map(cb => 
      cb.id.replace('country-', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    ));
    applyFilters();
    updateFilterSummary();
  }

  function selectNoCountries() {
    const checkboxes = filterPanel.querySelectorAll('.country-checkbox') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    selectedCountries.clear();
    applyFilters();
    updateFilterSummary();
  }

  // Advanced filter functions
  function updateBirthYearRange() {
    const minInput = document.getElementById("birth-year-min") as HTMLInputElement;
    const maxInput = document.getElementById("birth-year-max") as HTMLInputElement;
    birthYearRange.min = parseInt(minInput.value);
    birthYearRange.max = parseInt(maxInput.value);
    applyFilters();
    updateFilterSummary();
  }

  function updateLifespanFilter() {
    const minInput = document.getElementById("lifespan-min") as HTMLInputElement;
    const maxInput = document.getElementById("lifespan-max") as HTMLInputElement;
    lifespanFilter.min = parseInt(minInput.value);
    lifespanFilter.max = parseInt(maxInput.value);
    applyFilters();
    updateFilterSummary();
  }

  function updateDataCompletenessFilter() {
    selectedDataCompleteness.clear();
    const checkboxes = filterPanel.querySelectorAll('#tab-data .modern-checkbox') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        selectedDataCompleteness.add(checkbox.id);
      }
    });
    applyFilters();
    updateFilterSummary();
  }

  function updateRelationshipFilter() {
    selectedRelationshipFilters.clear();
    const relationshipCheckboxes = filterPanel.querySelectorAll('#direct-line-only, #patrilineal-line, #matrilineal-line, #migration-patterns') as NodeListOf<HTMLInputElement>;
    relationshipCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        selectedRelationshipFilters.add(checkbox.id);
      }
    });
    showDirectLineOnly = selectedRelationshipFilters.has('direct-line-only');
    applyFilters();
    updateFilterSummary();
  }

  function updateDnaContributionFilter(value: string) {
    minDnaContribution = parseFloat(value);
    const valueDisplay = document.getElementById("dna-contribution-value") as HTMLSpanElement;
    valueDisplay.textContent = `${minDnaContribution}%`;
    applyFilters();
    updateFilterSummary();
  }

  function updateResearchFilter() {
    selectedResearchFilters.clear();
    const researchCheckboxes = filterPanel.querySelectorAll('#research-gaps, #missing-data, #estimated-dates, #well-documented') as NodeListOf<HTMLInputElement>;
    researchCheckboxes.forEach(checkbox => {
      if (checkbox.checked) {
        selectedResearchFilters.add(checkbox.id);
      }
    });
    applyFilters();
    updateFilterSummary();
  }

  function resetAllFilters() {
    // Reset all filter states
    selectedCountries = new Set();
    selectedDataCompleteness.clear();
    selectedRelationshipFilters.clear();
    selectedResearchFilters.clear();
    minDnaContribution = 0;
    showDirectLineOnly = false;
    
    // Reset UI elements
    const generationSlider = document.getElementById("generation-slider") as HTMLInputElement;
    if (generationSlider) generationSlider.value = maxGeneration.toString();
    
    const generationValue = document.getElementById("generation-value") as HTMLSpanElement;
    if (generationValue) generationValue.textContent = maxGeneration.toString();
    
    // Reset all checkboxes except countries
    const checkboxes = filterPanel.querySelectorAll('.modern-checkbox') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    
    // Reset country checkboxes to checked
    const countryCheckboxes = filterPanel.querySelectorAll('.country-checkbox') as NodeListOf<HTMLInputElement>;
    countryCheckboxes.forEach(checkbox => {
      checkbox.checked = true;
      const country = checkbox.id.replace('country-', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
      selectedCountries.add(country);
    });
    
    // Reset range inputs
    const birthYearMin = document.getElementById("birth-year-min") as HTMLInputElement;
    const birthYearMax = document.getElementById("birth-year-max") as HTMLInputElement;
    if (birthYearMin) birthYearMin.value = originalBirthYearRange.min.toString();
    if (birthYearMax) birthYearMax.value = originalBirthYearRange.max.toString();
    birthYearRange = { ...originalBirthYearRange };
    
    const lifespanMin = document.getElementById("lifespan-min") as HTMLInputElement;
    const lifespanMax = document.getElementById("lifespan-max") as HTMLInputElement;
    if (lifespanMin) lifespanMin.value = "0";
    if (lifespanMax) lifespanMax.value = "120";
    
    const dnaSlider = document.getElementById("dna-contribution-slider") as HTMLInputElement;
    const dnaValue = document.getElementById("dna-contribution-value") as HTMLSpanElement;
    if (dnaSlider) dnaSlider.value = "0";
    if (dnaValue) dnaValue.textContent = "0%";
    
    applyFilters();
    updateFilterSummary();
  }


  function applyFilters() {
    const maxGen = parseInt((document.getElementById("generation-slider") as HTMLInputElement)?.value || maxGeneration.toString());
    
    // Get lineage data for filtering
    const patrilinealNames = tracePatrilineal(maxArseneaultConfig);
    const matrilinealNames = traceMatrilineal(maxArseneaultConfig);
    
    // Filter nodes based on all criteria
    g.selectAll(".node")
      .style("opacity", d => {
        const node = d as any;
        const country = getCountry(node.data.birthPlace);
        
        // Basic filters
        const isGenerationVisible = node.depth <= maxGen;
        const isCountryVisible = selectedCountries.has(country);
        
        // Time-based filters
        const birthYear = extractBirthYear(node.data.birthDate);
        const isBirthYearVisible = !birthYear || (birthYear >= birthYearRange.min && birthYear <= birthYearRange.max);
        
        const age = calculateAgeAtDate(node.data.birthDate ?? "", node.data.deathDate ?? "");
        const isLifespanVisible = !age || (age >= lifespanFilter.min && age <= lifespanFilter.max);
        
        // Data completeness filters
        let isDataCompletenessVisible = true;
        if (selectedDataCompleteness.size > 0) {
          isDataCompletenessVisible = Array.from(selectedDataCompleteness).some(filter => {
            switch(filter) {
              case 'has-photo': return !!node.data.imageUrl;
              case 'has-story': return !!(node.data.story && node.data.story !== "Stories coming soon...");
              case 'has-birth-date': return !!(node.data.birthDate && node.data.birthDate !== "Unknown");
              case 'has-death-date': return !!(node.data.deathDate && node.data.deathDate !== "N/A");
              case 'has-birth-place': return !!(node.data.birthPlace && node.data.birthPlace !== "Unknown");
              case 'has-parents': return !!(node.data.parents && node.data.parents.length > 0);
              default: return true;
            }
          });
        }
        
        // Relationship & lineage filters
        let isRelationshipVisible = true;
        if (selectedRelationshipFilters.size > 0) {
          isRelationshipVisible = Array.from(selectedRelationshipFilters).some(filter => {
            switch(filter) {
              case 'direct-line-only': return node.depth <= 2; // Direct ancestors only
              case 'patrilineal-line': return patrilinealNames.includes(node.data.name);
              case 'matrilineal-line': return matrilinealNames.includes(node.data.name);
              case 'migration-patterns': return hasMigrationPattern(node);
              default: return true;
            }
          });
        }
        
        // DNA contribution filter
        const dnaContribution = 100 / Math.pow(2, node.depth);
        const isDnaContributionVisible = dnaContribution >= minDnaContribution;
        
        // Research & analysis filters
        let isResearchVisible = true;
        if (selectedResearchFilters.size > 0) {
          isResearchVisible = Array.from(selectedResearchFilters).some(filter => {
            switch(filter) {
              case 'research-gaps': return hasResearchGaps(node);
              case 'missing-data': return hasMissingCriticalData(node);
              case 'estimated-dates': return hasEstimatedDates(node);
              case 'well-documented': return isWellDocumented(node);
              default: return true;
            }
          });
        }
        
        const isVisible = isGenerationVisible && isCountryVisible && isBirthYearVisible && 
                         isLifespanVisible && isDataCompletenessVisible && isRelationshipVisible && 
                         isDnaContributionVisible && isResearchVisible;
        
        return isVisible ? 1 : 0.1;
      });

    // Filter links based on visible nodes
    g.selectAll(".link")
      .style("opacity", d => {
        const link = d as any;
        const sourceCountry = getCountry(link.source.data.birthPlace);
        const targetCountry = getCountry(link.target.data.birthPlace);
        const sourceVisible = link.source.depth <= maxGen && selectedCountries.has(sourceCountry);
        const targetVisible = link.target.depth <= maxGen && selectedCountries.has(targetCountry);
        return (sourceVisible && targetVisible) ? 1 : 0.1;
      });
  }

  // Helper functions for advanced filtering
  function extractBirthYear(birthDate?: string): number | null {
    if (!birthDate || birthDate === "Unknown") return null;
    const yearMatch = birthDate.match(/\b(19|20)\d{2}\b/) || birthDate.match(/\b\d{4}\b/);
    return yearMatch ? parseInt(yearMatch[0]) : null;
  }

  function hasMigrationPattern(node: any): boolean {
    if (!node.data.parents || node.data.parents.length === 0) return false;
    const currentCountry = getCountry(node.data.birthPlace);
    return node.data.parents.some((parent: any) => {
      if (!parent) return false;
      const parentCountry = getCountry(parent.birthPlace);
      return currentCountry !== parentCountry;
    });
  }

  function hasResearchGaps(node: any): boolean {
    return !node.data.birthDate || node.data.birthDate === "Unknown" ||
           !node.data.deathDate || node.data.deathDate === "N/A" ||
           !node.data.birthPlace || node.data.birthPlace === "Unknown" ||
           !node.data.parents || node.data.parents.length === 0 ||
           !node.data.imageUrl;
  }

  function hasMissingCriticalData(node: any): boolean {
    return !node.data.birthDate || node.data.birthDate === "Unknown" ||
           !node.data.birthPlace || node.data.birthPlace === "Unknown";
  }

  function hasEstimatedDates(node: any): boolean {
    return node.data.birthDate?.includes("circa") || 
           node.data.birthDate?.includes("about") ||
           node.data.deathDate?.includes("circa") ||
           node.data.deathDate?.includes("about");
  }

  function isWellDocumented(node: any): boolean {
    return !!(node.data.birthDate && node.data.birthDate !== "Unknown" &&
              node.data.deathDate && node.data.deathDate !== "N/A" &&
              node.data.birthPlace && node.data.birthPlace !== "Unknown" &&
              node.data.imageUrl &&
              node.data.story && node.data.story !== "Stories coming soon...");
  }

  // Statistics dashboard state
  let isStatsDashboardVisible = false;
  let isTimelinePanelVisible = false;

  // Initialize statistics dashboard
  function initializeStatsDashboard() {
    // Use the same root data that's used in the tree (after updateTree has been called)
    const allNodes = root.descendants();
    
    // Debug: Log the number of nodes found and data structure
    console.log('Total nodes found:', allNodes.length);
    console.log('Root data:', root.data);
    console.log('Root children:', root.children?.length || 0);
    console.log('All nodes sample:', allNodes.slice(0, 5).map(n => ({ name: n.data.name, depth: n.depth })));
    
    // Calculate statistics
    const totalPeople = allNodes.length;
    const maxDepth = d3.max(allNodes, d => d.depth) || 0;
    const countries = new Map<string, number>();
    const birthYears = allNodes
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

    // Count countries
    allNodes.forEach(node => {
      const country = getCountry(node.data.birthPlace);
      countries.set(country, (countries.get(country) || 0) + 1);
    });
    
    // Debug: Log some sample data
    console.log('Sample nodes:', allNodes.slice(0, 3).map(n => ({ name: n.data.name, depth: n.depth })));
    console.log('Countries found:', Array.from(countries.entries()));

    // Calculate DNA breakdown by generation
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
      else {
        console.log(node.data);
        genderStats.unknown++;
      }
      
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

    // Create dashboard HTML
    statsDashboard.innerHTML = `
      <div class="stats-title">📊 Family Tree Statistics</div>
      
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
          <div class="dna-breakdown">
            <div class="dna-item">
              <span class="dna-label">👨 Male</span>
              <div class="dna-bar">
                <div class="dna-fill" style="width: ${(genderStats.male / totalPeople) * 100}%"></div>
              </div>
              <span class="dna-percent">${genderStats.male}</span>
            </div>
            <div class="dna-item">
              <span class="dna-label">👩 Female</span>
              <div class="dna-bar">
                <div class="dna-fill" style="width: ${(genderStats.female / totalPeople) * 100}%"></div>
              </div>
              <span class="dna-percent">${genderStats.female}</span>
            </div>
            ${genderStats.unknown > 0 ? `
            <div class="dna-item">
              <span class="dna-label">❓ Unknown</span>
              <div class="dna-bar">
                <div class="dna-fill" style="width: ${(genderStats.unknown / totalPeople) * 100}%"></div>
              </div>
              <span class="dna-percent">${genderStats.unknown}</span>
            </div>
            ` : ''}
          </div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-section-title collapsible" onclick="toggleSection('lifespan')">
          ⏰ Average Lifespan by Generation <span class="collapse-icon" onclick="event.stopPropagation(); toggleSection('lifespan');"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"></polyline></svg></span>
        </div>
        <div class="stats-section-content" id="lifespan">
          <div class="dna-breakdown">
            ${Array.from(lifespanByGeneration.entries())
              .sort((a, b) => a[0] - b[0])
              .map(([generation, ages]) => {
                const avgAge = ages.reduce((sum, age) => sum + age, 0) / ages.length;
                const maxAge = Math.max(...ages);
                const minAge = Math.min(...ages);
                return `
                  <div class="dna-item">
                    <span class="dna-label">Gen ${generation}: ${ages.length} people</span>
                    <div class="dna-bar">
                      <div class="dna-fill" style="width: ${Math.min((avgAge / 100) * 100, 100)}%"></div>
                    </div>
                    <span class="dna-percent">${avgAge.toFixed(1)}</span>
                  </div>
                  <div style="font-size: 10px; color: #888; margin-left: 8px; margin-bottom: 4px;">
                    Range: ${minAge}-${maxAge} years
                  </div>
                `;
              }).join('')}
          </div>
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-section-title collapsible" onclick="toggleSection('migration')">
          🌍 Migration Patterns <span class="collapse-icon" onclick="event.stopPropagation(); toggleSection('migration');"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"></polyline></svg></span>
        </div>
        <div class="stats-section-content" id="migration">
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

      <div class="stats-section">
        <div class="stats-section-title collapsible" onclick="toggleSection('dna-inheritance')">
          🧬 DNA Inheritance by Generation <span class="collapse-icon" onclick="event.stopPropagation(); toggleSection('dna-inheritance');"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"></polyline></svg></span>
        </div>
        <div class="stats-section-content" id="dna-inheritance">
        <div class="dna-breakdown">
          ${dnaBreakdown.map(item => `
            <div class="dna-item">
              <span class="dna-label">Gen ${item.generation}: ${item.count} people</span>
              <div class="dna-bar">
                <div class="dna-fill" style="width: ${Math.min(item.dnaPercent * 2, 100)}%"></div>
              </div>
              <span class="dna-percent">${item.dnaPercent}%</span>
            </div>
          `).join('')}
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
        </div>
      </div>

      <div class="stats-section">
        <div class="stats-section-title collapsible" onclick="toggleSection('dna-ethnicity')">
          🧬 DNA Contribution by Ethnicity <span class="collapse-icon" onclick="event.stopPropagation(); toggleSection('dna-ethnicity');"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"></polyline></svg></span>
        </div>
        <div class="stats-section-content" id="dna-ethnicity">
        <div class="dna-breakdown">
          ${(() => {
            // Calculate DNA contribution by tracing ancestry properly
            const countryDnaContribution = new Map<string, number>();
            const visitedNodes = new Set<string>(); // Prevent infinite recursion
            
            // Function to trace ancestry and assign DNA contribution
            function traceAncestry(node: any, depth: number) {
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
                  // TODO: UNDO THIS CHANGE - Treating dead-end Canada as French for DNA calculation
                  const deadEndCountry = country === "Canada" ? "France" : "Unknown";
                  countryDnaContribution.set(deadEndCountry, (countryDnaContribution.get(deadEndCountry) || 0) + dnaPercent);
                }
              }
              
              visitedNodes.delete(node.data.name); // Clean up for other branches
            }
            
            // Start tracing from the root (you)
            const rootNode = allNodes.find(n => n.depth === 0);
            if (rootNode) {
              traceAncestry(rootNode, 0);
            }
            
            return Array.from(countryDnaContribution.entries())
              .sort((a, b) => b[1] - a[1])
              .slice(0, 8)
              .map(([country, dnaPercent]) => {
                const svgSrc = countrySvgs[country];
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
          })()}
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
    `;
    
    // Create DNA pie chart after the HTML is rendered
    setTimeout(() => {
      createDnaPieChart();
    }, 100);
  }

  // Create DNA pie chart visualization
  function createDnaPieChart() {
    const svg = d3.select("#dna-pie-svg");
    const legend = d3.select("#dna-pie-legend");
    
    // Clear previous content
    svg.selectAll("*").remove();
    legend.selectAll("*").remove();
    
    // Get the DNA data (same calculation as in the HTML)
    const allNodes = root.descendants();
    const countryDnaContribution = new Map<string, number>();
    const visitedNodes = new Set<string>();
    
    function traceAncestry(node: any, depth: number) {
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
    }
    
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
    
    // Create color scale
    const colorScale = d3.scaleOrdinal()
      .domain(pieData.map(d => d.country))
      .range([
        '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', 
        '#06b6d4', '#84cc16', '#f97316', '#ec4899', '#6366f1'
      ]);
    
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
      .attr("d", arc)
      .attr("fill", d => colorScale(d.data.country))
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
          .style("left", (event.pageX + 10) + "px")
          .style("top", (event.pageY - 28) + "px");
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
      .style("background-color", d => colorScale(d.country))
      .style("margin-right", "8px")
      .style("border-radius", "2px");
    
    legendItems.append("span")
      .text(d => `${d.country} (${d.value.toFixed(1)}%)`)
      .style("color", "var(--text-primary)")
      .style("font-weight", "500");
  }

  // Close statistics dashboard function
  function closeStatsDashboard() {
    isStatsDashboardVisible = false;
    statsDashboard.classList.add("hidden");
    statsToggleBtn.classList.remove("active");
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
    
    // On mobile, toggle the left sidebar visibility
    if (window.innerWidth <= 768) {
      leftSidebar.classList.toggle('active', isStatsDashboardVisible);
    }
    
    if (isStatsDashboardVisible) {
      initializeStatsDashboard();
    }
  });

  // Initialize timeline panel
  function initializeTimelinePanel() {
    const allNodes = root.descendants();
    
    // Extract birth years and create timeline data
    const timelineData = allNodes
      .map(node => {
        if (!node.data.birthDate || node.data.birthDate === "Unknown" || node.data.birthDate === "UNKNOWN") return null;
        
        // Extract year from birth date
        const yearMatch = node.data.birthDate.match(/\b(19|20)\d{2}\b/) || node.data.birthDate.match(/\b\d{4}\b/);
        if (!yearMatch) return null;
        
        const year = parseInt(yearMatch[0]);
        if (year < 1000 || year > 2100) return null; // Filter out unreasonable years
        
        return {
          year,
          name: node.data.name,
          birthDate: node.data.birthDate,
          deathDate: node.data.deathDate,
          birthPlace: node.data.birthPlace,
          sex: node.data.sex,
          depth: node.depth,
          country: getCountry(node.data.birthPlace)
        };
      })
      .filter(item => item !== null)
      .sort((a, b) => b!.year - a!.year);

    // Group by decade for better visualization
    const decadeGroups = new Map<number, any[]>();
    timelineData.forEach(item => {
      const decade = Math.floor(item!.year / 10) * 10;
      if (!decadeGroups.has(decade)) {
        decadeGroups.set(decade, []);
      }
      decadeGroups.get(decade)!.push(item);
    });

    // Create timeline HTML
    timelinePanel.innerHTML = `
      <div class="timeline-title">📅 Family Timeline</div>
      <div class="timeline-content">
        ${Array.from(decadeGroups.entries())
          .sort((a, b) => b[0] - a[0])
          .map(([decade, people]) => `
            <div class="timeline-decade">
              <div class="decade-header">${decade}s</div>
              <div class="decade-people">
                ${people.slice(0, 10).map(person => {
                  const cleanName = cleanUnknown(person.name);
                  const cleanBirthPlace = cleanUnknown(person.birthPlace);
                  return `
                  <div class="timeline-person" onclick="showPersonModal(${JSON.stringify(person).replace(/"/g, '&quot;')}, ${person.depth})">
                    <div class="person-year">${person.year}</div>
                    <div class="person-name">${cleanName || "Name not available"}</div>
                    ${cleanBirthPlace ? `<div class="person-place">${cleanBirthPlace}</div>` : ""}
                    <div class="person-country">${person.country}</div>
                  </div>
                `;
                }).join('')}
                ${people.length > 10 ? `<div class="more-people">+${people.length - 10} more</div>` : ''}
              </div>
            </div>
          `).join('')}
      </div>
    `;
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
    // Update minimap viewport stroke color
    if (miniViewport) {
      miniViewport.attr("stroke", "var(--text-primary)");
    }
    
    // Update minimap links stroke color
    miniLinksG.selectAll("line")
      .attr("stroke", "var(--text-tertiary)");
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

  // Toggle section functionality
  (window as any).toggleSection = function(sectionId: string) {
    const content = document.getElementById(sectionId);
    const title = document.querySelector(`[onclick="toggleSection('${sectionId}')"]`);
    const icon = title?.querySelector('.collapse-icon');
    
    if (content && icon) {
      if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6,9 12,15 18,9"></polyline></svg>';
      } else {
        content.style.display = 'none';
        icon.innerHTML = '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9,18 15,12 9,6"></polyline></svg>';
      }
    }
  };

  // Tab switching functionality
  function switchFilterTab(tabName: string) {
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
    const activeTab = document.querySelector(`[data-tab="${tabName}"]`) as HTMLElement;
    const activeContent = document.getElementById(`tab-${tabName}`);
    
    if (activeTab) {
      activeTab.classList.add('active');
      activeTab.setAttribute('aria-selected', 'true');
      activeTab.setAttribute('tabindex', '0');
    }
    
    if (activeContent) {
      activeContent.classList.add('active');
      activeContent.setAttribute('aria-hidden', 'false');
    }
  }

  // Add keyboard navigation for filter tabs
  function addFilterKeyboardNavigation() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    filterTabs.forEach((tab, index) => {
      tab.addEventListener('keydown', (e) => {
        const key = e.key;
        let targetIndex = index;
        
        if (key === 'ArrowLeft' || key === 'ArrowUp') {
          e.preventDefault();
          targetIndex = index > 0 ? index - 1 : filterTabs.length - 1;
        } else if (key === 'ArrowRight' || key === 'ArrowDown') {
          e.preventDefault();
          targetIndex = index < filterTabs.length - 1 ? index + 1 : 0;
        } else if (key === 'Home') {
          e.preventDefault();
          targetIndex = 0;
        } else if (key === 'End') {
          e.preventDefault();
          targetIndex = filterTabs.length - 1;
        } else if (key === 'Enter' || key === ' ') {
          e.preventDefault();
          const tabName = (tab as HTMLElement).getAttribute('data-tab');
          if (tabName) switchFilterTab(tabName);
          return;
        }
        
        if (targetIndex !== index) {
          (filterTabs[targetIndex] as HTMLElement).focus();
        }
      });
    });
  }

  // Update filter summary
  function updateFilterSummary() {
    const summary = document.getElementById('filter-summary');
    const stats = document.getElementById('filter-stats');
    if (!summary || !stats) return;
    
    const activeFilters = [];
    const maxGen = parseInt((document.getElementById("generation-slider") as HTMLInputElement)?.value || maxGeneration.toString());
    
    if (maxGen < maxGeneration) {
      activeFilters.push(`${maxGen} generations`);
    }
    
    const countryCheckboxes = filterPanel.querySelectorAll('.country-checkbox') as NodeListOf<HTMLInputElement>;
    const selectedCountryCount = Array.from(countryCheckboxes).filter(cb => cb.checked).length;
    const totalCountryCount = countryCheckboxes.length;
    
    if (selectedCountryCount < totalCountryCount) {
      activeFilters.push(`${selectedCountryCount}/${totalCountryCount} countries`);
    }
    
    const dataCheckboxes = filterPanel.querySelectorAll('#tab-data .modern-checkbox') as NodeListOf<HTMLInputElement>;
    const selectedDataCount = Array.from(dataCheckboxes).filter(cb => cb.checked).length;
    if (selectedDataCount > 0) {
      activeFilters.push(`${selectedDataCount} data filters`);
    }
    
    const lineageCheckboxes = filterPanel.querySelectorAll('#tab-lineage .modern-checkbox') as NodeListOf<HTMLInputElement>;
    const selectedLineageCount = Array.from(lineageCheckboxes).filter(cb => cb.checked).length;
    if (selectedLineageCount > 0) {
      activeFilters.push(`${selectedLineageCount} lineage filters`);
    }
    
    const minInput = document.getElementById("birth-year-min") as HTMLInputElement;
    const maxInput = document.getElementById("birth-year-max") as HTMLInputElement;
    if (minInput && maxInput && (parseInt(minInput.value) !== originalBirthYearRange.min || parseInt(maxInput.value) !== originalBirthYearRange.max)) {
      activeFilters.push(`Years: ${minInput.value}-${maxInput.value}`);
    }
    
    const lifespanMinInput = document.getElementById("lifespan-min") as HTMLInputElement;
    const lifespanMaxInput = document.getElementById("lifespan-max") as HTMLInputElement;
    if (lifespanMinInput && lifespanMaxInput && (parseInt(lifespanMinInput.value) !== 0 || parseInt(lifespanMaxInput.value) !== 120)) {
      activeFilters.push(`Age: ${lifespanMinInput.value}-${lifespanMaxInput.value}`);
    }
    
    const dnaSlider = document.getElementById("dna-contribution-slider") as HTMLInputElement;
    if (dnaSlider && parseFloat(dnaSlider.value) > 0) {
      activeFilters.push(`DNA: ${dnaSlider.value}%+`);
    }
    
    if (activeFilters.length === 0) {
      summary.textContent = "No filters active";
      stats.textContent = "All people visible";
    } else {
      summary.textContent = `${activeFilters.length} filter${activeFilters.length > 1 ? 's' : ''} active`;
      stats.textContent = `${activeFilters.join(', ')}`;
    }
  }

  // Make functions globally available
  (window as any).updateGenerationFilter = updateGenerationFilter;
  (window as any).updateCountryFilter = updateCountryFilter;
  (window as any).selectAllCountries = selectAllCountries;
  (window as any).selectNoCountries = selectNoCountries;
  (window as any).closeStatsDashboard = closeStatsDashboard;
  (window as any).updateBirthYearRange = updateBirthYearRange;
  (window as any).updateLifespanFilter = updateLifespanFilter;
  (window as any).updateDataCompletenessFilter = updateDataCompletenessFilter;
  (window as any).updateRelationshipFilter = updateRelationshipFilter;
  (window as any).updateDnaContributionFilter = updateDnaContributionFilter;
  (window as any).updateResearchFilter = updateResearchFilter;
  (window as any).resetAllFilters = resetAllFilters;
  (window as any).switchFilterTab = switchFilterTab;

  function updateTree() {
    treeLayout(root);

    // Flip Y for Root at Bottom (invert coordinates)
    root.descendants().forEach(d => {
      d.y = height - d.y!;  // Invert y: root now at bottom
    });

    // Center the tree horizontally within the viewport
    const horizontalCenter = width / 2;
    const rootXShift = horizontalCenter - (root.x ?? 0);
    
    // Add vertical offset to ensure root is visible (shift up by 100px)
    const verticalOffset = -100;
    
    root.descendants().forEach(d => {
      d.x = (d.x ?? 0) + rootXShift;
      d.y = (d.y ?? 0) + verticalOffset;
    });

    // Links
    const links = g.selectAll(".link")
      .data(root.links(), d => `${(d.source as any).id}-${(d.target as any).id}`);

    links.enter().append("path")
      .attr("class", "link")
      .attr("d", d3.linkVertical().x(d => d.x ?? 0).y(d => d.y ?? 0))
      .attr("opacity", 0)
      .transition().duration(300).attr("opacity", 1);

    links.transition().duration(300)
      .attr("d", d3.linkVertical().x(d => d.x ?? 0).y(d => d.y ?? 0));

    links.exit().transition().duration(300).attr("opacity", 0).remove();

    // Nodes
    const nodes = g.selectAll(".node")
      .data(root.descendants(), d => (d as any).id || d.data.name);

    const nodeEnter = nodes.enter().append("g")
      .attr("class", d => d.depth === 0 ? "node root-node" : "node")
      .attr("transform", d => `translate(${d.x ?? 0},${d.y ?? 0})`)
      .attr("opacity", 0)
      .attr("aria-label", d => d.data.name)  // Accessibility
      .on("click", (_, d) => {
        showPersonModal(d.data, d.depth);
      });

    nodeEnter.transition().duration(300).attr("opacity", 1);

    nodes.transition().duration(300)
      .attr("transform", d => `translate(${d.x ?? 0},${d.y ?? 0})`);

    nodes.exit().transition().duration(300).attr("opacity", 0).remove();

    // Shapes (Scaled by DNA %)
    const scaleFactor = (depth: number) => 10 + (10 / Math.pow(2, depth));  // Larger for closer gens

    const males = nodeEnter.filter(d => d.data.sex === "Male");
    males.each(function(d) {
      const size = scaleFactor(d.depth) * 2;
      const halfSize = scaleFactor(d.depth);  // For centering: x/y = -halfSize
      const country = getCountry(d.data.birthPlace);
      const svgUrl = countrySvgs[country];
      const patternId = `country-pattern-${slugify(country)}`;
      if (d.data.imageUrl) {
        // For rects, use clipPath to clip image to square
        const clipId = `clip-${d.data.name.replace(/[^a-zA-Z0-9-]/g, "")}`;
        defs.append("clipPath")
          .attr("id", clipId)
          .append("rect")
          .attr("x", -halfSize)
          .attr("y", -halfSize)
          .attr("width", size)
          .attr("height", size);
      
        d3.select(this).append("image")
          .attr("xlink:href", d.data.imageUrl)
          .attr("x", -halfSize)
          .attr("y", -halfSize)
          .attr("width", size)
          .attr("height", size)
          .attr("preserveAspectRatio", "xMidYMid slice")
          .attr("clip-path", `url(#${clipId})`);
      
        // Add rect stroke on top
        d3.select(this).append("rect")
          .attr("x", -halfSize)
          .attr("y", -halfSize)
          .attr("width", size)
          .attr("height", size)
          .attr("fill", "none")
          .attr("stroke", "black");
      } else {
        d3.select(this).append("rect")
          .attr("width", size)
          .attr("height", size)
          .attr("x", -halfSize)
          .attr("y", -halfSize)
          .attr("fill", svgUrl ? `url(#${patternId})` : countryColors[country] || "gray")
          .attr("stroke", "black");
      }
    });

    const nonMales = nodeEnter.filter(d => d.data.sex !== "Male");
    nonMales.each(function(d) {
      const radius = scaleFactor(d.depth);
      const country = getCountry(d.data.birthPlace);
      const svgUrl = countrySvgs[country];
      const patternId = `country-pattern-${slugify(country)}`;
      if (d.data.imageUrl) {
        // For circles, use clipPath to clip image to circle
        const clipId = `clip-${d.data.name.replace(/[^a-zA-Z0-9-]/g, "")}`;
        defs.append("clipPath")
          .attr("id", clipId)
          .append("circle")
          .attr("r", radius);

        d3.select(this).append("image")
          .attr("xlink:href", d.data.imageUrl)
          .attr("x", -radius)
          .attr("y", -radius)
          .attr("width", radius * 2)
          .attr("height", radius * 2)
          .attr("preserveAspectRatio", "xMidYMid slice")
          .attr("clip-path", `url(#${clipId})`);

        // Add circle stroke on top
        d3.select(this).append("circle")
          .attr("r", radius)
          .attr("fill", "none")
          .attr("stroke", "black");
      } else {
        d3.select(this).append("circle")
          .attr("r", radius)
          .attr("fill", svgUrl ? `url(#${patternId})` : countryColors[country] || "gray")
          .attr("stroke", "black");
      }
    });

    // Text Labels with background and wrapping
    const textGroups = nodeEnter.append("g")
      .attr("class", "text-group");
    
    // Add background rectangle for text
    textGroups.append("rect")
      .attr("class", "text-background")
      .attr("x", -60) // Half of max text width
      .attr("y", d => scaleFactor(d.depth) + 7)
      .attr("width", 120) // Increased width to show more names
      .attr("height", 16) // Reduced height for more compact look
      .attr("rx", 8) // Increased border radius for more aesthetic rounded corners
      .attr("fill", "rgba(255, 255, 255, 0.9)")
      .attr("stroke", "rgba(0, 0, 0, 0.1)")
      .style("fill", "var(--bg-secondary)")
      .style("stroke", "var(--border-secondary)")
      .attr("stroke-width", 0.5);
    
    // Add text with truncation for long names - perfectly centered in background
    textGroups.append("text")
      .attr("dy", d => scaleFactor(d.depth) + 15) // Center of the 16px high background (7 + 16/2 = 15)
      .attr("x", 0)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central") // Perfect vertical centering
      .attr("class", "node-text")
      .text(d => {
        const name = d.data.name || "Unknown";
        // Truncate names that would exceed the 120px box width (roughly 16-18 characters)
        return name.length > 18 ? name.substring(0, 15) + "..." : name;
      });

    // Tooltips (Enhanced)
    nodeEnter.append("title")
      .text(d => {
        const isDeceased = d.data.deathDate !== "N/A";
        const age = isDeceased 
          ? calculateAgeAtDate(d.data.birthDate ?? "", d.data.deathDate ?? "") 
          : calculateAgeAtDate(d.data.birthDate ?? "");
        
        // Clean up data for tooltip
        const cleanName = cleanUnknown(d.data.name);
        const cleanBirthDate = cleanUnknown(d.data.birthDate);
        const cleanBirthPlace = cleanUnknown(d.data.birthPlace);
        const cleanDeathDate = cleanUnknown(d.data.deathDate);
        const cleanDeathPlace = cleanUnknown(d.data.deathPlace);
        
        const lines = [];
        lines.push(cleanName || "Name not available");
        
        if (cleanBirthDate || cleanBirthPlace) {
          const birthInfo = [];
          if (cleanBirthDate) birthInfo.push(cleanBirthDate);
          if (cleanBirthPlace) birthInfo.push(cleanBirthPlace);
          lines.push(`Born: ${birthInfo.join(" in ")}`);
        }
        
        if (cleanDeathDate || cleanDeathPlace) {
          const deathInfo = [];
          if (cleanDeathDate) deathInfo.push(cleanDeathDate);
          if (cleanDeathPlace) deathInfo.push(cleanDeathPlace);
          lines.push(`Died: ${deathInfo.join(" in ")}`);
        } else {
          lines.push("Died: —");
        }
        
        if (age !== null) {
          lines.push(`${isDeceased ? "Died at age" : "Age"}: ${age}`);
        }
        
        lines.push(`Country: ${getCountry(d.data.birthPlace)}`);
        lines.push(`DNA Contribution: ~${(100 / Math.pow(2, d.depth)).toFixed(2)}%`);
        
        return lines.join("\n");
      });

    // Clean Modern Generation Headers
    g.selectAll(".generation-header").remove();
    g.selectAll(".generation-separator").remove();
    
    const gens = getGenerations(root);
    
    // Create clean generation headers
    gens.forEach((info, depth) => {
      const nodesAtDepth = root.descendants().filter(d => d.depth === depth);
      if (nodesAtDepth.length === 0) return;
      const y = nodesAtDepth[0].y ?? 0;
      
      // Create generation header group
      const headerGroup = g.append("g")
        .attr("class", `generation-header generation-${depth}`)
        .attr("transform", `translate(${horizontalCenter}, ${y - 80})`);
      
      // Generation names
      const generationNames = ["You", "Parents", "Grandparents", "Great-Grandparents", "2nd Great-Grandparents", "3rd Great-Grandparents"];
      const genName = generationNames[depth] || `${depth}th Generation`;
      
      // Main title
      headerGroup.append("text")
        .attr("class", "generation-title")
        .attr("y", 0)
        .text(genName);
      
      // Subtitle with stats
      headerGroup.append("text")
        .attr("class", "generation-subtitle")
        .attr("y", 20)
        .text(`${info.count} of ${(2**depth).toLocaleString()} ancestors • ${info.dnaPercentEach.toFixed(1)}% DNA each • ${info.probOfSharingDna.toFixed(1)}% chance of sharing`);
      
      // Add subtle separator line below the header
      if (depth > 0) {
        g.append("line")
          .attr("class", "generation-separator")
          .attr("x1", 0)
          .attr("y1", y - 50)
          .attr("x2", width)
          .attr("y2", y - 50);
      }
    });

    // Lineages
    const patrilinealNames = tracePatrilineal(maxArseneaultConfig);
    const matrilinealNames = traceMatrilineal(maxArseneaultConfig);

    g.selectAll(".link")
      .attr("stroke", "#ccc")
      .attr("stroke-dasharray", null)
      .attr("stroke-width", 2);

    g.selectAll(".link")
      .filter(d => patrilinealNames.includes(d.source.data.name) && patrilinealNames.includes(d.target.data.name))
      .attr("stroke", "blue")
      .attr("stroke-dasharray", "5,5")
      .attr("stroke-width", 3);

    g.selectAll(".link")
      .filter(d => matrilinealNames.includes(d.source.data.name) && matrilinealNames.includes(d.target.data.name))
      .attr("stroke", "pink")
      .attr("stroke-dasharray", "5,5")
      .attr("stroke-width", 3);

    updateMinimap();
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
      
      // Position dropdown after content is added (small delay to ensure DOM update)
      setTimeout(positionDropdown, 0);
    } else {
      dropdown.style.display = "none";
      dropdown.innerHTML = ""; // Clear old suggestions
    }

    // Highlight matching nodes (keep current behavior)
    g.selectAll(".node")
      .classed("highlighted", d => query && (d.data.name?.toLowerCase().includes(query) ?? false));
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
      const searchInputRect = searchInput.getBoundingClientRect();
      dropdown.style.top = `${searchInputRect.bottom + window.scrollY}px`;
      dropdown.style.left = `${searchInputRect.left + window.scrollX}px`;
      dropdown.style.width = `${searchInputRect.width}px`;
    }
  };

  // Debounced positioning function for resize events
  let resizeTimeout: number;
  const debouncedPositionDropdown = () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(positionDropdown, 100);
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

  // Override the existing node click behavior for mobile
  const originalNodeClick = g.selectAll(".node").on("click");
  
  g.selectAll(".node")
    .on("click", function(event, d) {
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
              showPersonModal(d.data, d.depth);
            }
          }, 300);
        } else if (tapCount === 2) {
          // Double tap - zoom to node
          tapCount = 0;
          const currentTransform = d3.zoomTransform(svg.node()!);
          const scale = Math.min(currentTransform.k * 2, 3);
          const tx = width / 2 - (d.x ?? 0) * scale;
          const ty = height / 2 - (d.y ?? 0) * scale;
          
          svg.transition().duration(300).call(
            zoom.transform,
            d3.zoomIdentity.translate(tx, ty).scale(scale)
          );
        }
      } else {
        // Desktop behavior
        showPersonModal(d.data, d.depth);
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
    legendElement.style.display = 'block';
  }
  legendToggleBtn.style.opacity = '1';
  
  legendToggleBtn.addEventListener('click', () => {
    legendVisible = !legendVisible;
    if (legendElement) {
      legendElement.style.display = legendVisible ? 'block' : 'none';
    }
    legendToggleBtn.style.opacity = legendVisible ? '1' : '0.5';
    
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
        
        svg.attr('width', width).attr('height', height);
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
          
          svg.attr('width', width).attr('height', height);
          updateTree();
        }
      }, 100);
    }
  });
});