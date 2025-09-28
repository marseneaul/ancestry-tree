// src/components/search.ts
import * as d3 from "d3";

/**
 * Creates and sets up the search functionality including dropdown and event handlers
 */
export function setupSearchFunctionality(
  searchInput: HTMLInputElement,
  searchClearBtn: HTMLElement,
  searchResultsCount: HTMLElement,
  root: any, // D3 hierarchy root
  allNames: string[],
  svg: any,  // D3 SVG selection
  g: any,    // D3 group selection
  zoom: any, // D3 zoom behavior
  width: number,
  height: number
): HTMLElement {
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
    const matchingNodes = root.descendants().filter((d: any) => 
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
      .classed("highlighted", (d: any) => query && ((d as any).data.name?.toLowerCase().includes(query) ?? false));
  });

  // On selection (change event fires when picking from datalist)
  searchInput.addEventListener("change", (e) => {
    const selectedName = (e.target as HTMLInputElement).value;
    if (!selectedName) return;

    // Find the node with exact name match (assume unique names; if not, take first)
    const selectedNode = root.descendants().find((d: any) => d.data.name === selectedName);
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

  return dropdown;
}

/**
 * Sets up enhanced keyboard shortcuts and search functionality
 */
export function setupSearchKeyboardShortcuts(searchInput: HTMLInputElement): void {
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
}

/**
 * Sets up enhanced search input interactions
 */
export function setupSearchInputInteractions(
  searchInput: HTMLInputElement,
  searchClearBtn: HTMLElement
): void {
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
}
