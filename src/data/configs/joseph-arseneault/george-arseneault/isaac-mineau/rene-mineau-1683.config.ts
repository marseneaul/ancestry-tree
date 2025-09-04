import { marieCloutierConfig } from "./marie-cloutier/marie-cloutier.config";

export const reneMineau1683Config = {
    name: "Rene Mineau",
    sex: "Male",
    birthPlace: "Saint-Laurent, Ile D'Orléans, Québec, Canada",
    deathPlace: "Maskinongé, Quebec, Canada",
    birthDate: "10 October 1683",
    deathDate: "2 January 1750",
    parents: [
        {
            name: "M Jeanne Catherine Dufresne",
            sex: "Female",
            birthPlace: "Ste. Famille, Ile d'Orléans, Montmorency, Québec, Canada",
            deathPlace: "Saint-Laurent, Ile D'Orléans, Québec, Canada",
            birthDate: "18 November 1666",
            deathDate: "6 February 1711",
            parents: [
                {
                    name: "Anne Patin",
                    sex: "Female",
                    birthPlace: "Dieppe, Rouen, Normandie, France",
                    deathPlace: "Saint-Laurent-de-l'Île-d'Orléans, Capitale-Nationale Region, Quebec, Canada",
                    birthDate: "1634",
                    deathDate: "29 Novemeber 1700",
                    parents: []
                },
                {
                    name: "Pierre Dufresne",
                    sex: "Male",
                    birthPlace: "Rouen, Seine-Maritime, Haute-Normandie, France",
                    deathPlace: "Saint-Laurent-de-l'Île-d'Orléans, Capitale-Nationale Region, Quebec, Canada",
                    birthDate: "1629",
                    deathDate: "29 November 1687",
                    parents: []
                }
            ]
        },
        {
            name: "Rene Mineau",
            sex: "Male",
            birthPlace: "La Rochelle, Departement de la Charente-Maritime, Poitou-Charentes, France",
            deathPlace: "Saint-Laurent-de-l'Île-d'Orléans, Capitale-Nationale Region, Quebec, Canada",
            birthDate: "1658",
            deathDate: "17 January 1687",
            parents: [
                marieCloutierConfig,
                {
                    name: "Jean Celestin Migneault dit Chatillon",
                    sex: "Male",
                    birthPlace: "Châtillon-sous-Bagneux auj. Châtillon, France",
                    deathPlace: "Château-Richer, La Côte-de-Beaupré, Quebec",
                    birthDate: "20 April 1622-1627",
                    deathDate: ">26 February 1679",
                    parents: [
                        {                       
                            name: "Marguerite De Brie",
                            sex: "Female",
                            birthPlace: "Chatillon, Departement des Hauts-de-Seine, Île-de-France, France",
                            deathPlace: "Antony, Departement des Hauts-de-Seine, Île-de-France, France",
                            birthDate: "1606",
                            deathDate: "1660"
                        },
                        {
                            name: "Nicolas Mineau",
                            sex: "Male",
                            birthPlace: "Châtillon, Cote d'Or, Bourgogne, France",
                            deathPlace: "Sceaux, Hauts-de-Seine, Ile-de-France, France",
                            birthDate: "~1599",
                            deathDate: "10 November 1648"
                        }
                    ]
                }
            ]
        }
    ]
}