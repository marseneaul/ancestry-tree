import { antoineArseneauConfig } from "./antoine-arseneau.config";
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
            name: "Marie Laurence Mineau",
            sex: "Female",
            birthPlace: "Louiseville, Maskinongé, Quebec, Canada",
            birthDate: "20 December 1832",
            deathDate: "8 August 1912",
            parents: []
        },
        {
            name: "Louis Arsenault",
            sex: "Male",
            birthPlace: "Louiseville, Maskinongé, Quebec, Canada",
            birthDate: "15 February 1830",
            deathDate: "14 March 1868",
            parents: [
                rosalieLambertConfig,
                antoineArseneauConfig
            ]
        }
    ]
}