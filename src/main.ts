// src/main.ts
// @ts-nocheck
import "./style.css";
import * as d3 from "d3";
import { maxArseneaultConfig } from "./data/configs/max-arseneault.config";
import { Person } from "./interfaces/person";
import { buildHierarchy, getGenerations, tracePatrilineal, traceMatrilineal, getCountry, calculateAge, countryColors } from "./utils/utils";
// import { format } from "date-fns";  // Uncomment if needed

document.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector("#app");
  if (!app) return;

  // Add UI Elements for Professional Look
  const header = document.createElement("header");
  header.innerHTML = `
    <h1>Arseneault Family Tree Explorer</h1>
    <input type="text" id="search-input" placeholder="Search by name...">
    <button id="export-png">Export PNG</button>
    <button id="export-svg">Export SVG</button>
  `;
  app.appendChild(header);

  const container = document.createElement("div");
  container.id = "tree-container";
  app.appendChild(container);

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

  // Populate Color Legend Dynamically
  const colorLegend = document.getElementById("color-legend");
  Object.entries(countryColors).forEach(([country, color]) => {
    const li = document.createElement("li");
    li.innerHTML = `<span style="background: ${color}; width: 20px; height: 20px; display: inline-block; margin-right: 5px;"></span>${country}`;
    colorLegend?.appendChild(li);
  });

  // Responsive SVG
  const width = window.innerWidth * 0.8;
  const height = window.innerHeight * 0.7;
  const margin = { top: 50, right: 150, bottom: 50, left: 150 };

  const svg = d3.select("#tree-container").append("svg")
    .attr("width", "100%")
    .attr("height", height)
    .attr("viewBox", `${-margin.left} ${-margin.top} ${width + margin.left + margin.right} ${height + margin.top + margin.bottom}`)
    .attr("preserveAspectRatio", "xMidYMid meet");

  const g = svg.append("g");

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
    background: "rgba(255,255,255,0.9)",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
    zIndex: "999",
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
    .attr("stroke", "#333")
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

    // Split join to keep shapes by sex
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
            .attr("fill", "#444"),
        (update) =>
          update.attr("x", (d) => mx(d.x) - 1.5).attr("y", (d) => my(d.y) - 1.5)
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
            .attr("fill", "#222"),
        (update) => update.attr("cx", (d) => mx(d.x)).attr("cy", (d) => my(d.y))
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



  const root = buildHierarchy(maxArseneaultConfig);
  const treeLayout = d3.tree<Person>().size([width, height - 100]).nodeSize([120, 200]);  // Adjusted for flipped layout

  function updateTree() {
    treeLayout(root);

    // Flip Y for Root at Bottom (invert coordinates)
    root.descendants().forEach(d => {
      d.y = height - d.y!;  // Invert y: root now at bottom
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
      .attr("class", "node")
      .attr("transform", d => `translate(${d.x ?? 0},${d.y ?? 0})`)
      .attr("opacity", 0)
      .attr("aria-label", d => d.data.name)  // Accessibility
      .on("click", (event, d) => {
        if (d.children) {
          d._children = d.children;
          d.children = null;
        } else {
          d.children = d._children;
          d._children = null;
        }
        updateTree();
      });

    nodeEnter.transition().duration(300).attr("opacity", 1);

    nodes.transition().duration(300)
      .attr("transform", d => `translate(${d.x ?? 0},${d.y ?? 0})`);

    nodes.exit().transition().duration(300).attr("opacity", 0).remove();

    // Shapes (Scaled by DNA %)
    const scaleFactor = (depth: number) => 10 + (10 / Math.pow(2, depth));  // Larger for closer gens

    // Defs for patterns (for images)
    const defs = g.append("defs");

    const males = nodeEnter.filter(d => d.data.sex === "Male");
    males.each(function(d) {
      const size = scaleFactor(d.depth) * 2;
      if (d.data.imageUrl) {
        const patternId = `img-${d.data.name.replace(/\s/g, "-")}`;
        defs.append("pattern")
          .attr("id", patternId)
          .attr("width", 1)
          .attr("height", 1)
          .append("image")
          .attr("xlink:href", d.data.imageUrl)
          .attr("width", size)
          .attr("height", size)
          .attr("preserveAspectRatio", "xMidYMid slice");

        d3.select(this).append("rect")
          .attr("width", size)
          .attr("height", size)
          .attr("x", -scaleFactor(d.depth))
          .attr("y", -scaleFactor(d.depth))
          .attr("fill", `url(#${patternId})`)
          .attr("stroke", "black");
      } else {
        d3.select(this).append("rect")
          .attr("width", size)
          .attr("height", size)
          .attr("x", -scaleFactor(d.depth))
          .attr("y", -scaleFactor(d.depth))
          .attr("fill", countryColors[getCountry(d.data.birthPlace)] || "gray")
          .attr("stroke", "black");
      }
    });

    const nonMales = nodeEnter.filter(d => d.data.sex !== "Male");
    nonMales.each(function(d) {
      const radius = scaleFactor(d.depth);
      if (d.data.imageUrl) {
        // For circles, use clipPath to clip image to circle
        const clipId = `clip-${d.data.name.replace(/\s/g, "-")}`;
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
          .attr("fill", countryColors[getCountry(d.data.birthPlace)] || "gray")
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
        const age = calculateAge(d.data.birthDate ?? "", d.data.deathDate ?? "N/A");
        return `${d.data.name || "Unknown"}\nBorn: ${d.data.birthDate || "Unknown"} in ${d.data.birthPlace || "Unknown"}\nDied: ${d.data.deathDate || "N/A"} in ${d.data.deathPlace || "Unknown"}\nAge: ${age ?? "Deceased"}\nCountry: ${getCountry(d.data.birthPlace)}\nDNA Contribution: ~${(100 / Math.pow(2, d.depth)).toFixed(2)}%`;
      });

    // Generation Labels (with Total DNA)
    g.selectAll(".gen-label").remove();
    const gens = getGenerations(root);
    gens.forEach((info, depth) => {
      g.append("text")
        .attr("class", "gen-label")
        .attr("x", -250)
        .attr("y", height - (depth * 200) - 50)  // Adjusted for flip
        .text(`Gen ${depth}: ${info.count} ancestors, ~${info.dnaPercentEach.toFixed(2)}% each (${info.dnaPercentTotal.toFixed(2)}% total DNA), ${info.probOfSharingDna.toFixed(2)}% probability of sharing DNA`);
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

  // Search Functionality
  const searchInput = document.getElementById("search-input") as HTMLInputElement;
  searchInput.addEventListener("input", (e) => {
    const query = (e.target as HTMLInputElement).value.toLowerCase();
    g.selectAll(".node")
      .classed("highlighted", d => query && (d.data.name?.toLowerCase().includes(query) ?? false));
  });

  // Export PNG
  document.getElementById("export-png")?.addEventListener("click", () => {
    const svgElement = svg.node() as SVGSVGElement;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgElement);
    const canvas = document.createElement("canvas");
    canvas.width = width + margin.left + margin.right;
    canvas.height = height + margin.top + margin.bottom;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      ctx?.drawImage(img, 0, 0);
      const a = document.createElement("a");
      a.href = canvas.toDataURL("image/png");
      a.download = "family-tree.png";
      a.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(svgStr);
  });

  // Export SVG
  document.getElementById("export-svg")?.addEventListener("click", () => {
    const svgElement = svg.node() as SVGSVGElement;
    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgElement);
    const blob = new Blob([svgStr], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "family-tree.svg";
    a.click();
    URL.revokeObjectURL(url);
  });

  // Resize Handler
  window.addEventListener("resize", () => {
    // Recompute width/height and update viewBox if needed
    updateTree();
    updateMinimapViewport();
  });
});