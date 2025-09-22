import { AncestralGroup, AncestralTube, DeepAncestryVisualization } from '../interfaces/ancestral-tubes';
import { ANCESTRAL_GROUPS, EUROPEAN_SUBGROUPS } from '../data/ancestral-groups';

export function detectAncestralGroups(nodes: any[]): AncestralGroup[] {
  const groups: AncestralGroup[] = [];
  const groupMap = new Map<string, any[]>();

  // Group nodes by their ancestral origin
  nodes.forEach(node => {
    const country = getCountryFromNode(node);
    const groupId = getGroupIdFromCountry(country);
    
    if (!groupMap.has(groupId)) {
      groupMap.set(groupId, []);
    }
    groupMap.get(groupId)!.push(node);
  });

  // Create ancestral groups
  groupMap.forEach((nodeList, groupId) => {
    if (nodeList.length === 0) return;

    const groupConfig = ANCESTRAL_GROUPS.find(g => g.id === groupId);
    if (!groupConfig) return;

    // Calculate bounds
    const xCoords = nodeList.map(n => n.x).filter(x => x !== undefined);
    const yCoords = nodeList.map(n => n.y).filter(y => y !== undefined);
    
    if (xCoords.length === 0 || yCoords.length === 0) return;

    const minX = Math.min(...xCoords);
    const maxX = Math.max(...xCoords);
    const minY = Math.min(...yCoords);
    const maxY = Math.max(...yCoords);

    // Calculate DNA contribution
    const dnaContribution = nodeList.reduce((sum, node) => {
      return sum + (100 / Math.pow(2, node.depth));
    }, 0);

    groups.push({
      id: groupId,
      name: groupConfig.name,
      color: groupConfig.color,
      nodes: nodeList,
      bounds: {
        x: minX,
        y: minY,
        width: maxX - minX,
        height: maxY - minY
      },
      parentGroup: groupConfig.parentGroup,
      childGroups: groupConfig.childGroups,
      dnaContribution
    });
  });

  return groups;
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

export function createDeepAncestryVisualization(nodes: any[]): DeepAncestryVisualization {
  // Create a deep ancestry timeline that extends far beyond the genealogical data
  const groups = createDeepAncestryTimeline(nodes);
  const tubes = createAncestralTubes(groups);
  const neanderthalAdmixture = createNeanderthalAdmixture();

  return {
    groups,
    tubes,
    neanderthalAdmixture
  };
}

function createDeepAncestryTimeline(nodes: any[]): AncestralGroup[] {
  const groups: AncestralGroup[] = [];
  
  // Analyze the genealogical data to determine modern ethnic composition
  const modernGroups = detectAncestralGroups(nodes);
  
  // Create a proper deep ancestry timeline that flows to the left of the main tree
  // Position groups in a vertical flowing timeline to the left
  const timelineGroups = [
    // Modern Era (0-500 years ago) - Your genealogical data (rightmost)
    ...modernGroups.map(g => ({
      ...g,
      bounds: { x: 2000, y: 0, width: 300, height: 150 },
      timePeriod: 'Modern Era (0-500 years ago)'
    })),
    
    // Historical Era (500-2000 years ago)
    {
      id: 'medieval-european',
      name: 'Medieval European',
      color: '#3b82f6',
      nodes: [],
      bounds: { x: 1600, y: 0, width: 350, height: 180 },
      parentGroup: 'ancient-european',
      dnaContribution: 85,
      timePeriod: 'Historical (500-2000 years ago)'
    },
    
    // Ancient Era (2000-8000 years ago)
    {
      id: 'ancient-european',
      name: 'Ancient European',
      color: '#6366f1',
      nodes: [],
      bounds: { x: 1200, y: 0, width: 400, height: 200 },
      parentGroup: 'bronze-age-european',
      dnaContribution: 70,
      timePeriod: 'Ancient (2000-8000 years ago)'
    },
    
    // Bronze Age (3000-5000 years ago)
    {
      id: 'bronze-age-european',
      name: 'Bronze Age European',
      color: '#7c3aed',
      nodes: [],
      bounds: { x: 750, y: 0, width: 450, height: 220 },
      parentGroup: 'neolithic-european',
      dnaContribution: 50,
      timePeriod: 'Bronze Age (3000-5000 years ago)'
    },
    
    // Neolithic Era (5000-10000 years ago)
    {
      id: 'neolithic-european',
      name: 'Neolithic European',
      color: '#8b5cf6',
      nodes: [],
      bounds: { x: 250, y: 0, width: 500, height: 240 },
      parentGroup: 'mesolithic-european',
      dnaContribution: 35,
      timePeriod: 'Neolithic (5000-10000 years ago)'
    },
    
    // Mesolithic Era (10000-15000 years ago)
    {
      id: 'mesolithic-european',
      name: 'Mesolithic European',
      color: '#a855f7',
      nodes: [],
      bounds: { x: -300, y: 0, width: 550, height: 260 },
      parentGroup: 'paleolithic-european',
      dnaContribution: 25,
      timePeriod: 'Mesolithic (10000-15000 years ago)'
    },
    
    // Paleolithic Era (15000-40000 years ago) - This is where Neanderthal admixture happened
    {
      id: 'paleolithic-european',
      name: 'Paleolithic European',
      color: '#c084fc',
      nodes: [],
      bounds: { x: -900, y: 0, width: 600, height: 280 },
      parentGroup: 'out-of-africa',
      dnaContribution: 15,
      timePeriod: 'Paleolithic (15000-40000 years ago)'
    },
    
    // Out of Africa (40000-70000 years ago) - Neanderthal admixture point
    {
      id: 'out-of-africa',
      name: 'Out of Africa',
      color: '#059669',
      nodes: [],
      bounds: { x: -1550, y: 0, width: 650, height: 300 },
      parentGroup: 'african',
      dnaContribution: 10,
      timePeriod: 'Out of Africa (40000-70000 years ago)'
    },
    
    // African Origins (70000-200000 years ago)
    {
      id: 'african',
      name: 'African Origins',
      color: '#0891b2',
      nodes: [],
      bounds: { x: -2250, y: 0, width: 700, height: 320 },
      parentGroup: 'modern-human',
      dnaContribution: 5,
      timePeriod: 'African Origins (70000-200000 years ago)'
    },
    
    // Modern Human (200000-300000 years ago)
    {
      id: 'modern-human',
      name: 'Modern Human',
      color: '#be185d',
      nodes: [],
      bounds: { x: -3000, y: 0, width: 750, height: 340 },
      parentGroup: 'archaic-human',
      dnaContribution: 2,
      timePeriod: 'Modern Human (200000-300000 years ago)'
    },
    
    // Archaic Human (300000-1000000 years ago)
    {
      id: 'archaic-human',
      name: 'Archaic Human',
      color: '#6b7280',
      nodes: [],
      bounds: { x: -3800, y: 0, width: 800, height: 360 },
      parentGroup: 'early-hominin',
      dnaContribution: 1,
      timePeriod: 'Archaic Human (300000-1000000 years ago)'
    },
    
    // Early Hominin (1000000-3000000 years ago)
    {
      id: 'early-hominin',
      name: 'Early Hominin',
      color: '#4b5563',
      nodes: [],
      bounds: { x: -4650, y: 0, width: 850, height: 380 },
      parentGroup: 'australopithecine',
      dnaContribution: 0.5,
      timePeriod: 'Early Hominin (1000000-3000000 years ago)'
    },
    
    // Australopithecine (3000000-6000000 years ago)
    {
      id: 'australopithecine',
      name: 'Australopithecine',
      color: '#374151',
      nodes: [],
      bounds: { x: -5550, y: 0, width: 900, height: 400 },
      parentGroup: 'common-ancestor',
      dnaContribution: 0.1,
      timePeriod: 'Australopithecine (3000000-6000000 years ago)'
    },
    
    // Common Ancestor (6000000+ years ago)
    {
      id: 'common-ancestor',
      name: 'Common Ancestor',
      color: '#1f2937',
      nodes: [],
      bounds: { x: -6500, y: 0, width: 950, height: 420 },
      dnaContribution: 0.01,
      timePeriod: 'Common Ancestor (6000000+ years ago)'
    }
  ];
  
  return timelineGroups;
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
