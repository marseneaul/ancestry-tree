import { TimePeriod, MigrationEvent } from '../interfaces/deep-ancestry';

export const TIME_PERIODS: TimePeriod[] = [
  {
    name: "Modern Era",
    startYear: 0,
    endYear: 2024,
    color: "#4A90E2",
    description: "Contemporary period with recorded history",
    characteristics: ["Written records", "Advanced technology", "Global connectivity"]
  },
  {
    name: "Medieval Period",
    startYear: -1000,
    endYear: 0,
    color: "#7B68EE",
    description: "Middle Ages and classical antiquity",
    characteristics: ["Written languages", "Metalworking", "Agriculture", "Cities"],
    migrationEvents: [
      {
        name: "Roman Expansion",
        year: -200,
        description: "Roman Empire spreads across Europe",
        fromRegion: "Italy",
        toRegion: "Europe",
        significance: "Cultural and genetic mixing across Mediterranean"
      }
    ]
  },
  {
    name: "Bronze Age",
    startYear: -3000,
    endYear: -1000,
    color: "#CD7F32",
    description: "Age of bronze tools and weapons",
    characteristics: ["Bronze metallurgy", "Wheel", "Writing systems", "Trade networks"],
    migrationEvents: [
      {
        name: "Indo-European Expansion",
        year: -2000,
        description: "Massive migration from Pontic-Caspian steppe",
        fromRegion: "Pontic-Caspian Steppe",
        toRegion: "Europe and Asia",
        significance: "Major genetic and linguistic transformation"
      }
    ]
  },
  {
    name: "Neolithic Revolution",
    startYear: -10000,
    endYear: -3000,
    color: "#8B4513",
    description: "Transition to agriculture and settled life",
    characteristics: ["Agriculture", "Domestication", "Pottery", "Settlements"],
    migrationEvents: [
      {
        name: "Agricultural Expansion",
        year: -6000,
        description: "Farming spreads from Fertile Crescent",
        fromRegion: "Fertile Crescent",
        toRegion: "Europe",
        significance: "Genetic replacement of hunter-gatherers"
      }
    ]
  },
  {
    name: "Mesolithic",
    startYear: -15000,
    endYear: -10000,
    color: "#A0522D",
    description: "Middle Stone Age - advanced hunter-gatherers",
    characteristics: ["Microliths", "Fishing", "Seasonal camps", "Art"],
    migrationEvents: [
      {
        name: "Post-Glacial Recolonization",
        year: -12000,
        description: "Humans recolonize northern Europe after ice age",
        fromRegion: "Southern Europe",
        toRegion: "Northern Europe",
        significance: "Genetic diversity in post-glacial populations"
      }
    ]
  },
  {
    name: "Upper Paleolithic",
    startYear: -40000,
    endYear: -15000,
    color: "#8B7355",
    description: "Late Stone Age - modern humans and Neanderthals",
    characteristics: ["Cave art", "Bone tools", "Clothing", "Complex tools"],
    migrationEvents: [
      {
        name: "Neanderthal Admixture",
        year: -40000,
        description: "Interbreeding between modern humans and Neanderthals",
        fromRegion: "Eurasia",
        toRegion: "Eurasia",
        significance: "Non-Africans inherit 1-4% Neanderthal DNA"
      },
      {
        name: "Out of Africa",
        year: -60000,
        description: "Modern humans migrate from Africa to Eurasia",
        fromRegion: "Africa",
        toRegion: "Eurasia",
        significance: "Foundational migration of all non-Africans"
      }
    ]
  },
  {
    name: "Middle Paleolithic",
    startYear: -300000,
    endYear: -40000,
    color: "#696969",
    description: "Middle Stone Age - Neanderthals and early modern humans",
    characteristics: ["Mousterian tools", "Fire control", "Burial practices", "Language"],
    migrationEvents: [
      {
        name: "Neanderthal Expansion",
        year: -200000,
        description: "Neanderthals spread across Europe and western Asia",
        fromRegion: "Europe",
        toRegion: "Eurasia",
        significance: "Dominant human species in Europe for 200,000 years"
      }
    ]
  },
  {
    name: "Lower Paleolithic",
    startYear: -2500000,
    endYear: -300000,
    color: "#2F4F4F",
    description: "Early Stone Age - first humans and tool-making",
    characteristics: ["Oldowan tools", "Acheulean handaxes", "Fire", "Hunting"],
    migrationEvents: [
      {
        name: "Homo erectus Migration",
        year: -1800000,
        description: "First human migration out of Africa",
        fromRegion: "Africa",
        toRegion: "Eurasia",
        significance: "First human species to leave Africa"
      }
    ]
  }
];

export const NEANDERTHAL_ADMIXTURE_INFO = {
  year: -40000,
  description: "Interbreeding between modern humans and Neanderthals occurred around 40,000 years ago in Eurasia. Non-African populations carry 1-4% Neanderthal DNA, with some populations having higher percentages.",
  significance: "This admixture provided modern humans with beneficial genes for immune function, skin pigmentation, and adaptation to cold climates.",
  regions: ["Europe", "Asia", "Middle East"],
  excludedRegions: ["Sub-Saharan Africa"]
};

export const MIGRATION_PATTERNS = {
  "Out of Africa": {
    startYear: -60000,
    endYear: -40000,
    route: "Africa → Middle East → Europe/Asia",
    description: "The foundational migration that populated the world outside Africa"
  },
  "Neanderthal Admixture": {
    startYear: -45000,
    endYear: -35000,
    route: "Eurasia (multiple locations)",
    description: "Interbreeding between modern humans and Neanderthals"
  },
  "Agricultural Expansion": {
    startYear: -10000,
    endYear: -5000,
    route: "Fertile Crescent → Europe → Asia",
    description: "Spread of farming and associated genetic changes"
  },
  "Indo-European Expansion": {
    startYear: -4000,
    endYear: -2000,
    route: "Pontic-Caspian Steppe → Europe/Asia",
    description: "Massive migration that shaped European and Asian populations"
  }
};

export function getTimePeriodForYear(year: number): TimePeriod {
  // Convert BCE years to negative numbers for easier comparison
  const adjustedYear = year < 0 ? year : -year;
  
  for (const period of TIME_PERIODS) {
    if (adjustedYear >= period.startYear && adjustedYear <= period.endYear) {
      return period;
    }
  }
  
  // Fallback to oldest period
  return TIME_PERIODS[TIME_PERIODS.length - 1];
}

export function isNeanderthalAdmixtureRelevant(region: string): boolean {
  return !NEANDERTHAL_ADMIXTURE_INFO.excludedRegions.includes(region);
}
