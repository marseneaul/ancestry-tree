import { barbaraRankeConfig } from "./barbara-ranke.config";
import { friedrichMoserConfig } from "./friedrich-moser.config";
import { maryZeilingerConfig } from "./mary-zeilinger.config";

// COMPLETE
export const lucilleArseneaultConfig = {
    name: "Lucille Florence Moser Arseneault",
    sex: "Female",
    birthPlace: "Flint, Michigan, United States",
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
                    name: "John George Bauer Jr.",
                    sex: "Male",
                    birthPlace: "Richville, Tuscola, Michigan, United States",
                    deathPlace: "Denmark Township, Tuscola County, Michigan, United States",
                    birthDate: "7 February 1870",
                    deathDate: "18 May 1944",
                    parents: [
                        {
                            name: "Anna Barbara Riechle",
                            sex: "Female",
                            birthPlace: "Mähringen, Tubingen, Baden-Wuerttemberg, Germany",
                            deathPlace: "Richville, Tuscola, Michigan, United States",
                            birthDate: "11 December 1822",
                            deathDate: "22 November 1894"
                        },
                        {
                            name: "Johann Jakob Bauer",
                            sex: "Male",
                            birthPlace: "Mähringen, Tubingen, Baden-Wuerttemberg, Germany",
                            deathPlace: "Richville, Tuscola, Michigan, United States",
                            birthDate: "14 November 1821",
                            deathDate: "22 August 1897"
                        }
                    ]
                }
            ]
        },
        {
            name: "Johann Adolph Sigismund Moser",
            sex: "Male",
            birthPlace: "Frankenmuth, Saginaw, Michigan, United States",
            birthDate: "3 October 1891",
            deathDate: "18 February 1960",
            parents: [
                barbaraRankeConfig,
                friedrichMoserConfig
            ]
        }

    ]
}