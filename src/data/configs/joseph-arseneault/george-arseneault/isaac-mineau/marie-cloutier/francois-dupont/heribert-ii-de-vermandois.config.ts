import { charlemagneConfig } from "./charlemagne.config";
import { hildegardVonKraichgauConfig } from "./hildegard-von-kraichgau.config";

export const heribertIIDeVermandoisConfig = {
	// HAS PAINTING https://www.ancestry.com/family-tree/person/tree/44204929/person/430053355487/facts
	// Count of Vermandois, Count of Meaux, and Count of Soissons. He was the first to exercise power over the territory that became the province of Champagne.
	name: "Heribert II De Vermandois",
	sex: "Male",
	birthPlace: "Vermandois, Nuestria Western, France",
	deathPlace: "St Quentin, Marne, Champagne-Ardenne, France",
	birthDate: "23 February 885",
	deathDate: "23 February 923",
	parents: [
		{
			name: "Lietgardis N.",
			sex: "Female",
			birthPlace: "France",
			deathPlace: "UNKNOWN",
			birthDate: "UNKNOWN",
			deathDate: "UNKNOWN"
		},
		{
			// Baldwin II to have him assassinated in 907.
			// probably charged with defending the Oise against Viking intrusions
			// Count of Vermandois, Count of Meaux, Count of Soissons, and lay abbot of Saint Quentin
			name: "Heribert I De Vermandois",
			sex: "Male",
			birthPlace: "Vermandois, Aisne, Picardie, France",
			deathPlace: "Vermandois, Aisne, Picardie, France",
			birthDate: "1 January 848",
			deathDate: "6 November 907",
			parents: [
				{
					// first count of Vermandois, lord of Senlis, Péronne, and Saint Quentin.
					name: "Pepin De Vermando",
					sex: "Male",
					birthPlace: "Bohain-en-Vermandois, Departement de l'Aisne, Picardie, France",
					deathPlace: "Milan, Provincia di Milano, Lombardia, Italy",
					birthDate: "817",
					deathDate: ">854",
					parents: [
						{
							name: "Cunigunda of Laon",
							sex: "Female",
							birthPlace: "Bohain-en-Vermandois, Departement de l'Aisne, Picardie, France",
							deathPlace: "Provincia di Milano, Lombardia, Italy",
							birthDate: "UNKNOWN",
							deathDate: "UNKNOWN"
						},
						{
							// plot against Louis the Pious led to his blinding (carried out by means of pressing a red-hot stiletto to the eyeballs) proved so traumatic that Bernard died in agony two days after the procedure was carried out.
							// 11 Sep 813 at Aix-la-Chapelle as BERNARD I King of Italy
							name: "Bernard of Italy",
							sex: "Male",
							birthPlace: "Bohain-en-Vermandois, Departement de l'Aisne, Picardie, France",
							deathPlace: "Aachen, Aachener Stadtkreis, Nordrhein-Westfalen, Germany",
							birthDate: "797",
							deathDate: "17 April 818",
							parents: [
								{
									name: "Berthe Ingeltrude de Toulouse of Italy",
									sex: "Female",
									birthPlace: "Toulouse, Departement de la Haute-Garonne, Midi-Pyrénées, France",
									deathPlace: "Lombardia, Italy",
									birthDate: "UNKNOWN",
									deathDate: "UNKNOWN"
								},
								{
									// PEPIN King of Italy 15 Apr 781. He was made "king of Italy"[2] after his father's conquest of the Lombards, in 781, and crowned by Pope Hadrian I with the Iron Crown of Lombardy.
									name: "Pepin Carolingian of Italy",
									sex: "Male",
									birthPlace: "Aachen, Aachener Stadtkreis, Nordrhein-Westfalen, Germany",
									deathPlace: "Provincia di Milano, Lombardia, Italy",
									birthDate: "April 773",
									deathDate: "8 July 810",
									parents: [
										hildegardVonKraichgauConfig,
										charlemagneConfig
									]
								}
							]
						}
					]
				}
			]
		}
	]
};