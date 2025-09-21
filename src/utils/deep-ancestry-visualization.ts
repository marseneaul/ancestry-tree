import { Person } from '../interfaces/person';
import { DeepAncestor, TimePeriod } from '../interfaces/deep-ancestry';
import { TIME_PERIODS, getTimePeriodForYear, NEANDERTHAL_ADMIXTURE_INFO } from '../data/deep-ancestry-data';
import { getLeaves } from './utils';

export interface AncestryPath {
  id: string;
  name: string;
  timePeriod: TimePeriod;
  startYear: number;
  endYear: number;
  color: string;
  width: number; // Visual width representing population size
  isNeanderthal?: boolean;
  description: string;
}

export interface DeepAncestryVisualization {
  paths: AncestryPath[];
  neanderthalAdmixture?: {
    year: number;
    percentage: number;
    description: string;
  };
}

export function createDeepAncestryVisualization(
  rootPerson: Person,
  isNonAfrican: boolean = true
): DeepAncestryVisualization {
  const paths: AncestryPath[] = [];
  
  // Create representative paths for different time periods
  const timePeriods = TIME_PERIODS.filter(period => period.startYear < 0); // Only prehistoric periods
  
  timePeriods.forEach((period, index) => {
    const path: AncestryPath = {
      id: `path-${period.name.toLowerCase().replace(/\s+/g, '-')}`,
      name: period.name,
      timePeriod: period,
      startYear: period.startYear,
      endYear: period.endYear,
      color: period.color,
      width: Math.max(20, 100 - (index * 10)), // Wider for more recent periods
      description: period.description
    };
    
    paths.push(path);
  });
  
  // Add Neanderthal admixture if relevant
  let neanderthalAdmixture;
  if (isNonAfrican) {
    neanderthalAdmixture = {
      year: NEANDERTHAL_ADMIXTURE_INFO.year,
      percentage: 2.5, // Average Neanderthal contribution
      description: NEANDERTHAL_ADMIXTURE_INFO.description
    };
  }
  
  return {
    paths,
    neanderthalAdmixture
  };
}

export function renderDeepAncestryPaths(
  svg: any,
  width: number,
  height: number,
  visualization: DeepAncestryVisualization
): void {
  // Clear existing deep ancestry paths
  svg.selectAll('.deep-ancestry-path').remove();
  svg.selectAll('.deep-ancestry-label').remove();
  svg.selectAll('.neanderthal-admixture').remove();
  
  const pathsGroup = svg.append('g').attr('class', 'deep-ancestry-paths');
  
  // Create vertical timeline
  const timelineX = width - 200;
  const timelineStartY = 100;
  const timelineEndY = height - 100;
  const timelineHeight = timelineEndY - timelineStartY;
  
  // Add timeline background
  pathsGroup.append('rect')
    .attr('class', 'timeline-background')
    .attr('x', timelineX - 10)
    .attr('y', timelineStartY)
    .attr('width', 20)
    .attr('height', timelineHeight)
    .attr('fill', 'var(--bg-tertiary)')
    .attr('stroke', 'var(--border-secondary)')
    .attr('rx', 10);
  
  // Render each time period as a colored tube
  visualization.paths.forEach((path, index) => {
    const pathY = timelineStartY + (index * (timelineHeight / visualization.paths.length));
    const pathHeight = timelineHeight / visualization.paths.length;
    
    // Create the tube
    const tube = pathsGroup.append('rect')
      .attr('class', 'deep-ancestry-path')
      .attr('x', timelineX - path.width / 2)
      .attr('y', pathY)
      .attr('width', path.width)
      .attr('height', pathHeight)
      .attr('fill', path.color)
      .attr('opacity', 0.7)
      .attr('rx', 5);
    
    // Add hover effect
    tube.on('mouseover', function() {
      showTimePeriodTooltip(path, this);
    }).on('mouseout', function() {
      hideTimePeriodTooltip();
    });
    
    // Add label
    pathsGroup.append('text')
      .attr('class', 'deep-ancestry-label')
      .attr('x', timelineX + 30)
      .attr('y', pathY + pathHeight / 2)
      .attr('dy', '0.35em')
      .attr('fill', 'var(--text-primary)')
      .attr('font-size', '12px')
      .attr('font-weight', '500')
      .text(path.name);
    
    // Add year range
    pathsGroup.append('text')
      .attr('class', 'deep-ancestry-year')
      .attr('x', timelineX + 30)
      .attr('y', pathY + pathHeight / 2 + 15)
      .attr('dy', '0.35em')
      .attr('fill', 'var(--text-secondary)')
      .attr('font-size', '10px')
      .text(`${Math.abs(path.startYear)} - ${Math.abs(path.endYear)} BCE`);
  });
  
  // Add Neanderthal admixture indicator
  if (visualization.neanderthalAdmixture) {
    const neanderthalY = timelineStartY + (timelineHeight * 0.3); // Position in upper third
    
    pathsGroup.append('circle')
      .attr('class', 'neanderthal-admixture')
      .attr('cx', timelineX)
      .attr('cy', neanderthalY)
      .attr('r', 8)
      .attr('fill', '#D2691E')
      .attr('stroke', '#8B4513')
      .attr('stroke-width', 2);
    
    pathsGroup.append('text')
      .attr('class', 'neanderthal-label')
      .attr('x', timelineX + 15)
      .attr('y', neanderthalY)
      .attr('dy', '0.35em')
      .attr('fill', 'var(--text-primary)')
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .text('Neanderthal Admixture');
    
    pathsGroup.append('text')
      .attr('class', 'neanderthal-percentage')
      .attr('x', timelineX + 15)
      .attr('y', neanderthalY + 15)
      .attr('dy', '0.35em')
      .attr('fill', 'var(--text-secondary)')
      .attr('font-size', '10px')
      .text(`${visualization.neanderthalAdmixture.percentage}% DNA`);
  }
}

function showTimePeriodTooltip(path: AncestryPath, element: any): void {
  hideTimePeriodTooltip(); // Remove any existing tooltip
  
  const tooltip = document.createElement('div');
  tooltip.className = 'deep-ancestry-tooltip';
  tooltip.innerHTML = `
    <div class="tooltip-header" style="background-color: ${path.color}; color: white; padding: 8px; border-radius: 4px 4px 0 0;">
      <strong>${path.name}</strong>
    </div>
    <div class="tooltip-content" style="padding: 12px; background: var(--bg-secondary); border: 1px solid var(--border-secondary); border-radius: 0 0 4px 4px;">
      <p style="margin: 0 0 8px 0; font-size: 14px;">${path.description}</p>
      <p style="margin: 0; font-size: 12px; color: var(--text-secondary);">
        ${Math.abs(path.startYear)} - ${Math.abs(path.endYear)} BCE
      </p>
    </div>
  `;
  
  document.body.appendChild(tooltip);
  
  // Position tooltip near the element
  const rect = element.getBoundingClientRect();
  tooltip.style.position = 'absolute';
  tooltip.style.left = `${rect.left - 200}px`;
  tooltip.style.top = `${rect.top}px`;
  tooltip.style.zIndex = '10000';
  tooltip.style.maxWidth = '200px';
  tooltip.style.boxShadow = 'var(--shadow-heavy)';
}

function hideTimePeriodTooltip(): void {
  const existingTooltip = document.querySelector('.deep-ancestry-tooltip');
  if (existingTooltip) {
    existingTooltip.remove();
  }
}
