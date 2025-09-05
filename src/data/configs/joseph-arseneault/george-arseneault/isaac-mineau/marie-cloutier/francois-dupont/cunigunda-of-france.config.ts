import { charlesMartelConfig } from "./charles-martel.config";
import { chrotrudisDeTrevesConfig } from "./chrotrudis-de-treves.config";
import { gerardIOfParis } from "./gerard-i-of-paris.config";
import { heilwigNConfig } from "./heilwig-n.config";
import { immaOfAlemmaniaConfig } from "./imma-of-alemmania.config";
import { louisIOfTheFranksConfig } from "./louis-i-of-the-franks.config";
import { pepinOfHerstalConfig } from "./pepin-of-herstal.config";
import { rotrudeNConfig } from "./rotrude-n.config";
import { welfVonSwabiaConfig } from "./welf-von-swabia.config";

export const cunigundaOfFranceConfig = {
    name: "Cunigunda of France",
    sex: "Female",
    birthPlace: "France",
    deathPlace: "UNKNOWN",
    birthDate: "893",
    deathDate: ">923",
    parents: [
        {
            name: "Ermentrude of France",
            sex: "Female",
            birthPlace: "France",
            deathPlace: "UNKNOWN",
            birthDate: "875/878",
            deathDate: "UNKNOWN",
            parents: [
                {
                    name: "Adelaide of Paris",
                    sex: "Female",
                    birthPlace: "France",
                    deathPlace: "UNKNOWN",
                    birthDate: "850-853",
                    deathDate: "10 November 901",
                    parents: [
                        {
                            // Comte de Paris [885]. Comte 875. Comte palatin 877. Comte de Paris [885].
                            name: "Adalard of Paris",
                            sex: "Male",
                            birthPlace: "France",
                            deathPlace: "UNKNOWN",
                            birthDate: "830-890",
                            deathDate: "UNKNOWN",
                            parents: [
                                {
                                    name: "Susanna de Paris",
                                    sex: "Female",
                                    birthPlace: "France",
                                    deathPlace: "UNKNOWN",
                                    birthDate: "~812",
                                    deathDate: "~859",
                                    parents: [
                                        {
                                            name: "Alpais of the Franks",
                                            sex: "Female",
                                            birthPlace: "France",
                                            deathPlace: "UNKNOWN",
                                            birthDate: "UNKNOWN",
                                            deathDate: "UNKNOWN",
                                            parents: [
                                                louisIOfTheFranksConfig
                                            ]
                                        },
                                        {
                                            // Comte de Paris Marquis de Septimanie]
                                            name: "Beggo of Toulouse",
                                            sex: "Male",
                                            birthPlace: "France",
                                            deathPlace: "UNKNOWN",
                                            birthDate: "UNKNOWN",
                                            deathDate: "28 October 816",
                                            parents: [
                                                rotrudeNConfig,
                                                gerardIOfParis
                                            ]
                                        }
                                    ]
                                },
                                {
                                    // Comte de Flavigny {Flavigny-sur-Ozerain, Côte d'Or.
                                    name: "Vulfard de Flavigny",
                                    sex: "Male",
                                    birthPlace: "France",
                                    deathPlace: "UNKNOWN",
                                    birthDate: "UNKNOWN",
                                    deathDate: "~856"
                                }
                            ]
                        }
                    ]
                },
                {
                    // PAINTING https://www.ancestry.com/family-tree/person/tree/44204929/person/430051917418/facts
                    // King of West Francia LUDWIG III King of West Lotharingia
                    name: "Louis II of France",
                    sex: "Male",
                    birthPlace: "France",
                    deathPlace: "Delincourt, Departement de l'Oise, Picardie, France",
                    birthDate: "1 November 846",
                    deathDate: "10 April 879",
                    imageUrl: "./images/louis-ii-of-france.jpg",
                    parents: [
                        {
                            name: "Ermentrude of Orleans",
                            sex: "Female",
                            birthPlace: "Germany",
                            deathPlace: "UNKNOWN",
                            birthDate: "27 September 823",
                            deathDate: "6 October 869",
                            parents: [
                                {
                                	name: "Engeltrude de Fezensac",
                                	sex: "Female",
                                	birthPlace: "City of Paris, Île-de-France, France",
                                	deathPlace: "Orleans, Departement du Loiret, Centre, France",
                                	birthDate: "UNKNOWN",
                                	deathDate: "UNKNOWN",
                                    parents: [
                                        {
                                        	name: "Grimhilda N.",
                                        	sex: "Female",
                                        	birthPlace: "France",
                                        	deathPlace: "UNKNOWN",
                                        	birthDate: "UNKNOWN",
                                        	deathDate: "UNKNOWN"
                                        },
                                        {
                                            // Comte de Fézensac.
                                        	name: "Liuthard de Fezensac",
                                        	sex: "Male",
                                        	birthPlace: "France",
                                        	deathPlace: "UNKNOWN",
                                        	birthDate: "UNKNOWN",
                                        	deathDate: "3 January 813",
                                            parents: [
                                                rotrudeNConfig,
                                                gerardIOfParis
                                            ]
                                        }
                                    ]
                                },
                                {
                                    // Killed in battle
                                    // Comte d'Orléans
                                	name: "Eudes of Orleans",
                                	sex: "Male",
                                	birthPlace: "Orleans, Departement du Loiret, Centre, France",
                                	deathPlace: "Touraine, Indre-et-Loire, Centre, France",
                                	birthDate: "770/780",
                                	deathDate: "June 834",
                                    parents: [
                                        {
                                        	name: "Waldrada of Nibelungid",
                                        	sex: "Female",
                                        	birthPlace: "France",
                                        	deathPlace: "UNKNOWN",
                                        	birthDate: "760",
                                        	deathDate: "824",
                                            parents: [
                                                {
                                                	name: "Albana d'Autun",
                                                	sex: "Female",
                                                	birthPlace: "France",
                                                	deathPlace: "UNKNOWN",
                                                	birthDate: "UNKNOWN",
                                                	deathDate: ">804",
                                                    parents: [
                                                        {
                                                        	name: "Aldana of France",
                                                        	sex: "Female",
                                                        	birthPlace: "France",
                                                        	deathPlace: "UNKNOWN",
                                                        	birthDate: "732",
                                                        	deathDate: "755",
                                                            parents: [
                                                                chrotrudisDeTrevesConfig,
                                                                charlesMartelConfig
                                                            ]
                                                        },
                                                        {
                                                            // Count of Autun and Toulouse
                                                        	name: "Theoderic I d'Autun",
                                                        	sex: "Male",
                                                        	birthPlace: "France",
                                                        	deathPlace: "UNKNOWN",
                                                        	birthDate: "720",
                                                        	deathDate: "791 / 15 December 804",
                                                        }
                                                    ]
                                                },
                                                {
                                                	name: "Nibelung II Nibelungid",
                                                	sex: "Male",
                                                	birthPlace: "France",
                                                	deathPlace: "UNKNOWN",
                                                	birthDate: "750/760",
                                                	deathDate: "805",
                                                    parents: [
                                                        {
                                                            name: "Nibelung I of Burgundy",
                                                	        sex: "Male",
                                                	        birthPlace: "France",
                                                	        deathPlace: "UNKNOWN",
                                                	        birthDate: "705",
                                                	        deathDate: "786",
                                                            parents: [
                                                                {
                                                                    name: "Childebrand of Burgundy",
                                                	                sex: "Male",
                                                	                birthPlace: "France",
                                                	                deathPlace: "UNKNOWN",
                                                	                birthDate: "UNKNOWN",
                                                	                deathDate: ">751",
                                                                    parents: [
                                                                        pepinOfHerstalConfig
                                                                    ]
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            // Count
                                        	name: "Adrian of Orleans",
                                        	sex: "Male",
                                        	birthPlace: "Germany",
                                        	deathPlace: "UNKNOWN",
                                        	birthDate: "~760",
                                        	deathDate: "15 February 0824",
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
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            // King of West Francia; King of Aquitaine
                            // Holy Roman Emperor, Charles II
                            // King of Italy
                            // PAINTING https://www.ancestry.com/family-tree/person/tree/44204929/person/430051918090/facts
                            name: "Charles 'The Bald' of the West Franks",
                            sex: "Male",
                            birthPlace: "Frankfurt Am Main, Darmstadt, Hesse, Germany",
                            deathPlace: "Brides, Les Bains, Pyrénées-Orientales, Languedoc-Roussillon, France",
                            birthDate: "13 June 823",
                            deathDate: "6 October 877",
                            imageUrl: "./images/charles-the-bald.jpg",
                            parents: [
                                {
                                    // PAINTING https://www.ancestry.com/family-tree/person/tree/44204929/person/430051962545/facts
                                    // Queen and Empress
                                    name: "Judith von Swabia",
                                    sex: "Female",
                                    birthPlace: "Altdorf, Eichstatt, Bayern, Germany",
                                    deathPlace: "Tours, Indre-et-Loire, Centre, France",
                                    birthDate: "800",
                                    deathDate: "19 April 843",
                                    parents: [
                                        heilwigNConfig,
                                        welfVonSwabiaConfig
                                    ]
                                },
                                louisIOfTheFranksConfig
                            ]
                        }
                    ]
                }
            ]
        }
    ]
};