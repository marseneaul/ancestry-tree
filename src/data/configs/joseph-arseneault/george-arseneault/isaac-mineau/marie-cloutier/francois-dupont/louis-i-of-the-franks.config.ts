import { charlemagneConfig } from "./charlemagne.config";
import { hildegardVonKraichgauConfig } from "./hildegard-von-kraichgau.config";

export const louisIOfTheFranksConfig = {
	// King of the Franks, co-emperor Louis I (holy roman empire)
	// PAINTING https://www.ancestry.com/family-tree/person/tree/44204929/person/430051962540/facts
	name: "Louis I of the Franks (Louis the Pious)",
	sex: "Male",
	birthPlace: "Casseneuil, Lot-et-Garonne, Aquitaine, France",
	deathPlace: "Ingelheim Am Rhein, Mainz-Bingen, Rhineland-Palatinate, Germany",
	birthDate: "15 August 778",
	deathDate: "20 June 840",
	imageUrl: "./images/louis-the-pious.jpg",
	parents: [
		hildegardVonKraichgauConfig,
		charlemagneConfig
	]
};