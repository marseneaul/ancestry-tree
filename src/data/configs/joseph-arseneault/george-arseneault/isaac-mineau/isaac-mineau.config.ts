import { claudeMineauConfig } from "./claude-mineau.config";
import { marieJolyConfig } from "./marie-joly.config";

export const isaacMineauConfig = {
    name: "Isaac Mineau",
    sex: "Male",
    birthPlace: "Louiseville, Maskinongé, Quebec, Canada",
    deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
    birthDate: "19 May 1807",
    deathDate: "16 December 1881",
    parents: [
        {
            name: "Angelique Desmarais",
            sex: "Female",
            birthPlace: "St Ours, Richelieu, Quebec, Canada",
            deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
            birthDate: "30 October 1784",
            deathDate: "6 June 1862",
            parents: [] // https://www.ancestry.com/family-tree/person/tree/113414159/person/292538313749/facts?usePUBJs=true
        },
        {
            name: "Pierre Mineau",
            sex: "Male",
            birthPlace: "Louiseville, Maskinongé, Quebec, Canada",
            deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
            birthDate: "1 April 1780",
            deathDate: "20 November 1856",
            parents: [
                marieJolyConfig,
                claudeMineauConfig
            ]
        }
    ]
};