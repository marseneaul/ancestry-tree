import { jacquesArchambaultStory } from "../../../../stories/jacques-archambault";
import { paulChalifourStory } from "../../../../stories/paul-chalifour";

export const marieBibaultConfig = {
    name: "Marie Jeanne Bibault",
    sex: "Female",
    birthPlace: "Linctôt, Bécancour, Québec, Canada",
    deathPlace: "Yamaska, Monteregie Region, Quebec, Canada",
    birthDate: "12 September 1674",
    deathDate: "12 February 1748",
    parents: [
        {
            name: "Jeanne Chalifour",
            sex: "Female",
            birthPlace: "Quebec, Capitale-Nationale Region, Quebec, Canada",
            deathPlace: "Trois-Rivières, Mauricie Region, Quebec, Canada",
            birthDate: "22 February 1654",
            deathDate: "1682",
            parents: [
                {   
                    name: "Jacquette-Françoise Archambault",
                    sex: "Female",
                    birthPlace: "Dompierre-sur-Mer, Departement de la Charente-Maritime, Poitou-Charentes, France",
                    deathPlace: "Quebec, Capitale-Nationale Region, Quebec, Canada",
                    birthDate: "26 December 1632",
                    deathDate: "~1700",
                    parents: [
                        {
                            name: "Francoise Tournault Toureau",
                            sex: "Female",
                            birthPlace: "Lardilliere, Dompierre-sur-Mer, La Rochelle, Manche, Basse-Normandie, France",
                            deathPlace: "Montreal City, Montréal, Quebec, Canada",
                            birthDate: "11 November 1600",
                            deathDate: "9 December 1663",
                            parents: []
                        },
                        {   //https://en.wikipedia.org/wiki/Jacques_Archambault
                            name: "Jacques Archambault",
                            sex: "Male",
                            birthPlace: "Lardilliere, Dompierre-en-Aunis, La Rochelle, Charente-Maritime, France",
                            deathPlace: " Riviere-des-Prairies, Montréal, Ile-de-Montreal, Quebec, Canada, New France",
                            birthDate: "11 November 1604",
                            deathDate: "15 February 1688",
                            imageUrl: "./images/jacques-archambault.jpg",
                            story: jacquesArchambaultStory,
                            parents: []
                        }
                    ]
                },
                {
                    name: "Paul Charles Chalifour",
                    sex: "Male",
                    birthPlace: "Perigny, Departement de la Charente-Maritime, Poitou-Charentes, France",
                    deathPlace: "Notre-Dame-des-Anges, Capitale-Nationale Region, Quebec, Canada",
                    birthDate: "26 December 1612",
                    deathDate: "13 October 1680",
                    story: paulChalifourStory,
                    parents: []
                }
            ]
        },
        {
            name: "François Bibaut",
            sex: "Male",
            birthPlace: "La Rochette, Departement de la Charente, Poitou-Charentes, France",
            deathPlace: "Saint-François-du-Lac, Centre-du-Quebec Region, Quebec, Canada",
            birthDate: "1642",
            deathDate: "23 September 1708",
            parents: []
        }
    ]
};