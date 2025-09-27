// src/utils/neanderthal-extension.ts
import { Person, Sex } from "../interfaces/person";
import { estimateAncientBirthDate } from "./utils";

/**
 * Extends a random chain with Neanderthal ancestry
 * Creates a symbolic representation of Neanderthal admixture in modern humans
 * from interbreeding ~40,000 years ago.
 * 
 * @param ancient - The ancient ancestor to extend with Neanderthal lineage
 */
export function extendWithNeanderthal(ancient: Person): void {
  // Parse ancient's birth year if available (fallback to 1800 for estimation)
  let baseYear = 1800;
  if (ancient.birthDate) {
    const match = ancient.birthDate.match(/\d{4}/);
    if (match) baseYear = parseInt(match[0]);
  }

  // Create Neanderthal node
  const neanderthal: Person = {
    name: "Neanderthal Woman",
    sex: Sex.FEMALE,
    birthPlace: "Eurasia",
    birthDate: "circa 40000 BCE",
    deathDate: "N/A",
    parents: [],
    story: "Symbolic representation of Neanderthal admixture in modern humans, from interbreeding ~40,000 years ago."
  };

  // Number of unknown ancestors in the trail (adjust for longer/shorter trail)
  const numUnknowns = 1747;
  let last: Person = neanderthal;

  for (let i = numUnknowns; i > 0; i--) {
    const sex = Math.random() > 0.5 ? Sex.MALE : Sex.FEMALE;
    const unk: Person = {
      name: "Unknown Ancestor",
      sex: sex,
      birthPlace: "Unknown",
      birthDate: estimateAncientBirthDate(baseYear, numUnknowns - i + 20), // Offset to go deeper
      deathDate: "N/A",
      parents: []
    };
    const isMotherLine = Math.random() > 0.5;
    if (isMotherLine) {
      unk.parents = [last];
    } else {
      unk.parents = [undefined, last];
    }
    last = unk;
  }

  // Attach the chain to the ancient ancestor
  const isMotherAttach = Math.random() > 0.5;
  if (isMotherAttach) {
    ancient.parents = [last, ...(ancient.parents || [])];
  } else {
    ancient.parents = [...(ancient.parents || []), last];
  }
}
