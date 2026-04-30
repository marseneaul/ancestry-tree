// src/visualization/tooltips.ts
import { Person } from "../interfaces/person";
import { getCountry, countryColors } from "../utils/utils";

export interface TooltipConfig {
  scale?: number;
  zIndex?: number;
  transitionDuration?: number;
}

export interface TooltipState {
  currentTooltip: HTMLElement | null;
  currentPerson: Person | null;
  tooltipTimeout: number | null;
}

export class TooltipSystem {
  private config: TooltipConfig;
  private state: TooltipState;

  constructor(config: TooltipConfig = {}) {
    this.config = {
      scale: 1,
      zIndex: 10000,
      transitionDuration: 200,
      ...config
    };
    this.state = {
      currentTooltip: null,
      currentPerson: null,
      tooltipTimeout: null
    };
  }

  /**
   * Show tooltip for a person
   */
  showPersonTooltip(person: Person, depth: number, element: any, event?: any): void {
    this.hidePersonTooltip(); // Remove any existing tooltip
    this.state.currentPerson = person;
    this.createTooltip(person, depth, element, event);
  }

  /**
   * Hide the current tooltip
   */
  hidePersonTooltip(): void {
    // Clear any pending tooltip timeout
    if (this.state.tooltipTimeout) {
      clearTimeout(this.state.tooltipTimeout);
      this.state.tooltipTimeout = null;
    }
    
    if (this.state.currentTooltip) {
      // Fade out and remove
      this.state.currentTooltip.style.opacity = '0';
      setTimeout(() => {
        if (this.state.currentTooltip && this.state.currentTooltip.parentNode) {
          this.state.currentTooltip.parentNode.removeChild(this.state.currentTooltip);
        }
        this.state.currentTooltip = null;
        this.state.currentPerson = null;
      }, this.config.transitionDuration);
    }
  }

  /**
   * Create and position tooltip
   */
  private createTooltip(person: Person, depth: number, _element: any, event?: any): void {
    const tooltip = document.createElement('div');
    tooltip.className = 'person-tooltip';
    this.state.currentTooltip = tooltip;
    
    const initials = this.getInitials(person?.name);
    const isDeceased = person.deathDate !== "N/A";
    const age = isDeceased 
      ? this.calculateAgeAtDate(person.birthDate ?? "", person.deathDate ?? "") 
      : this.calculateAgeAtDate(person.birthDate ?? "");
    
    // Get country for color coding
    const country = getCountry(person.birthPlace);
    const countryColor = countryColors[country] || "#808080";
    
    // Calculate relationship
    const relation = this.calculateRelationship(depth, person.sex ?? "Unknown");
    
    // Clean up data for display
    const cleanName = this.cleanUnknown(person.name);
    const cleanBirthDate = this.cleanUnknown(person.birthDate ?? "");
    const cleanBirthPlace = this.cleanUnknown(person.birthPlace ?? "");
    const cleanDeathDate = this.cleanUnknown(person.deathDate ?? "");
    const cleanStory = this.cleanUnknown(person.story ?? "");
    
    // Calculate DNA contribution
    const dnaContribution = depth === 0 ? 100 : (100 / Math.pow(2, depth));
    
    // Determine text color for better readability on country background
    const isLight = this.isColorLight(countryColor);
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
    tooltip.style.zIndex = this.config.zIndex!.toString();
    tooltip.style.pointerEvents = 'none';
    tooltip.style.opacity = '0';
    tooltip.style.transition = `opacity ${this.config.transitionDuration! / 1000}s ease`;
    
    // Add to DOM
    document.body.appendChild(tooltip);
    
    // Position tooltip based on mouse coordinates
    this.positionTooltip(tooltip, event);
    
    // Show tooltip
    requestAnimationFrame(() => {
      if (this.state.currentTooltip) {
        this.state.currentTooltip.style.opacity = '1';
      }
    });
  }

  /**
   * Position tooltip based on mouse coordinates
   */
  private positionTooltip(tooltip: HTMLElement, event?: any): void {
    if (event && event.clientX !== undefined && event.clientY !== undefined) {
      // Account for the CSS zoom transform
      const scaledX = event.clientX / this.config.scale!;
      const scaledY = event.clientY / this.config.scale!;
      
      // Position tooltip upper-left corner to the right of mouse cursor
      let left = scaledX + 20; // 20px gap from cursor (scaled)
      let top = scaledY - 15;  // 15px above cursor (scaled)
      
      // Get tooltip dimensions after it's in the DOM
      const tooltipRect = tooltip.getBoundingClientRect();
      
      // Adjust if tooltip would go off screen (use scaled viewport)
      const scaledViewportWidth = window.innerWidth / this.config.scale!;
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
  }

  /**
   * Get initials from a name
   */
  private getInitials(name: string): string {
    if (!name || name === "Unknown") return "?";
    const words = name.trim().split(/\s+/);
    if (words.length === 1) {
      return words[0].charAt(0).toUpperCase();
    }
    return (words[0].charAt(0) + words[words.length - 1].charAt(0)).toUpperCase();
  }

  /**
   * Calculate age at date
   */
  private calculateAgeAtDate(birthDate: string, deathDate?: string): number | null {
    if (!birthDate || birthDate === "N/A") return null;
    
    const birth = new Date(birthDate);
    const end = deathDate && deathDate !== "N/A" ? new Date(deathDate) : new Date();
    
    if (isNaN(birth.getTime()) || isNaN(end.getTime())) return null;
    
    let age = end.getFullYear() - birth.getFullYear();
    const monthDiff = end.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && end.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  }

  /**
   * Calculate relationship based on depth and sex
   */
  private calculateRelationship(depth: number, sex: string): string {
    if (depth === 0) {
      return "You";
    } else if (depth === 1) {
      return sex === "Female" ? "Mother" : "Father";
    } else if (depth === 2) {
      return sex === "Female" ? "Grandmother" : "Grandfather";
    } else {
      const ordinal = this.getOrdinalFromNumber(depth - 2);
      const greats = `${depth === 3 ? "" : ordinal + " "}Great-`;
      return `${greats}Grand${sex === "Female" ? "mother" : "father"}`;
    }
  }

  /**
   * Get ordinal number (1st, 2nd, 3rd, etc.)
   */
  private getOrdinalFromNumber(num: number): string {
    const suffixes = ["th", "st", "nd", "rd"];
    const value = num % 100;
    return num + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
  }

  /**
   * Clean unknown values
   */
  private cleanUnknown(value: string): string {
    if (!value || value === "N/A" || value === "Unknown" || value === "?") {
      return "";
    }
    return value;
  }

  /**
   * Check if a color is light
   */
  private isColorLight(color: string): boolean {
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    
    // Calculate luminance
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5;
  }

  /**
   * Get current tooltip state
   */
  getState(): TooltipState {
    return this.state;
  }

  /**
   * Clean up resources
   */
  destroy(): void {
    this.hidePersonTooltip();
  }
}
