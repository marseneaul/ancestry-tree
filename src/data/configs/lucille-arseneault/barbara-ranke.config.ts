import { johannZehnderConfig } from "./johann-zehnder.config";

// COMPLETE
export const barbaraRankeConfig = {
    name: "Barbara Gertrud Caroline Ranke",
    sex: "Female",
    birthPlace: "Frankenmuth, Saginaw, Michigan, United States",
    deathPlace: "UNKNOWN",
    birthDate: "20 January 1864",
    deathDate: "1922",
    imageUrl: "./src/images/barbara-ranke.jpg",
    parents: [
        {
            name: "Maria Margaretha Zehnder",
            sex: "Female",
            birthPlace: "Mausendorf, Neuendettelsau, Ansbach, Bavaria, Germany",
            birthDate: "2 May 1841",
            deathDate: "8 December 1919",
            parents: [
                {
                    name: "Maria Margaretha Fuerwitt",
                    sex: "Female",
                    birthPlace: "Middle Franconia, Bavaria, Germany",
                    birthDate: "30 March 1812",
                    deathDate: "7 September 1888",
                    parents: [
                        {
                            name: "Anna Barbara Wittmann",
                            sex: "Female",
                            birthPlace: "UNKNOWN",
                            birthDate: "UNKNOWN",
                            deathDate: "28 December 1763",
                            parents: [
                                {
                                    name: "Stephan Whittmann",
                                    sex: "Male",
                                    birthPlace: "UNKNOWN",
                                    birthDate: "1736",
                                    deathDate: "1797"
                                }
                            ]
                        },
                        {
                            name: "John Fuerwitt",
                            sex: "Male",
                            birthPlace: "UNKNOWN",
                            birthDate: "UNKNOWN",
                            deathDate: "UNKNOWN"
                        }
                    ]
                },
                {
                    name: "Johann Stephan Zehnder",
                    sex: "Male",
                    birthPlace: "Weißenbronn, Heilsbronn, Landkreis Ansbach, Bayern, Germany",
                    birthDate: "10 May 1810",
                    deathDate: "30 March 1875",
                    parents: [
                        {
                            name: "Maria Barbara Weber",
                            sex: "Female",
                            birthPlace: "UNKNOWN",
                            birthDate: "1763",
                            deathDate: "15 May 1816"
                        },
                        johannZehnderConfig
                    ]
                }
            ]
        },
        {
            name: "Christian Friedrich Ranke",
            sex: "Male",
            birthPlace: "Saschen, Hasselwerder, Hannover, Kingdom of Prussia, Germany",
            birthDate: "16 January 1836",
            deathDate: "29 September 1918",
            parents: [
                {
                    name: "Dorothea Fuecksel",
                    sex: "Female",
                    birthPlace: "Colba, Germany",
                    birthDate: "25 July 1799",
                    deathDate: "1856"
                },
                {   // Listed parents are low quality
                    name: "John Michael Ranke",
                    sex: "Male",
                    birthPlace: "Coburg, Sachsen-Weimar, Middle Franconia, Bavaria, Germany",
                    birthDate: "24 February 1802",
                    deathDate: "17 May 1878"
                }
            ]
        }
    ]
}