import { immaOfAlemmaniaConfig } from "./imma-of-alemmania.config";

export const hildegardVonKraichgauConfig = {
	// She died from the after effects of childbirth
	// PAINTING https://www.ancestry.com/family-tree/person/tree/44204929/person/430051963471/facts
	name: "Hildegard von Kraichgau",
	sex: "Female",
	birthPlace: "Aachen, Rheinland-Pfalz, Germany",
	deathPlace: "Thionville, Moselle, Lorraine, France",
	birthDate: "758",
	deathDate: "30 April 783",
	parents: [
		immaOfAlemmaniaConfig,
		{
			// Count of Kraichgau
			name: "Gerold I von Kraichgau",
			sex: "Male",
			birthPlace: "Schwäbisch Haller Landkreis, Baden-Württemberg, Germany",
			deathPlace: "Germany",
			birthDate: "~725",
			deathDate: "1 July 784"
		}
	]
};