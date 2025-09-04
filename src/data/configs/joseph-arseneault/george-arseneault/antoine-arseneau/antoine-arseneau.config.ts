import { louisJosephArsenaultConfig } from "./louis-joseph-arseneau/louis-joseph-arseneau.config";
import { marieCarronConfig } from "./marie-carron.config";
import { marieRivardLavigneConfig } from "./marie-rivard-lavigne.config";

export const antoineArseneauConfig = {
    name: "Antoine Alphonse Arseneau",
    sex: "Male",
    birthPlace: "Louiseville, Maskinongé, Quebec, Canada",
    deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
    birthDate: "8 August 1793",
    deathDate: "24 June 1886",
    parents: [
        {
            name: "Marie Victoire Damphousse",
            sex: "Female",
            birthPlace: "La Pocatière, Kamouraska, Quebec, Canada",
            deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
            birthDate: "9 April 1773",
            deathDate: "23 September 1804",
            parents: [
                marieCarronConfig,
                {
                    name: "François Dominique Damphousse",
                    sex: "Male",
                    birthPlace: "Montmagny, Quebec City, Quebec, Canada",
                    deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
                    birthDate: "6 December 1746",
                    deathDate: "27 November 1805",
                    parents: [
                        {
                            name: "Marie Louise Dandurand",
                            sex: "Female",
                            birthPlace: "St. Thomas, Quebec, Canada",
                            deathPlace: "St Roch des Aulnaies, Quebec, Canada",
                            birthDate: "31 August 1702",
                            deathDate: "26 December 1779",
                        },
                        {
                            name: "Jean Anselme Damphous Sieur",
                            sex: "Male",
                            birthPlace: "St Sauveur Eveché, Aix en Provence, France",
                            deathPlace: "Quebec, Canada",
                            birthDate: "5 March 1707",
                            deathDate: "25 February 1769"
                        }
                    ]
                }
            ]
        },
        {
            name: "Louis Arseneau",
            sex: "Male",
            birthPlace: "Louiseville, Maskinongé, Quebec, Canada",
            deathPlace: "St-Stanislas-de-Champlain, Les Chenaux, Quebec, Canada",
            birthDate: "28 August 1769",
            deathDate: "10 August 1849",
            parents: [
                marieRivardLavigneConfig,
                louisJosephArsenaultConfig
            ]
        }
    ]
}