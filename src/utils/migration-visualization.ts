// Migration patterns visualization using D3.js
import * as d3 from 'd3';
import { MigrationPatterns, MigrationPoint, MigrationRoute } from './migration-patterns';

export interface MigrationMapConfig {
  width: number;
  height: number;
  container: string | HTMLElement;
  showRoutes?: boolean;
  showPoints?: boolean;
  pointSize?: (point: MigrationPoint) => number;
  routeWidth?: (route: MigrationRoute) => number;
}

export class MigrationMapVisualization {
  private svg: d3.Selection<SVGSVGElement, unknown, null, undefined>;
  private g: d3.Selection<SVGGElement, unknown, null, undefined>;
  private projection: d3.GeoProjection;
  private path: d3.GeoPath;
  private width: number;
  private height: number;
  private patterns: MigrationPatterns | null = null;
  private worldData: any = null;
  private zoom!: d3.ZoomBehavior<SVGSVGElement, unknown>;

  private getThemeColors() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return {
      background: isDark ? '#1e293b' : '#ffffff',
      countries: isDark ? '#475569' : '#e2e8f0',
      borders: isDark ? '#64748b' : '#cbd5e1',
      accent: isDark ? '#60a5fa' : '#3b82f6',
      accentHover: isDark ? '#3b82f6' : '#2563eb',
      text: isDark ? '#f8fafc' : '#1e293b',
      textSecondary: isDark ? '#cbd5e1' : '#475569',
      textTertiary: isDark ? '#94a3b8' : '#64748b',
      shadow: isDark ? 'rgba(0, 0, 0, 0.4)' : 'rgba(15, 23, 42, 0.08)'
    };
  }

  constructor(config: MigrationMapConfig) {
    this.width = config.width;
    this.height = config.height;
    
    // Create SVG container
    const container = typeof config.container === 'string' 
      ? document.querySelector(config.container) 
      : config.container;
    
    if (!container) {
      throw new Error('Container element not found');
    }
    
    // Clear container
    container.innerHTML = '';
    
    // Create SVG
    const colors = this.getThemeColors();
    this.svg = d3.select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .style('background', colors.background)
      .style('border-radius', '0.75rem')
      .style('border', `1px solid ${colors.borders}`);
    
    // Create main group
    this.g = this.svg.append('g');
    
    // Set up projection (Mercator)
    this.projection = d3.geoMercator()
      .scale(100)
      .center([0, 0])
      .translate([this.width / 2, this.height / 2]);
    
    this.path = d3.geoPath().projection(this.projection);
    
    // Set up zoom functionality
    this.setupZoom();
    
    
    // Always create a fallback map first to ensure something is visible
    this.createFallbackMap();
    
    // Then try to load world data
    this.loadWorldData();
  }

  private setupZoom(): void {
    // Create zoom behavior with performance optimizations
    this.zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.5, 4]) // Reduced max zoom for better performance
      .filter((event) => {
        // Only allow zoom on left mouse button and wheel
        return !event.ctrlKey && !event.button;
      })
      .on('zoom', (event) => {
        const { transform } = event;
        
        // Apply zoom transform to the main group - this is much more efficient
        this.g.attr('transform', transform);
      });
    
    // Apply zoom behavior to SVG
    this.svg.call(this.zoom);
    
    // Add zoom controls
    this.addZoomControls();
  }

  private addZoomControls(): void {
    const colors = this.getThemeColors();
    const controlsGroup = this.svg.append('g')
      .attr('class', 'zoom-controls')
      .attr('transform', `translate(${this.width - 45}, 10)`);
    
    // Zoom in button
    const zoomInBtn = controlsGroup.append('g')
      .attr('class', 'zoom-control zoom-in')
      .style('cursor', 'pointer')
      .style('opacity', 0.8)
      .on('click', () => {
        this.svg.transition().duration(200).call(
          this.zoom.scaleBy, 1.5
        );
      })
      .on('mouseover', function() {
        d3.select(this).style('opacity', 1);
      })
      .on('mouseout', function() {
        d3.select(this).style('opacity', 0.8);
      });
    
    zoomInBtn.append('rect')
      .attr('width', 25)
      .attr('height', 12)
      .attr('fill', colors.background)
      .attr('stroke', colors.borders)
      .attr('stroke-width', 1)
      .attr('rx', 2);
    
    zoomInBtn.append('text')
      .attr('x', 12.5)
      .attr('y', 8)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.text)
      .style('font-size', '9px')
      .style('font-weight', 'bold')
      .text('+');
    
    // Zoom out button
    const zoomOutBtn = controlsGroup.append('g')
      .attr('class', 'zoom-control zoom-out')
      .attr('transform', 'translate(0, 15)')
      .style('cursor', 'pointer')
      .style('opacity', 0.8)
      .on('click', () => {
        this.svg.transition().duration(200).call(
          this.zoom.scaleBy, 1 / 1.5
        );
      })
      .on('mouseover', function() {
        d3.select(this).style('opacity', 1);
      })
      .on('mouseout', function() {
        d3.select(this).style('opacity', 0.8);
      });
    
    zoomOutBtn.append('rect')
      .attr('width', 25)
      .attr('height', 12)
      .attr('fill', colors.background)
      .attr('stroke', colors.borders)
      .attr('stroke-width', 1)
      .attr('rx', 2);
    
    zoomOutBtn.append('text')
      .attr('x', 12.5)
      .attr('y', 8)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.text)
      .style('font-size', '9px')
      .style('font-weight', 'bold')
      .text('−');
    
    // Reset button
    const resetBtn = controlsGroup.append('g')
      .attr('class', 'zoom-control reset')
      .attr('transform', 'translate(0, 30)')
      .style('cursor', 'pointer')
      .style('opacity', 0.8)
      .on('click', () => {
        this.resetZoom();
      })
      .on('mouseover', function() {
        d3.select(this).style('opacity', 1);
      })
      .on('mouseout', function() {
        d3.select(this).style('opacity', 0.8);
      });
    
    resetBtn.append('rect')
      .attr('width', 25)
      .attr('height', 12)
      .attr('fill', colors.background)
      .attr('stroke', colors.borders)
      .attr('stroke-width', 1)
      .attr('rx', 2);
    
    resetBtn.append('text')
      .attr('x', 12.5)
      .attr('y', 8)
      .attr('text-anchor', 'middle')
      .attr('fill', colors.text)
      .style('font-size', '7px')
      .style('font-weight', 'bold')
      .text('⌂');
  }

  private resetZoom(): void {
    this.svg.transition().duration(500).call(
      this.zoom.transform,
      d3.zoomIdentity
    );
  }

  private async loadWorldData(): Promise<void> {
    try {
      // Try multiple possible paths for the world data
      const possiblePaths = [
        './world-110m.json',
        '/world-110m.json',
        './public/world-110m.json',
        '/public/world-110m.json',
        '/dist/world-110m.json',
        './dist/world-110m.json'
      ];
      
      let response: Response | null = null;
      for (const path of possiblePaths) {
        try {
          response = await fetch(path);
          if (response.ok) {
            break;
          }
        } catch (e) {
          continue;
        }
      }
      
      if (!response || !response.ok) {
        throw new Error(`Could not load world data from any path`);
      }
      
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        throw new Error('Response is not JSON');
      }
      this.worldData = await response.json();
      
      
      this.render();
    } catch (error) {
      console.error('Failed to load world data:', error);
      // Create a simple fallback
      this.createFallbackMap();
    }
  }

  private createFallbackMap(): void {
    
    // Clear any existing content
    this.g.selectAll('*').remove();
    
    // Create a simple rectangular background as fallback
    this.g.append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', '#f8f9fa')
      .attr('stroke', '#dee2e6')
      .attr('stroke-width', 2);
    
    // Set up a simple projection for fallback
    this.projection
      .scale(100)
      .center([0, 0])
      .translate([this.width / 2, this.height / 2]);
    
    // Add a simple world map outline
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    
    // Simple continents as rectangles with better styling
    const continents = [
      { x: centerX - 80, y: centerY - 20, width: 40, height: 60, name: 'Europe', color: '#6c757d' },
      { x: centerX - 20, y: centerY - 30, width: 60, height: 50, name: 'Asia', color: '#6c757d' },
      { x: centerX - 100, y: centerY + 10, width: 50, height: 40, name: 'Americas', color: '#6c757d' },
      { x: centerX + 20, y: centerY + 20, width: 40, height: 30, name: 'Australia', color: '#6c757d' },
      { x: centerX - 30, y: centerY + 40, width: 80, height: 20, name: 'Africa', color: '#6c757d' }
    ];
    
    continents.forEach(continent => {
      this.g.append('rect')
        .attr('x', continent.x)
        .attr('y', continent.y)
        .attr('width', continent.width)
        .attr('height', continent.height)
        .attr('fill', continent.color)
        .attr('stroke', '#495057')
        .attr('stroke-width', 1)
        .style('opacity', 0.7);
    });
    
    // Add title
    this.g.append('text')
      .attr('x', centerX)
      .attr('y', centerY - 60)
      .attr('text-anchor', 'middle')
      .attr('fill', '#212529')
      .style('font-size', '18px')
      .style('font-weight', 'bold')
      .text('Migration Patterns Map');
    
    // Add status text
    this.g.append('text')
      .attr('x', centerX)
      .attr('y', centerY + 90)
      .attr('text-anchor', 'middle')
      .attr('fill', '#6c757d')
      .style('font-size', '14px')
      .text('Loading detailed world map...');
    
    // Add some sample migration points if we have patterns
    if (this.patterns && this.patterns.points.length > 0) {
      this.patterns.points.forEach((point, index) => {
        const angle = index * 2.399963229728653;
        const radius = 18 + (index % 9) * 10;
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius * 0.5;
        
        this.g.append('circle')
          .attr('cx', x)
          .attr('cy', y)
          .attr('r', Math.max(3, Math.min(8, point.count)))
          .attr('fill', '#007bff')
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 2)
          .style('opacity', 0.8);
      });
    }
    
  }

  public updatePatterns(patterns: MigrationPatterns): void {
    this.patterns = patterns;
    this.render();
  }

  private render(): void {
    // Clear existing content
    this.g.selectAll('*').remove();
    
    // Always render something - either world map or fallback
    if (this.worldData) {
      this.renderWorldMap();
      
      // Render migration data if available
      if (this.patterns) {
        this.renderMigrationData();
      }
    } else {
      this.createFallbackMap();
    }
  }

  private renderWorldMap(): void {
    if (!this.worldData) return;
    
    const colors = this.getThemeColors();
    
    // Use a simple fixed scale for now to ensure visibility
    this.projection
      .scale(100)
      .center([0, 0])
      .translate([this.width / 2, this.height / 2]);
    
    
    // Render countries - filter out very small features for performance
    const countriesGroup = this.g.append('g').attr('class', 'countries');
    const filteredFeatures = this.worldData.features.filter((feature: any) => {
      // Only render features that are large enough to be visible
      const bounds = this.path.bounds(feature);
      const width = bounds[1][0] - bounds[0][0];
      const height = bounds[1][1] - bounds[0][1];
      return width > 2 && height > 2; // Only render features larger than 2x2 pixels
    });
    
    countriesGroup.selectAll('path')
      .data(filteredFeatures)
      .enter()
      .append('path')
      .attr('d', (feature: any) => this.path(feature) || '')
      .attr('fill', colors.countries)
      .attr('stroke', colors.borders)
      .attr('stroke-width', 0.5)
      .style('opacity', 0.8);
    
  }

  private renderMigrationData(): void {
    if (!this.patterns) return;
    
    // Render migration routes
    this.renderRoutes();
    
    // Render migration points
    this.renderPoints();
  }

  private renderRoutes(): void {
    if (!this.patterns || this.patterns.routes.length === 0) return;
    
    const colors = this.getThemeColors();
    const routesGroup = this.g.append('g').attr('class', 'migration-routes');
    
    // Limit routes for performance (show top 30 most significant)
    const sortedRoutes = this.patterns.routes
      .sort((a, b) => b.count - a.count)
      .slice(0, 30);
    
    routesGroup.selectAll('path')
      .data(sortedRoutes)
      .enter()
      .append('path')
      .attr('d', (route: MigrationRoute) => {
        const from = this.projection(route.from.coordinates);
        const to = this.projection(route.to.coordinates);
        if (!from || !to) return '';

        const [x1, y1] = from;
        const [x2, y2] = to;
        
        if (!x1 || !y1 || !x2 || !y2) return '';
        
        // Use simple straight line for better performance
        return `M ${x1} ${y1} L ${x2} ${y2}`;
      })
      .attr('fill', 'none')
      .attr('stroke', colors.accent)
      .attr('stroke-width', (route: MigrationRoute) => Math.max(1, Math.min(5, route.count * 0.5)))
      .attr('stroke-opacity', 0.7)
      .attr('stroke-dasharray', '5,5');
  }

  private renderPoints(): void {
    if (!this.patterns || this.patterns.points.length === 0) return;
    
    const colors = this.getThemeColors();
    const pointsGroup = this.g.append('g').attr('class', 'migration-points');
    
    // Limit the number of points for performance (show top 50 most significant)
    const sortedPoints = this.patterns.points
      .sort((a, b) => b.count - a.count)
      .slice(0, 50);
    
    // Create point circles
    const circles = pointsGroup.selectAll('circle')
      .data(sortedPoints)
      .enter()
      .append('circle')
      .attr('cx', (point: MigrationPoint) => {
        const [x] = this.projection(point.coordinates) ?? [0, 0];
        return x || 0;
      })
      .attr('cy', (point: MigrationPoint) => {
        const [, y] = this.projection(point.coordinates) ?? [0, 0];
        return y || 0;
      })
      .attr('r', (point: MigrationPoint) => Math.max(2, Math.min(8, point.count * 1.5)))
      .attr('fill', colors.accent)
      .attr('stroke', colors.background)
      .attr('stroke-width', 1)
      .style('opacity', 0.8)
      .style('cursor', 'pointer');
    
    // Add simplified hover effects for better performance
    circles
      .on('mouseover', function(_event: MouseEvent, point: MigrationPoint) {
        d3.select(this)
          .style('opacity', 1)
          .attr('r', Math.max(3, Math.min(10, point.count * 1.8)));
      })
      .on('mouseout', function(_event: MouseEvent, point: MigrationPoint) {
        d3.select(this)
          .style('opacity', 0.8)
          .attr('r', Math.max(2, Math.min(8, point.count * 1.5)));
      });
    
    // Add tooltips
    const tooltip = d3.select('body').append('div')
      .attr('class', 'migration-tooltip')
      .style('position', 'fixed')
      .style('background', colors.background)
      .style('border', `1px solid ${colors.borders}`)
      .style('border-radius', '0.5rem')
      .style('padding', '0.5rem 0.75rem')
      .style('font-size', '0.875rem')
      .style('color', colors.text)
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 1000);
    
    circles
      .on('mouseover', function(event: MouseEvent, point: MigrationPoint) {
        tooltip
          .style('opacity', 1)
          .html(`
            <div style="font-weight: 600; margin-bottom: 0.25rem;">
              ${point.name}
            </div>
            <div style="color: ${colors.textSecondary}; font-size: 0.75rem;">
              ${point.count} ancestor${point.count !== 1 ? 's' : ''}
            </div>
            <div style="color: ${colors.textTertiary}; font-size: 0.75rem;">
              ${point.country}
            </div>
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 28) + 'px');
      })
      .on('mouseout', function() {
        tooltip.style('opacity', 0);
      });
  }

  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    
    this.svg
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`);
    
    this.projection.translate([this.width / 2, this.height / 2]);
    
    // Update zoom controls position if they exist
    const zoomControls = this.svg.select('.zoom-controls');
    if (!zoomControls.empty()) {
      zoomControls.attr('transform', `translate(${this.width - 45}, 10)`);
    }
    
    this.render();
  }

  public destroy(): void {
    // Clean up tooltips
    d3.selectAll('.migration-tooltip').remove();
    
    // Remove SVG
    this.svg.remove();
  }
}
