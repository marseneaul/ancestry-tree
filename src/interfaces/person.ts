export interface Person {
    name: string;
    sex?: string;
    birthPlace?: string;
    deathPlace?: string;
    birthDate?: string;
    deathDate?: string;
    parents?: Person[];  // Recursive for parents/grandparents
    imageUrl?: string;
    story?: string;
  }