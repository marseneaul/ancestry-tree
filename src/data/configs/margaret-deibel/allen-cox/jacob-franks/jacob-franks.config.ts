import { conradMichaelFranksConfig } from "./conrad-michael-franks.config";
import { jacobMichaelFranksConfig } from "./jacob-michael-franks.config";

export const jacobFranksConfig = {
    name: "Jacob Conrad Franks",
    sex: "Male",
    birthPlace: "Wayne Township, Ohio, United States",
    deathPlace: "Portland, Ionia, Michigan, United States",
    birthDate: "8 July 1844",
    deathDate: "9 February 1918",
    parents: [
        {
            name: "Sarah Ann Franks",
            sex: "Female",
            birthPlace: "Wayne Township, Ohio, United States",
            birthDate: "10 August 1824",
            deathDate: "6 February 1899",
            parents: [
                {
                    name: "Anna Katherine Elizabeth Miller",
                    sex: "Female",
                    birthPlace: "Virginia, United States",
                    deathPlace: "Wayne Township, Ohio, United States",
                    birthDate: "12 February 1781",
                    deathDate: "11 April 1854",
                    parents: [
                        {
                            name: "Barbara Hock",
                            sex: "Female",
                            birthPlace: "Virginia, United States",
                            birthDate: "29 September 1750",
                            deathDate: "1818",
                            parents: []
                        },
                        {
                            name: "Andrew Jackson Miller Sr.", // Fought in War of 1812
                            sex: "Male",
                            birthPlace: "Virginia, United States",
                            birthDate: "4 April 1743",
                            deathDate: "3 June 1816"
                        }
                    ]
                },
                jacobMichaelFranksConfig
            ]
        },
        {
            name: "Cornelius Franks",
            sex: "Male",
            birthPlace: "East Union, Wayne, Ohio, United States",
            deathPlace: "Orange, Ionia, Michigan, United States",
            birthDate: "1820",
            deathDate: "15 July 1896",
            parents: [
                {
                    name: "Mary Magdalena 'Polly' Smith",
                    sex: "Female",
                    birthPlace: "Fayette City, Fayette, Pennsylvania, United States",
                    deathPlace: "Smithville, Wayne, Ohio, United States",
                    birthDate: "21 December 1786",
                    deathDate: "6 October 1868",
                    parents: [
                        {
                            name: "Barbara / Elizabeth Grovenstadt",
                            sex: "Female",
                            birthPlace: "Fayette, Pennsylvania, United States",
                            deathPlace: "Fayette City, Fayette, Pennsylvania, United States",
                            birthDate: "1758",
                            deathDate: "10 August 1796"
                        },
                        {   // Fought as a minute man
                            // Manufactured powder
                            name: "Heinrich 'Henry' Barnabus Smith",
                            sex: "Male",
                            birthPlace: "Antietam Farm, Frederick, Maryland, United States",
                            deathPlace: "Yorks Run, Fayette, Pennsylvania, United States",
                            birthDate: "25 February 1752",
                            deathDate: "10 March 1838",
                            parents: [
                                {   // Typed out lengthy will
                                    name: "Barbara Markley",
                                    sex: "Female",
                                    birthPlace: "Cologne, Koln, Nordrhein-Westfalen, Germany",
                                    deathPlace: "Apple Creek, East Union, Wayne, Ohio, United States",
                                    birthDate: "1730",
                                    deathDate: "6 October 1819",
                                    parents: [] // path to parent with land plot!
                                },
                                {   // Captain Shamoka, fought in revolutionary war INDIAN SPY (https://www.ancestry.com/mediaui-viewer/collection/1030/tree/59059250/person/30494089996/media/a2fa169a-4f98-4812-8bd3-8b6da2fbec71?galleryindex=16&sort=-created), teutonic royalty
                                    //https://www.ancestry.com/mediaui-viewer/collection/1030/tree/59059250/person/30494089996/media/bfd5efbb-88cc-4f97-b43c-1033d0cb08f8?galleryindex=7&sort=-created
                                    // Played violin well and loved dances
                                    name: "Philip Smith (Schmidt)",
                                    sex: "Male",
                                    birthPlace: "Cologne, Koln, Nordrhein-Westfalen, Germany",
                                    deathPlace: "Steubenville, Jefferson, Ohio, United States",
                                    birthDate: "18 May 1725",
                                    deathDate: "14 June 1814",
                                    parents: [
                                        {
                                            name: "Anna Elisabetha Forster",
                                            sex: "Female",
                                            birthPlace: "Steinweiler, Germersheim, Rheinland-Pfalz, Germany",
                                            deathPlace: "Steinweiler, Ansbach, Bayern, Germany",
                                            birthDate: "1699",
                                            deathDate: "8 July 1759"
                                        },
                                        {
                                            name: "Johann Paul Schmidt",
                                            sex: "Male",
                                            birthPlace: "Rohrbach, Aichach-Friedberg, Bayern, Germany",
                                            deathPlace: "Schmidterhoff, Winnweiler, Bayern, Germany",
                                            birthDate: "1701",
                                            deathDate: "19 April 1767",
                                            parents: []
                                        }
                                    ]
                                }
                            ]
                        }
                    ]
                },
                conradMichaelFranksConfig
            ]
        }
    ]
}