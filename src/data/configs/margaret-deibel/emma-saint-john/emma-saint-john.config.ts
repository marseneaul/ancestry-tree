import { leviSaintJohnConfig } from "./levi-saint-john.config";

// COMPLETE
export const emmaSaintJohnConfig = {
    name: "Emma Victoria Saint John",
    sex: "Female",
    birthPlace: "Oscoda, Iosco, Michigan, United States",
    deathPlace: "Cheboygan, Cheboygan, Michigan, United States",
    birthDate: "20 October 1883",
    deathDate: "8 October 1962",
    imageUrl: "./src/images/emma-saint-john.jpg",
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
                    name: "Antoine Sharkey",
                    sex: "Male",
                    birthPlace: "Canada",
                    birthDate: "~1821",
                    deathDate: "UNKNOWN"
                }
            ]
        },
        {
            name: "Frederick St. John",
            sex: "Male",
            birthPlace: "Fletcher, Franklin, Vermont, United States",
            deathPlace: "Onaway, Presque Isle, Michigan, United States",
            birthDate: "1 April 1849",
            deathDate: "22 December 1878",
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