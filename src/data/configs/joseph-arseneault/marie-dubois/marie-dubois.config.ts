import { francoisDuboisStory } from "../../../stories/francois-dubois";
import { marieDuboisStory } from "../../../stories/marie-dubois";
import { francoisDuboisDitLaFrance1799Config } from "./francois-dubois-dit-lafrance-1799.config";
import { thomasTherrienConfig } from "./thomas-therrien.config";

export const marieDuboisConfig = {
    name: "Marie Leonie Dubois",
    sex: "Female",
    birthPlace: "Nicolet, Canada East, Canada",
    deathPlace: "Flint, Genesee County, Michigan, United States",
    birthDate: "31 March 1861",
    deathDate: "27 November 1934",
    imageUrl: "./images/marie-leonie-dubois.jpg",
    story: marieDuboisStory,
    parents: [
        {
            name: "Sophie Marie Therrien dit Landry",
            sex: "Female",
            birthPlace: "Baie-du-Febvre, Nicolet-Yamaska, Quebec, Canada",
            deathPlace: "Gentilly, Nicolet, Quebec, Canada",
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
                    parents: [
                        {
                            name: "Marie Anne Benoit",
                            sex: "Female",
                            birthPlace: "Baie-du-Febvre, Yamaska, Quebec, Canada",
                            deathPlace: "St-Gregoire, Nicolet, Quebec, Canada",
                            birthDate: "14 January 1786",
                            deathDate: "16 April 1846",
                            parents: [
                                {
                                    name: "Marie-Antoinette Lafond",
                                    sex: "Female",
                                    birthPlace: "Baie-du-Febvre, Yamaska, Quebec, Canada",
                                    deathPlace: "Yamaska, Quebec, Canada",
                                    birthDate: "17 July 1751",
                                    deathDate: "17 April 1826",
                                    parents: []
                                },
                                {
                                    name: "Antoine Benoit dit Laforest",
                                    sex: "Male",
                                    birthPlace: "Baie-du-Febvre, Centre-du-Quebec Region, Quebec, Canada",
                                    deathPlace: "Baie-du-Febvre, Centre-du-Quebec Region, Quebec, Canada",
                                    birthDate: "19 November 1744",
                                    deathDate: "18 November 1795",
                                    parents: [
                                        {
                                            name: "Marie-Madeleine Catherine Burel/Burelle",
                                            sex: "Female",
                                            birthPlace: "Verchères, Quebec, Canada",
                                            deathPlace: "Baie-du-Febvre, Centre-du-Quebec Region, Quebec, Canada",
                                            birthDate: "18 November 1708",
                                            deathDate: "29 May 1792",
                                            parents: []
                                        },
                                        {
                                            name: "Joseph Benoit dit Laforest",
                                            sex: "Male",
                                            birthPlace: "Baie-du-Febvre, Centre-du-Quebec Region, Quebec, Canada",
                                            deathPlace: "Quebec, Capitale-Nationale Region, Quebec, Canada",
                                            birthDate: "29 April 1701",
                                            deathDate: "30 August 1759",
                                            parents: []
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            name: "Antoine Desilets",
                            sex: "Male",
                            birthPlace: "Becancour, Nicolet, Quebec, Canada",
                            deathPlace: "St. Gregoire, Quebec, Canada",
                            birthDate: "29 June 1776",
                            deathDate: "18 December 1856"
                        }
                    ]
                },
                thomasTherrienConfig
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
            story: francoisDuboisStory,
            parents: [
                {
                    name: "Sophie Beaufort-Brunelle",
                    sex: "Female",
                    birthPlace: "Canada",
                    deathPlace: "Manchester, Hillsborough, New Hampshire, United States",
                    birthDate: "2 April 1796",
                    deathDate: "3 August 1832",
                    parents: [
                        {
                            name: "Marguerite Rivard",
                            sex: "Female",
                            birthPlace: "Champlain, Quebec, Canada",
                            deathPlace: "Richelieu, Quebec, Canada",
                            birthDate: "21 June 1761",
                            deathDate: "14 February 1827"
                        },
                        {
                            name: "Joseph Antoine Beaufort Brunel",
                            sex: "Male",
                            birthPlace: "Bécancour, Quebec, Canada",
                            deathPlace: "Gentilly, Quebec, Canada",
                            birthDate: "15 January 1763",
                            deathDate: "4 June 1830"
                        }
                    ]
                },
                francoisDuboisDitLaFrance1799Config
            ]
        }
    ]
};