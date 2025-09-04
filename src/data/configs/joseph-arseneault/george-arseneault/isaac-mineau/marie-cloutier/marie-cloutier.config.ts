import { zacharieClourierStory } from "../../../../../stories/zacharie-clourier";
import { paulMichelDupontConfig } from "./paul-michel-dupont.config";

export const marieCloutierConfig = {
    name: "Marie Louise Cloutier",
    sex: "Female",
    birthPlace: "Fontenay-le-Comte, Departement de la Vendée, Pays de la Loire, France",
    deathPlace: "Chateau Richer, Montmorency, Quebec, Canada",
    birthDate: "1632",
    deathDate: "22 June 1699",
    parents: [
        {
            name: "Xainte (Sainte) Dupont",
            sex: "Female",
            birthPlace: "Paroisse Saint-Jean, Mortagne, Perche, Orne, Normandie, France",
            deathPlace: "Chateau-Richer, Québec, Canada",
            birthDate: "1 January 1596",
            deathDate: "13 July 1680",
            parents: [
                {
                	name: "Perrine Rousseau",
                	sex: "Female",
                	birthPlace: "St-Jean, Mortagne-au-Perche, Orne, Normandie, France",
                	deathPlace: "St-Jean, Mortagne-au-Perche, Orne, Normandie, France",
                	birthDate: "1570",
                	deathDate: "1606"
                },
                paulMichelDupontConfig
            ]
        },
        {   // https://en.wikipedia.org/wiki/Zacharie_Cloutier
            name: "Zacharie Cloutier",
            sex: "Male",
            birthPlace: "18 July 1590",
            deathPlace: "17 September 1677",
            birthDate: "Mortagne-au-Perche, Departement de l'Orne, Basse-Normandie, France",
            deathDate: "Château-Richer, Montmorency, Québec, Canada",
            imageUrl: "./images/zacharie-cloutier.jpg",
            story: zacharieClourierStory,
            parents: [] // Goes for a bit more
        }
    ]
};