import { allenCoxConfig } from "./allen-cox/allen-cox.config";
import { emmaSaintJohnConfig } from "./emma-saint-john/emma-saint-john.config";

// COMPLETE
export const margaretDeibelConfig = {
    name: "Margaret Mary Deibel",
    sex: "Female",
    birthPlace: "Detroit, Michigan, United States",
    birthDate: "24 November 1927",
    deathDate: "N/A",
    imageUrl: "./images/margaret-deibel.jpg",
    parents: [
        {
            name: "Marie Agnes Cox",
            sex: "Female",
            birthPlace: "Onaway, Presque Isle, Michigan, United States",
            deathPlace: "Mount Pleasant, Isabelle, Michigan, United States",
            birthDate: "10 July 1901",
            deathDate: "22 February 1991",
            imageUrl: "./images/marie-agnes-cox.jpg",
            parents: [
                emmaSaintJohnConfig,
                allenCoxConfig
            ]
        },
        {
            name: "Daniel Aloysius Dacey",
            sex: "Male",
            birthPlace: "Detroit, Wayne, Michigan, United States",
            deathPlace: "Detroit, Wayne, Michigan, United States",
            birthDate: "6 November 1896",
            deathDate: "16 May 1961",
            parents: [
                {
                    name: "Margarete Ellen (Maggie) O'Connor Dacy",
                    sex: "Female",
                    birthPlace: "Detroit, Michigan, United States",
                    deathPlace: "Detroit, Michigan, United States",
                    birthDate: "5 November 1867",
                    deathDate: "19 February 1928",
                    imageUrl: "./images/margarete-oconnor.jpg",
                    parents: [
                        {
                            name: "Mary Fitzgerald",
                            sex: "Female",
                            birthPlace: "Galbally, Limerick, Ireland",
                            deathPlace: "Detroit, Wayne, Michigan, United States",
                            birthDate: "October 1842",
                            deathDate: "23 June 1915",
                            parents: [
                                {
                                    name: "Ellen Finn",
                                    sex: "Female",
                                    birthPlace: "Liscaroll, Ireland",
                                    deathPlace: "Clonakilty, Ireland",
                                    birthDate: "1813",
                                    deathDate: "1890"
                                },
                                {
                                    name: "Michael Fitzgerald",
                                    sex: "Male",
                                    birthPlace: "Limerick, Ireland",
                                    deathPlace: "Caledonia County, Vermont, United States",
                                    birthDate: "~1820",
                                    deathDate: "12 March 1889",
                                    parents: [
                                        {
                                            name: "Richard Fitzgerald",
                                            sex: "Male",
                                            birthPlace: "UNKNOWN",
                                            deathPlace: "UNKNOWN",
                                            birthDate: "UNKNOWN",
                                            deathDate: "UNKNOWN"
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            name: "Pierce 'Piney' O'Connor",
                            sex: "Male",
                            birthPlace: "Kerry, Ireland",
                            deathPlace: "Detroit, Michigan, United States",
                            birthDate: "September 1834",
                            deathDate: "23 February 1919",
                            parents: [
                                {
                                    name: "John O'Connor",
                                    sex: "Male",
                                    birthPlace: "Limerick, Ireland",
                                    birthDate: "~1814",
                                    deathDate: "UNKNOWN"
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "Daniel Aloysius Dacy",
                    sex: "Male",
                    birthPlace: "Detroit, Wayne, Michigan, United States",
                    deathPlace: "Detroit, Wayne, Michigan, United States",
                    birthDate: "7 August 1866",
                    deathDate: "13 December 1901",
                    parents: [
                        {
                            name: "Mary Ann Keenan or Cannane",
                            sex: "Female",
                            birthPlace: "Michigan, United States",
                            deathPlace: "Detroit, Wayne, Michigan, United States",
                            birthDate: "August 1838",
                            deathDate: "22 February 1900",
                            parents: [
                                {
                                    name: "Maria 'Mary' Franklin",
                                    sex: "Female",
                                    birthPlace: "Ireland",
                                    deathPlace: "UNKNOWN",
                                    birthDate: "UNKNOWN",
                                    deathDate: "UNKNOWN"
                                },
                                {
                                    name: "Michaelis 'Michael' Canane",
                                    sex: "Male",
                                    birthPlace: "Ireland",
                                    deathPlace: "UNKNOWN",
                                    birthDate: "UNKNOWN",
                                    deathDate: "UNKNOWN"
                                }
                            ]
                        },
                        {   // POLICE OFFICER - died of brain clot after car accident (see article)
                            name: "John Dacy",
                            sex: "Male",
                            birthPlace: "Desertserges, Cork, Ireland",
                            deathPlace: "Detroit, Wayne, Michigan, United States",
                            birthDate: "29 June 1832",
                            deathDate: "27 October 1908",
                            imageUrl: "./images/john-dacy.jpg",
                            parents: [
                                {
                                    name: "Marie Riordan",
                                    sex: "Female",
                                    birthPlace: "Ireland",
                                    birthDate: "~1815",
                                    deathDate: "UNKNOWN"
                                },
                                {
                                    name: "Danielis 'Daniel' Deasy",
                                    sex: "Male",
                                    birthPlace: "Southwestern, County Cork, Ireland",
                                    deathPlace: "UNKNOWN",
                                    birthDate: "~1815",
                                    deathDate: "UNKNOWN"
                                }
                            ]
                        } 
                    ]
                },
            ]
        }
    ]
}