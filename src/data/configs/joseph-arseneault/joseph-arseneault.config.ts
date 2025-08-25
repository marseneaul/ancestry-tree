import { elizabethVossConfig } from "./elizabeth-voss/elizabeth-voss.config";
import { georgeArseneaultConfig } from "./george-arseneault.config";

export const josephArseneaultConfig = {
    name: "Joseph Homer Arseneault",
    sex: "Male",
    birthPlace: "Michigan, United States",
    birthDate: "~1923",
    deathDate: "8 February 2012",
    imageUrl: "./images/joseph-arseneault.jpg",
    parents: [
        {
            name: "Elizabeth Hennecke",
            sex: "Female",
            birthPlace: "Lake Linden, Houghton, Michigan",
            birthDate: "29 June 1886",
            deathDate: "27 January 1969",
            parents: [
                elizabethVossConfig,
                {
                    name: "Joseph Hennecke",
                    sex: "Male",
                    birthPlace: "Fleckenberg, Schmallenberg, Hochsauerlandkreis, North Rhine-Westphalia, Germany",
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
            parents: [
                {
                    name: "Marie Leonie Dubois",
                    sex: "Female",
                    birthPlace: "Nicolet, Canada East, British North America",
                    deathPlace: "Flint, Genesee County, Michigan, United States",
                    birthDate: "31 March 1861",
                    deathDate: "27 November 1934",
                    imageUrl: "./images/marie-leonie-dubois.jpg",
                    parents: [
                        {
                            name: "Sophie Marie Therrien dit Landry",
                            sex: "Female",
                            birthPlace: "Quebec, Canada",
                            deathPlace: "Baie-du-Febvre, Nicolet-Yamaska, Quebec, Canada",
                            birthDate: "23 February 1838",
                            deathDate: "9 October 1915",
                            imageUrl: "./images/sophie-landry.jpg",
                            parents: [ // QUESTIONABLE LINEAGE
                                {
                                    name: "Sophie Desilets",
                                    sex: "Female",
                                    birthPlace: "Nicolet, Nicolet-Yamaska, Quebec, Canada",
                                    deathPlace: "Nicolet, Nicolet-Yamaska, Quebec, Canada",
                                    birthDate: "3 January 1808",
                                    deathDate: "6 March 1865",
                                    parents: []
                                },
                                {
                                    name: "Thomas Therrien",
                                    sex: "Male",
                                    birthPlace: "Saint-Maurice, La Côte-de-Gaspé, Quebec, Canada",
                                    deathPlace: "UNKNOWN",
                                    birthDate: "30 January 1808",
                                    deathDate: "1905",
                                    parents: []
                                }
                            ]
                        },
                        {
                            name: "Francois Dubois",
                            sex: "Male",
                            birthPlace: "Gentilly, Nicolet, Quebec, Canada",
                            deathPlace: "Gentilly, Nicolet, Quebec, Canada",
                            birthDate: "23 April 1831",
                            deathDate: "16 March 1905",
                            imageUrl: "./images/francois-dubois.jpg",
                            parents: [ // QUESTIONABLE LINEAGE
                                {
                                    name: "Sophie Beaufort-Brunelle",
                                    sex: "Female",
                                    birthPlace: "UNKNOWN",
                                    deathPlace: "Manchester, Hillsborough, New Hampshire, United States",
                                    birthDate: "2 April 1796",
                                    deathDate: "3 August 1832",
                                    parents: []
                                },
                                {
                                    name: "Francois Dubois dit LaFrance",
                                    sex: "Male",
                                    birthPlace: "Gentilly, Nicolet County, Quebec, Canada",
                                    deathPlace: "Gentilly, Nicolet County, Quebec, Canada",
                                    birthDate: "3 September 1799",
                                    deathDate: "8 July 1877",
                                    parents: []
                                }
                            ]
                        }
                    ]
                },
                georgeArseneaultConfig
            ]
        }
    ]
}