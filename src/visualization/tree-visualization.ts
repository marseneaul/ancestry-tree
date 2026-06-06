// src/visualization/tree-visualization.ts
import * as d3 from "d3";
import { Person } from "../interfaces/person";
import { 
  getCountry, 
  countryColors, 
  getGenerations, 
  tracePatrilineal, 
  traceMatrilineal 
} from "../utils/utils";
import { slugify } from "../utils/helpers";
import { measureSync } from "../utils/performance";
import { Minimap, MinimapConfig } from "./minimap";

export interface TreeVisualizationConfig {
  container: string;
  width: number;
  height: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  countrySvgs: Record<string, string>;
  originalPersonData?: Person; // For lineage tracing
  onNodeClick?: (person: Person, depth: number) => void;
  onNodeHover?: (person: Person, depth: number, element: any, event?: any) => void;
  onNodeHoverOut?: () => void;
  onMinimapUpdate?: () => void;
}

export interface TreeVisualizationState {
  root: any;
  svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  g: d3.Selection<SVGGElement, unknown, null, undefined>;
  defs: d3.Selection<SVGDefsElement, unknown, null, undefined>;
  zoom: d3.ZoomBehavior<SVGSVGElement, unknown>;
  currentTransform: d3.ZoomTransform;
  treeLayout: d3.TreeLayout<Person>;
  minimap: Minimap;
}

interface RenderProfile {
  totalNodes: number;
  labelDepthLimit: number;
  imageDepthLimit: number;
  animate: boolean;
}

export class TreeVisualization {
  private config: TreeVisualizationConfig;
  private state: TreeVisualizationState;
  private hoverTimeout: number | null = null;
  private renderProfile: RenderProfile = {
    totalNodes: 0,
    labelDepthLimit: Number.POSITIVE_INFINITY,
    imageDepthLimit: Number.POSITIVE_INFINITY,
    animate: true
  };

  constructor(config: TreeVisualizationConfig) {
    this.config = {
      margin: { top: 50, right: 150, bottom: 50, left: 150 },
      ...config
    };
    this.state = {} as TreeVisualizationState;
  }

  /**
   * Initialize the tree visualization
   */
  initialize(): void {
    this.createSVG();
    this.createTreeLayout();
    this.createZoomBehavior();
    this.createMinimap();
    this.setupCountryPatterns();
  }

  /**
   * Create the main SVG container and groups
   */
  private createSVG(): void {
    const { container, width, height, margin } = this.config;
    
    // Create main SVG
    this.state.svg = d3.select(container).append("svg")
      .attr("width", "100%")
      .attr("height", height)
      .attr("viewBox", `${-margin!.left} ${-margin!.top} ${width + margin!.left + margin!.right} ${height + margin!.top + margin!.bottom}`)
      .attr("preserveAspectRatio", "xMidYMid meet") as unknown as d3.Selection<SVGSVGElement, unknown, null, undefined>;

    // Create main group
    this.state.g = this.state.svg.append("g");

    // Create defs for patterns
    this.state.defs = this.state.svg.append("defs");
  }

  /**
   * Create the tree layout
   */
  private createTreeLayout(): void {
    const { width, height } = this.config;
    const [nodeX, nodeY] = this.getNodeSpacing(width);

    this.state.treeLayout = d3.tree<Person>()
      .size([width, height - 120])
      .nodeSize([nodeX, nodeY]);
  }

  /**
   * Create zoom behavior
   */
  private createZoomBehavior(): void {
    this.state.currentTransform = d3.zoomIdentity;
    
    this.state.zoom = d3.zoom<SVGSVGElement, unknown>().on("zoom", (event) => {
      this.state.currentTransform = event.transform;
      this.state.g.attr("transform", this.state.currentTransform.toString());
      this.state.minimap.updateMinimapViewport(this.state.currentTransform);
    });

    this.state.svg.call(this.state.zoom);
  }

  /**
   * Create minimap
   */
  private createMinimap(): void {
    const minimapConfig: MinimapConfig = {
      container: this.config.container,
      width: this.config.width,
      height: this.config.height,
      onViewportChange: (transform: d3.ZoomTransform) => {
        this.state.svg.call(this.state.zoom.transform as any, transform);
      }
    };

    this.state.minimap = new Minimap(minimapConfig);
    this.state.minimap.initialize();
  }

  /**
   * Setup country SVG patterns
   */
  private setupCountryPatterns(): void {
    Object.entries(this.config.countrySvgs).forEach(([country, url]) => {
      const patternId = `country-pattern-${slugify(country)}`;
      const href = url ?? `./svgs/${slugify(country)}.svg`;

      const pattern = this.state.defs.append("pattern")
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
  }

  /**
   * Update the tree with new data
   */
  updateTree(root: any): void {
    this.state.root = root;
    measureSync("tree.update", () => this.renderTree());
  }

  /**
   * Render the tree visualization
   */
  private renderTree(): void {
    const { width, height } = this.config;
    const root = this.state.root;

    const descendants = measureSync("tree.layout", () => {
      this.state.treeLayout(root);
      return root.descendants();
    });
    this.renderProfile = this.getRenderProfile(descendants.length);

    // Flip Y for Root at Bottom (invert coordinates)
    descendants.forEach((d: any) => {
      d.y = height - d.y!;
    });

    // Center the tree horizontally within the viewport
    const horizontalCenter = width / 2;
    const rootXShift = horizontalCenter - (root.x ?? 0);
    const verticalOffset = -20;

    descendants.forEach((d: any) => {
      d.x = (d.x ?? 0) + rootXShift;
      d.y = (d.y ?? 0) + verticalOffset;
    });

    // Render links
    measureSync("tree.renderLinks", () => this.renderLinks(root));

    // Render nodes
    measureSync("tree.renderNodes", () => this.renderNodes(root));

    // Render generation headers
    measureSync("tree.renderGenerationHeaders", () => this.renderGenerationHeaders(descendants, horizontalCenter));

    // Render lineages
    measureSync("tree.renderLineages", () => this.renderLineages());

    // Update minimap
    measureSync("tree.updateMinimap", () => this.state.minimap.updateMinimap(root, this.state.currentTransform));
  }

  /**
   * Render tree links
   */
  private renderLinks(root: any): void {
    const duration = this.renderProfile.animate ? 300 : 0;
    const links = this.state.g.selectAll(".link")
      .data(root.links(), (d: any) => `${this.getNodeKey((d as any).source)}-${this.getNodeKey((d as any).target)}`);

    links.enter().append("path")
      .attr("class", "link")
      .attr("d", d3.linkVertical<any, any>().x((d: any) => d.x ?? 0).y((d: any) => d.y ?? 0))
      .attr("opacity", 0)
      .transition().duration(duration).attr("opacity", 1);

    links.transition().duration(duration)
      .attr("d", d3.linkVertical<any, any>().x((d: any) => d.x ?? 0).y((d: any) => d.y ?? 0));

    links.exit().transition().duration(duration).attr("opacity", 0).remove();
  }

  /**
   * Render tree nodes
   */
  private renderNodes(root: any): void {
    const duration = this.renderProfile.animate ? 300 : 0;
    const nodes = this.state.g.selectAll(".node")
      .data(root.descendants(), (d: any) => this.getNodeKey(d));

    const nodeEnter = nodes.enter().append("g")
      .attr("class", (d: any) => {
        const classes = [d.depth === 0 ? "node root-node" : "node"];
        if (!this.shouldRenderLabel(d.depth)) classes.push("compact-node");
        return classes.join(" ");
      })
      .attr("transform", (d: any) => `translate(${d.x ?? 0},${d.y ?? 0})`)
      .attr("opacity", 0)
      .on("click", (_, d: any) => {
        if (this.hoverTimeout) {
          clearTimeout(this.hoverTimeout);
          this.hoverTimeout = null;
        }
        if (this.config.onNodeClick) {
          this.config.onNodeClick(d.data, d.depth);
        }
      })
      .on("mouseover", (event, d: any) => {
        if (this.config.onNodeHover) {
          this.config.onNodeHover(d.data, d.depth, this, event);
        }
      })
      .on("mouseout", () => {
        if (this.config.onNodeHoverOut) {
          this.config.onNodeHoverOut();
        }
      });

    nodeEnter.transition().duration(duration).attr("opacity", 1);

    nodes.transition().duration(duration)
      .attr("transform", (d: any) => `translate(${d.x ?? 0},${d.y ?? 0})`);

    nodes.exit().transition().duration(duration).attr("opacity", 0).remove();

    // Render node shapes
    this.renderNodeShapes(nodeEnter);

    // Render node text
    this.renderNodeText(nodeEnter.filter((d: any) => this.shouldRenderLabel(d.depth)));
  }

  /**
   * Render node shapes (rectangles for males, circles for females)
   */
  private renderNodeShapes(nodeEnter: d3.Selection<SVGGElement, any, SVGGElement, any>): void {
    const scaleFactor = (depth: number) => 10 + (10 / Math.pow(2, depth));
    const self = this; // Capture the class instance

    // Male nodes (rectangles)
    const males = nodeEnter.filter((d: any) => d.data.sex === "Male");
    males.each(function(d: any) {
      const size = scaleFactor(d.depth) * 2;
      const halfSize = scaleFactor(d.depth);
      const country = getCountry(d.data.birthPlace);
      const svgUrl = self.config.countrySvgs[country];
      const patternId = `country-pattern-${slugify(country)}`;

      if (d.data.imageUrl && self.shouldRenderImage(d.depth)) {
        const clipId = self.getClipId(d);
        self.state.defs.append("clipPath")
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

    // Female nodes (circles)
    const nonMales = nodeEnter.filter((d: any) => d.data.sex !== "Male");
    nonMales.each(function(d: any) {
      const radius = scaleFactor(d.depth);
      const country = getCountry(d.data.birthPlace);
      const svgUrl = self.config.countrySvgs[country];
      const patternId = `country-pattern-${slugify(country)}`;

      if (d.data.imageUrl && self.shouldRenderImage(d.depth)) {
        const clipId = self.getClipId(d);
        self.state.defs.append("clipPath")
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
  }

  /**
   * Render node text labels
   */
  private renderNodeText(nodeEnter: d3.Selection<SVGGElement, any, SVGGElement, any>): void {
    const scaleFactor = (depth: number) => 10 + (10 / Math.pow(2, depth));

    const textGroups = nodeEnter.append("g")
      .attr("class", "text-group");

    // Add background rectangle for text
    textGroups.append("rect")
      .attr("class", "text-background")
      .attr("x", -60)
      .attr("y", (d: any) => scaleFactor(d.depth) + 7)
      .attr("width", 120)
      .attr("height", 16)
      .attr("rx", 8)
      .attr("fill", "rgba(255, 255, 255, 0.9)")
      .attr("stroke", "rgba(0, 0, 0, 0.1)")
      .style("fill", "var(--bg-secondary)")
      .style("stroke", "var(--border-secondary)")
      .attr("stroke-width", 0.5);

    // Add text with truncation
    textGroups.append("text")
      .attr("dy", (d: any) => scaleFactor(d.depth) + 15)
      .attr("x", 0)
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "central")
      .attr("class", "node-text")
      .text((d: any) => {
        const name = d.data.name || "Unknown";
        return name.length > 18 ? name.substring(0, 15) + "..." : name;
      });
  }

  /**
   * Render generation headers
   */
  private renderGenerationHeaders(descendants: any[], horizontalCenter: number): void {
    const { width } = this.config;

    // Remove existing headers
    this.state.g.selectAll(".generation-header").remove();
    this.state.g.selectAll(".generation-separator").remove();

    const gens = getGenerations(this.state.root);
    const nodesByDepth = d3.group(descendants, (d: any) => d.depth);

    gens.forEach((info: any, depth: number) => {
      const nodesAtDepth = nodesByDepth.get(depth) ?? [];
      if (nodesAtDepth.length === 0) return;
      const y = nodesAtDepth[0].y ?? 0;

      const headerGroup = this.state.g.append("g")
        .attr("class", `generation-header generation-${depth}`)
        .attr("transform", `translate(${horizontalCenter}, ${y - 80})`);

      const generationNames = ["You", "Parents", "Grandparents", "Great-Grandparents", "2nd Great-Grandparents", "3rd Great-Grandparents"];
      const genName = generationNames[depth] || `${depth}th Generation`;

      headerGroup.append("text")
        .attr("class", "generation-title")
        .attr("y", 0)
        .text(genName);

      const subtitle = width < 520
        ? `${info.count} of ${(2**depth).toLocaleString()} ancestors`
        : width < 760
          ? `${info.count} ancestors • ${info.dnaPercentEach.toFixed(1)}% DNA each`
          : `${info.count} of ${(2**depth).toLocaleString()} ancestors • ${info.dnaPercentEach.toFixed(1)}% DNA each • ${info.probOfSharingDna.toFixed(1)}% chance of sharing`;

      headerGroup.append("text")
        .attr("class", "generation-subtitle")
        .attr("y", 20)
        .text(subtitle);

      if (depth > 0) {
        this.state.g.append("line")
          .attr("class", "generation-separator")
          .attr("x1", 0)
          .attr("y1", y - 50)
          .attr("x2", width)
          .attr("y2", y - 50);
      }
    });
  }

  /**
   * Render lineage highlighting
   */
  private renderLineages(): void {
    if (!this.config.originalPersonData) return;

    const patrilinealNames = tracePatrilineal(this.config.originalPersonData);
    const matrilinealNames = traceMatrilineal(this.config.originalPersonData);

    this.state.g.selectAll(".link")
      .attr("stroke", "#ccc")
      .attr("stroke-dasharray", null)
      .attr("stroke-width", 2);

    this.state.g.selectAll(".link")
      .filter((d: any) => patrilinealNames.includes(d.source.data.name) && patrilinealNames.includes(d.target.data.name))
      .attr("stroke", "blue")
      .attr("stroke-dasharray", "5,5")
      .attr("stroke-width", 3);

    this.state.g.selectAll(".link")
      .filter((d: any) => matrilinealNames.includes(d.source.data.name) && matrilinealNames.includes(d.target.data.name))
      .attr("stroke", "pink")
      .attr("stroke-dasharray", "5,5")
      .attr("stroke-width", 3);
  }

  private getRenderProfile(totalNodes: number): RenderProfile {
    if (totalNodes > 800) {
      return {
        totalNodes,
        labelDepthLimit: 6,
        imageDepthLimit: 4,
        animate: false
      };
    }

    if (totalNodes > 400) {
      return {
        totalNodes,
        labelDepthLimit: 8,
        imageDepthLimit: 6,
        animate: true
      };
    }

    return {
      totalNodes,
      labelDepthLimit: Number.POSITIVE_INFINITY,
      imageDepthLimit: Number.POSITIVE_INFINITY,
      animate: true
    };
  }

  private shouldRenderLabel(depth: number): boolean {
    return depth <= this.renderProfile.labelDepthLimit;
  }

  private shouldRenderImage(depth: number): boolean {
    return depth <= this.renderProfile.imageDepthLimit;
  }

  private getNodeSpacing(width: number): [number, number] {
    if (width < 520) return [96, 150];
    if (width < 760) return [128, 170];
    if (width < 1100) return [150, 185];
    return [180, 200];
  }

  private getNodeKey(node: any): string {
    return node.data.id || `${node.data.name}-${node.data.birthDate || "unknown"}-${node.depth}`;
  }

  private getClipId(node: any): string {
    return `clip-${slugify(`${this.getNodeKey(node)}`)}`;
  }


  /**
   * Get the current SVG element
   */
  getSVG(): d3.Selection<SVGSVGElement, unknown, null, undefined> {
    return this.state.svg;
  }

  /**
   * Get the current zoom behavior
   */
  getZoom(): d3.ZoomBehavior<SVGSVGElement, unknown> {
    return this.state.zoom;
  }

  /**
   * Get the current transform
   */
  getCurrentTransform(): d3.ZoomTransform {
    return this.state.currentTransform;
  }

  /**
   * Update dimensions
   */
  updateDimensions(width: number, height: number): void {
    this.config.width = width;
    this.config.height = height;
    
    this.state.svg
      .attr("height", height)
      .attr("viewBox", `${-this.config.margin!.left} ${-this.config.margin!.top} ${width + this.config.margin!.left + this.config.margin!.right} ${height + this.config.margin!.top + this.config.margin!.bottom}`);

    const [nodeX, nodeY] = this.getNodeSpacing(width);
    this.state.treeLayout = d3.tree<Person>()
      .size([width, height - 120])
      .nodeSize([nodeX, nodeY]);

    this.state.minimap?.updateDimensions(width, height);
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    if (this.state.minimap) {
      this.state.minimap.destroy();
    }
    this.state.svg.remove();
  }
}
