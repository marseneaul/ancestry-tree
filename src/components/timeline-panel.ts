import { getCountry } from "../utils/utils";
import { cleanUnknown } from "../utils/helpers";

export interface TimelinePerson {
  year: number;
  name: string;
  birthDate: string;
  deathDate?: string;
  deathPlace?: string;
  birthPlace?: string;
  sex?: string;
  depth: number;
  country: string;
  imageUrl?: string;
  largeImageUrl?: string;
  story?: string;
}

export interface TimelinePanelData {
  root: any; // d3.HierarchyNode<Person>
  onPersonSelect?: (person: TimelinePerson, depth: number) => void;
}

export class TimelinePanel {
  private container: HTMLElement;
  private data: TimelinePanelData;
  private timelinePeople: TimelinePerson[] = [];
  private hasInteractionListener = false;

  constructor(container: HTMLElement, data: TimelinePanelData) {
    this.container = container;
    this.data = data;
  }

  /**
   * Initialize the timeline panel with data
   */
  public initialize(): void {
    this.renderTimeline();
    this.setupInteractions();
  }

  /**
   * Update the timeline panel with new data
   */
  public updateData(newData: TimelinePanelData): void {
    this.data = newData;
    this.renderTimeline();
  }

  /**
   * Render the timeline panel
   */
  private renderTimeline(): void {
    const allNodes: any[] = this.data.root.descendants();
    
    // Extract birth years and create timeline data
    const timelineData: TimelinePerson[] = allNodes
      .map((node: any): TimelinePerson | null => {
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
          deathPlace: node.data.deathPlace,
          birthPlace: node.data.birthPlace,
          sex: node.data.sex,
          depth: node.depth,
          country: getCountry(node.data.birthPlace),
          imageUrl: node.data.imageUrl,
          largeImageUrl: (node.data as any).largeImageUrl,
          story: node.data.story
        };
      })
      .filter((item): item is TimelinePerson => item !== null)
      .sort((a, b) => b.year - a.year);
    this.timelinePeople = timelineData;

    // Group by decade for better visualization
    const decadeGroups = new Map<number, TimelinePerson[]>();
    timelineData.forEach((item: TimelinePerson) => {
      const decade = Math.floor(item.year / 10) * 10;
      if (!decadeGroups.has(decade)) {
        decadeGroups.set(decade, []);
      }
      decadeGroups.get(decade)!.push(item!);
    });

    // Create timeline HTML
    this.container.innerHTML = `
      <div class="timeline-title">Family Timeline</div>
      <div class="timeline-content">
        ${Array.from(decadeGroups.entries())
          .sort((a, b) => b[0] - a[0])
          .map(([decade, people]) => `
            <div class="timeline-decade">
              <div class="decade-header">${decade}s</div>
              <div class="decade-people">
                ${people.slice(0, 10).map(person => {
                  const personIndex = this.timelinePeople.indexOf(person);
                  const cleanName = cleanUnknown(person.name);
                  const cleanBirthPlace = cleanUnknown(person.birthPlace);
                  return `
                  <div class="timeline-person" data-person-index="${personIndex}">
                    <div class="person-year">${person.year}</div>
                    <div class="person-name">${cleanName || "Name not available"}</div>
                    ${cleanBirthPlace ? `<div class="person-place">${cleanBirthPlace}</div>` : ""}
                    <div class="person-country">${person.country}</div>
                  </div>
                `;
                }).join('')}
                ${people.length > 10 ? `<div class="more-people">+${people.length - 10} more</div>` : ''}
              </div>
            </div>
          `).join('')}
      </div>
    `;
  }

  private setupInteractions(): void {
    if (this.hasInteractionListener) return;

    this.container.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const personEl = target.closest('.timeline-person') as HTMLElement | null;
      if (!personEl) return;

      const personIndex = Number(personEl.dataset.personIndex);
      const person = this.timelinePeople[personIndex];
      if (person) {
        this.data.onPersonSelect?.(person, person.depth);
      }
    });

    this.hasInteractionListener = true;
  }
}
