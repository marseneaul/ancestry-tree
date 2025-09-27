import { AncestralGroup, AncestralTube } from '../interfaces/ancestral-tubes';
// import { ANCESTRAL_GROUPS, EUROPEAN_SUBGROUPS } from '../data/ancestral-groups';

export function detectAncestralGroups(nodes: any[]): AncestralGroup[] {
  // TODO: This function is temporarily disabled due to missing ancestral-groups.ts file
  return [];
}

export function createAncestralTubes(groups: AncestralGroup[]): AncestralTube[] {
  const tubes: AncestralTube[] = [];
  
  groups.forEach(group => {
    if (group.parentGroup) {
      const parentGroup = groups.find(g => g.id === group.parentGroup);
      if (parentGroup) {
        const tube = createTubeBetweenGroups(parentGroup, group);
        tubes.push(tube);
      }
    }
  });

  return tubes;
}

function createTubeBetweenGroups(parent: AncestralGroup, child: AncestralGroup): AncestralTube {
  // Create a flowing horizontal connection between the groups
  const parentRight = {
    x: parent.bounds.x + parent.bounds.width,
    y: parent.bounds.y + parent.bounds.height / 2
  };
  
  const childLeft = {
    x: child.bounds.x,
    y: child.bounds.y + child.bounds.height / 2
  };

  // Create a smooth horizontal flowing path
  const midX = (parentRight.x + childLeft.x) / 2;
  
  // Create a flowing horizontal path
  const path = `M ${parentRight.x} ${parentRight.y}
                Q ${midX} ${parentRight.y - 50} ${childLeft.x} ${childLeft.y}`;
  
  return {
    id: `${parent.id}-to-${child.id}`,
    fromGroup: parent.id,
    toGroup: child.id,
    width: Math.max(8, child.dnaContribution / 2), // Scale width based on DNA contribution
    color: child.color,
    path,
    animationDelay: Math.random() * 1000 // Random delay for staggered animation
  };
}

export function createNeanderthalAdmixture(): { percentage: number; entryPoint: string; color: string } {
  return {
    percentage: 1.5, // Average Neanderthal admixture in non-Africans
    entryPoint: 'eurasian', // Neanderthal admixture entered through Eurasian populations
    color: '#92400e' // Amber-800
  };
}


function getCountryFromNode(node: any): string {
  // Extract country from birth place or use a default
  const birthPlace = node.data?.birthPlace || '';
  return getCountry(birthPlace);
}

function getCountry(place: string): string {
  if (!place || place === "N/A") return "Unknown";
  
  const placeLower = place.toLowerCase();
  
  if (placeLower.includes('canada') || placeLower.includes('montreal') || placeLower.includes('quebec')) return 'Canada';
  if (placeLower.includes('germany') || placeLower.includes('deutschland')) return 'Germany';
  if (placeLower.includes('france') || placeLower.includes('paris')) return 'France';
  if (placeLower.includes('ireland') || placeLower.includes('dublin')) return 'Ireland';
  if (placeLower.includes('scotland') || placeLower.includes('edinburgh')) return 'United Kingdom';
  if (placeLower.includes('england') || placeLower.includes('london')) return 'United Kingdom';
  if (placeLower.includes('italy') || placeLower.includes('rome')) return 'Italy';
  if (placeLower.includes('spain') || placeLower.includes('madrid')) return 'Spain';
  if (placeLower.includes('netherlands') || placeLower.includes('amsterdam')) return 'Netherlands';
  if (placeLower.includes('belgium') || placeLower.includes('brussels')) return 'Belgium';
  if (placeLower.includes('luxembourg')) return 'Luxembourg';
  if (placeLower.includes('norway') || placeLower.includes('oslo')) return 'Norway';
  if (placeLower.includes('switzerland') || placeLower.includes('zurich')) return 'Switzerland';
  if (placeLower.includes('austria') || placeLower.includes('vienna')) return 'Austria';
  if (placeLower.includes('hungary') || placeLower.includes('budapest')) return 'Hungary';
  if (placeLower.includes('united states') || placeLower.includes('usa') || placeLower.includes('america')) return 'United States';
  
  return 'Unknown';
}

function getGroupIdFromCountry(country: string): string {
  // Map countries to ancestral groups
  switch (country) {
    case 'Canada':
      return 'french-canadian'; // Default for Canadian entries
    case 'Germany':
    case 'Austria':
    case 'Switzerland':
      return 'german';
    case 'Ireland':
      return 'irish';
    case 'United Kingdom':
      return 'scottish'; // Default for UK entries
    case 'France':
    case 'Italy':
    case 'Spain':
    case 'Netherlands':
    case 'Belgium':
    case 'Luxembourg':
    case 'Norway':
    case 'Hungary':
      return 'european';
    case 'United States':
      return 'indigenous-american'; // Could be more nuanced
    default:
      return 'european'; // Default fallback
  }
}
