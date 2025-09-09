// src/main.ts
// @ts-nocheck
import "./style.css";
import * as d3 from "d3";
import { maxArseneaultConfig } from "./data/configs/max-arseneault.config";
import { Person } from "./interfaces/person";
import { buildHierarchy, getGenerations, tracePatrilineal, traceMatrilineal, getCountry, calculateAgeAtDate, countryColors, getInitials, getOrdinalFromNumber, estimateAncientBirthDate, getLeaves } from "./utils/utils";

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

  content.innerHTML = `
    <button class="modal-close-btn" onclick="closeModal()" aria-label="Close modal">×</button>
    <div style="display:flex; flex-direction:column; align-items:center; gap:16px; text-align:center; padding:8px;">
      ${imageHtml}
      ${placeholderHtml}
      <h2 style="margin:0; font-size:20px; font-weight:700;">${d.name || "Unknown"}</h2>
      ${relation ? `<div style="color:#444"><strong>Relation:</strong> ${relation}</div>` : ""}
      <div style="color:#444">${d.birthDate ? `<strong>Born:</strong> ${d.birthDate}` : ""} ${d.birthPlace ? `(${d.birthPlace})` : ""}</div>
      <div style="color:#444"><strong>Died:</strong> ${d.deathDate || "—"} ${age !== null && isDeceased ? `(age ${age})` : ""}</div>
      ${age !== null && !isDeceased ? `<div style="color:#444"><strong>Age:</strong> ${age}</div>` : ""}
      <div style="margin-top:8px; color:#666; font-style:italic; max-width:70vw">${(d as Person).story || "Stories coming soon..."}</div>
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

// Make closeModal globally available
(window as any).closeModal = closeModal;


document.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector("#app");
  if (!app) return;

  // Add UI Elements for Professional Look
  const header = document.createElement("header");
  header.innerHTML = `
    <h1>Arseneault Family Tree Explorer</h1>
    <div class="search-container">
      <div class="search-input-wrapper">
        <svg class="search-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"></circle>
          <path d="m21 21-4.35-4.35"></path>
        </svg>
        <input type="text" id="search-input" placeholder="Search by name...">
        <button class="search-clear-btn" id="search-clear-btn" onclick="clearSearch()" aria-label="Clear search">×</button>
      </div>
      <div class="search-results-count" id="search-results-count"></div>
    </div>
  `;
  app.appendChild(header);

  // Add Statistics Toggle Button
  const statsToggleBtn = document.createElement("button");
  statsToggleBtn.className = "stats-toggle-btn";
  statsToggleBtn.textContent = "📊";
  statsToggleBtn.title = "Toggle Statistics";
  app.appendChild(statsToggleBtn);

  // Add Timeline Toggle Button
  const timelineToggleBtn = document.createElement("button");
  timelineToggleBtn.className = "timeline-toggle-btn";
  timelineToggleBtn.textContent = "📅";
  timelineToggleBtn.title = "Toggle Timeline View";
  app.appendChild(timelineToggleBtn);

  // Add Filter Toggle Button
  const filterToggleBtn = document.createElement("button");
  filterToggleBtn.className = "filter-toggle-btn";
  filterToggleBtn.textContent = "⚙";
  filterToggleBtn.title = "Toggle Filters";
  app.appendChild(filterToggleBtn);

  // Add View Controls
  const viewControls = document.createElement("div");
  viewControls.className = "view-controls";
  viewControls.innerHTML = `
    <button class="view-control-btn" id="zoom-in-btn" title="Zoom In">+</button>
    <button class="view-control-btn" id="zoom-out-btn" title="Zoom Out">−</button>
    <button class="view-control-btn" id="fit-screen-btn" title="Fit to Screen">⌂</button>
    <button class="view-control-btn" id="reset-view-btn" title="Reset View">↺</button>
  `;
  app.appendChild(viewControls);

  const searchInput = document.getElementById("search-input") as HTMLInputElement;
  const searchClearBtn = document.getElementById("search-clear-btn") as HTMLButtonElement;
  const searchResultsCount = document.getElementById("search-results-count") as HTMLDivElement;

  // Clear search function
  (window as any).clearSearch = function() {
    searchInput.value = "";
    searchClearBtn.classList.remove("visible");
    searchResultsCount.textContent = "";
    searchResultsCount.classList.remove("highlighted");
    dropdown.style.display = "none";
    g.selectAll(".node").classed("highlighted", false);
  };

  // Keyboard shortcut for search (Ctrl+K or Cmd+K)
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "k") {
      e.preventDefault();
      searchInput.focus();
    }
    // ESC to clear search
    if (e.key === "Escape" && document.activeElement === searchInput) {
      (window as any).clearSearch();
    }
  });

  const container = document.createElement("div");
  container.id = "tree-container";
  app.appendChild(container);

  // Create Filter Panel
  // Create and append the statistics dashboard
  const statsDashboard = document.createElement("div");
  statsDashboard.className = "stats-dashboard hidden";
  statsDashboard.id = "stats-dashboard";
  app.appendChild(statsDashboard);

  const filterPanel = document.createElement("div");
  filterPanel.className = "filter-panel hidden";
  filterPanel.id = "filter-panel";
  app.appendChild(filterPanel);

  // Create Timeline Panel
  const timelinePanel = document.createElement("div");
  timelinePanel.className = "timeline-panel hidden";
  timelinePanel.id = "timeline-panel";
  app.appendChild(timelinePanel);

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
  app.appendChild(legend);

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
  let height = window.innerHeight * 0.55;
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
    const pattern = defs.append("pattern")
      .attr("id", `country-pattern-${country.replace(/\s/g, "").toLowerCase()}`)
      .attr("width", 1)
      .attr("height", 1)
      .attr("patternContentUnits", "objectBoundingBox");
    pattern.append("image")
      .attr("xlink:href", url)
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
  Object.assign(miniWrap.style, {
    position: "fixed",
    right: "16px",
    bottom: "16px",
    width: `${miniW + 2 * miniPad}px`,
    height: `${miniH + 2 * miniPad}px`,
    border: "1px solid #ccc",
    background: "rgba(255,255,255,0.95)",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    zIndex: "1000",
    userSelect: "none",
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
    .attr("stroke", "#000")
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
            .attr("stroke", "#bbb")
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

  const treeLayout = d3.tree<Person>().size([width, height - 100]).nodeSize([120, 200]);  // Adjusted for flipped layout

  // Filter state
  let maxGeneration = 0;
  let selectedCountries = new Set<string>();
  let isFilterPanelVisible = false;

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

    // Create filter panel HTML
    filterPanel.innerHTML = `
      <div class="filter-section">
        <div class="filter-title">Generations</div>
        <div class="generation-controls">
          <div class="generation-slider-container">
            <span style="font-size: 12px; color: #666;">Show up to:</span>
            <input type="range" class="generation-slider" id="generation-slider" 
                   min="0" max="${maxGeneration}" value="${maxGeneration}" 
                   oninput="updateGenerationFilter(this.value)">
            <span class="generation-value" id="generation-value">${maxGeneration}</span>
          </div>
        </div>
      </div>
      
      <div class="filter-section">
        <div class="filter-title">Countries</div>
        <div class="country-filters">
          ${Array.from(countryCounts.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([country, count]) => `
              <div class="country-filter-item">
                <input type="checkbox" class="country-filter-checkbox" 
                       id="country-${country.replace(/\s+/g, '-').toLowerCase()}" 
                       checked onchange="updateCountryFilter()">
                <label class="country-filter-label" for="country-${country.replace(/\s+/g, '-').toLowerCase()}">
                  <img src="./svgs/${country.toLowerCase().replace(/\s+/g, '-')}.svg" 
                       style="width: 16px; height: 16px; object-fit: contain;" 
                       onerror="this.style.display='none'">
                  ${country}
                  <span class="country-count">${count}</span>
                </label>
              </div>
            `).join('')}
        </div>
      </div>
      
      <div class="filter-actions">
        <button class="filter-btn" onclick="selectAllCountries()">All</button>
        <button class="filter-btn" onclick="selectNoCountries()">None</button>
      </div>
    `;

    // Initialize all countries as selected
    selectedCountries = new Set(countryCounts.keys());
  }

  // Filter functions
  function updateGenerationFilter(value: string) {
    const generationValue = document.getElementById("generation-value") as HTMLSpanElement;
    generationValue.textContent = value;
    applyFilters();
  }

  function updateCountryFilter() {
    const checkboxes = filterPanel.querySelectorAll('.country-filter-checkbox') as NodeListOf<HTMLInputElement>;
    selectedCountries.clear();
    checkboxes.forEach(checkbox => {
      if (checkbox.checked) {
        const country = checkbox.id.replace('country-', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        selectedCountries.add(country);
      }
    });
    applyFilters();
  }

  function selectAllCountries() {
    const checkboxes = filterPanel.querySelectorAll('.country-filter-checkbox') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(checkbox => {
      checkbox.checked = true;
    });
    selectedCountries = new Set(Array.from(checkboxes).map(cb => 
      cb.id.replace('country-', '').replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    ));
    applyFilters();
  }

  function selectNoCountries() {
    const checkboxes = filterPanel.querySelectorAll('.country-filter-checkbox') as NodeListOf<HTMLInputElement>;
    checkboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
    selectedCountries.clear();
    applyFilters();
  }

  function applyFilters() {
    const maxGen = parseInt((document.getElementById("generation-slider") as HTMLInputElement)?.value || maxGeneration.toString());
    
    // Filter nodes based on generation and country
    g.selectAll(".node")
      .style("opacity", d => {
        const node = d as any;
        const country = getCountry(node.data.birthPlace);
        const isGenerationVisible = node.depth <= maxGen;
        const isCountryVisible = selectedCountries.has(country);
        return (isGenerationVisible && isCountryVisible) ? 1 : 0.1;
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
        </div>
      </div>
    `;
  }

  // Close statistics dashboard function
  function closeStatsDashboard() {
    isStatsDashboardVisible = false;
    statsDashboard.classList.add("hidden");
    statsToggleBtn.textContent = "📊";
  }

  // Toggle statistics dashboard visibility
  statsToggleBtn.addEventListener("click", () => {
    isStatsDashboardVisible = !isStatsDashboardVisible;
    statsDashboard.classList.toggle("hidden", !isStatsDashboardVisible);
    statsToggleBtn.textContent = isStatsDashboardVisible ? "✕" : "📊";
    
    console.log('Stats button clicked, visible:', isStatsDashboardVisible, 'button text:', statsToggleBtn.textContent);
    
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
      .sort((a, b) => a!.year - b!.year);

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
          .sort((a, b) => a[0] - b[0])
          .map(([decade, people]) => `
            <div class="timeline-decade">
              <div class="decade-header">${decade}s</div>
              <div class="decade-people">
                ${people.slice(0, 10).map(person => `
                  <div class="timeline-person" onclick="showPersonModal(${JSON.stringify(person).replace(/"/g, '&quot;')}, ${person.depth})">
                    <div class="person-year">${person.year}</div>
                    <div class="person-name">${person.name}</div>
                    <div class="person-place">${person.birthPlace}</div>
                    <div class="person-country">${person.country}</div>
                  </div>
                `).join('')}
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
    timelineToggleBtn.textContent = "📅";
  }

  // Toggle timeline panel visibility
  timelineToggleBtn.addEventListener("click", () => {
    isTimelinePanelVisible = !isTimelinePanelVisible;
    timelinePanel.classList.toggle("hidden", !isTimelinePanelVisible);
    timelineToggleBtn.textContent = isTimelinePanelVisible ? "✕" : "📅";
    
    if (isTimelinePanelVisible) {
      initializeTimelinePanel();
    }
  });

  // Toggle filter panel visibility
  filterToggleBtn.addEventListener("click", () => {
    isFilterPanelVisible = !isFilterPanelVisible;
    filterPanel.classList.toggle("hidden", !isFilterPanelVisible);
    filterToggleBtn.textContent = isFilterPanelVisible ? "✕" : "⚙";
  });

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

  // Make functions globally available
  (window as any).updateGenerationFilter = updateGenerationFilter;
  (window as any).updateCountryFilter = updateCountryFilter;
  (window as any).selectAllCountries = selectAllCountries;
  (window as any).selectNoCountries = selectNoCountries;
  (window as any).closeStatsDashboard = closeStatsDashboard;

  function updateTree() {
    treeLayout(root);

    // Flip Y for Root at Bottom (invert coordinates)
    root.descendants().forEach(d => {
      d.y = height - d.y!;  // Invert y: root now at bottom
    });

    // Center the tree horizontally within the viewport
    const viewportWidth = window.innerWidth;
    const horizontalCenter = viewportWidth / 2;
    const rootXShift = horizontalCenter - (root.x ?? 0);
    
    root.descendants().forEach(d => {
      d.x = (d.x ?? 0) + rootXShift;
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
      const patternId = `country-pattern-${country.replace(/\s/g, "").toLowerCase()}`;
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
      const patternId = `country-pattern-${country.replace(/\s/g, "").toLowerCase()}`;
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

    // Text Labels
    nodeEnter.append("text")
      .attr("dy", d => scaleFactor(d.depth) + 10)
      .attr("x", 0)
      .attr("text-anchor", "middle")
      .text(d => d.data.name || "Unknown");

    // Tooltips (Enhanced)
    nodeEnter.append("title")
      .text(d => {
        const isDeceased = d.data.deathDate !== "N/A";
        const age = isDeceased 
          ? calculateAgeAtDate(d.data.birthDate ?? "", d.data.deathDate ?? "") 
          : calculateAgeAtDate(d.data.birthDate ?? "");
        return `${d.data.name || "Unknown"}\nBorn: ${d.data.birthDate || "Unknown"} in ${d.data.birthPlace || "Unknown"}\nDied: ${d.data.deathDate || "N/A"} in ${d.data.deathPlace || "Unknown"}\n${isDeceased ? "Died at age" : "Age"}: ${age ?? "Unknown"}\nCountry: ${getCountry(d.data.birthPlace)}\nDNA Contribution: ~${(100 / Math.pow(2, d.depth)).toFixed(2)}%`;
      });

    // Generation Labels (with Total DNA)
    g.selectAll(".gen-label").remove();
    const gens = getGenerations(root);
    gens.forEach((info, depth) => {
      const nodesAtDepth = root.descendants().filter(d => d.depth === depth);
      if (nodesAtDepth.length === 0) return;
      const y = nodesAtDepth[0].y ?? 0;  // All nodes at same y
      g.append("text")
        .attr("class", "gen-label")
        .attr("x", horizontalCenter)
        .attr("y", y + 45)  // Position above the node row; adjust offset as needed (e.g., +30 for below)
        .attr("text-anchor", "middle")
        .text(`Gen ${depth}: ${info.count}/${(2**depth).toLocaleString()} ancestors, ~${info.dnaPercentEach.toFixed(2)}% each (${info.dnaPercentTotal.toFixed(2)}% total DNA), ${info.probOfSharingDna.toFixed(2)}% probability of sharing DNA`);
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
  searchInput.parentElement?.appendChild(dropdown);

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
    } else {
      dropdown.style.display = "none";
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
    }
  });

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
});