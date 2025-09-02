import { antoineArseneauConfig } from "./antoine-arseneau.config";
import { isaacMineauConfig } from "./isaac-mineau.config";
import { rosalieLambertConfig } from "./rosalie-lambert.config";

export const georgeArseneaultConfig = {
    name: "George Louis Arseneault", // Mill operative
    sex: "Male",
    birthPlace: "St-Etienne-Des-Gras, St-Maurice, PQ, Canada",
    deathPlace: "Flint, Genesee, Michigan",
    birthDate: "31 May 1863",
    deathDate: "4 March 1931",
    imageUrl: "./images/george-louis-arseneault.jpg",
    parents: [
        {   
            name: "Emerentienne Marie Laurence Mineau",
            sex: "Female",
            birthPlace: "Louiseville, Maskinongé, Quebec, Canada",
            deathPlace: "St-Mathieu, St-Maurice County, Quebec, Canada",
            birthDate: "20 December 1832",
            deathDate: "6 August 1912",
            parents: [ //https://en.wikipedia.org/wiki/Marin_Boucher
                {
                    name: "Emelie Beland",
                    sex: "Female",
                    birthPlace: "Louiseville, Maskinongé, Quebec, Canada",
                    deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
                    birthDate: "19 October 1805",
                    deathDate: "18 November 1875"
                },
                isaacMineauConfig
            ]
        },
        {
            name: "Louis R Arsenault",
            sex: "Male",
            birthPlace: "Louiseville, Maskinongé, Quebec, Canada",
            deathPlace: "St-Etienne-des-Gres, Quebec, Canada",
            birthDate: "15 February 1830",
            deathDate: "14 March 1868",
            parents: [
                rosalieLambertConfig,
                antoineArseneauConfig
            ]
        }
    ]
}