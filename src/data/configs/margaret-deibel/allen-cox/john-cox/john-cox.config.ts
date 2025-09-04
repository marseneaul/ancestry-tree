import { johnDCoxStory } from "../../../../stories/john-d-cox";
import { jamesWardConfig } from "./james-ward.config";
import { mariaWilloughbyConfig } from "./maria-willoughby/maria-willoughby.config";
import { phillipCoxConfig } from "./phillip-cox.config";

export const johnCoxConfig = {
    name: "John Edwin Cox",
    sex: "Male",
    birthPlace: "Buckland, Berkshire, England, United Kingdom",
    deathPlate: "Gaylord, Otsego, Michigan, United States",
    birthDate: "6 June 1828",
    deathDate: "1 December 1897",
    imageUrl: "./images/john-cox-sr.jpg",
    story: johnDCoxStory,
    parents: [
        {
            name: "Mary Ann Ward",
            sex: "Female",
            birthPlace: "Aston, Oxfordshire, England, United Kingdom",
            deathPlace: "Thurlow, Hastings County, Ontario, Canada",
            birthDate: "18 February 1804",
            deathDate: "12 September 1888",
            parents: [
                mariaWilloughbyConfig,
                jamesWardConfig
            ]
        },
        {
            name: "Phillip Charles Cox",
            sex: "Male",
            birthPlace: "Buckland, Oxfordshire, England, United Kingdom",
            deathPlace: "Belleville, Hastings, Ontario, Canada",
            birthDate: "27 May 1802",
            deathDate: "12 March 1879",
            parents: [
                {
                    name: "Ann Abraham",
                    sex: "Female",
                    birthPlace: "Faringdon, Berkshire, England, United Kingdom",
                    deathPlace: "UNKNOWN",
                    birthDate: "27 May 1802",
                    deathDate: "~1837",
                    parents: [
                        {
                            name: "Ester Goyling",
                            sex: "Female",
                            birthPlace: "England, United Kingdom",
                            deathPlace: "UNKNOWN",
                            birthDate: "1733",
                            deathDate: "UNKNOWN"
                        },
                        {
                            name: "William Abraham",
                            sex: "Male",
                            birthPlace: "England, United Kingdom",
                            deathPlace: "England, United Kingdom",
                            birthDate: "1730",
                            deathDate: "1808"
                        }
                    ]
                },
                phillipCoxConfig
            ]
        }
    ]
}