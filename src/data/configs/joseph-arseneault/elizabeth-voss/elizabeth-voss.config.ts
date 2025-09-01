import { josephKayserConfig } from "./joseph-kayser.config";
import { mariaTielmannConfig } from "./maria-tielmann.config";

// COMPLETE
export const elizabethVossConfig = {
    name: "Elizabeth Voss",
    sex: "Female",
    birthPlace: "Hancock, Houghton County, Michigan, United States",
    deathPlace: "Hancock, Houghton County, Michigan, United States",
    birthDate: "6 November 1860",
    deathDate: "30 July 1937",
    parents: [
        {
            name: "Maria Theresia 'Tracy' Kaiser",
            sex: "Female",
            birthPlace: "Paderborn, Westphalia, Prussia, Germany",
            deathPlace: "Hancock, Houghton County, Michigan, United States",
            birthDate: "30 August 1827",
            deathDate: "27 September 1902",
            parents: [
                mariaTielmannConfig,
                josephKayserConfig
            ]
        },
        {
            name: "Friedrich Johannes Voss",
            sex: "Male",
            birthPlace: "Prussia, Germany",
            deathPlace: "Hancock, Houghton County, Michigan, United States",
            birthDate: "20 December 1829",
            deathDate: "12 July 1903",
            parents: [
                {
                    name: "Anna Maria Spies",
                    sex: "Female",
                    birthPlace: "Germany",
                    birthDate: "1803",
                    deathDate: "UNKNOWN",
                    parents: [
                        {
                            name: "Philippina Welter",
                            sex: "Female",
                            birthPlace: "Germany",
                            birthDate: "UNKNOWN",
                            deathDate: "UNKNOWN"
                        },
                        {
                            name: "Johannes Weber",
                            sex: "Male",
                            birthPlace: "Germany",
                            birthDate: "UNKNOWN",
                            deathDate: "UNKNOWN"
                        }
                    ]
                },
                {
                    name: "Johannes Voss",
                    sex: "Male",
                    birthPlace: "Germany",
                    birthDate: "1789",
                    deathDate: "UNKNOWN"
                }
            ]
        }
    ]
}