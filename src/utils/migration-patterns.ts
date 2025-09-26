// Migration patterns utility for analyzing ancestry location data
import { Person } from '../interfaces/person';

export interface MigrationPoint {
  name: string;
  coordinates: [number, number]; // [longitude, latitude]
  country: string;
  region?: string;
  city?: string;
  count: number; // Number of ancestors from this location
  timePeriod?: string;
}

export interface MigrationRoute {
  from: MigrationPoint;
  to: MigrationPoint;
  count: number; // Number of migrations along this route
  timePeriod?: string;
}

export interface MigrationPatterns {
  points: MigrationPoint[];
  routes: MigrationRoute[];
  bounds: {
    north: number;
    south: number;
    east: number;
    west: number;
  };
}

// Location coordinates mapping (simplified for key locations)
const LOCATION_COORDINATES: Record<string, [number, number]> = {
  // Germany
  'Germany': [10.4515, 51.1657],
  'Bavaria, Germany': [11.4975, 48.7904],
  'Baden-Württemberg, Germany': [9.1770, 48.7758],
  'Schramberg, Rottweil, Baden-Württemberg, Germany': [8.3858, 48.2283],
  'Ansbach, Bayern, Germany': [10.5833, 49.3000],
  'Weißenbronn, Heilsbronn, Ansbach, Bavaria, Germany': [10.8000, 49.3333],
  'Meklenberg, Middle Franconia, Bavaria, Germany': [10.5833, 49.3000],
  'Wurttemberg, Germany': [9.1770, 48.7758],
  
  // France
  'France': [2.2137, 46.2276],
  'Normandy, France': [-0.3707, 49.1829],
  'Arles, France': [4.6284, 43.6769],
  'Blois, Loir-et-Cher, Centre, France': [1.3333, 47.5833],
  'Marche, Limousin, Poitou, France': [1.1667, 46.1667],
  
  // Spain
  'Spain': [-3.7492, 40.4637],
  'Barcelona, Spain': [2.1734, 41.3851],
  'Madrid, Spain': [-3.7038, 40.4168],
  'Seville, Spain': [-5.9845, 37.3891],
  
  // Canada
  'Canada': [-106.3468, 56.1304],
  'Quebec, Canada': [-73.5491, 52.9399],
  'Montreal, Quebec, Canada': [-73.5673, 45.5017],
  'Trois-Rivières, Quebec, Canada': [-72.5449, 46.3432],
  
  // United States
  'United States': [-95.7129, 37.0902],
  'Michigan, United States': [-84.5467, 43.3266],
  'Ohio, United States': [-82.7649, 40.3888],
  'Columbus, Franklin, Ohio, United States': [-82.9988, 39.9612],
  'Oscoda, Iosco, Michigan, United States': [-83.3308, 44.4200],
  'Cheboygan, Cheboygan, Michigan, United States': [-84.4747, 45.6469],
  'Onaway, Presque Isle, Michigan, USA': [-84.2278, 45.3575],
  'Richville Township, Tuscola, Michigan, United States': [-83.6833, 43.4167],
  'Licking, Ohio, United States': [-82.3985, 40.0912],
  
  // Ireland
  'Ireland': [-8.2439, 53.4129],
  
  // Scotland
  'Scotland': [-4.2026, 56.4907],
  'Scotland, United Kingdom': [-4.2026, 56.4907],
  'England, United Kingdom': [-3.4359, 55.3781],
  'Burghead, Moray, Scotland, United Kingdom': [-3.4833, 57.7000],
  'Angus, Scotland, United Kingdom': [-2.8333, 56.6667],
  'Fettercairn, Mearns, Scotland, United Kingdom': [-2.5667, 56.8500],
  'Perthshire, Scotland, United Kingdom': [-3.5000, 56.5000],
  'Galloway, Scotland, United Kingdom': [-4.0000, 55.0000],
  'Vlurn, Scotland, United Kingdom': [-3.0000, 56.0000],
  'Dunfother, Scotland, United Kingdom': [-3.0000, 56.0000],
  
  // England
  'England': [-3.4359, 55.3781],
  'United Kingdom': [-3.4359, 55.3781],
  'London, London, England, United Kingdom': [-0.1276, 51.5074],
  
  // Netherlands
  'Netherlands': [5.2913, 52.1326],
  'Holland': [4.9041, 52.3676],
  'Winkel, West, Friesland, Netherlands': [5.0833, 52.7500],
  'Amsterdam, Netherlands': [4.9041, 52.3676],
  'Rotterdam, Netherlands': [4.4777, 51.9244],
  
  // Switzerland
  'Switzerland': [8.2275, 46.8182],
  
  // Belgium
  'Belgium': [4.4699, 50.5039],
  
  // Austria
  'Austria': [14.5501, 47.5162],
  
  // Hungary
  'Hungary': [19.5033, 47.1625],
  
  // Italy
  'Italy': [12.5674, 41.8719],
  
  // Greece
  'Greece': [21.8243, 39.0742],
  'Nikaia, Attiki, Attiki, Greece': [23.6419, 37.9755],
  
  // Palestine/Israel
  'Palestine': [35.2332, 31.9522],
  'Ramla (Ramleh), Palestine': [34.8667, 31.9167],
  'Israel': [34.8516, 31.0461],
  
  // Norway
  'Norway': [8.4689, 60.4720],
  
  // Luxembourg
  'Luxembourg': [6.1296, 49.8153],
  
  // Tunisia
  'Tunisia': [9.5375, 33.8869],
  'Tunis, Tunisia': [10.1815, 36.8065],
  
  // Unknown/Generic locations
  'Unknown': [0, 0],
  'UNKNOWN': [0, 0],
};

// Extract country from location string
function extractCountry(location: string): string {
  if (!location || location === 'Unknown' || location === 'UNKNOWN') {
    return 'Unknown';
  }
  
  const locationLower = location.toLowerCase();
  
  // Check for specific countries
  if (locationLower.includes('germany')) return 'Germany';
  if (locationLower.includes('france')) return 'France';
  if (locationLower.includes('spain')) return 'Spain';
  if (locationLower.includes('palestine')) return 'Palestine';
  if (locationLower.includes('israel')) return 'Israel';
  if (locationLower.includes('canada')) return 'Canada';
  if (locationLower.includes('united states') || locationLower.includes('usa')) return 'United States';
  if (locationLower.includes('ireland')) return 'Ireland';
  if (locationLower.includes('scotland')) return 'Scotland';
  if (locationLower.includes('england')) return 'England';
  if (locationLower.includes('united kingdom') || locationLower.includes('uk')) return 'United Kingdom';
  if (locationLower.includes('greece') || locationLower.includes('greek')) return 'Greece';
  if (locationLower.includes('netherlands') || locationLower.includes('holland')) return 'Netherlands';
  if (locationLower.includes('switzerland')) return 'Switzerland';
  if (locationLower.includes('belgium')) return 'Belgium';
  if (locationLower.includes('austria')) return 'Austria';
  if (locationLower.includes('hungary')) return 'Hungary';
  if (locationLower.includes('italy')) return 'Italy';
  if (locationLower.includes('norway')) return 'Norway';
  if (locationLower.includes('luxembourg')) return 'Luxembourg';
  if (locationLower.includes('tunisia') || locationLower.includes('tunis')) return 'Tunisia';
  
  return 'Unknown';
}

// Get coordinates for a location
function getCoordinates(location: string): [number, number] {
  // Try exact match first
  if (LOCATION_COORDINATES[location]) {
    return LOCATION_COORDINATES[location];
  }
  
  // Try to find a partial match
  for (const [key, coords] of Object.entries(LOCATION_COORDINATES)) {
    if (location.toLowerCase().includes(key.toLowerCase()) || 
        key.toLowerCase().includes(location.toLowerCase())) {
      return coords;
    }
  }
  
  // Fallback to country-level coordinates
  const country = extractCountry(location);
  return LOCATION_COORDINATES[country] || [0, 0];
}

// Extract migration patterns from ancestry tree
export function extractMigrationPatterns(rootPerson: Person): MigrationPatterns {
  console.log('Extracting migration patterns from:', rootPerson);
  const locationCounts = new Map<string, number>();
  const routes = new Map<string, MigrationRoute>();
  
  // Recursively traverse the tree to collect location data
  function traversePerson(person: Person, depth: number = 0) {
    if (!person) return;
    
    // Count birth places
    if (person.birthPlace && person.birthPlace !== 'Unknown' && person.birthPlace !== 'UNKNOWN') {
      console.log('Found birth place:', person.birthPlace, 'for person:', person.name);
      const count = locationCounts.get(person.birthPlace) || 0;
      locationCounts.set(person.birthPlace, count + 1);
    }
    
    // Count death places
    if (person.deathPlace && person.deathPlace !== 'Unknown' && person.deathPlace !== 'UNKNOWN') {
      const count = locationCounts.get(person.deathPlace) || 0;
      locationCounts.set(person.deathPlace, count + 1);
    }
    
    // Track migration routes (birth to death)
    if (person.birthPlace && person.deathPlace && 
        person.birthPlace !== person.deathPlace &&
        person.birthPlace !== 'Unknown' && person.birthPlace !== 'UNKNOWN' &&
        person.deathPlace !== 'Unknown' && person.deathPlace !== 'UNKNOWN') {
      
      const routeKey = `${person.birthPlace} -> ${person.deathPlace}`;
      const existingRoute = routes.get(routeKey);
      
      if (existingRoute) {
        existingRoute.count++;
      } else {
        const fromCoords = getCoordinates(person.birthPlace);
        const toCoords = getCoordinates(person.deathPlace);
        
        routes.set(routeKey, {
          from: {
            name: person.birthPlace,
            coordinates: fromCoords,
            country: extractCountry(person.birthPlace),
            count: 1
          },
          to: {
            name: person.deathPlace,
            coordinates: toCoords,
            country: extractCountry(person.deathPlace),
            count: 1
          },
          count: 1
        });
      }
    }
    
    // Recursively process parents
    if (person.parents) {
      person.parents.forEach(parent => traversePerson(parent, depth + 1));
    }
  }
  
  traversePerson(rootPerson);
  
  // Convert location counts to migration points
  const points: MigrationPoint[] = Array.from(locationCounts.entries()).map(([location, count]) => {
    const coords = getCoordinates(location);
    const country = extractCountry(location);
    
    return {
      name: location,
      coordinates: coords,
      country,
      count,
      timePeriod: 'Historical' // Could be enhanced with actual date parsing
    };
  });
  
  console.log('Extracted migration points:', points);
  console.log('Extracted migration routes:', Array.from(routes.values()));
  
  // Convert routes to array
  const routeArray: MigrationRoute[] = Array.from(routes.values());
  
  // Calculate bounds
  const allCoords = points.map(p => p.coordinates).filter(([lng, lat]) => lng !== 0 || lat !== 0);
  
  if (allCoords.length === 0) {
    return {
      points: [],
      routes: [],
      bounds: { north: 0, south: 0, east: 0, west: 0 }
    };
  }
  
  const bounds = {
    north: Math.max(...allCoords.map(([lng, lat]) => lat)),
    south: Math.min(...allCoords.map(([lng, lat]) => lat)),
    east: Math.max(...allCoords.map(([lng, lat]) => lng)),
    west: Math.min(...allCoords.map(([lng, lat]) => lng))
  };
  
  return {
    points,
    routes: routeArray,
    bounds
  };
}

// Get a focused region for the map based on migration patterns
export function getFocusedRegion(patterns: MigrationPatterns): {
  center: [number, number];
  zoom: number;
  bounds: { north: number; south: number; east: number; west: number };
} {
  if (patterns.points.length === 0) {
    return {
      center: [0, 0],
      zoom: 2,
      bounds: { north: 0, south: 0, east: 0, west: 0 }
    };
  }
  
  // Add some padding to the bounds
  const padding = 5; // degrees
  const bounds = {
    north: patterns.bounds.north + padding,
    south: patterns.bounds.south - padding,
    east: patterns.bounds.east + padding,
    west: patterns.bounds.west - padding
  };
  
  // Calculate center
  const center: [number, number] = [
    (bounds.east + bounds.west) / 2,
    (bounds.north + bounds.south) / 2
  ];
  
  // Calculate zoom level based on bounds size
  const latRange = bounds.north - bounds.south;
  const lngRange = bounds.east - bounds.west;
  const maxRange = Math.max(latRange, lngRange);
  
  let zoom = 2;
  if (maxRange < 10) zoom = 6;
  else if (maxRange < 20) zoom = 5;
  else if (maxRange < 40) zoom = 4;
  else if (maxRange < 80) zoom = 3;
  
  return { center, zoom, bounds };
}
