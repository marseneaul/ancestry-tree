import { ferdinandNeefConfig } from "./ferdinand-neef.config";

// COMPLETE
export const crescentiaHassConfig = {
    name: "Crescentia Haas",
    sex: "Female",
    birthPlace: "UNKNOWN",
    deathPlace: "Schramberg, Rottweil, Baden-Wuerttemberg, Germany",
    birthDate: "1800",
    deathDate: "1849",
    parents: [  // Questionable connection
        {   
            name: "Monika Neef",
            sex: "Female",
            birthPlace: "UNKNOWN",
            birthDate: "1773",
            deathDate: "22 March 1838",
            parents: [
                {
                    name: "Josepha Maurer",
                    sex: "Female",
                    birthPlace: "UNKNOWN",
                    birthDate: "~1750",
                    deathDate: "UNKNOWN"
                },
                ferdinandNeefConfig
            ]
        },
        {
            name: "Johannes Haas",
            sex: "Male",
            birthPlace: "UNKNOWN",
            birthDate: "1777",
            deathDate: "UNKNOWN"
        }
    ]
}