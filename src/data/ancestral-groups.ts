export interface AncestralGroupConfig {
  id: string;
  name: string;
  color: string;
  parentGroup?: string;
  childGroups?: string[];
  countries: string[]; // Countries that belong to this group
  description: string;
  timePeriod: string;
}

export const ANCESTRAL_GROUPS: AncestralGroupConfig[] = [
  // Modern Ethnic Groups
  {
    id: 'french-canadian',
    name: 'French Canadian',
    color: '#3b82f6', // Blue
    parentGroup: 'european',
    countries: ['Canada'],
    description: 'French settlers in North America',
    timePeriod: '1600s-1800s'
  },
  {
    id: 'german',
    name: 'German',
    color: '#f59e0b', // Amber
    parentGroup: 'european',
    countries: ['Germany', 'Austria', 'Switzerland'],
    description: 'Germanic peoples of Central Europe',
    timePeriod: 'Medieval-Modern'
  },
  {
    id: 'irish',
    name: 'Irish',
    color: '#10b981', // Emerald
    parentGroup: 'european',
    countries: ['Ireland'],
    description: 'Celtic peoples of Ireland',
    timePeriod: 'Ancient-Modern'
  },
  {
    id: 'scottish',
    name: 'Scottish',
    color: '#8b5cf6', // Violet
    parentGroup: 'european',
    countries: ['United Kingdom'],
    description: 'Celtic and Pictish peoples of Scotland',
    timePeriod: 'Ancient-Modern'
  },
  {
    id: 'mikmaq',
    name: 'Mi\'kmaq',
    color: '#ef4444', // Red
    parentGroup: 'indigenous-american',
    countries: ['Canada'],
    description: 'Indigenous peoples of Eastern Canada',
    timePeriod: 'Pre-contact-Modern'
  },
  {
    id: 'nipissing',
    name: 'Nipissing',
    color: '#f97316', // Orange
    parentGroup: 'indigenous-american',
    countries: ['Canada'],
    description: 'Indigenous peoples of Ontario',
    timePeriod: 'Pre-contact-Modern'
  },

  // Broad European Groups
  {
    id: 'european',
    name: 'European',
    color: '#6366f1', // Indigo
    parentGroup: 'eurasian',
    childGroups: ['french-canadian', 'german', 'irish', 'scottish'],
    countries: ['France', 'Germany', 'Ireland', 'United Kingdom', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Luxembourg', 'Norway', 'Switzerland', 'Austria', 'Hungary'],
    description: 'Peoples of European descent',
    timePeriod: 'Bronze Age-Modern'
  },

  // Indigenous American Groups
  {
    id: 'indigenous-american',
    name: 'Indigenous American',
    color: '#dc2626', // Red-600
    parentGroup: 'amerindian',
    childGroups: ['mikmaq', 'nipissing'],
    countries: ['Canada', 'United States'],
    description: 'First Nations peoples of North America',
    timePeriod: 'Pre-contact-Modern'
  },

  // Ancient Ancestral Groups
  {
    id: 'eurasian',
    name: 'Eurasian',
    color: '#7c3aed', // Purple
    parentGroup: 'out-of-africa',
    childGroups: ['european', 'indigenous-american'],
    countries: [],
    description: 'Peoples who migrated out of Africa into Eurasia',
    timePeriod: '50,000-10,000 years ago'
  },
  {
    id: 'amerindian',
    name: 'Amerindian',
    color: '#ea580c', // Orange-600
    parentGroup: 'eurasian',
    childGroups: ['indigenous-american'],
    countries: [],
    description: 'Peoples who migrated to the Americas',
    timePeriod: '15,000-10,000 years ago'
  },
  {
    id: 'out-of-africa',
    name: 'Out of Africa',
    color: '#059669', // Emerald-600
    parentGroup: 'african',
    childGroups: ['eurasian'],
    countries: [],
    description: 'Modern humans who migrated out of Africa',
    timePeriod: '70,000-50,000 years ago'
  },
  {
    id: 'african',
    name: 'African',
    color: '#0891b2', // Cyan-600
    parentGroup: 'modern-human',
    childGroups: ['out-of-africa'],
    countries: [],
    description: 'Ancestral African populations',
    timePeriod: '200,000-70,000 years ago'
  },
  {
    id: 'modern-human',
    name: 'Modern Human',
    color: '#be185d', // Pink-600
    parentGroup: 'archaic-human',
    childGroups: ['african'],
    countries: [],
    description: 'Homo sapiens sapiens',
    timePeriod: '300,000-200,000 years ago'
  },
  {
    id: 'archaic-human',
    name: 'Archaic Human',
    color: '#6b7280', // Gray-500
    parentGroup: 'hominin',
    childGroups: ['modern-human', 'neanderthal'],
    countries: [],
    description: 'Early human species',
    timePeriod: '1,000,000-300,000 years ago'
  },
  {
    id: 'neanderthal',
    name: 'Neanderthal',
    color: '#92400e', // Amber-800
    parentGroup: 'archaic-human',
    countries: [],
    description: 'Neanderthal admixture in non-Africans',
    timePeriod: 'Admixture: 50,000-40,000 years ago'
  },
  {
    id: 'hominin',
    name: 'Hominin',
    color: '#374151', // Gray-700
    countries: [],
    description: 'Human lineage',
    timePeriod: '6,000,000+ years ago'
  }
];

// European sub-groups based on ancient DNA
export const EUROPEAN_SUBGROUPS: AncestralGroupConfig[] = [
  {
    id: 'steppe-pastoralist',
    name: 'Steppe Pastoralist',
    color: '#fbbf24', // Amber-400
    parentGroup: 'european',
    countries: [],
    description: 'Yamnaya and related steppe peoples',
    timePeriod: '5,000-3,000 years ago'
  },
  {
    id: 'anatolian-farmer',
    name: 'Anatolian Farmer',
    color: '#34d399', // Emerald-400
    parentGroup: 'european',
    countries: [],
    description: 'Early European farmers from Anatolia',
    timePeriod: '8,000-5,000 years ago'
  },
  {
    id: 'western-hunter-gatherer',
    name: 'Western Hunter-Gatherer',
    color: '#a78bfa', // Violet-400
    parentGroup: 'european',
    countries: [],
    description: 'Mesolithic European hunter-gatherers',
    timePeriod: '10,000-5,000 years ago'
  }
];
