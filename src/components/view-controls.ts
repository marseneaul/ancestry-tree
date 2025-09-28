// src/components/view-controls.ts
import * as d3 from "d3";

/**
 * Creates the view controls component with zoom and navigation buttons
 */
export function createViewControls(): HTMLElement {
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
  return viewControls;
}

/**
 * Sets up event listeners for view control buttons
 * This function will be called after the D3 visualization is initialized
 */
export function setupViewControlListeners(
  zoomInBtn: HTMLElement,
  zoomOutBtn: HTMLElement,
  fitScreenBtn: HTMLElement,
  resetViewBtn: HTMLElement,
  zoom: any, // D3 zoom behavior
  svg: any,  // D3 SVG selection
  g: any     // D3 group selection
): void {
  // Zoom In
  zoomInBtn.addEventListener("click", () => {
    svg.transition().call(zoom.scaleBy, 1.5);
  });

  // Zoom Out
  zoomOutBtn.addEventListener("click", () => {
    svg.transition().call(zoom.scaleBy, 1 / 1.5);
  });

  // Fit to Screen
  fitScreenBtn.addEventListener("click", () => {
    const bounds = g.node().getBBox();
    const fullWidth = svg.node().clientWidth;
    const fullHeight = svg.node().clientHeight;
    const width = bounds.width;
    const height = bounds.height;
    const midX = bounds.x + width / 2;
    const midY = bounds.y + height / 2;
    
    if (width === 0 || height === 0) return;
    
    const scale = 0.8 / Math.max(width / fullWidth, height / fullHeight);
    const translate = [fullWidth / 2 - scale * midX, fullHeight / 2 - scale * midY];
    
    svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity.translate(translate[0], translate[1]).scale(scale));
  });

  // Reset View
  resetViewBtn.addEventListener("click", () => {
    svg.transition()
      .duration(750)
      .call(zoom.transform, d3.zoomIdentity);
  });
}
