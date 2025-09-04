import { allenDuffyCoxStory } from "../../../stories/allen-duffy-cox";
import { jamesDCoxStory } from "../../../stories/james-d-cox";
import { jacobFranksConfig } from "./jacob-franks/jacob-franks.config";
import { johnCoxConfig } from "./john-cox/john-cox.config";

// COMPLETE
export const allenCoxConfig = {
    name: "Allen Duffy Cox",
    sex: "Male",
    birthPlace: "Onaway, Presque Isle, Michigan, United States",
    deathPlace: "Onaway, Presque Isle, Michigan, United States",
    birthDate: "22 January 1882",
    deathDate: "23 August 1906",
    imageUrl: "./images/allen-cox.jpg",
    story: allenDuffyCoxStory,
    parents: [
        {
            name: "Huldah Franks",
            sex: "Female",
            birthPlace: "Ohio, United States",
            deathPlace: "Onaway, Presque Isle, Michigan, United States",
            birthDate: "November 1864",
            deathDate: "19 February 1931",
            imageUrl: "./images/huldah-franks.jpg",
            parents: [
                {
                    name: "Rosanna Belle McDowell",
                    sex: "Female",
                    birthPlace: "Pennsylvania, United States",
                    deathPlace: "Orange, Ionia, Michigan, United States",
                    birthDate: "February 1844",
                    deathDate: "~1918",
                    parents: [
                        {
                            name: "Elizabeth Levers",
                            sex: "Female",
                            birthPlace: "Lancaster, Lancaster, Pennsylvania, United States",
                            deathPlace: "Wooster, Wayne, Ohio, United States",
                            birthDate: "17 February 1824",
                            deathDate: "1924",
                            parents: [
                                {
                                    name: "Elizabeth Licht",
                                    sex: "Female",
                                    birthPlace: "Dauphin County, Pennsylvania, United States",
                                    deathPlace: "West Brookfield, Stark County, Ohio, United States",
                                    birthDate: "5 August 1793",
                                    deathDate: "2 May 1873",
                                    imageUrl: "./images/elizabeth-licht.jpg",
                                    parents: []
                                },
                                {   // "1st Lieutenant" WILLIAM S LEVERS (Served in the War of 1812, civil, rev war)

                                    name: "William S Levers",
                                    sex: "Female",
                                    birthPlace: "Atlantic Ocean (Born at Sea), United States",
                                    deathPlace: "Seneca, Seneca, Ohio, United States",
                                    birthDate: "30 April 1792",
                                    deathDate: "27 May 1855",
                                    parents: [
                                        {
                                            name: "Elsche Vandergrift",
                                            sex: "Female",
                                            birthPlace: "Switzerland",
                                            deathPlace: "Philadelphia, Philadelphia, Pennsylvania, United States",
                                            birthDate: "1750",
                                            deathDate: "UNKNOWN",
                                            parents: []
                                        },
                                        {
                                            name: "Abraham Levers",
                                            sex: "Male",
                                            birthPlace: "Switzerland",
                                            deathPlace: "Philadelphia, Philadelphia, Pennsylvania, United States",
                                            birthDate: "1741",
                                            deathDate: "1795",
                                            parents: [] // British?
                                        }
                                    ]
                                }
                            ]
                        },
                        {   // Civil War
                            name: "John McDowell",
                            sex: "Male",
                            birthPlace: "Ballymoney Parish, Antrim, Ireland",
                            deathPlace: "UNKNOWN",
                            birthDate: "12 JUN 1825",
                            deathDate: "UNKNOWN",
                            parents: [
                                {
                                    name: "Elizabeth McIntyre",
                                    sex: "Female",
                                    birthPlace: "Kirkcolm, Wigtown, Scotland, United Kingdom",
                                    deathPlace: "Portpatrick, Wigtownshire, Scotland, United Kingdom",
                                    birthDate: "6 July 1824",
                                    deathDate: "1848–1851",
                                    parents: []
                                },
                                {
                                    name: "John Mc Dowall Sr",
                                    sex: "Male",
                                    birthPlace: "Mochrum, Wigtownshire, Scotland, United Kingdom",
                                    deathPlace: "West Millgrove, Wood, Ohio, United States",
                                    birthDate: "11 October 1794",
                                    deathDate: "2 November 1855",
                                    parents: []
                                }
                            ]
                        }
                    ]
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
            story: jamesDCoxStory,
            imageUrl: "./images/james-cox.jpg",
            parents: [
                {
                    name: "Ellen Duffy",
                    sex: "Female",
                    birthPlace: "Ontario, Canada",
                    deathPlace: "Pontiac, Oakland, Michigan, United States",
                    birthDate: "25 July 1831",
                    deathDate: "21 May 1912",
                    imageUrl: "./images/ellen-duffy.jpg",
                    parents: [
                        {
                            name: "Mary Christy",
                            sex: "Female",
                            birthPlace: "Ireland",
                            deathPlace: "UNKNOWN",
                            birthDate: "~1811",
                            deathDate: "UNKNOWN"
                        },
                        {   // Found in jail documents for manslaughter? (convicted in 1844, 5' 5 3/4")
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