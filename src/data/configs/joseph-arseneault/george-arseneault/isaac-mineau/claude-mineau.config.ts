import { marieBibaultConfig } from "./marie-bibault.config";
import { reneMineauConfig } from "./rene-mineau.config";

export const claudeMineauConfig = {
    name: "Claude Mineau",
    sex: "Male",
    birthPlace: "Louiseville, Maskinongé, Quebec, Canada",
    deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
    birthDate: "3 March 1744",
    deathDate: "13 August 1817",
    parents: [
        {
            name: "Marie Josephte Morneau",
            sex: "Female",
            birthPlace: "Quebec, Canada",
            deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
            birthDate: "22 September 1709",
            deathDate: "4 January 1774",
            parents: [
                marieBibaultConfig,
                {
                    name: "Pierre Francois Morneau",
                    sex: "Male",
                    birthPlace: "Batiscan, Québec, Canada",
                    deathPlace: "St-Michel d'Yamaska, Quebec, Canada",
                    birthDate: "28 August 1685",
                    deathDate: "29 January 1750",
                    parents: []
                }
            ]
        },
        reneMineauConfig
    ]
};