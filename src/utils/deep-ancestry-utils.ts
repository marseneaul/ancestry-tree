import { Person } from '../interfaces/person';
import { DeepAncestor, TimePeriod } from '../interfaces/deep-ancestry';
import { TIME_PERIODS, getTimePeriodForYear, isNeanderthalAdmixtureRelevant, NEANDERTHAL_ADMIXTURE_INFO } from '../data/deep-ancestry-data';
import { estimateAncientBirthDate } from './utils';

export function extendTreeWithDeepAncestry(
  root: Person, 
  maxGenerations: number = 50,
  isNonAfrican: boolean = true
): Person {
  // Find the deepest ancestors (leaves) in the current tree
  const leaves = getLeaves(root);
  
  // Extend each leaf with deep ancestry
  leaves.forEach(leaf => {
    extendLeafWithDeepAncestry(leaf, maxGenerations, isNonAfrican);
  });
  
  return root;
}

function getLeaves(person: Person): Person[] {
  if (!person.parents || person.parents.length === 0) return [person];
  let leaves = [];
  for (let p of person.parents) {
    if (p) leaves = leaves.concat(getLeaves(p));
  }
  return leaves;
}

function extendLeafWithDeepAncestry(
  leaf: Person, 
  maxGenerations: number,
  isNonAfrican: boolean
): void {
  // Parse the leaf's birth year to determine starting point
  let baseYear = 1800; // Default fallback
  if (leaf.birthDate) {
    const match = leaf.birthDate.match(/\d{4}/);
    if (match) baseYear = parseInt(match[0]);
  }
  
  let currentParent = leaf;
  let generation = 0;
  
  // Limit to prevent excessive computation
  const safeMaxGenerations = Math.min(maxGenerations, 15);
  
  while (generation < safeMaxGenerations) {
    const estimatedYear = baseYear - (generation * 30); // 30 years per generation for deeper time
    const timePeriod = getTimePeriodForYear(estimatedYear);
    
    // Create deep ancestor
    const deepAncestor = createDeepAncestor(
      generation,
      estimatedYear,
      timePeriod,
      isNonAfrican
    );
    
    // Add as parent to current parent
    if (!currentParent.parents) {
      currentParent.parents = [];
    }
    
    // Add to parents array (alternating between mother and father)
    const isMother = generation % 2 === 0;
    if (isMother) {
      currentParent.parents[0] = deepAncestor;
    } else {
      currentParent.parents[1] = deepAncestor;
    }
    
    currentParent = deepAncestor;
    generation++;
    
    // Stop if we've reached the Neanderthal admixture period and it's relevant
    if (estimatedYear <= NEANDERTHAL_ADMIXTURE_INFO.year && isNonAfrican && generation >= 5) {
      // Add Neanderthal ancestor
      const neanderthal = createNeanderthalAncestor();
      if (!currentParent.parents) {
        currentParent.parents = [];
      }
      currentParent.parents[0] = neanderthal;
      break;
    }
  }
}

function createDeepAncestor(
  generation: number,
  estimatedYear: number,
  timePeriod: TimePeriod,
  isNonAfrican: boolean
): DeepAncestor {
  const sex = Math.random() > 0.5 ? "Male" : "Female";
  const isNeanderthal = estimatedYear <= NEANDERTHAL_ADMIXTURE_INFO.year && 
                       isNonAfrican && 
                       Math.random() < 0.1; // 10% chance for Neanderthal
  
  const name = isNeanderthal ? 
    "Neanderthal Ancestor" : 
    `Ancient ${sex} (${timePeriod.name})`;
  
  const birthPlace = getEstimatedLocation(estimatedYear, timePeriod);
  
  return {
    name,
    sex,
    birthPlace,
    birthDate: estimateAncientBirthDate(estimatedYear, 0),
    deathDate: "N/A",
    parents: [],
    timePeriod,
    isNeanderthal,
    estimatedLocation: birthPlace,
    culturalGroup: getCulturalGroup(timePeriod),
    dnaContribution: calculateDNAContribution(generation),
    story: generateDeepAncestorStory(timePeriod, isNeanderthal, estimatedYear)
  };
}

function createNeanderthalAncestor(): DeepAncestor {
  return {
    name: "Neanderthal Woman",
    sex: "Female",
    birthPlace: "Eurasia",
    birthDate: "circa 40000 BCE",
    deathDate: "N/A",
    parents: [],
    timePeriod: getTimePeriodForYear(-40000),
    isNeanderthal: true,
    estimatedLocation: "Eurasia",
    culturalGroup: "Neanderthal",
    dnaContribution: 2.5, // Average Neanderthal contribution
    story: "Symbolic representation of Neanderthal admixture in modern humans. This ancestor represents the interbreeding that occurred ~40,000 years ago between modern humans and Neanderthals, contributing 1-4% of DNA to non-African populations."
  };
}

function getEstimatedLocation(year: number, timePeriod: TimePeriod): string {
  const locations = {
    "Modern Era": ["Europe", "Asia", "Africa", "Americas"],
    "Medieval Period": ["Europe", "Middle East", "Asia"],
    "Bronze Age": ["Europe", "Middle East", "Central Asia"],
    "Neolithic Revolution": ["Fertile Crescent", "Europe", "Asia"],
    "Mesolithic": ["Europe", "Asia", "Africa"],
    "Upper Paleolithic": ["Europe", "Asia", "Middle East"],
    "Middle Paleolithic": ["Europe", "Asia", "Africa"],
    "Lower Paleolithic": ["Africa", "Asia", "Europe"]
  };
  
  const periodLocations = locations[timePeriod.name] || ["Unknown"];
  return periodLocations[Math.floor(Math.random() * periodLocations.length)];
}

function getCulturalGroup(timePeriod: TimePeriod): string {
  const culturalGroups = {
    "Modern Era": ["Agricultural", "Urban", "Industrial"],
    "Medieval Period": ["Agricultural", "Pastoral", "Urban"],
    "Bronze Age": ["Agricultural", "Pastoral", "Metalworking"],
    "Neolithic Revolution": ["Agricultural", "Pastoral", "Settled"],
    "Mesolithic": ["Hunter-Gatherer", "Semi-sedentary"],
    "Upper Paleolithic": ["Hunter-Gatherer", "Cave-dwelling"],
    "Middle Paleolithic": ["Hunter-Gatherer", "Nomadic"],
    "Lower Paleolithic": ["Hunter-Gatherer", "Nomadic"]
  };
  
  const groups = culturalGroups[timePeriod.name] || ["Unknown"];
  return groups[Math.floor(Math.random() * groups.length)];
}

function calculateDNAContribution(generation: number): number {
  return 100 / Math.pow(2, generation);
}

function generateDeepAncestorStory(
  timePeriod: TimePeriod, 
  isNeanderthal: boolean, 
  year: number
): string {
  if (isNeanderthal) {
    return `This Neanderthal ancestor lived during the Upper Paleolithic period, when modern humans and Neanderthals coexisted and interbred. This interbreeding contributed beneficial genes for immune function and adaptation to cold climates.`;
  }
  
  const stories = {
    "Modern Era": "This ancestor lived in the modern era with access to written records, advanced technology, and global connectivity.",
    "Medieval Period": "This ancestor lived during the medieval period, experiencing the rise of cities, metalworking, and written languages.",
    "Bronze Age": "This ancestor lived during the Bronze Age, witnessing the development of bronze metallurgy, the wheel, and early writing systems.",
    "Neolithic Revolution": "This ancestor was part of the agricultural revolution, transitioning from hunting and gathering to farming and settled life.",
    "Mesolithic": "This ancestor was an advanced hunter-gatherer, using microliths and living in seasonal camps with early forms of art.",
    "Upper Paleolithic": "This ancestor lived during the Upper Paleolithic, creating cave art, using bone tools, and developing complex hunting strategies.",
    "Middle Paleolithic": "This ancestor used Mousterian tools, controlled fire, and may have practiced early burial rituals.",
    "Lower Paleolithic": "This ancestor was among the first tool-makers, using Oldowan and Acheulean tools to hunt and process food."
  };
  
  return stories[timePeriod.name] || "This ancient ancestor lived in a time before recorded history.";
}

export function getTimePeriodColor(timePeriod: TimePeriod): string {
  return timePeriod.color;
}

export function shouldShowNeanderthalAdmixture(region: string): boolean {
  return isNeanderthalAdmixtureRelevant(region);
}
