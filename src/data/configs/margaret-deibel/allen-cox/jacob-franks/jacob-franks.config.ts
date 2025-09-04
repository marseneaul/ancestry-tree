import { henrySmithStory } from "../../../../stories/henry-smith";
import { philipSmithStory } from "../../../../stories/philip-smith";
import { conradMichaelFranksConfig } from "./conrad-michael-franks.config";
import { jacobMichaelFranksConfig } from "./jacob-michael-franks.config";

export const jacobFranksConfig = {
    name: "Jacob Conrad Franks", // paid sureties for a new bar (divine bar)
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
            name: "Cornelius E. Franks",
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
                            {
                            // Manufactured powder
                            name: "Heinrich 'Henry' Barnabus Smith",
                            sex: "Male",
                            birthPlace: "Antietam Farm, Frederick, Maryland, United States",
                            deathPlace: "Yorks Run, Fayette, Pennsylvania, United States",
                            birthDate: "25 February 1752",
                            deathDate: "10 March 1838",
                            story: henrySmithStory,
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
                                {  
                                    name: "Philip Smith (Schmidt)",
                                    sex: "Male",
                                    birthPlace: "Cologne, Koln, Nordrhein-Westfalen, Germany",
                                    deathPlace: "Steubenville, Jefferson, Ohio, United States",
                                    birthDate: "18 May 1725",
                                    deathDate: "14 June 1814",
                                    story: philipSmithStory,
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