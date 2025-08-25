import { jacobFranksConfig } from "./jacob-franks.config";
import { johnCoxConfig } from "./john-cox.config";

// COMPLETE
export const allenCoxConfig = {
    name: "Allen Duffy Cox",
    sex: "Male",
    birthPlace: "Onaway, Presque Isle, Michigan, United States",
    deathPlace: "Onaway, Presque Isle, Michigan, United States",
    birthDate: "22 January 1882",
    deathDate: "23 August 1906",
    imageUrl: "./src/images/allen-cox.jpg",
    parents: [
        {
            name: "Huldah Franks",
            sex: "Female",
            birthPlace: "UNKNOWN",
            deathPlace: "Michigan, United States",
            birthDate: "November 1864",
            deathDate: "UNKNOWN",
            parents: [
                {
                    name: "Rose Belle McDowell",
                    sex: "Female",
                    birthPlace: "Wayne Township, Ohio, United States",
                    birthDate: "February 1844",
                    deathDate: "UNKNOWN"
                },
                jacobFranksConfig
            ]
        },
        {
            name: "James D. Cox",
            sex: "Male",
            birthPlace: "Canada",
            deathPlace: "Onaway, Presque Isle, Michigan, United States",
            birthDate: "27 July 1860",
            deathDate: "8 May 1923",
            imageUrl: "./src/images/james-cox.jpg",
            parents: [
                {
                    name: "Ellen Duffy",
                    sex: "Female",
                    birthPlace: "Ontario, Canada",
                    deathPlace: "Pontiac, Oakland, Michigan, United States",
                    birthDate: "25 July 1831",
                    deathDate: "21 May 1912",
                    imageUrl: "./src/images/ellen-duffy.jpg",
                    parents: [
                        {
                            name: "Mary Christy",
                            sex: "Female",
                            birthPlace: "Ireland",
                            deathPlace: "UNKNOWN",
                            birthDate: "~1811",
                            deathDate: "UNKNOWN"
                        },
                        {
                            name: "William Duffy",
                            sex: "Male",
                            birthPlace: "Ireland",
                            deathPlace: "UNKNOWN",
                            birthDate: "~1809",
                            deathDate: "June 1879"
                        }
                    ]
                },
                johnCoxConfig
            ]
        }
    ]
}