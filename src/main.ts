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
import { createViewControls, setupViewControlListeners } from "./components/view-controls";
import { setupSearchFunctionality, setupSearchKeyboardShortcuts, setupSearchInputInteractions } from "./components/search";






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
    const href = url ?? `./svgs/${slugify(country)}.svg`;

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
    g.attr("transform", currentTransform.toString());
    updateMinimapViewport(); // keep minimap viewport in sync
  });

  svg.call(zoom);

    // ───────────────── MINIMAP: setup ─────────────────
  const miniW = 280;
  const miniH = 200;
  const miniPad = 12;

  // Container (fixed, bottom-right). Style here so you don't need to touch CSS.
  const miniWrap = document.createElement("div");
  miniWrap.id = "minimap";
  miniWrap.className = "minimap-container";
  Object.assign(miniWrap.style, {
    position: "fixed",
    right: "20px",
    bottom: "20px",
    width: `${miniW + 2 * miniPad}px`,
    height: `${miniH + 2 * miniPad}px`,
    border: "1px solid var(--border-secondary)",
    background: "var(--bg-secondary)",
    borderRadius: "12px",
    boxShadow: "0 8px 24px var(--shadow-medium), 0 2px 8px var(--shadow-light)",
    zIndex: "1000",
    userSelect: "none",
    transition: "all 0.3s ease",
    backdropFilter: "blur(10px)",
    WebkitBackdropFilter: "blur(10px)",
  });
  app.appendChild(miniWrap);

  const miniSvg = d3
    .select(miniWrap)
    .append("svg")
    .attr("width", miniW + 2 * miniPad)
    .attr("height", miniH + 2 * miniPad);

  const miniG = miniSvg.append("g").attr("transform", `translate(${miniPad},${miniPad})`);
  
  // Add simple background rect (no pattern for performance)
  miniG.append("rect")
    .attr("width", miniW + 2 * miniPad)
    .attr("height", miniH + 2 * miniPad)
    .attr("x", -miniPad)
    .attr("y", -miniPad)
    .attr("fill", "var(--bg-tertiary)")
    .attr("opacity", 0.3)
    .attr("rx", 8)
    .attr("ry", 8);

  // Clean minimap view - no title or legend for performance
  
  const miniLinksG = miniG.append("g").attr("class", "minimap-links");
  const miniNodesG = miniG.append("g").attr("class", "minimap-nodes");
  
  const miniViewport = miniG
    .append("rect")
    .attr("class", "minimap-viewport")
    .attr("fill", "rgba(74, 158, 255, 0.1)")
    .attr("stroke", "var(--accent-primary)")
    .attr("stroke-width", 2)
    .attr("stroke-dasharray", "4,2")
    .attr("pointer-events", "all");

  // Bounds/scales for minimap
  let treeBounds = { x0: 0, y0: 0, x1: 1, y1: 1 };
  let miniScaleX = 1;
  let miniScaleY = 1;

  // Helpers to map main coords → minimap coords
  const mx = (x: number) => (x - treeBounds.x0) * miniScaleX;
  const my = (y: number) => (y - treeBounds.y0) * miniScaleY;

  // Drag to pan main view from the minimap
  const dragViewport = d3
    .drag<SVGRectElement, unknown>()
    .on("drag", (event) => {
      // convert minimap rect top-left back to main coords
      const x0 = event.x; // in minimap group coords (already inside miniG with translate)
      const y0 = event.y;

      const mainX0 = x0 / miniScaleX + treeBounds.x0;
      const mainY0 = y0 / miniScaleY + treeBounds.y0;

      const k = currentTransform.k;
      const tx = -mainX0 * k;
      const ty = -mainY0 * k;

      svg.call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(k));
    });
  miniViewport.call(dragViewport);

  // Add click-to-center functionality on the minimap background (throttled for performance)
  let clickTimeout: number | null = null;
  miniG.on("click", (event) => {
    if (clickTimeout) return; // Throttle clicks
    
    clickTimeout = window.setTimeout(() => {
      clickTimeout = null;
    }, 100);
    
    const rect = miniG.node()?.getBoundingClientRect();
    if (!rect) return;
    
    const x = event.offsetX;
    const y = event.offsetY;
    
    // Get the current offset values from the minimap
    const scaledWidth = treeBounds.x1 - treeBounds.x0;
    const scaledHeight = treeBounds.y1 - treeBounds.y0;
    const offsetX = (miniW - scaledWidth * miniScaleX) / 2;
    const offsetY = (miniH - scaledHeight * miniScaleY) / 2;
    
    // Convert minimap coords to main coords
    const mainX = (x - offsetX) / miniScaleX + treeBounds.x0;
    const mainY = (y - offsetY) / miniScaleY + treeBounds.y0;
    
    // Center the main view on this point
    const k = currentTransform.k;
    const tx = -mainX * k + width / 2;
    const ty = -mainY * k + height / 2;
    
    svg.call(zoom.transform, d3.zoomIdentity.translate(tx, ty).scale(k));
  });

  // Add tooltip (simplified hover effects for performance)
  miniWrap.title = "Click to center view • Drag viewport to pan • Drag tree to navigate";

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
    const pad = 30;
    treeBounds = { x0: x0 - pad, x1: x1 + pad, y0: y0 - pad, y1: y1 + pad };

    const bw = treeBounds.x1 - treeBounds.x0;
    const bh = treeBounds.y1 - treeBounds.y0;

    // Calculate scale to fill the entire minimap area (stretched/distorted)
    const scaleX = miniW / Math.max(bw, 1);
    const scaleY = miniH / Math.max(bh, 1);
    
    // Use separate scales for X and Y to fill the entire minimap (distorted view)
    miniScaleX = scaleX * 0.95; // 95% to add minimal padding
    miniScaleY = scaleY * 0.95;
    
    // Center the tree in the minimap
    const scaledWidth = bw * miniScaleX;
    const scaledHeight = bh * miniScaleY;
    const offsetX = (miniW - scaledWidth) / 2;
    const offsetY = (miniH - scaledHeight) / 2;
    
    // Update the transform to center the content (no scaling here - done in coordinate functions)
    miniG.attr("transform", `translate(${miniPad + offsetX},${miniPad + offsetY})`);

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
            .attr("stroke-width", 1.5)
            .attr("opacity", 0.6),
        (update) =>
          update
            .attr("x1", (d) => mx(d.source.x))
            .attr("y1", (d) => my(d.source.y))
            .attr("x2", (d) => mx(d.target.x))
            .attr("y2", (d) => my(d.target.y)),
        (exit) => exit.remove()
      );

    // Nodes (simplified for performance - all circles, no gender distinction)
    const miniNodes = miniNodesG
      .selectAll<SVGCircleElement, any>("circle")
      .data(nodes, (d: any) => d.data.id || d.data.name + d.depth);

    miniNodes
      .join(
        (enter) =>
          enter
            .append("circle")
            .attr("r", 1.5)
            .attr("cx", (d) => mx(d.x))
            .attr("cy", (d) => my(d.y))
            .attr("fill", (d) => countryColors[getCountry(d.data.birthPlace)] || "#808080"),
        (update) => update
          .attr("cx", (d) => mx(d.x))
          .attr("cy", (d) => my(d.y))
          .attr("fill", (d) => countryColors[getCountry(d.data.birthPlace)] || "#808080"),
        (exit) => exit.remove()
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
    const rw = vw * miniScaleX;
    const rh = vh * miniScaleY;

    miniViewport
      .attr("x", rx)
      .attr("y", ry)
      .attr("width", Math.max(10, rw)) // keep visible
      .attr("height", Math.max(10, rh));
  }

  let rootPerson = migratedMaxArseneaultConfig;
  
  // Helper function to determine if a color is light or dark
  function isColorLight(color: string): boolean {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  }
  
  // Beautiful hover tooltip functions
  let tooltipTimeout: number | null = null;
  let currentTooltip: HTMLElement | null = null;
  let currentPerson: Person | null = null;
  
  function showPersonTooltip(person: Person, depth: number, element: any, event?: any) {
    hidePersonTooltip(); // Remove any existing tooltip
    currentPerson = person;
    createTooltip(person, depth, element, event);
  }
  
  function createTooltip(person: Person, depth: number, element: any, event?: any) {
    const tooltip = document.createElement('div');
    tooltip.className = 'person-tooltip';
    currentTooltip = tooltip;
    
    const initials = getInitials(person?.name);
    const isDeceased = person.deathDate !== "N/A";
    const age = isDeceased 
      ? calculateAgeAtDate(person.birthDate ?? "", person.deathDate ?? "") 
      : calculateAgeAtDate(person.birthDate ?? "");
    
    // Get country for color coding
    const country = getCountry(person.birthPlace);
    const countryColor = countryColors[country] || "#808080";
    
    // Calculate relationship
    let relation = "";
    if (depth === 0) {
      relation = "You";
    } else if (depth === 1) {
      relation = person.sex === "Female" ? "Mother" : "Father";
    } else if (depth === 2) {
      relation = person.sex === "Female" ? "Grandmother" : "Grandfather";
    } else {
      const ordinal = getOrdinalFromNumber(depth - 2);
      const greats = `${depth === 3 ? "" : ordinal + " "}Great-`;
      relation = `${greats}Grand${person.sex === "Female" ? "mother" : "father"}`;
    }
    
    // Clean up data for display
    const cleanName = cleanUnknown(person.name);
    const cleanBirthDate = cleanUnknown(person.birthDate);
    const cleanBirthPlace = cleanUnknown(person.birthPlace);
    const cleanDeathDate = cleanUnknown(person.deathDate);
    const cleanStory = cleanUnknown(person.story);
    
    // Calculate DNA contribution
    const dnaContribution = depth === 0 ? 100 : (100 / Math.pow(2, depth));
    
    // Determine text color for better readability on country background
    const isLight = isColorLight(countryColor);
    const headerTextColor = isLight ? '#000000' : '#ffffff';
    const headerIconBg = isLight ? 'rgba(0,0,0,0.1)' : 'rgba(255,255,255,0.2)';
    
    tooltip.innerHTML = `
      <div class="tooltip-header" style="background-color: ${countryColor}; color: ${headerTextColor}; padding: 8px 12px; border-radius: 8px 8px 0 0; display: flex; align-items: center; gap: 8px;">
        <div style="width: 24px; height: 24px; background: ${headerIconBg}; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 12px; font-weight: 600;">
          ${initials}
        </div>
        <div>
          <div style="font-weight: 600; font-size: 14px;">${cleanName || "Unknown"}</div>
          <div style="font-size: 11px; opacity: 0.9;">${relation}</div>
        </div>
      </div>
      <div class="tooltip-content" style="padding: 12px; background: var(--bg-secondary); border: 1px solid var(--border-secondary); border-radius: 0 0 8px 8px; max-width: 250px;">
        ${cleanBirthDate || cleanBirthPlace ? `
          <div style="margin-bottom: 8px;">
            <div style="font-size: 11px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">Birth</div>
            <div style="font-size: 13px; color: var(--text-primary);">
              ${cleanBirthDate ? `<strong>${cleanBirthDate}</strong>` : ""}
              ${cleanBirthPlace ? `<br><span style="color: var(--text-secondary);">${cleanBirthPlace}</span>` : ""}
            </div>
          </div>
        ` : ""}
        
        <div style="margin-bottom: 8px;">
          <div style="font-size: 11px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">Death</div>
          <div style="font-size: 13px; color: var(--text-primary);">
            <strong>${cleanDeathDate || "—"}</strong>
            ${age !== null && isDeceased ? `<br><span style="color: var(--text-secondary);">Age ${age}</span>` : ""}
            ${age !== null && !isDeceased ? `<br><span style="color: var(--success);">Currently ${age} years old</span>` : ""}
          </div>
        </div>
        
        <div style="margin-bottom: 8px;">
          <div style="font-size: 11px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 2px;">DNA Contribution</div>
          <div style="font-size: 13px; color: var(--text-primary);">
            <strong>${dnaContribution.toFixed(2)}%</strong>
            <span style="color: var(--text-secondary); font-size: 11px;"> (${depth === 0 ? 'You' : depth === 1 ? 'Parent' : depth === 2 ? 'Grandparent' : `${depth} generations back`})</span>
          </div>
        </div>
        
        ${cleanStory ? `
          <div style="border-top: 1px solid var(--border-primary); padding-top: 8px;">
            <div style="font-size: 11px; font-weight: 600; color: var(--accent-primary); text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px;">Story</div>
            <div style="font-size: 12px; color: var(--text-primary); line-height: 1.4; font-style: italic;">
              ${cleanStory.length > 100 ? cleanStory.substring(0, 100) + "..." : cleanStory}
            </div>
          </div>
        ` : ""}
      </div>
    `;
    
    // Set tooltip styles for mouse following
    tooltip.style.position = 'fixed';
    tooltip.style.zIndex = '10000';
    tooltip.style.pointerEvents = 'none';
    tooltip.style.opacity = '0';
    tooltip.style.transition = 'opacity 0.2s ease';
    
    // Add to DOM
    document.body.appendChild(tooltip);
    
    // Position tooltip based on mouse coordinates
    if (event && event.clientX !== undefined && event.clientY !== undefined) {
      // Account for the CSS zoom transform (scale 0.75)
      const scale = 0.75;
      const scaledX = event.clientX / scale;
      const scaledY = event.clientY / scale;
      
      // Position tooltip upper-left corner to the right of mouse cursor
      let left = scaledX + 20; // 20px gap from cursor (scaled)
      let top = scaledY - 15;  // 15px above cursor (scaled)
      
      // Get tooltip dimensions after it's in the DOM
      const tooltipRect = tooltip.getBoundingClientRect();
      
      // Adjust if tooltip would go off screen (use scaled viewport)
      const scaledViewportWidth = window.innerWidth / scale;
      const scaledViewportHeight = window.innerHeight / scale;
      
      if (left + tooltipRect.width > scaledViewportWidth) {
        left = scaledX - tooltipRect.width - 20; // Position to the left instead
      }
      if (top < 0) {
        top = scaledY + 20; // Position below cursor if not enough space above
      }
      
      tooltip.style.left = `${left}px`;
      tooltip.style.top = `${top}px`;
    } else {
      // Fallback positioning if no event coordinates
      tooltip.style.left = '10px';
      tooltip.style.top = '10px';
    }
    
    // Show tooltip
    requestAnimationFrame(() => {
      if (currentTooltip) {
        currentTooltip.style.opacity = '1';
      }
    });
  }
  
  function hidePersonTooltip() {
    // Clear any pending tooltip timeout
    if (tooltipTimeout) {
      clearTimeout(tooltipTimeout);
      tooltipTimeout = null;
    }
    
    if (currentTooltip) {
      // Fade out and remove
      currentTooltip.style.opacity = '0';
      setTimeout(() => {
        if (currentTooltip && currentTooltip.parentNode) {
          currentTooltip.parentNode.removeChild(currentTooltip);
        }
        currentTooltip = null;
        currentPerson = null;
      }, 200);
    }
  }
  
  function updateTreeWithNewData(newRoot: any) {
    // Update the root reference
    root = newRoot;
    
    // Clear existing tree
    g.selectAll("*").remove();
    
    // Update tree layout and render
    updateTree();
  }
  
  
  let root = buildHierarchy(rootPerson);

  // Migration content will be initialized when stats dashboard is opened

  const treeLayout = d3.tree<Person>().size([width, height - 120]).nodeSize([180, 200]);  // Increased horizontal spacing to prevent text overlap

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
              <div class="range-row">
                <div class="range-field">
                  <label class="range-label">From</label>
                  <input type="number" class="modern-input" id="birth-year-min" 
                         value="${minBirthYear}" min="${minBirthYear}" max="${maxBirthYear}" 
                         onchange="updateBirthYearRange()">
                </div>
                <div class="range-to">to</div>
                <div class="range-field">
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
              <div class="range-row">
                <div class="range-field">
                  <label class="range-label">Min Age</label>
                  <input type="number" class="modern-input" id="lifespan-min" 
                         value="0" min="0" max="120" onchange="updateLifespanFilter()">
                </div>
                <div class="range-to">to</div>
                <div class="range-field">
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
    const patrilinealNames = tracePatrilineal(migratedMaxArseneaultConfig);
    const matrilinealNames = traceMatrilineal(migratedMaxArseneaultConfig);
    
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
  let statsDashboardInstance: StatsDashboard | null = null;
  
  // Timeline panel state
  let isTimelinePanelVisible = false;
  let timelinePanelInstance: TimelinePanel | null = null;

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
        const key = (e as KeyboardEvent).key;
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
    
    // Add vertical offset to ensure root is visible (shift up by 20px)
    const verticalOffset = -20;
    
    root.descendants().forEach(d => {
      d.x = (d.x ?? 0) + rootXShift;
      d.y = (d.y ?? 0) + verticalOffset;
    });

    // Links
    const links = g.selectAll(".link")
      .data(root.links(), (d: any) => `${(d.source as any).id || (d.source as any).data.name}-${(d.target as any).id || (d.target as any).data.name}`);

    links.enter().append("path")
      .attr("class", "link")
      .attr("d", d3.linkVertical<any, any>().x((d: any) => d.x ?? 0).y((d: any) => d.y ?? 0))
      .attr("opacity", 0)
      .transition().duration(300).attr("opacity", 1);

    links.transition().duration(300)
      .attr("d", d3.linkVertical<any, any>().x((d: any) => d.x ?? 0).y((d: any) => d.y ?? 0));

    links.exit().transition().duration(300).attr("opacity", 0).remove();

    // Nodes
    const nodes = g.selectAll(".node")
      .data(root.descendants(), d => (d as any).id || (d as any).data.name);

    const nodeEnter = nodes.enter().append("g")
      .attr("class", d => d.depth === 0 ? "node root-node" : "node")
      .attr("transform", d => `translate(${d.x ?? 0},${d.y ?? 0})`)
      .attr("opacity", 0)
      .on("click", (_, d) => {
        // Clear any pending hover timeout to prevent conflicts
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
          hoverTimeout = null;
        }
        showPersonModal((d as any).data, (d as any).depth);
      })
      .on("mouseover", function(event, d) {
        showPersonTooltip((d as any).data, (d as any).depth, this, event);
      })
      .on("mouseout", function() {
        hidePersonTooltip();
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
          .attr("class", "node-circle")
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
          .attr("class", "node-circle")
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
    const patrilinealNames = tracePatrilineal(migratedMaxArseneaultConfig);
    const matrilinealNames = traceMatrilineal(migratedMaxArseneaultConfig);

    g.selectAll(".link")
      .attr("stroke", "#ccc")
      .attr("stroke-dasharray", null)
      .attr("stroke-width", 2);

    g.selectAll(".link")
      .filter(d => patrilinealNames.includes((d as any).source.data.name) && patrilinealNames.includes((d as any).target.data.name))
      .attr("stroke", "blue")
      .attr("stroke-dasharray", "5,5")
      .attr("stroke-width", 3);

    g.selectAll(".link")
      .filter(d => matrilinealNames.includes((d as any).source.data.name) && matrilinealNames.includes((d as any).target.data.name))
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

  // Chart functions have been moved to the StatsDashboard component

});
