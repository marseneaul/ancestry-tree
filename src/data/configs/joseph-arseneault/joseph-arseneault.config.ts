import { edwardGeorgeArseneaultStory } from "../../stories/edward-george-arseneault";
import { josephArseneaultStory } from "../../stories/joseph-arseneault";
import { elizabethVossConfig } from "./elizabeth-voss/elizabeth-voss.config";
import { georgeArseneaultConfig } from "./george-arseneault/george-arseneault.config";
import { marieDuboisConfig } from "./marie-dubois/marie-dubois.config";

export const josephArseneaultConfig = {
    name: "Joseph Homer Arseneault",
    sex: "Male",
    birthPlace: "Flint, Genesee County, Michigan, United States",
    deathPlace: "Asheville, Buncombe County, North Carolina, United States",
    birthDate: "~1923",
    deathDate: "8 February 2012",
    imageUrl: "./images/joseph-arseneault.jpg",
    story: josephArseneaultStory,
    parents: [
        {
            name: "Elizabeth E Hennecke",
            sex: "Female",
            birthPlace: "Lake Linden, Houghton, Michigan, United States",
            deathPlace: "Flint, Genesee County, Michigan, United States",
            birthDate: "29 June 1886",
            deathDate: "27 January 1969",
            parents: [
                elizabethVossConfig,
                {   // Farmer as occupation
                    name: "Joseph Hennecke",
                    sex: "Male",
                    birthPlace: "Fleckenberg, Schmallenberg, Hochsauerlandkreis, North Rhine-Westphalia, Germany",
                    deathPlace: "Schoolcraft, Houghton, Michigan, United States",
                    birthDate: "8 April 1847",
                    deathDate: "20 August 1927"
                }
            ]
        },
        {
            name: "Edward George Arseneault",
            sex: "Male",
            birthPlace: "Gentilly, Nicolet, Quebec, Canada",
            deathPlace: "Flint, Genesee County, Michigan, United States",
            birthDate: "1 August 1889",
            deathDate: "10 August 1945",
            imageUrl: "./images/edward-arseneault.jpg",
            story: edwardGeorgeArseneaultStory,
            parents: [
                marieDuboisConfig,
                georgeArseneaultConfig
            ]
        }
    ]
}