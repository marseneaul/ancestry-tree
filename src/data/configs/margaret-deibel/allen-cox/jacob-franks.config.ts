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
                            name: "Andrew Jackson Miller Sr.",
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
                    name: "Mary Magdalena Smith",
                    sex: "Female",
                    birthPlace: "Fayette City, Fayette, Pennsylvania, United States",
                    birthDate: "31 December 1786",
                    deathDate: "6 October 1868",
                    parents: [
                        {
                            name: "Barbara Grovenstadt",
                            sex: "Female",
                            birthPlace: "UNKNOWN",
                            deathPlace: "UNKNOWN",
                            birthDate: "UNKNOWN",
                            deathDate: "1839"
                        },
                        {
                            name: "Henry Barnabus Smith",
                            sex: "Male",
                            birthPlace: "Antietam Farm, Frederick, Maryland, United States",
                            deathPlace: "Yorks Run, Fayette, Pennsylvania, United States",
                            birthDate: "25 February 1752",
                            deathDate: "10 March 1838"
                        }
                    ]
                },
                conradMichaelFranksConfig
            ]
        }
    ]
}