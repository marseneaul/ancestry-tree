import { crescentiaHassConfig } from "./crescentia-haas.config";

// COMPLETE
export const charlesAndrewDiebelConfig = {
    name: "Charles Andrew Diebel",
    sex: "Male",
    birthPlace: "Columbus, Franklin, Ohio, United States",
    deathPlace: "Licking, Ohio, United States",
    birthDate: "7 July 1860",
    deathDate: "24 September 1920",
    imageUrl: "./src/images/charles-andrew-diebel.jpg",
    parents: [
        {
            name: "Crescentia Crenenisa Volk",
            sex: "Female",
            birthPlace: "Schramberg, Oberndorf, Württemberg, Germany",
            deathPlace: "Columbus, Franklin, Ohio, United States",
            birthDate: "10 July 1834",
            deathDate: "8 April 1899",
            parents: [
                crescentiaHassConfig,
                {
                    name: "Constantin Volk",
                    sex: "Male",
                    birthPlace: "Schramberg, Rottweil, Baden-Wuerttemberg, Germany",
                    deathPlace: "Schramberg, Rottweil, Baden-Wuerttemberg, Germany",
                    birthDate: "1796",
                    deathDate: "2 February 1844",
                    parents: [
                        {
                            name: "Katar Ehle",
                            sex: "Female",
                            birthPlace: "UNKNOWN",
                            birthDate: "UNKNOWN",
                            deathDate: "UNKNOWN"
                        },
                        {
                            name: "Fidelis Volk",
                            sex: "Male",
                            birthPlace: "UNKNOWN",
                            birthDate: "UNKNOWN",
                            deathDate: "UNKNOWN"
                        }
                    ]
                }
            ]
        },
        {
            name: "Casper Deibel",
            sex: "Male",
            birthPlace: "Württemberg, Germany",
            deathPlace: "Columbus, Franklin, Ohio, United States",
            birthDate: "6 January 1828",
            deathDate: "23 December 1878"
        }
    ]
}