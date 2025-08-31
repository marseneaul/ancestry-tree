import { johnBlackwellConfig } from "./john-blackwell.config";

export const maryBlackwellConfig = {
    name: "Mary Blackwell",
    sex: "Female",
    birthPlace: "Ashbury, Berkshire, England, United Kingdom",
    deathPlace: "Highworth, Wiltshire, England, United Kingdom",
    birthDate: "22 October 1703",
    deathDate: "September 1788",
    parents: [
        {
            name: "Allice Deane",
            sex: "Female",
            birthPlace: "Uffington, Berkshire, England, United Kingdom",
            deathPlace: "Ashbury, Berkshire, England, United Kingdom",
            birthDate: "12 June 1658",
            deathDate: "1713",
            parents: [
                {
                    name: "Alicia",
                    sex: "Female",
                    birthPlace: "Uffington, Berkshire, England, United Kingdom",
                    deathPlace: "UNKNOWN",
                    birthDate: "~1635",
                    deathDate: "UNKNOWN"
                },
                {
                    name: "Anthony Deane",
                    sex: "Male",
                    birthPlace: "Uffington, Berkshire, England, United Kingdom",
                    deathPlace: "UNKNOWN",
                    birthDate: "~1630",
                    deathDate: "UNKNOWN"
                }
            ]
        },
        {
            name: "William Blackwell",
            sex: "Male",
            birthPlace: "Ashbury, Berkshire, England, United Kingdom",
            deathPlace: "UNKNOWN",
            birthDate: "~1658",
            deathDate: "UNKNOWN",
            parents: [
                johnBlackwellConfig
            ]
        }
    ]
};