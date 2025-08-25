import { charlesAndrewDiebelConfig } from "./charles-andrew-diebel.config";
import { maryMerkConfig } from "./mary-merk.config";

// COMPLETE
export const charlesDeibelConfig = {
    name: "Charles Ambrose Deibel",
    sex: "Male",
    birthPlace: "Columbus, Franklin, Ohio, United States",
    birthDate: "2 February 1928",
    deathDate: "12 August 2016",
    imageUrl: "./src/images/charlie-deibel.jpg",
    parents: [
        {
            name: "Walter John Diebel",
            sex: "Male",
            birthPlace: "Columbus, Franklin, Ohio, United States",
            birthDate: "3 December 1887",
            deathDate: "10 June 1946",
            parents: [
                maryMerkConfig,
                charlesAndrewDiebelConfig
            ]
        },
        {
            name: "Florence M Muth",
            sex: "Female",
            birthPlace: "Columbus, Franklin, Ohio, United States",
            birthDate: "20 May 1891",
            deathDate: "8 January 1953",
            parents: [
                {
                    name: "Josephine Johanna Scully",
                    sex: "Female",
                    birthPlace: "Ohio, United States",
                    birthDate: "12 March 1863",
                    deathDate: "6 September 1933",
                    parents: [
                        {
                            name: "Johanna Bastable",
                            sex: "Female",
                            birthPlace: "Ireland",
                            birthDate: "~1838",
                            deathDate: "UNKNOWN"
                        },
                        {
                            name: "William Scully",
                            sex: "Male",
                            birthPlace: "Ireland",
                            birthDate: "~1830",
                            deathDate: "UNKNOWN",
                        }
                    ]
                },
                {
                    name: "John J Muth",
                    sex: "Male",
                    birthPlace: "Columbus, Franklin, Ohio, United States",
                    birthDate: "24 February 1859",
                    deathDate: "16 February 1915",
                    parents: [
                        {
                            name: "Catherine Green",
                            sex: "Female",
                            birthPlace: "Ireland",
                            birthDate: "1834",
                            deathDate: "1874"
                        },
                        {
                            name: "John Muth",
                            sex: "Male",
                            birthPlace: "Bavaria, Germany",
                            birthDate: "24 April 1825",
                            deathDate: "14 July 1887",
                            parents: [
                                {
                                    name: "Margaret",
                                    sex: "Female",
                                    birthPlace: "Germany",
                                    birthDate: "UNKNOWN",
                                    deathDate: "UNKNOWN"
                                },
                                {
                                    name: "Gilbert Muth",
                                    sex: "Male",
                                    birthPlace: "Germany",
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
}