// src/data/utils.ts

import { Person } from "../interfaces/person";
import { hierarchy, HierarchyNode } from "d3-hierarchy";

export function buildHierarchy(root: Person): HierarchyNode<Person> {
  return hierarchy(root, d => {
    // Sort parents: mother (female/left) first, father (male/right) second
    if (d.parents) {
      return d.parents.sort((a, b) => (a.sex === "Female" ? -1 : 1));
    }
    return [];
  });
}

export function tracePatrilineal(root: Person): string[] {  // Y-chromosome: father"s line
  const path: string[] = [root.name];
  let current = root;
  while (current.parents && current.parents[1]?.sex === "Male") {  // Assume father at index 1
    current = current.parents[1];
    path.push(current.name);
  }
  return path;
}

export function traceMatrilineal(root: Person): string[] {  // Mitochondrial: mother"s line
  const path: string[] = [root.name];
  let current = root;
  while (current.parents && current.parents[0]?.sex === "Female") {  // Assume mother at index 0
    current = current.parents[0];
    path.push(current.name);
  }
  return path;
}

export function calculateAge(birthDate: string, deathDate: string, currentDate: Date = new Date(2025, 7, 24)): number | null {  // Aug 24, 2025 (month 7=Aug, 0-indexed)
  if (deathDate !== "N/A") return null;  // Deceased, no age
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;
  const age = currentDate.getFullYear() - birth.getFullYear();
  return (currentDate.getMonth() > birth.getMonth() || (currentDate.getMonth() === birth.getMonth() && currentDate.getDate() >= birth.getDate())) ? age : age - 1;
}

export function getCountry(birthPlace?: string): string {
    if (!birthPlace) return "Unknown";
    const place = birthPlace.toLowerCase();
    if (place.includes("france") || place.includes("french")) return "France";
    if (place.includes("united kingdom") || place.includes("england") || place.includes("british")) return "United Kingdom";
    if (place.includes("ireland") || place.includes("irish")) return "Ireland";
    if (place.includes("germany") || place.includes("german") || place.includes("prussia") || place.includes("deutschland")) return "Germany";
    if (place.includes("canada") || place.includes("canadian")) return "Canada";
    if (place.includes("united states") || place.includes("usa") || place.includes("america")) return "United States";
    if (place.includes("switzerland")) return "Switzerland";
    if (place.includes("belgium")) return "Belgium";
    if (place.includes("austria")) return "Austria";
    if (place.includes("norway")) return "Norway";
    return place.split(",").pop()?.trim() || "Unknown";  // Fallback
  }
  
export const countryColors: Record<string, string> = {
    "Germany": "#FFCC00",         // gold/yellow, already good contrast
    "Ireland": "#009B3A",         // emerald green, distinct and vivid
    "France": "#0055A4",          // deep blue, distinct from US navy
    "United Kingdom": "#CC0000",  // bright red, very different from Canada
    "Canada": "#FF0000",          // pure red, distinguishable from UK crimson
    "United States": "#1E90FF",   // dodger blue, brighter than France
    "Switzerland": "#FF2B2B",     // lighter red to separate from Canada/UK
    "Belgium": "FFCD00",          // yellow from flag
    "Austria": "FFFFFF",          // white from flag
    "Norway": "FFFFFF",          // white from flag
    "Unknown": "#808080",         // neutral gray
};


  
export function getGenerations(root: HierarchyNode<Person>): Map<number, { count: number; dnaPercentEach: number; dnaPercentTotal: number, probOfSharingDna: number }> {
    const gens = new Map<number, { count: number; dnaPercentEach: number; dnaPercentTotal: number, probOfSharingDna: number }>();
    root.each(d => {
      const depth = d.depth;
      if (!gens.has(depth)) gens.set(depth, { count: 0, dnaPercentEach: 0, dnaPercentTotal: 0, probOfSharingDna: 0 });
      const info = gens.get(depth)!;
      info.count++;
      info.dnaPercentEach = 100 / Math.pow(2, depth);  // Per ancestor
      info.dnaPercentTotal += info.dnaPercentEach;     // Sum for layer
      const c = 34;
      info.probOfSharingDna = (1 - Math.pow(Math.E, (-c / Math.pow(2, depth)))) * 100;
    });
    return gens;
}

export function getInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map(s => s[0].toUpperCase())
    .slice(0, 2)
    .join("");
}

export function getOrdinalFromNumber(num: number): string {
  const numAsString = num.toString(); 
  const lastDigit = numAsString.length === 1 ? numAsString : numAsString[-1];
  switch(parseInt(lastDigit)) {
    case 1:
      return numAsString + "st";
    case 2:
      return numAsString + "nd";
    case 3:
      return numAsString + "rd";
    default:
      return numAsString + "th";
  }
}