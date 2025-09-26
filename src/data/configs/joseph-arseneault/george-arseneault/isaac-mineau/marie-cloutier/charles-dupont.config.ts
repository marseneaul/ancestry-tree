import { francoisDupontConfig } from "./francois-dupont/francois-dupont.config";

export const charlesDupontConfig = {
	name: "Charles Louis Dupont",
	sex: "Male",
	birthPlace: "Langonnet, Morbihan, Bretagne, France",
	deathPlace: "Langonnet, Morbihan, Bretagne, France",
	birthDate: "1515",
	deathDate: "1570",
    parents: [
        {
        	name: "Cara Fournier",
        	sex: "Female",
        	birthPlace: "France",
        	deathPlace: "UNKNOWN",
        	birthDate: "1486",
        	deathDate: "UNKNOWN"
        },
        {
        	name: "Charles Louis Du Pont",
        	sex: "Male",
        	birthPlace: "Aquitaine, France",
        	deathPlace: "Mortagne-sur-Sèvre, Vendee, Pays de la Loire, France",
        	birthDate: "1486",
        	deathDate: "1515",
            parents: [
                {
                	name: "Marie Hervy",
                	sex: "Female",
                	birthPlace: "Aquitaine, France",
                	deathPlace: "Aquitaine, France",
                	birthDate: "1455",
                	deathDate: "1508"
                },
                francoisDupontConfig
            ]
        }
    ]
};