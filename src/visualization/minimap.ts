// src/visualization/minimap.ts
import * as d3 from "d3";
import { getCountry, countryColors } from "../utils/utils";

export interface MinimapConfig {
  container: string;
  width: number;
  height: number;
  onViewportChange?: (transform: d3.ZoomTransform) => void;
}

export interface MinimapState {
  container: HTMLElement;
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  g: d3.Selection<SVGGElement, unknown, null, undefined>;
  linksG: d3.Selection<SVGGElement, unknown, null, undefined>;
  nodesG: d3.Selection<SVGGElement, unknown, null, undefined>;
  viewport: d3.Selection<SVGRectElement, unknown, null, undefined>;
  bounds: { x0: number; y0: number; x1: number; y1: number };
  scaleX: number;
  scaleY: number;
  currentTransform: d3.ZoomTransform;
}

export class Minimap {
  private config: MinimapConfig;
  private state: MinimapState;
  private miniW = 280;
  private miniH = 200;
  private miniPad = 12;

  constructor(config: MinimapConfig) {
    this.config = config;
    this.state = {} as MinimapState;
  }

  /**
   * Initialize the minimap
   */
  initialize(): void {
    this.createMinimapContainer();
    this.createMinimapSVG();
    this.setupMinimapInteractions();
  }

  /**
   * Create minimap container
   */
  private createMinimapContainer(): void {
    // Create minimap container
    const miniWrap = document.createElement("div");
    miniWrap.id = "minimap";
    miniWrap.className = "minimap-container";
    Object.assign(miniWrap.style, {
      position: "fixed",
      right: "20px",
      bottom: "20px",
      width: `${this.miniW + 2 * this.miniPad}px`,
      height: `${this.miniH + 2 * this.miniPad}px`,
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

    // Append to the same container as the main SVG
    const container = document.querySelector(this.config.container);
    if (container) {
      container.appendChild(miniWrap);
    }

    this.state.container = miniWrap;
  }

  /**
   * Create minimap SVG and groups
   */
  private createMinimapSVG(): void {
    // Create minimap SVG
    const miniSvg = d3
      .select(this.state.container)
      .append("svg")
      .attr("width", this.miniW + 2 * this.miniPad)
      .attr("height", this.miniH + 2 * this.miniPad);

    const miniG = miniSvg.append("g").attr("transform", `translate(${this.miniPad},${this.miniPad})`);

    // Add background
    miniG.append("rect")
      .attr("width", this.miniW + 2 * this.miniPad)
      .attr("height", this.miniH + 2 * this.miniPad)
      .attr("x", -this.miniPad)
      .attr("y", -this.miniPad)
      .attr("fill", "var(--bg-tertiary)")
      .attr("opacity", 0.3)
      .attr("rx", 8)
      .attr("ry", 8);

    // Create minimap groups
    const miniLinksG = miniG.append("g").attr("class", "minimap-links");
    const miniNodesG = miniG.append("g").attr("class", "minimap-nodes");

    // Create viewport rectangle
    const miniViewport = miniG
      .append("rect")
      .attr("class", "minimap-viewport")
      .attr("fill", "rgba(74, 158, 255, 0.1)")
      .attr("stroke", "var(--accent-primary)")
      .attr("stroke-width", 2)
      .attr("stroke-dasharray", "4,2")
      .attr("pointer-events", "all");

    // Initialize minimap state
    this.state.svg = miniSvg;
    this.state.g = miniG;
    this.state.linksG = miniLinksG;
    this.state.nodesG = miniNodesG;
    this.state.viewport = miniViewport;
    this.state.bounds = { x0: 0, y0: 0, x1: 1, y1: 1 };
    this.state.scaleX = 1;
    this.state.scaleY = 1;
    this.state.currentTransform = d3.zoomIdentity;

    // Add tooltip
    this.state.container.title = "Click to center view • Drag viewport to pan • Drag tree to navigate";
  }

  /**
   * Setup minimap interactions
   */
  private setupMinimapInteractions(): void {
    // Setup minimap drag behavior
    const dragViewport = d3
      .drag<SVGRectElement, unknown>()
      .on("drag", (event) => {
        const x0 = event.x;
        const y0 = event.y;
        const mainX0 = x0 / this.state.scaleX + this.state.bounds.x0;
        const mainY0 = y0 / this.state.scaleY + this.state.bounds.y0;
        
        if (this.config.onViewportChange) {
          const k = this.state.currentTransform.k;
          const tx = -mainX0 * k;
          const ty = -mainY0 * k;
          const newTransform = d3.zoomIdentity.translate(tx, ty).scale(k);
          this.config.onViewportChange(newTransform);
        }
      });
    this.state.viewport.call(dragViewport);

    // Setup click-to-center
    let clickTimeout: number | null = null;
    this.state.g.on("click", (event) => {
      if (clickTimeout) return;
      clickTimeout = window.setTimeout(() => {
        clickTimeout = null;
      }, 100);

      const rect = this.state.g.node()?.getBoundingClientRect();
      if (!rect) return;

      const x = event.offsetX;
      const y = event.offsetY;
      const scaledWidth = this.state.bounds.x1 - this.state.bounds.x0;
      const scaledHeight = this.state.bounds.y1 - this.state.bounds.y0;
      const offsetX = (this.miniW - scaledWidth * this.state.scaleX) / 2;
      const offsetY = (this.miniH - scaledHeight * this.state.scaleY) / 2;
      const mainX = (x - offsetX) / this.state.scaleX + this.state.bounds.x0;
      const mainY = (y - offsetY) / this.state.scaleY + this.state.bounds.y0;
      const k = this.state.currentTransform.k;
      const tx = -mainX * k + this.config.width / 2;
      const ty = -mainY * k + this.config.height / 2;

      if (this.config.onViewportChange) {
        const newTransform = d3.zoomIdentity.translate(tx, ty).scale(k);
        this.config.onViewportChange(newTransform);
      }
    });
  }

  /**
   * Update minimap with new tree data
   */
  updateMinimap(root: any, currentTransform: d3.ZoomTransform): void {
    // Update the current transform reference
    this.state.currentTransform = currentTransform;
    // Compute tree bounds
    const nodes = root.descendants();
    const xs = nodes.map((d: any) => d.x);
    const ys = nodes.map((d: any) => d.y);

    const x0 = Math.min(...xs);
    const x1 = Math.max(...xs);
    const y0 = Math.min(...ys);
    const y1 = Math.max(...ys);

    const pad = 30;
    this.state.bounds = { x0: x0 - pad, x1: x1 + pad, y0: y0 - pad, y1: y1 + pad };

    const bw = this.state.bounds.x1 - this.state.bounds.x0;
    const bh = this.state.bounds.y1 - this.state.bounds.y0;

    this.state.scaleX = (this.miniW / Math.max(bw, 1)) * 0.95;
    this.state.scaleY = (this.miniH / Math.max(bh, 1)) * 0.95;

    this.state.g.attr("transform", `translate(12,12)`);

    // Update minimap links
    const miniLinks = this.state.linksG
      .selectAll<SVGLineElement, any>("line")
      .data(root.links(), (d: any) => `${d.source.data.name}-${d.target.data.name}`);

    miniLinks
      .join(
        (enter) =>
          enter
            .append("line")
            .attr("x1", (d: any) => this.mx(d.source.x))
            .attr("y1", (d: any) => this.my(d.source.y))
            .attr("x2", (d: any) => this.mx(d.target.x))
            .attr("y2", (d: any) => this.my(d.target.y))
            .attr("stroke", "var(--text-tertiary)")
            .attr("stroke-width", 1.5)
            .attr("opacity", 0.6),
        (update) =>
          update
            .attr("x1", (d: any) => this.mx(d.source.x))
            .attr("y1", (d: any) => this.my(d.source.y))
            .attr("x2", (d: any) => this.mx(d.target.x))
            .attr("y2", (d: any) => this.my(d.target.y)),
        (exit) => exit.remove()
      );

    // Update minimap nodes
    const miniNodes = this.state.nodesG
      .selectAll<SVGCircleElement, any>("circle")
      .data(nodes, (d: any) => d.data.id || d.data.name + d.depth);

    miniNodes
      .join(
        (enter) =>
          enter
            .append("circle")
            .attr("r", 1.5)
            .attr("cx", (d: any) => this.mx(d.x))
            .attr("cy", (d: any) => this.my(d.y))
            .attr("fill", (d: any) => countryColors[getCountry(d.data.birthPlace)] || "#808080"),
        (update) => update
          .attr("cx", (d: any) => this.mx(d.x))
          .attr("cy", (d: any) => this.my(d.y))
          .attr("fill", (d: any) => countryColors[getCountry(d.data.birthPlace)] || "#808080"),
        (exit) => exit.remove()
      );

    this.updateMinimapViewport(currentTransform);
  }

  /**
   * Update minimap viewport
   */
  updateMinimapViewport(currentTransform: d3.ZoomTransform): void {
    const k = currentTransform.k;
    const x0 = -currentTransform.x / k;
    const y0 = -currentTransform.y / k;
    const vw = this.config.width / k;
    const vh = this.config.height / k;

    const rx = this.mx(x0);
    const ry = this.my(y0);
    const rw = vw * this.state.scaleX;
    const rh = vh * this.state.scaleY;

    this.state.viewport
      .attr("x", rx)
      .attr("y", ry)
      .attr("width", Math.max(10, rw))
      .attr("height", Math.max(10, rh));
  }

  /**
   * Helper functions for minimap coordinate mapping
   */
  private mx(x: number): number {
    return (x - this.state.bounds.x0) * this.state.scaleX;
  }

  private my(y: number): number {
    return (y - this.state.bounds.y0) * this.state.scaleY;
  }

  /**
   * Get the minimap state
   */
  getState(): MinimapState {
    return this.state;
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.state.container?.parentNode) {
      this.state.container.parentNode.removeChild(this.state.container);
    }
  }
}
