// Simple test to verify migration data extraction
const { extractMigrationData } = require('./src/utils/map-visualization.ts');

// Test data with migration patterns
const testPerson = {
  name: "Test Person",
  birthPlace: "France",
  deathPlace: "Canada",
  parents: [
    {
      name: "Parent 1",
      birthPlace: "Ireland", 
      deathPlace: "United States",
      parents: []
    },
    {
      name: "Parent 2",
      birthPlace: "Germany",
      deathPlace: "Canada", 
      parents: []
    }
  ]
};

console.log('Testing migration data extraction...');
const migrationPatterns = extractMigrationData(testPerson);
console.log('Extracted patterns:', migrationPatterns);

// Expected patterns:
// France → Canada (1)
// Ireland → United States (1) 
// Germany → Canada (1)
