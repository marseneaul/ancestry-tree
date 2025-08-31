import { barbaraRankeConfig } from "./barbara-ranke.config";
import { friedrichMoserConfig } from "./friedrich-moser.config";
import { maryZeilingerConfig } from "./mary-zeilinger.config";

// COMPLETE
export const lucilleArseneaultConfig = {
    name: "Lucille Florence Moser Arseneault", // Served in WWII Navy
    sex: "Female",
    birthPlace: "Flint, Genesee County, Michigan, United States",
    deathPlace: "Asheville, Buncombe County, North Carolina, United States",
    birthDate: "4 Jan 1922",
    deathDate: "27 Oct 2014",
    imageUrl: "./images/lucille-arseneault.jpg",
    parents: [
        {
            name: "Lydia Bauer Moser",
            sex: "Female",
            birthPlace: "Richville, Michigan, United States",
            deathPlace: "UNKNOWN",
            birthDate: "1897",
            deathDate: "1962",
            parents: [
                maryZeilingerConfig,
                {
                    name: "John George Bauer Jr.", // WWII Draft Card
                    sex: "Male",
                    birthPlace: "Richville, Tuscola, Michigan, United States",
                    deathPlace: "Denmark Township, Tuscola County, Michigan, United States",
                    birthDate: "7 February 1870",
                    deathDate: "18 May 1944",
                    parents: [ // John G. Bauer and Maria B. Kunder from certificate
                        {
                            name: "Anna Barbara Frisch", // Fischer?
                            sex: "Female",
                            birthPlace: "Bavaria, Germany",
                            deathPlace: "Richville, Tuscola, Michigan, United States",
                            birthDate: "1825",
                            deathDate: "16 May 1893"
                        },
                        { 
                            name: "Johann George 'John' Bauer",
                            sex: "Male",
                            birthPlace: "Franconia, Bavaria, Germany",
                            deathPlace: "Richville, Tuscola, Michigan, United States",
                            birthDate: "30 December 1820",
                            deathDate: "18 January 1885",
                            parents: [
                                {
                                    name: "Louisa",
                                    sex: "Female",
                                    birthPlace: "Germany",
                                    deathPlace: "UNKNOWN",
                                    birthDate: "UNKNOWN",
                                    deathDate: "UNKNOWN"
                                },
                                {
                                    name: "George Bauer",
                                    sex: "Female",
                                    birthPlace: "Germany",
                                    deathPlace: "UNKNOWN",
                                    birthDate: "UNKNOWN",
                                    deathDate: "UNKNOWN"
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {   // Tall, light brown hair, light blue eyes, medium build (WWI and WWII draft cards)
            name: "Johann Adolph Sigismund Moser",
            sex: "Male",
            birthPlace: "Frankenmuth, Saginaw, Michigan, United States",
            deathPlace: "Flint, Genesee County, Michigan, United States",
            birthDate: "3 October 1891",
            deathDate: "18 February 1960",
            parents: [
                barbaraRankeConfig,
                friedrichMoserConfig
            ]
        }

    ]
}