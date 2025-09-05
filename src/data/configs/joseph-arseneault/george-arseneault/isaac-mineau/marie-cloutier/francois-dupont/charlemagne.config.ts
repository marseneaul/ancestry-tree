import { charlemagneStory } from "../../../../../../stories/charlemagne";
import { charlesMartelConfig } from "./charles-martel.config";
import { chrotrudisDeTrevesConfig } from "./chrotrudis-de-treves.config";

export const charlemagneConfig = {
	// PAINTING / SCULPTURE https://www.ancestry.com/family-tree/person/tree/44204929/person/430051963468/facts
	// Holy Roman Emperor
	// King of Italy
	name: "Charles I of the Franks (Charlemagne)",
	sex: "Male",
	birthPlace: "Aachen, Rheinland-Pfalz, Germany",
	deathPlace: "Aachen, Stadt Aachen, Nordrhein-Westfalen, Germany",
	birthDate: "2 April 742/747/748",
	deathDate: "28 January 814",
    imageUrl: "./images/charlemagne.jpg",
	story: charlemagneStory,
	parents: [
		{
			// Queen of the Franks the queen with the goose-foot
			// SCULPTURES https://www.ancestry.com/family-tree/person/tree/44204929/person/430051964133/facts
			name: "Bertrada of Laon",
			sex: "Female",
			birthPlace: "Aisne, Picardie, France",
			deathPlace: "Choisy-au-Bac, France",
			birthDate: "2 April 720",
			deathDate: "12 July 783",
			parents: [
				{
					name: "Bertrada de Prum",
					sex: "Female",
					birthPlace: "Laon, Aisne, Picardie, France",
					deathPlace: "Laon, Aisne, Picardie, France",
					birthDate: "~695",
					deathDate: "12 July 721",
					parents: []
				},
				{
					// PAINTING https://www.ancestry.com/family-tree/person/tree/44204929/person/430051967977/facts
					// Comte de Laon.
					name: "Charibert of Laon",
					sex: "Male",
					birthPlace: "Laon, Aisne, Picardie, France",
					deathPlace: "Laon, Aisne, Picardie, France",
					birthDate: "690",
					deathDate: "23 June 720",
					parents: []
				}
			]
		},
		{
			// King of the Franks
			// During his expedition to Italy the following year, Pépin obliged the Lombards to accept the independence of Rome, marking the beginning of the Papal State. He recaptured Narbonne from the Muslim invaders in [759], and finally conquered Aquitaine after the
			// SCULPTURES / PAINTINGS https://www.ancestry.com/family-tree/person/tree/44204929/person/430051964118/facts
			name: "Pepin the Short of the Franks",
			sex: "Male",
			birthPlace: "France",
			deathPlace: "UNKNOWN",
			birthDate: "714",
			deathDate: "24 September 768",
			imageUrl: "./images/pepin-the-short.jpg",
			parents: [
				chrotrudisDeTrevesConfig,
				charlesMartelConfig
			]
		}
	]
};