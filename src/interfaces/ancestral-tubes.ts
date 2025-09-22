export interface AncestralGroup {
  id: string;
  name: string;
  color: string;
  nodes: any[]; // D3 nodes that belong to this group
  bounds: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  parentGroup?: string; // ID of parent ancestral group
  childGroups?: string[]; // IDs of child ancestral groups
  dnaContribution: number; // Total DNA contribution percentage
}

export interface AncestralTube {
  id: string;
  fromGroup: string;
  toGroup: string;
  width: number; // Based on DNA contribution
  color: string;
  path: string; // SVG path for the tube
  animationDelay: number; // For staggered animations
}

export interface DeepAncestryVisualization {
  groups: AncestralGroup[];
  tubes: AncestralTube[];
  neanderthalAdmixture: {
    percentage: number;
    entryPoint: string; // Which group it enters
    color: string;
  };
}
