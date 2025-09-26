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
    this.svg = d3.select(container)
      .append('svg')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`)
      .style('background', 'var(--bg-primary)')
      .style('border-radius', 'var(--radius-lg)')
      .style('box-shadow', '0 4px 12px var(--shadow-light)');
    
    // Create main group
    this.g = this.svg.append('g');
    
    // Set up projection (Mercator)
    this.projection = d3.geoMercator()
      .scale(1)
      .translate([this.width / 2, this.height / 2]);
    
    this.path = d3.geoPath().projection(this.projection);
    
    // Load world data
    this.loadWorldData();
  }

  private async loadWorldData(): Promise<void> {
    try {
      const response = await fetch('./world-110m.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
    // Create a simple rectangular background as fallback
    this.g.append('rect')
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('fill', 'var(--bg-tertiary)')
      .attr('stroke', 'var(--border-primary)')
      .attr('stroke-width', 1);
    
    // Set up a simple projection for fallback
    this.projection
      .scale(100)
      .center([0, 0])
      .translate([this.width / 2, this.height / 2]);
    
    // Add a simple world map outline
    const centerX = this.width / 2;
    const centerY = this.height / 2;
    
    // Simple continents as rectangles
    const continents = [
      { x: centerX - 80, y: centerY - 20, width: 40, height: 60, name: 'Europe' },
      { x: centerX - 20, y: centerY - 30, width: 60, height: 50, name: 'Asia' },
      { x: centerX - 100, y: centerY + 10, width: 50, height: 40, name: 'Americas' },
      { x: centerX + 20, y: centerY + 20, width: 40, height: 30, name: 'Australia' },
      { x: centerX - 30, y: centerY + 40, width: 80, height: 20, name: 'Africa' }
    ];
    
    continents.forEach(continent => {
      this.g.append('rect')
        .attr('x', continent.x)
        .attr('y', continent.y)
        .attr('width', continent.width)
        .attr('height', continent.height)
        .attr('fill', 'var(--bg-quaternary)')
        .attr('stroke', 'var(--border-secondary)')
        .attr('stroke-width', 0.5)
        .style('opacity', 0.8);
    });
    
    this.g.append('text')
      .attr('x', centerX)
      .attr('y', centerY - 50)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-primary)')
      .style('font-size', '16px')
      .style('font-weight', 'var(--font-weight-semibold)')
      .text('Migration Patterns Map');
    
    this.g.append('text')
      .attr('x', centerX)
      .attr('y', centerY + 80)
      .attr('text-anchor', 'middle')
      .attr('fill', 'var(--text-secondary)')
      .style('font-size', '12px')
      .text('World map data loading...');
  }

  public updatePatterns(patterns: MigrationPatterns): void {
    this.patterns = patterns;
    this.render();
  }

  private render(): void {
    // Clear existing content
    this.g.selectAll('*').remove();
    
    // Render world map if available
    if (this.worldData) {
      this.renderWorldMap();
    } else {
      this.createFallbackMap();
    }
    
    // Render migration data if available
    if (this.patterns) {
      this.renderMigrationData();
    }
  }

  private renderWorldMap(): void {
    if (!this.worldData) return;
    
    // Calculate appropriate scale and translation
    const { center, zoom } = this.getMapTransform();
    
    this.projection
      .scale(zoom * 100)
      .center(center)
      .translate([this.width / 2, this.height / 2]);
    
    // Render countries
    this.g.append('g')
      .attr('class', 'countries')
      .selectAll('path')
      .data(this.worldData.features)
      .enter()
      .append('path')
      .attr('d', this.path)
      .attr('fill', 'var(--bg-quaternary)')
      .attr('stroke', 'var(--border-secondary)')
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
    
    const routesGroup = this.g.append('g').attr('class', 'migration-routes');
    
    routesGroup.selectAll('path')
      .data(this.patterns.routes)
      .enter()
      .append('path')
      .attr('d', (route: MigrationRoute) => {
        const [x1, y1] = this.projection(route.from.coordinates);
        const [x2, y2] = this.projection(route.to.coordinates);
        
        if (!x1 || !y1 || !x2 || !y2) return '';
        
        // Create curved path
        const midX = (x1 + x2) / 2;
        const midY = (y1 + y2) / 2;
        const controlY = midY - Math.abs(x2 - x1) * 0.3;
        
        return `M ${x1} ${y1} Q ${midX} ${controlY} ${x2} ${y2}`;
      })
      .attr('fill', 'none')
      .attr('stroke', 'var(--accent-primary)')
      .attr('stroke-width', (route: MigrationRoute) => Math.max(1, Math.min(5, route.count * 0.5)))
      .attr('stroke-opacity', 0.7)
      .attr('stroke-dasharray', '5,5')
      .style('filter', 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))');
  }

  private renderPoints(): void {
    if (!this.patterns || this.patterns.points.length === 0) return;
    
    const pointsGroup = this.g.append('g').attr('class', 'migration-points');
    
    // Create point circles
    const circles = pointsGroup.selectAll('circle')
      .data(this.patterns.points)
      .enter()
      .append('circle')
      .attr('cx', (point: MigrationPoint) => {
        const [x] = this.projection(point.coordinates);
        return x || 0;
      })
      .attr('cy', (point: MigrationPoint) => {
        const [, y] = this.projection(point.coordinates);
        return y || 0;
      })
      .attr('r', (point: MigrationPoint) => Math.max(3, Math.min(12, point.count * 2)))
      .attr('fill', 'var(--accent-primary)')
      .attr('stroke', 'var(--bg-secondary)')
      .attr('stroke-width', 2)
      .style('filter', 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))')
      .style('cursor', 'pointer');
    
    // Add hover effects
    circles
      .on('mouseover', function(event: MouseEvent, point: MigrationPoint) {
        d3.select(this)
          .attr('r', Math.max(5, Math.min(15, point.count * 2.5)))
          .attr('fill', 'var(--accent-hover)');
      })
      .on('mouseout', function(event: MouseEvent, point: MigrationPoint) {
        d3.select(this)
          .attr('r', Math.max(3, Math.min(12, point.count * 2)))
          .attr('fill', 'var(--accent-primary)');
      });
    
    // Add tooltips
    const tooltip = d3.select('body').append('div')
      .attr('class', 'migration-tooltip')
      .style('position', 'absolute')
      .style('background', 'var(--bg-secondary)')
      .style('border', '1px solid var(--border-primary)')
      .style('border-radius', 'var(--radius-md)')
      .style('padding', 'var(--space-2) var(--space-3)')
      .style('font-size', 'var(--font-size-sm)')
      .style('color', 'var(--text-primary)')
      .style('box-shadow', '0 4px 12px var(--shadow-medium)')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('z-index', 1000);
    
    circles
      .on('mouseover', function(event: MouseEvent, point: MigrationPoint) {
        tooltip
          .style('opacity', 1)
          .html(`
            <div style="font-weight: var(--font-weight-semibold); margin-bottom: var(--space-1);">
              ${point.name}
            </div>
            <div style="color: var(--text-secondary); font-size: var(--font-size-xs);">
              ${point.count} ancestor${point.count !== 1 ? 's' : ''}
            </div>
            <div style="color: var(--text-tertiary); font-size: var(--font-size-xs);">
              ${point.country}
            </div>
          `)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px');
      })
      .on('mouseout', function() {
        tooltip.style('opacity', 0);
      });
  }

  private getMapTransform(): { center: [number, number]; zoom: number } {
    if (!this.patterns || this.patterns.points.length === 0) {
      return { center: [0, 0], zoom: 1 };
    }
    
    // Calculate bounds
    const validPoints = this.patterns.points.filter(p => p.coordinates[0] !== 0 || p.coordinates[1] !== 0);
    
    if (validPoints.length === 0) {
      return { center: [0, 0], zoom: 1 };
    }
    
    const lngs = validPoints.map(p => p.coordinates[0]);
    const lats = validPoints.map(p => p.coordinates[1]);
    
    const bounds = {
      west: Math.min(...lngs),
      east: Math.max(...lngs),
      south: Math.min(...lats),
      north: Math.max(...lats)
    };
    
    // Add padding
    const padding = 5;
    const center: [number, number] = [
      (bounds.west + bounds.east) / 2,
      (bounds.south + bounds.north) / 2
    ];
    
    // Calculate zoom based on bounds
    const latRange = bounds.north - bounds.south + padding * 2;
    const lngRange = bounds.east - bounds.west + padding * 2;
    const maxRange = Math.max(latRange, lngRange);
    
    let zoom = 1;
    if (maxRange < 10) zoom = 3;
    else if (maxRange < 20) zoom = 2.5;
    else if (maxRange < 40) zoom = 2;
    else if (maxRange < 80) zoom = 1.5;
    
    return { center, zoom };
  }

  public resize(width: number, height: number): void {
    this.width = width;
    this.height = height;
    
    this.svg
      .attr('width', this.width)
      .attr('height', this.height)
      .attr('viewBox', `0 0 ${this.width} ${this.height}`);
    
    this.projection.translate([this.width / 2, this.height / 2]);
    
    this.render();
  }

  public destroy(): void {
    // Clean up tooltips
    d3.selectAll('.migration-tooltip').remove();
    
    // Remove SVG
    this.svg.remove();
  }
}
