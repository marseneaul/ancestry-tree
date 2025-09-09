// src/data/utils.ts

import { Person } from "../interfaces/person";
import { hierarchy, HierarchyNode } from "d3-hierarchy";

export function buildHierarchy(root: Person): HierarchyNode<Person> {
  return hierarchy(root, d => {
    // Sort parents: mother (female/left) first, father (male/right) second
    if (d.parents) {
      return d.parents.filter(p => p).sort((a, b) => (a.sex === "Female" ? -1 : 1));
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

export function calculateAgeAtDate(birthDate: string, atDateStr: string = "", currentDate: Date = new Date("2025-09-08")): number | null {
  if (!birthDate) return null;
  const birth = new Date(birthDate);
  if (isNaN(birth.getTime())) return null;
  
  const atDate = atDateStr ? new Date(atDateStr) : currentDate;
  if (isNaN(atDate.getTime())) return null;
  
  let age = atDate.getFullYear() - birth.getFullYear();
  const monthDiff = atDate.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && atDate.getDate() < birth.getDate())) {
    age--;
  }
  return age >= 0 ? age : null; // Avoid negative ages
}

// Helper for estimating ancient dates in BCE (returns string like "circa 50000 BCE")
export function estimateAncientBirthDate(baseYear: number, generationsBack: number, genLength: number = 25): string {
  const estimatedYear = baseYear - (generationsBack * genLength);
  if (estimatedYear > 0) {
    return `Circa ${estimatedYear}`;
  } else {
    return `Circa ${Math.abs(estimatedYear)} BCE`;
  }
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
    if (place.includes("luxembourg")) return "Luxembourg";
    if (place.includes("holland") || place.includes("netherlands")) return "Netherlands";
    if (place.includes("italy")) return "Italy";
    if (place.includes("hungary")) return "Hungary";
    return place.split(",").pop()?.trim() || "Unknown";  // Fallback
  }
  
export const countryColors: Record<string, string> = {
  "Germany": "#FFCE00",         // Gold from flag
  "Ireland": "#009B3A",         // Green from flag
  "France": "#0055A4",          // Blue from flag
  "United Kingdom": "#C8102E",  // Red from flag
  "Canada": "#D80621",          // Red from flag
  "United States": "#3C3B6E",   // Blue from flag
  "Switzerland": "#DA291C",     // Red from flag
  "Belgium": "#FFD100",         // Yellow from flag
  "Austria": "#ED2939",         // Red from flag
  "Norway": "#BA0C2F",          // Red from flag
  "Luxembourg": "#00A3E0",      // Blue from flag
  "Netherlands": "#AE1C28",     // Red from flag (or #FF4F00 for orange if preferred)
  "Italy": "#008C45",           // Green from flag
  "Hungary": "#477050",         // Green from flag
  "Unknown": "#808080",         // Neutral gray
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
    .filter(ch => /^[A-Z]$/.test(ch)) // only keep A–Z
    .slice(0, 2)
    .join("");
}

export function getOrdinalFromNumber(num: number): string {
  if (num % 100 >= 11 && num % 100 <= 13) {
    return num + "th";
  }
  switch (num % 10) {
    case 1: return num + "st";
    case 2: return num + "nd";
    case 3: return num + "rd";
    default: return num + "th";
  }
}

export function getLeaves(person: Person): Person[] {
  if (!person.parents || person.parents.length === 0) return [person];
  let leaves = [];
  for (let p of person.parents) {
    if (p) leaves = leaves.concat(getLeaves(p));
  }
  return leaves;
}