import { charlesDupontConfig } from "./charles-dupont.config";

export const paulMichelDupontConfig = {
	name: "Paul-Michel Dupont",
	sex: "Male",
	birthPlace: "Saint-Jean, Mortagne, Perche, Orne, Normandie, France",
	deathPlace: "Perche, Orne, Basse-Normandie, France",
	birthDate: "1569",
	deathDate: "8 April 1608",
    parents: [
        {
        	name: "Xaintine Aubry",
        	sex: "Female",
        	birthPlace: "Mortagne, Orne, Basse-Normandie, France",
        	deathPlace: "Motagne, Perche, Orne, Normandie, France",
        	birthDate: "1540",
        	deathDate: "1600",
            parents: [
                {
                	name: "Jeanne Pele",
                	sex: "Female",
                	birthPlace: "Vilaine, Yonne, Bourgogne, France",
                	deathPlace: "Vilaine, Yonne, Bourgogne, France",
                	birthDate: "19 January 1507",
                	deathDate: "1565"
                },
                {
                	name: "Gilles Aubry",
                	sex: "Male",
                	birthPlace: "Vilaine, Yonne, Bourgogne, France",
                	deathPlace: "Vilaine, Yonne, Bourgogne, France",
                	birthDate: "1515",
                	deathDate: "1570",
                    parents: [
                        {
                        	name: "Anne Frichot",
                        	sex: "Female",
                        	birthPlace: "Vilaine, Yonne, Bourgogne, France",
                        	deathPlace: "Vilaine, Yonne, Bourgogne, France",
                        	birthDate: "1490",
                        	deathDate: "UNKNOWN"
                        },
                        {
                        	name: "Charles Aubry",
                        	sex: "Male",
                        	birthPlace: "Vilaine, Yonne, Bourgogne, France",
                        	deathPlace: "Vilaine, Yonne, Bourgogne, France",
                        	birthDate: "1490",
                        	deathDate: "1590"
                        }
                    ]
                }

            ]
        },
        {
        	name: "Denis Dupont",
        	sex: "Male",
        	birthPlace: "Mortagne, Orne, Basse-Normandie, France",
        	deathPlace: "Ruelle Saint-Jean, Mortagne Au Perche, Orne, Normandie, France",
        	birthDate: "10 April 1540",
        	deathDate: "1575",
            parents: [
                {
                	name: "Priçille Marguerite Lemiere Collineau DeMontaguerre",
                    sex: "Female",
                	birthPlace: "Mortagne, Orne, Basse-Normandie, France",
                	deathPlace: "Rochefort, Allier, Auvergne, France",
                	birthDate: "1515",
                	deathDate: "1615"
                },
                charlesDupontConfig
            ]
        }
    ]
};