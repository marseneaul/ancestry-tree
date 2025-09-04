import { emmaSaintJohnStory } from "../../../stories/emma-saint-john";
import { leviSaintJohnConfig } from "./levi-saint-john.config";

// COMPLETE
export const emmaSaintJohnConfig = {
    name: "Emma Victoria Saint John",
    sex: "Female",
    birthPlace: "Oscoda, Iosco, Michigan, United States",
    deathPlace: "Cheboygan, Cheboygan, Michigan, United States",
    birthDate: "20 October 1883",
    deathDate: "8 October 1962",
    imageUrl: "./images/emma-saint-john.jpg",
    story: emmaSaintJohnStory,
    parents: [
        {
            name: "Laura Louisa Sharkey",
            sex: "Female",
            birthPlace: "Canada",
            deathPlace: "Onaway, Presque Isle, Michigan, USA",
            birthDate: "September 13 1857",
            deathDate: "April 19 1921",
            parents: [
                {
                    name: "Amelia Margaret Newton",
                    sex: "Female",
                    birthPlace: "Canada",
                    birthDate: "~1818",
                    deathDate: "UNKNOWN"
                },
                {
                    name: "Antoine Chartier Sharkey",
                    sex: "Male",
                    birthPlace: "Canada",
                    deathPlace: "UNKNOWN",
                    birthDate: "~1821",
                    deathDate: "UNKNOWN"
                }
            ]
        },
        {
            // Alphonse?
            name: "Frederick (Fred) St. John", // Farmer
            sex: "Male",
            birthPlace: "Fletcher, Franklin, Vermont, United States",
            deathPlace: "Onaway, Presque Isle, Michigan, United States",
            birthDate: "1 April 1849",
            deathDate: "22 December 1878",
            parents: [
                {
                    name: "Amelia (Emily) Hadd",
                    sex: "Female",
                    birthPlace: "Canada",
                    deathPlace: "Cambridge, Lamoille, Vermont, United States",
                    birthDate: "~1811",
                    deathDate: "1880",
                },
                {
                    name: "Cassimere St. John",
                    sex: "Male",
                    birthPlace: "Departement des Yvelines, Île-de-France, France",
                    deathPlace: "Allis, Presque Isle, Michigan, United States",
                    birthDate: "23 November 1814",
                    deathDate: "7 February 1904",
                    parents: [
                        {
                            name: "Marie Maleret",
                            sex: "Female",
                            birthPlace: "France",
                            deathPlace: "UNKNOWN",
                            birthDate: "20 JUN 1790",
                            deathDate: "UNKNOWN"
                        },
                        {
                            name: "Joseph St. John",
                            sex: "Male",
                            birthPlace: "France",
                            deathPlace: "UNKNOWN",
                            birthDate: "16 November 1791",
                            deathDate: "UNKNOWN",
                            parents: [
                                {
                                    name: "Marguerite Morel",
                                    sex: "Female",
                                    birthPlace: "France",
                                    deathPlace: "UNKNOWN",
                                    birthDate: "UNKNOWN",
                                    deathDate: "UNKNOWN"
                                },
                                {
                                    name: "Benoit St. John (St. Gerand)",
                                    sex: "Male",
                                    birthPlace: "France",
                                    deathPlace: "UNKNOWN",
                                    birthDate: "UNKNOWN",
                                    deathDate: "UNKNOWN",
                                    parents: [
                                        {
                                            name: "François St. Gerand",
                                            sex: "Male",
                                            birthPlace: "France",
                                            deathPlace: "UNKNOWN",
                                            birthDate: "UNKNOWN",
                                            deathDate: "UNKNOWN"
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                }
            ]
            // parents: [ // This is a questionable connection!
            //     {
            //         name: "Jane Jones",
            //         sex: "Female",
            //         birthPlace: "Wales, United Kingdom",
            //         birthDate: "1834",
            //         deathDate: "29 July 1916"
            //     },
            //     leviSaintJohnConfig
            // ]
        }
    ]
}