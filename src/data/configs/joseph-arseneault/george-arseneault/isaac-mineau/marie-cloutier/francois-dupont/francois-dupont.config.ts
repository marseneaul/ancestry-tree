import { aleixDePlusquellecConfig } from "./alix-de-plusquellec.config";
import { charlemagneConfig } from "./charlemagne.config";
import { herveDeRosmadec1240Config } from "./herve-de-rosmadec-1240.config";
import { herveDeRosmadecConfig } from "./herve-de-rosmadec.config";
import { herveIIIConfig } from "./herve-iii.config";
import { hildegardVonKraichgauConfig } from "./hildegard-von-kraichgau.config";
import { jeanneDeParthenayConfig } from "./jeanne-de-parthenay.config";
import { pierreIIIConfig } from "./pierre-iii-config";
import { rivallonDeRosmadecConfig } from "./rivallon-de-rosmadec.config";
import { robertIConfig } from "./robert-i.config";

export const francoisDupontConfig = {
	name: "Francois Du Pont-L'Abbe",
	sex: "Male",
	birthPlace: "Aquitaine, France",
	deathPlace: "Aquitaine, France",
	birthDate: "1450",
	deathDate: "1508",
    parents: [
        {
        	name: "Marguerite de Rostrenen",
        	sex: "Female",
        	birthPlace: "Rostrenen, Côtes-d'Armor, Bretagne, France",
        	deathPlace: "Rostrenen, Côtes-d'Armor, Bretagne, France",
        	birthDate: "~1426",
        	deathDate: "20 March 1456",
            parents: [
                {
                	name: "Jeanne de Guermeur",
                	sex: "Female",
                	birthPlace: "France",
                	deathPlace: "UNKNOWN",
                	birthDate: "~1405",
                	deathDate: "1457",
                    parents: [
                        {
                        	name: "Marguerite du Chastel",
                        	sex: "Female",
                        	birthPlace: "France",
                        	deathPlace: "UNKNOWN",
                        	birthDate: "~1380",
                        	deathDate: "1459",
                            parents: [
                                {
                                	name: "Mencie de Lescoet",
                                	sex: "Female",
                                	birthPlace: "France",
                                	deathPlace: "UNKNOWN",
                                	birthDate: "UNKNOWN",
                                	deathDate: "UNKNOWN",
                                    parents: [
										{
											name: "Tiphaine de Kerenpris",
											sex: "Female",
											birthPlace: "France",
											deathPlace: "UNKNOWN",
											birthDate: "UNKNOWN",
											deathDate: "UNKNOWN"
										},
										{
											name: "Guillaume de Lescoet",
											sex: "Male",
											birthPlace: "France",
											deathPlace: "UNKNOWN",
											birthDate: "UNKNOWN",
											deathDate: "UNKNOWN"
										}
									]
                                },
                                {
                                	name: "Herve II du Chastel",
                                	sex: "Male",
                                	birthPlace: "France",
                                	deathPlace: "UNKNOWN",
                                	birthDate: "UNKNOWN",
                                	deathDate: "<1396",
                                    parents: [
										{
                        					name: "Alix de Lesourny",
                        					sex: "Female",
                        					birthPlace: "France",
                        					deathPlace: "UNKNOWN",
                        					birthDate: "~1320",
                        					deathDate: "UNKNOWN"
                        				},
                        				{	// seigneur du Chastel et Leslein puis de Coëtengars (après son frère Garsin) , sert le duc de Bretagne Jean «Le Vaillant», prisonnier ; Seigneur du Chastel (1352), Seigneur de Leslein, Seigneur de Coëtengars, Sieur, du Chastel, de Leslem, de Coëtangars, Pann
                        					name: "Guillaume I du Chastel",
                        					sex: "Male",
                        					birthPlace: "France",
                        					deathPlace: "UNKNOWN",
                        					birthDate: "UNKNOWN",
                        					deathDate: "1370",
											parents: [
												{
													name: "Tiphaine de Plusquellec",
													sex: "Female",
													birthPlace: "France",
													deathPlace: "UNKNOWN",
													birthDate: "1305",
													deathDate: "UNKNOWN",
													parents: [
														{
															name: "Aliette de la Roche",
															sex: "Female",
															birthPlace: "France",
															deathPlace: "UNKNOWN",
															birthDate: "UNKNOWN",
															deathDate: "UNKNOWN"
														},
														{
															name: "Charles de Plusquellec",
															sex: "Male",
															birthPlace: "France",
															deathPlace: "UNKNOWN",
															birthDate: "UNKNOWN",
															deathDate: "UNKNOWN"
														}
													]
												},
												{	// seigneur du Chastel et Trémazan, Capitaine de Brest (1341/42) X en Bretagne avec Gauthier de Mauny, Lieutenant-Général du comte de Montfort contre Charles de Blois
													name: "Tanguy I du Chastel",
													sex: "Male",
													birthPlace: "France",
													deathPlace: "UNKNOWN",
													birthDate: "UNKNOWN",
													deathDate: "~1352",
													parents: [
														{
															name: "Eleanor de Rosmadec",
															sex: "Female",
															birthPlace: "France",
															deathPlace: "UNKNOWN",
															birthDate: "UNKNOWN",
															deathDate: "15 July 1337",
															parents: [
																herveDeRosmadecConfig
															]
														},
														{	// seigneur du Chastel; Sieur, du Chastel, de Leslem, Lieutenant Général, de Montfort
															name: "Bernard II du Chastel",
															sex: "Male",
															birthPlace: "France",
															deathPlace: "UNKNOWN",
															birthDate: "UNKNOWN",
															deathDate: "~1331",
															parents: [
																{
																	name: "Sibylle de Leslein",
																	sex: "Female",
																	birthPlace: "France",
																	deathPlace: "UNKNOWN",
																	birthDate: "UNKNOWN",
																	deathDate: "UNKNOWN",
																	parents: [
																		{	// Sieur, de Leslem, Chevalier, Croisé
																			name: "Pregent de Leslein",
																			sex: "Male",
																			birthPlace: "France",
																			deathPlace: "UNKNOWN",
																			birthDate: "UNKNOWN",
																			deathDate: "1248"
																		}
																	]
																},
																{	// chevalier, seigneur de Trémazan
																	name: "Herve I du Chastel",
																	sex: "Male",
																	birthPlace: "France",
																	deathPlace: "UNKNOWN",
																	birthDate: "UNKNOWN",
																	deathDate: "<1296",
																	parents: [
																		{	// dame de Trémazan et Landunvez
																			name: "Anne de Leon",
																			sex: "Female",
																			birthPlace: "France",
																			deathPlace: "UNKNOWN",
																			birthDate: "UNKNOWN",
																			deathDate: "1276"
																		},
																		{	// chevalier, croisé
																			name: "Bernard du Chastel (de Castro)",
																			sex: "Male",
																			birthPlace: "France",
																			deathPlace: "UNKNOWN",
																			birthDate: "1240",
																			deathDate: "1301"
																		}
																	]
																}
															]
														}
													]
												}
											]
                        				}
									]
                                }
                            ]
                        },
                        {
                        	name: "Hervé de Guermeur",
                        	sex: "Male",
                        	birthPlace: "France",
                        	deathPlace: "UNKNOWN",
                        	birthDate: "UNKNOWN",
                        	deathDate: "~1405"
                        }
                    ]
                },
                {
                	name: "Pierre VIII de Rostrenen",
                	sex: "Male",
                	birthPlace: "Parigi, France",
                	deathPlace: "Paris, Paris, Ile-de-France, France",
                	birthDate: "~1400",
                	deathDate: "21 August 1440",
                    parents: [
                        {
                        	name: "Marie Marguerite De Mauny",
                        	sex: "Female",
                        	birthPlace: "France",
                        	deathPlace: "UNKNOWN",
                        	birthDate: "1375",
                        	deathDate: "1419",
                            parents: [
								{
									name: "Marguerite de Quebriac",
									sex: "Female",
									birthPlace: "France",
									deathPlace: "UNKNOWN",
									birthDate: "UNKNOWN",
									deathDate: "UNKNOWN"
								},
								{	// sieges of Maguelonne and Birviesca as well as at the Battle of Navarette ; battle of Toledo and contributed to the gain of that of Montiel, took part in the sieges of Saint-Sever (1370) and Saint-Jean-d'Angély , battle of Châteauneuf-de-Randon in 1380.
									// knight Breton who took part in many battles with the constable , his cousin. 1352 the fight of the Thirty; takes the fortress of Carentan of which he becomes the captain; the Battle of Cocherel , the battle of Auray during which he is taken prisoner
									// Lord of Lesnen
									name: "Olivier De Mauny",
									sex: "Male",
									birthPlace: "France",
									deathPlace: "UNKNOWN",
									birthDate: "1320",
									deathDate: ">1405",
									parents: [
										{
											name: "Marie de Guesclin",
											sex: "Female",
											birthPlace: "France",
											deathPlace: "UNKNOWN",
											birthDate: "UNKNOWN",
											deathDate: "UNKNOWN",
											parents: [
												{
													name: "Jeanne de la Motte-Broons",
													sex: "Female",
													birthPlace: "France",
													deathPlace: "UNKNOWN",
													birthDate: "UNKNOWN",
													deathDate: "UNKNOWN",
													parents: []
												},
												{
													// Sieur, de Broons, de la Ville-Anne, du Clos-Poulet, de Quatre-Voyes, de Vauruzé
													name: "Bertrand IV de Guesclin",
													sex: "Male",
													birthPlace: "France",
													deathPlace: "UNKNOWN",
													birthDate: "1250",
													deathDate: "1293",
													parents: [
														{
															// Sieur, du Plessis-Bertrand, 1247, du Guarplic, Chevalier
															name: "Bertrand III de Guesclin",
															sex: "Male",
															birthPlace: "France",
															deathPlace: "UNKNOWN",
															birthDate: "UNKNOWN",
															deathDate: "~1260",
															parents: [
																{
																	// Sieur, du Guarplic, de Saint-Coulomb, de Saint-Ideuc, de Cancale, de Saint-Meloir
																	name: "Pierre I de Guesclin",
																	sex: "Male",
																	birthPlace: "France",
																	deathPlace: "UNKNOWN",
																	birthDate: "UNKNOWN",
																	deathDate: "1247",
																	parents: [
																		{
																			// Sieur, du Guarplic, de Saint-Coulomb, de Saint-Ideuc, de Cancale, de Saint-Meloir
																			name: "Bertrand de Guarplic",
																			sex: "Male",
																			birthPlace: "France",
																			deathPlace: "UNKNOWN",
																			birthDate: "1160",
																			deathDate: "UNKNOWN",
																			parents: [
																				{
																					// Sieur, du Guarplic
																					name: "Geoffroy de Guarplic",
																					sex: "Male",
																					birthPlace: "France",
																					deathPlace: "UNKNOWN",
																					birthDate: "1130",
																					deathDate: "UNKNOWN",
																				}
																			]
																		}
																	]
																}
															]
														}
													]
												}
											]
										},
										{
											// Lord of Thorigny
											name: "Herve de Mauny",
											sex: "Male",
											birthPlace: "France",
											deathPlace: "UNKNOWN",
											birthDate: "UNKNOWN",
											deathDate: "1344"
										}
									]
								}
							]
                        },
                        {   // Lord of Rostrenen. Ambassador of the States of Brittany in 1408 to the Duke of Burgundy
                        	name: "Pierre VII de Rostrenen",
                        	sex: "Male",
                        	birthPlace: "France",
                        	deathPlace: "UNKNOWN",
                        	birthDate: "1370",
                        	deathDate: "2 September 1419",
                            parents: [
                                {
                                	name: "Marie de la Jaille",
                                	sex: "Female",
                                	birthPlace: "France",
                                	deathPlace: "UNKNOWN",
                                	birthDate: "UNKNOWN",
                                	deathDate: "UNKNOWN",
                                    parents: [
										{
											// lady of Bouchaud in Poitou
											name: "Marguerite de Mathas",
											sex: "Female",
											birthPlace: "France",
											deathPlace: "UNKNOWN",
											birthDate: "UNKNOWN",
											deathDate: "UNKNOWN",
											parents: []
										},
										{
											// banneret in Anjou and Brittany , knight of great reputation almost all the campaigns of the war of Poitou and Guyenne (1350)
											name: "Yvon XII de la Jaille",
											sex: "Male",
											birthPlace: "La Jaille-Yvon, Maine-et-Loire, Pays de la Loire, France",
											deathPlace: "UNKNOWN",
											birthDate: "1324",
											deathDate: "UNKNOWN",
											parents: [
												{
													// made war against the English for the benefit of the crown of France and for the benefit of the House of Blois (1317). He was killed in the battle of Rocheï¿½Derrien (1349).
													name: "Yvon XI de la Jaille",
													sex: "Male",
													birthPlace: "France",
													deathPlace: "UNKNOWN",
													birthDate: "UNKNOWN",
													deathDate: "1349",
													parents: [
														{
															name: "Yvon X de la Jaille",
															sex: "Male",
															birthPlace: "France",
															deathPlace: "Angers, Pays-De-La-Loire, France",
															birthDate: "1275",
															deathDate: "1299",
															parents: [
																{
																	name: "Marthe de la Motte de Saint Michel du Pin",
																	sex: "Female",
																	birthPlace: "France",
																	deathPlace: "UNKNOWN",
																	birthDate: "UNKNOWN",
																	deathDate: "UNKNOWN"
																},
																{
																	// owns Jaille-Yvon, Jaille-en-Noellet, Saint-Mars-la-Jaille , and Pordic in Brittan
																	name: "Yvon IX de la Jaille -Yvon",
																	sex: "Male",
																	birthPlace: "France",
																	deathPlace: "Angers, Pays-De-La-Loire, France",
																	birthDate: "UNKNOWN",
																	deathDate: "24 June 1294",
																	parents: [
																		{
																			name: "Margaretha van Chateaubriand",
																			sex: "Female",
																			birthPlace: "France",
																			deathPlace: "UNKNOWN",
																			birthDate: "UNKNOWN",
																			deathDate: "1265",
																			parents: [
																				{
																					name: "Geoffrey IV de Chateaubriand",
																					sex: "Male",
																					birthPlace: "France",
																					deathPlace: "UNKNOWN",
																					birthDate: "UNKNOWN",
																					deathDate: "15 March 1233",
																					parents: [
																						{
																							// Seigneur de Châteaubriand.
																							name: "Geoffrey III de Chateaubriand",
																							sex: "Male",
																							birthPlace: "France",
																							deathPlace: "UNKNOWN",
																							birthDate: "UNKNOWN",
																							deathDate: "1206",
																							parents: [
																								{
																									// Seigneur de Châteaubriand.
																									name: "Briand III de Chateaubriand",
																									sex: "Male",
																									birthPlace: "France",
																									deathPlace: "UNKNOWN",
																									birthDate: "UNKNOWN",
																									deathDate: "UNKNOWN",
																									parents: [
																										{
																											// Seigneur de Châteaubriand.
																											name: "Juhael de Chateaubriand",
																											sex: "Male",
																											birthPlace: "France",
																											deathPlace: "UNKNOWN",
																											birthDate: "UNKNOWN",
																											deathDate: "1120",
																											parents: []
																										}
																									]
																								}
																							]
																						}
																					]
																				}
																			]
																		},
																		{
																			// Crusader in Egypt - captured
																			// Lord of Jaille en Noellet and Jaille en Yvon
																			name: "Yvon VIII de La Jaille-Yvon",
																			sex: "Male",
																			birthPlace: "France",
																			deathPlace: "UNKNOWN",
																			birthDate: "1235",
																			deathDate: "1265",
																			parents: []
																		}
																	]
																}
															]
														}
													]
												}
											]
										}
									]
                                },
                                {   // A valiant knight, he fought at the battle of Chizé on 21 March 1373 , at the siege of La Rochelle on 15 August 1372 and at the siege of Brest in 1373 .
                                	name: "Pierre VI de Rostrenen",
                                	sex: "Male",
                                	birthPlace: "France",
                                	deathPlace: "UNKNOWN",
                                	birthDate: "1320",
                                	deathDate: "2 September 1419",
                                    parents: [
										{
											name: "Anne du Pont L'Abbe",
											sex: "Female",
											birthPlace: "France",
											deathPlace: "UNKNOWN",
											birthDate: "1280",
											deathDate: "1320",
											parents: []
										},
										{	// the siege of Rennes , that of Hennebont and took part in the surrender of Auray Died in the Battle of La Roche Derrien
											// Lord of Rostrenen
											name: "Pierre V De Rostrenen",
											sex: "Male",
											birthPlace: "France",
											deathPlace: "UNKNOWN",
											birthDate: "1270",
											deathDate: "20 June 1347",
											parents: [
												{
													name: "Nicole de Vitre",
													sex: "Female",
													birthPlace: "UNKNOWN",
													deathPlace: "UNKNOWN",
													birthDate: "1240",
													deathDate: "UNKNOWN",
													parents: []
												},
												{	// in literature appears in the life of Saint Yves as protagonist of the miracle of the forest of Rostrenen
													name: "Pierre IV de Rostrenen",
													sex: "Male",
													birthPlace: "France",
													deathPlace: "UNKNOWN",
													birthDate: "~1245",
													deathDate: "11 March 1307",
													parents: [
														jeanneDeParthenayConfig,
														pierreIIIConfig
													]
												}
											]
										}
									]
                                }
                            ]
                        }
                    ]
                }
            ]
        },
        {
        	name: "Jean II du Pont-L'Abbe et de Rostrenen",
        	sex: "Male",
        	birthPlace: "Aquitaine, France",
        	deathPlace: "Aquitaine, France",
        	birthDate: "~1425",
        	deathDate: "26 December 1478",
            parents: [
                {
                	name: "Marie de Rosmadec",
                	sex: "Female",
                	birthPlace: "Rosmadec (now Pont-Croix), Quimper, Finistère, Bretagne, France",
                	deathPlace: "Rosmadec (now Pont-Croix), Quimper, Finistère, Bretagne, France",
                	birthDate: "1402",
                	deathDate: "1454",
                    parents: [
                        {
                        	name: "Alice de Tyvarlen",
                        	sex: "Female",
                        	birthPlace: "France",
                        	deathPlace: "France",
                        	birthDate: "1375",
                        	deathDate: "1412",
							parents: [
								{
									name: "Plesance de Pennault",
									sex: "Female",
									birthPlace: "France",
									deathPlace: "UNKNOWN",
									birthDate: "UNKNOWN",
									deathDate: "UNKNOWN"
								},
								{
									name: "Alain de Tyvarlen",
									sex: "Male",
									birthPlace: "France",
									deathPlace: "UNKNOWN",
									birthDate: "UNKNOWN",
									deathDate: "1384"
								}
							]
                        },
                        {	// chambellan duc de Bretagne Chamberlain to the Duke of Brittany, Sieur, de Tirvalen, de Portevoix, Chambellan, de Bretagne, Seigneur de Rosmadec
                        	name: "Jean I de Rosmadec",
                        	sex: "Male",
                        	birthPlace: "Quimper, Finistère, Bretagne, France",
                        	deathPlace: "Quimper, Finistère, Bretagne, France",
                        	birthDate: "1375",
                        	deathDate: "1425",
							parents: [
								{
									name: "Marie de Cornouaille",
									sex: "Female",
									birthPlace: "France",
									deathPlace: "UNKNOWN",
									birthDate: "UNKNOWN",
									deathDate: "UNKNOWN",
									parents: [] //https://www.ancestry.com/family-tree/person/tree/44204929/person/432283977714/facts
								},
								{
									name: "Guillaume de Rosmadec",
									sex: "Male",
									birthPlace: "France",
									deathPlace: "UNKNOWN",
									birthDate: "UNKNOWN",
									deathDate: "1401",
									parents: [
										{
											name: "Mathilde de Chastellier",
											sex: "Female",
											birthPlace: "France",
											deathPlace: "UNKNOWN",
											birthDate: "UNKNOWN",
											deathDate: "UNKNOWN"
										},
										{
											name: "Herve II de Rosmadec",
											sex: "Male",
											birthPlace: "Telgruc-sur-Mer, Finistere, Brittany, France",
											deathPlace: "UNKNOWN",
											birthDate: "~1290",
											deathDate: "UNKNOWN",
											parents: [
												{
													name: "Mabille du Pont-l'Abbe",
													sex: "Female",
													birthPlace: "France",
													deathPlace: "UNKNOWN",
													birthDate: "UNKNOWN",
													deathDate: "UNKNOWN",
													parents: [
														{
															name: "UNKNOWN",
															sex: "Female",
															birthPlace: "UNKNOWN",
															deathPlace: "UNKNOWN",
															birthDate: "UNKNOWN",
															deathDate: "UNKNOWN",
														},
														{
															name: "UNKNOWN",
															sex: "Male",
															birthPlace: "UNKNOWN",
															deathPlace: "UNKNOWN",
															birthDate: "UNKNOWN",
															deathDate: "UNKNOWN",
														}
													]
												},
												{	// Seigneur de Rosmadec
													name: "Yvon de Rosmadec",
													sex: "Male",
													birthPlace: "Telgruc-sur-Mer, Finistere, Brittany, France",
													deathPlace: "UNKNOWN",
													birthDate: "~1260",
													deathDate: "UNKNOWN",
													parents: [
														{
															name: "Marie de Rosmadec",
															sex: "Female",
															birthPlace: "France",
															deathPlace: "UNKNOWN",
															birthDate: "UNKNOWN",
															deathDate: "UNKNOWN",
															parents: [
																rivallonDeRosmadecConfig
															]
														},
														{
															name: "Guyomar de Rosmadec",
															sex: "Male",
															birthPlace: "Telgruc-sur-Mer, Finistere, Brittany, France",
															deathPlace: "UNKNOWN",
															birthDate: "UNKNOWN",
															deathDate: "UNKNOWN",
															parents: [
																aleixDePlusquellecConfig,
																herveDeRosmadec1240Config
															]
														}
													]
												}
											]
										}
									]
								}
							]
                        }
                    ]
                },
                {   // https://fr.wikipedia.org/wiki/Famille_du_Pont-l%27Abb%C3%A9
                	name: "Hervé VIII du Pont-l'Abbé",
                	sex: "Male",
                	birthPlace: "Saint-Aubin-du-Pavail, Rennes, Ille-et-Vilaine, Bretagne, France",
                	deathPlace: "Saint-James de Beuvron, France",
                	birthDate: "1400",
                	deathDate: "6 March 1426",
                    parents: [
                        {
							name: "Jeanne Chateaugiron Malestroit",
							sex: "Female",
							birthPlace: "Malestroit, Vannes, Morbihan, Bretagne, France",
							deathPlace: "Malestroit, Vannes, Morbihan, Bretagne, France",
							birthDate: "1375",
							deathDate: "1421",
							parents: []
						},
						{
							name: "Herve VII du Pont-I'Abbe",
							sex: "Male",
							birthPlace: "France",
							deathPlace: "France",
							birthDate: "1370",
							deathDate: "1414",
							parents: [
								{	// Lord of Pont-l'Abbé
									name: "Herve VI du Pont-I'Abbe",
									sex: "Male",
									birthPlace: "France",
									deathPlace: "UNKNOWN",
									birthDate: "UNKNOWN",
									deathDate: "1426",
									parents: [
										{
											name: "Peronelle de Rochefort",
											sex: "Female",
											birthPlace: "France",
											deathPlace: "Quimper, Finistère, Bretagne, France",
											birthDate: "1320",
											deathDate: "2 August 1383",
											parents: [
												{
													name: "Philippa Laval",
													sex: "Female",
													birthPlace: "France",
													deathPlace: "UNKNOWN",
													birthDate: "1290",
													deathDate: "UNKNOWN",
													parents: []
												},
												{	// seigneur d’Ancérac, vicomte de Dangé seigneur de Rochefort et d'Assérac et de Châteauneuf-en-Saint-Malo
													name: "Guillaume II de Rochefort",
													sex: "Male",
													birthPlace: "France",
													deathPlace: "UNKNOWN",
													birthDate: "1292",
													deathDate: "1347",
													parents: []
												}
											]
										},
										{
											name: "Herve V du Pont-I'Abbe",
											sex: "Male",
											birthPlace: "France",
											deathPlace: "UNKNOWN",
											birthDate: "1320",
											deathDate: ">1383",
											parents: [
												{
													name: "Mahaut de Leon",
													sex: "Female",
													birthPlace: "France",
													deathPlace: "UNKNOWN",
													birthDate: "UNKNOWN",
													deathDate: ">11 April 1328",
													parents: [
														{
															name: "Jeanne de Montmorency",
															sex: "Female",
															birthPlace: "France",
															deathPlace: "UNKNOWN",
															birthDate: "UNKNOWN",
															deathDate: "December 1337",
															parents: [
																{
																	name: "Jeanne de Longueval",
																	sex: "Female",
																	birthPlace: "France",
																	deathPlace: "UNKNOWN",
																	birthDate: "UNKNOWN",
																	deathDate: "<1305",
																	parents: []
																},
																{	// Seigneur de Croissy
																	name: "Erard de Montmorency",
																	sex: "Male",
																	birthPlace: "France",
																	deathPlace: "UNKNOWN",
																	birthDate: "UNKNOWN",
																	deathDate: "<1322",
																	parents: [
																		{
																			name: "Jeanne de Brienne Ramerupt",
																			sex: "Female",
																			birthPlace: "France",
																			deathPlace: "UNKNOWN",
																			birthDate: "1216",
																			deathDate: ">1 August 1270",
																			parents: []
																		},
																		{
																			// Seigneur de Montmorency.
																			name: "Mathieu de Montmorency III",
																			sex: "Male",
																			birthPlace: "France",
																			deathPlace: "Tunis, Tunisia",
																			birthDate: "~1221",
																			deathDate: "~1270",
																			parents: []
																		}
																	]
																}
															]
														},
														{	// Franco-Flemish War. the Battle of Mons-en-Pévèle, He fought the Flemish again under Philip V in 1318 and Philip VI in 1328.
															// Seigneur de Noyon-sur-Andelle.
															name: "Herve VI de Leon",
															sex: "Male",
															birthPlace: "France",
															deathPlace: "UNKNOWN",
															birthDate: "UNKNOWN",
															deathDate: "1337",
															parents: []
														}
													]
												},
												{
													name: "Herve IV du Pont-I'Abbe",
													sex: "Male",
													birthPlace: "France",
													deathPlace: "UNKNOWN",
													birthDate: "UNKNOWN",
													deathDate: "29 September 1364",
													parents: [
														{
															name: "Jeanne de Malestroit",
															sex: "Female",
															birthPlace: "France",
															deathPlace: "UNKNOWN",
															birthDate: "UNKNOWN",
															deathDate: "UNKNOWN",
															parents: [
																{	// Seigneur de Malestroit and de Largoet
																	name: "Geoffrey II de Malestroit",
																	sex: "Male",
																	birthPlace: "France",
																	deathPlace: "UNKNOWN",
																	birthDate: "UNKNOWN",
																	deathDate: "UNKNOWN",
																	parents: [
																		{	// Seigneur de Malestroit. Sieur, de Malestroit, de Largoët, de Beaumont, Chevalier
																			name: "Payen III de Malestroit",
																			sex: "Male",
																			birthPlace: "France",
																			deathPlace: "UNKNOWN",
																			birthDate: "UNKNOWN",
																			deathDate: "UNKNOWN",
																			parents: [
																				{
																					name: "Agathe de Muzillac",
																					sex: "Female",
																					birthPlace: "France",
																					deathPlace: "UNKNOWN",
																					birthDate: "1201",
																					deathDate: "UNKNOWN"
																				},
																				{
																					name: "Eudon de Malestroit",
																					sex: "Male",
																					birthPlace: "France",
																					deathPlace: "UNKNOWN",
																					birthDate: "1205",
																					deathDate: "UNKNOWN",
																					parents: [
																						{
																							name: "Constance de Leon",
																							sex: "Female",
																							birthPlace: "France",
																							deathPlace: "UNKNOWN",
																							birthDate: "1185",
																							deathDate: "1209",
																							parents: [
																								{
																									name: "Margaretha van Rohan",
																									sex: "Female",
																									birthPlace: "France",
																									deathPlace: "UNKNOWN",
																									birthDate: "1165",
																									deathDate: "UNKNOWN",
																									parents: []
																								},
																								{	// first Lord of Léon
																									name: "Hervé I de Leon",
																									sex: "Male",
																									birthPlace: "France",
																									deathPlace: "UNKNOWN",
																									birthDate: "1165",
																									deathDate: "21 July 1203",
																									parents: [
																										{
																											name: "Nobilis or Maencie N.",
																											sex: "Female",
																											birthPlace: "France",
																											deathPlace: "UNKNOWN",
																											birthDate: "1151",
																											deathDate: "~1208"
																										},
																										{	// the Insane. first Lord of Léon
																											name: "Guyomarch IV de Leon",
																											sex: "Male",
																											birthPlace: "France",
																											deathPlace: "UNKNOWN",
																											birthDate: "1130",
																											deathDate: "4 October 1179",
																											parents: [
																												{
																													name: "Sybille de Blois",
																													sex: "Female",
																													birthPlace: "France",
																													deathPlace: "UNKNOWN",
																													birthDate: "UNKNOWN",
																													deathDate: ">1141",
																													parents: [
																														{
																															// died of a fever at Hedingham Castle, Essex, England, and is buried at Faversham Abbey
																															// Countess of Boulogne; Queen Consort of England at Westminster Abbey 22 Mar 1136.
																															name: "Mathilde de Boulogne",
																															sex: "Female",
																															birthPlace: "UNKNOWN",
																															deathPlace: "Essex, England",
																															birthDate: "1103/1105",
																															deathDate: "30 May or 3 July 1151",
																															parents: [
																																{
																																	name: "Mary of Scotland",
																																	sex: "Female",
																																	birthPlace: "Scotland, United Kingdom",
																																	deathPlace: "UNKNOWN",
																																	birthDate: "UNKNOWN",
																																	deathDate: "31 May 1116",
																																	parents: [
																																		{
																																			name: "Margaret of Wessex",
																																			sex: "Female",
																																			birthPlace: "Hungary",
																																			deathPlace: "Edinburgh, Midlothian, Scotland",
																																			birthDate: "1046/1053",
																																			deathDate: "16 November 1093",
																																			parents: []
																																		},
																																		{
																																			// later moved to Dunfermline and later still to and later still to Escorial, Madrid
																																			name: "Malcolm III of Scotland",
																																			sex: "Male",
																																			birthPlace: "Scotland, United Kingdom",
																																			deathPlace: "Alnwick, Northumberland, England",
																																			birthDate: "1031",
																																			deathDate: "13 November 1093",
																																			parents: [
																																				{
																																					name: "Sybilla of Northumberland",
																																					sex: "Female",
																																					birthPlace: "Scotland, United Kingdom",
																																					deathPlace: "UNKNOWN",
																																					birthDate: "UNKNOWN",
																																					deathDate: "UNKNOWN"
																																				},
																																				{
																																					// Historical basis of Duncan in MacBeth!
																																					// PAINTINGS
																																					// He was killed in battle by his first cousin, Macbeth, who succeeded as King of Scotland
																																					name: "Duncan I of Scotland",
																																					sex: "Male",
																																					birthPlace: "Scotland, United Kingdom",
																																					deathPlace: "Burghead, Moray, Scotland, United Kingdom",
																																					birthDate: "~1001",
																																					deathDate: "14 August 1040",
																																					parents: [
																																						{
																																							name: "Bethoc of Scotland",
																																							sex: "Female",
																																							birthPlace: "Scotland, United Kingdom",
																																							deathPlace: "UNKNOWN",
																																							birthDate: "UNKNOWN",
																																							deathDate: "~1050",
																																							parents: [
																																								{
																																									// King of Scotland
																																									name: "Malcolm II of Scotland",
																																									sex: "Male",
																																									birthPlace: "Scotland, United Kingdom",
																																									deathPlace: "Angus, Scotland, United Kingdom",
																																									birthDate: "~954",
																																									deathDate: "25 November 1034",
																																									parents: [
																																										{
																																											// King of Scotland
																																											// Killed -"Finuele filie filie Cunthar comitis de Anguss"
																																											name: "Kenneth II of Scotland",
																																											sex: "Male",
																																											birthPlace: "Scotland, United Kingdom",
																																											deathPlace: "Fettercairn, Mearns, Scotland, United Kingdom",
																																											birthDate: "UNKNOWN",
																																											deathDate: "995",
																																											parents: [
																																												{
																																													// killed
																																													// PAINTING https://www.ancestry.com/family-tree/person/tree/44204929/person/430103244854/facts
																																													name: "Malcolm I of Scotland",
																																													sex: "Male",
																																													birthPlace: "Scotland, United Kingdom",
																																													deathPlace: "Vlurn, Scotland, United Kingdom",
																																													birthDate: "UNKNOWN",
																																													deathDate: "954",
																																													parents: [] // continues w kings
																																												}
																																											]
																																										}
																																									]
																																								}
																																							]
																																						},
																																						{
																																							// Abthane of Dule. Lay abbot of Dunkeld. Steward of the Western Isles. Mormaer of Atholl.
																																							// Killed in battle w MacBeth
																																							name: "Crinan the Thane of Atholl",
																																							sex: "Male",
																																							birthPlace: "Scotland, United Kingdom",
																																							deathPlace: "UNKNOWN",
																																							birthDate: "UNKNOWN",
																																							deathDate: "1045"
																																						}
																																					]
																																				}
																																			]
																																		}
																																	]
																																},
																																{
																																	// participated in the First Crusade of 1096. present at the Siege of Nicaea (May–June 1097), helped rescue Bohemund of Taranto's beleaguered troops at the Battle of Dorylaeum (July 1, 1097), defeated an enemy ambush during the Siege of Antioch
																																	// commanded a division of the crusader army during the Battle of Ascalon patron of the Knights Templar
																																	// Comte de Boulogne, Comte de Lens.
																																	name: "Eustache III de Boulogne",
																																	sex: "Male",
																																	birthPlace: "France",
																																	deathPlace: "UNKNOWN",
																																	birthDate: "UNKNOWN",
																																	deathDate: "1125",
																																	parents: []
																																}
																															]
																														},
																														{	// PICTURE https://www.ancestry.com/family-tree/person/tree/44204929/person/430060991048/facts
																															// King of England from 1135 to his death. Count of Boulogne from 1125 until 1147 and Duke of Normandy from 1135 until 1144.
																															name: "Etienne de Blois",
																															sex: "Male",
																															birthPlace: "Blois, Loir-et-Cher, Centre, France",
																															deathPlace: "Dover, Kent, England",
																															birthDate: "1092-1096",
																															deathDate: "25 October 1154",
																															parents: [
																																{	// Regent of Blois 1102-1107
																																	name: "Adela de Normandie",
																																	sex: "Female",
																																	birthPlace: "France",
																																	deathPlace: "Marcigny, Departement de Saône-et-Loire, Bourgogne, France",
																																	birthDate: "1066",
																																	deathDate: "8 March 1137",
																																	parents: [
																																		{
																																			// Over time Matilda's tomb was desecrated and her original coffin destroyed. Her remains were placed in a sealed box and reburied under the original black slab.[20] In 1959 Matilda's incomplete skeleton was examined and her femur and tibia were measured to d
																																			// was Queen of England and Duchess of Normandy by marriage
																																			name: "Matilda of Flanders",
																																			sex: "Female",
																																			birthPlace: "Departement du Nord, Nord-Pas-de-Calais, France",
																																			deathPlace: "Caen, Departement du Calvados, Basse-Normandie, France",
																																			birthDate: "1030",
																																			deathDate: "3 November 1083",
																																			parents: [
																																				{
																																					// https://www.ancestry.com/family-tree/person/tree/44204929/person/430054484734/facts
																																					// PAINTING
																																					// Adela of Messines; (1009 – 8 January 1079, Messines), was, by marriage, the Duchess of Normandy (January 1027 – August 1027), Countess of Flanders (1035–1067).
																																					name: "Adela Capet",
																																					sex: "Female",
																																					birthPlace: "France",
																																					deathPlace: "France",
																																					birthDate: "1009",
																																					deathDate: "8 January 1079",
																																					parents: [
																																						{
																																							name: "Constance of Arles",
																																							sex: "Female",
																																							birthPlace: "Toulouse, Aquitaine, France",
																																							deathPlace: "Meulan, Aquitaine, France",
																																							birthDate: "986",
																																							deathDate: "28 July 1032",
																																							parents: []
																																						},
																																						{
																																							name: "Robert II of France",
																																							sex: "Male",
																																							birthPlace: "Orléans, Loiret, Centre, France",
																																							deathPlace: "Meulan, Aquitaine, France",
																																							birthDate: "27 March 972",
																																							deathDate: "20 July 1031",
																																							parents: [
																																								{
																																									name: "Adelaide of Aquitaine",
																																									sex: "Female",
																																									birthPlace: "France",
																																									deathPlace: "UNKNOWN",
																																									birthDate: "945",
																																									deathDate: "1004",
																																									parents: []
																																								},
																																								{
																																									// HUGUES "Capet" King of France by an assembly of nobles at Senlis 29 May 987. the King of the Franks from 987 to 996. He is the founder and first king from the House of Capet. He was elected as the successor of the last Carolingian king, Louis V.
																																									// Hugh Capet is encountered in the Divine Comedy of Dante Alighieri (c.1265-1321); the poet places him on the fifth terrace of Mount Purgatory (Purgatorio, Canto XX) among sinners performing penitence for avarice.
																																									name: "Hugh Capet",
																																									sex: "Male",
																																									birthPlace: "France",
																																									deathPlace: "UNKNOWN",
																																									birthDate: "938",
																																									deathDate: "14 October 996",
																																									parents: [
																																										{
																																											// Duchess consort of the Franks by her marriage to the Robertian duke Hugh the Great. Upon her husband's death in 956, she acted as a regent during the minority of their son Hugh Capet,
																																											name: "Hedwig of Saxony",
																																											sex: "Female",
																																											birthPlace: "Germany",
																																											deathPlace: "UNKNOWN",
																																											birthDate: "901",
																																											deathDate: "10 May 965",
																																											parents: [
																																												{
																																													// PAINTING https://www.ancestry.com/family-tree/person/tree/44204929/person/430051861798/facts
																																													name: "Matilda of Ringelheim",
																																													sex: "Female",
																																													birthPlace: "Germany",
																																													deathPlace: "Quedlinburg, Harz, Saxony-Anhalt, Germany",
																																													birthDate: "894/897",
																																													deathDate: "14 March 968",
																																													parents: []
																																												},
																																												{
																																													// Cerebral stroke
																																													// HEINRICH I "der Vogelsteller/the Fowler" King of Germany at Fritzlar 6 May 919, duke of Saxony from 912 and the elected king of East Francia from 919 until his death in 936.
																																													// PAINTINGS https://www.ancestry.com/family-tree/person/tree/44204929/person/430051861753/facts
																																													name: "Heinrich I of Germany",
																																													sex: "Male",
																																													birthPlace: "Membleben, Germany",
																																													deathPlace: "Memleben, Burgenlandkreis, Saxony-Anhalt, Germany",
																																													birthDate: "876",
																																													deathDate: "2 July 936",
																																													parents: [
																																														{
																																															name: "Hathui of Babenburg",
																																															sex: "Female",
																																															birthPlace: "Germany",
																																															deathPlace: "UNKNOWN",
																																															birthDate: "853",
																																															deathDate: "24 December 903",
																																															parents: []
																																														},
																																														{
																																															// Graf im Südthüringau. Graf im Eichsfeld.Duke of Saxony from 880 to his death.
																																															// PAINTING https://www.ancestry.com/family-tree/person/tree/44204929/person/430052144048/facts
																																															name: "Otto I of Saxony",
																																															sex: "Male",
																																															birthPlace: "Germany",
																																															deathPlace: "UNKNOWN",
																																															birthDate: "851",
																																															deathDate: "912",
																																															parents: []
																																														}
																																													]
																																												}
																																											]
																																										},
																																										{
																																											// Duc des Francs. 954 Duke of Burgundy in Apr 956. the Duke of the Franks and Count of Paris.
																																											name: "Hugh the Great of France",
																																											sex: "Male",
																																											birthPlace: "France",
																																											deathPlace: "UNKNOWN",
																																											birthDate: "898",
																																											deathDate: "16 June 956",
																																											parents: [
																																												{
																																													// Baldwin II to have him assassinated in 907.
																																													name: "Beatrice Vermandois",
																																													sex: "Female",
																																													birthPlace: "Vermandois, Aisne, Picardy, France",
																																													deathPlace: "UNKNOWN",
																																													birthDate: "~880",
																																													deathDate: "March 931",
																																													parents: []
																																												},
																																												robertIConfig
																																											]
																																										}
																																									]
																																								}
																																							]
																																						}
																																					]
																																				},
																																				{
																																					// 1035 as BAUDOUIN V "le Pieux/Insulanus" Count of Flanders.
																																					name: "Baldwin V of Flanders",
																																					sex: "Male",
																																					birthPlace: "Departement du Pas-de-Calais, Nord-Pas-de-Calais, France",
																																					deathPlace: "Lille, Departement du Nord, Nord-Pas-de-Calais, France",
																																					birthDate: "19 August 1012",
																																					deathDate: "1 September 1067",
																																					parents: [
																																						{
																																							name: "Ogive de Luxembourg",
																																							sex: "Female",
																																							birthPlace: "UNKNOWN",
																																							deathPlace: "UNKNOWN",
																																							birthDate: "UNKNOWN",
																																							deathDate: "21 February 1030",
																																							parents: [
																																								{
																																									name: "Ermentrude Gleiberg",
																																									sex: "Female",
																																									birthPlace: "Germany",
																																									deathPlace: "UNKNOWN",
																																									birthDate: "964",
																																									deathDate: ">985",
																																								},
																																								{
																																									// Graf im Moselgau. Vogt of Stablo and Malmédy.
																																									// PAINTING https://www.ancestry.com/family-tree/person/tree/44204929/person/430054782388/facts
																																									name: "Frederick I de Luxembourg",
																																									sex: "Male",
																																									birthPlace: "Luxembourg",
																																									deathPlace: "UNKNOWN",
																																									birthDate: "965",
																																									deathDate: "6 October 1019",
																																									parents: [
																																										{
																																											name: "Hedwig N.",
																																											sex: "Female",
																																											birthPlace: "France",
																																											deathPlace: "UNKNOWN",
																																											birthDate: "932",
																																											deathDate: "992",
																																											parents: [
																																												{
																																													name: "Luitgarde of Bidgau",
																																													sex: "Female",
																																													birthPlace: "Germany",
																																													deathPlace: "UNKNOWN",
																																													birthDate: "UNKNOWN",
																																													deathDate: "960",
																																													parents: [
																																														{
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
																																																			birthPlace: "UNKNOWN",
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
																																																					parents: []
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
																																																			parents: [
																																																				{
																																																					name: "Ermentrude of Orleans",
																																																					sex: "Female",
																																																					birthPlace: "Germany",
																																																					deathPlace: "UNKNOWN",
																																																					birthDate: "27 September 823",
																																																					deathDate: "6 October 869",
																																																					parents: []
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
																																																							parents: []
																																																						},
																																																						{
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
																																																						}
																																																					]
																																																				}
																																																			]
																																																		}
																																																	]
																																																}
																																															]
																																														},
																																														{
																																															// Founder House of Ardennes, Graf von Bidgau; Comte d'Ardenne
																																															name: "Wigeric III von Bidgau",
																																															sex: "Male",
																																															birthPlace: "Germany",
																																															deathPlace: "UNKNOWN",
																																															birthDate: "UNKNOWN",
																																															deathDate: "921"
																																														}
																																													]
																																												},
																																												{
																																													name: "Eberhard IV de Nordgau",
																																													sex: "Male",
																																													birthPlace: "France",
																																													deathPlace: "UNKNOWN",
																																													birthDate: "UNKNOWN",
																																													deathDate: "18 December 972/973",
																																													parents: []
																																												}
																																											]
																																										},
																																										{
																																											name: "Siegfried de Luxembourg",
																																											sex: "Male",
																																											birthPlace: "Luxembourg",
																																											deathPlace: "UNKNOWN",
																																											birthDate: "15 August 922",
																																											deathDate: "28 October 998",

																																										}
																																									]
																																								}
																																							]
																																						},
																																						{
																																							// Count of Flanders (The Beareded)
																																							// PAINTING https://en.wikipedia.org/wiki/Baldwin_IV,_Count_of_Flanders
																																							name: "Baldwin IV De Flanders",
																																							sex: "Male",
																																							birthPlace: "UNKNOWN",
																																							deathPlace: "UNKNOWN",
																																							birthDate: "980",
																																							deathDate: "30 March 1035",
																																							parents: []
																																						}
																																					]
																																				}
																																			]
																																		},
																																		{
																																			// GUILLAUME II Duke of Normandy; WILLIAM I "the Conqueror" King of England . the first Norman King of England
																																			// https://www.ancestry.com/family-tree/person/tree/44204929/person/430054483814/facts
																																			name: "Guillaume de Normandie",
																																			sex: "Male",
																																			birthPlace: "Falaise, Departement du Calvados, Basse-Normandie, France",
																																			deathPlace: "Rouen, Departement de la Seine-Maritime, Haute-Normandie, France",
																																			birthDate: "1027",
																																			deathDate: "9 September 1087",
																																			parents: [
																																				{
																																					name: "Herleve de Falaise",
																																					sex: "Female",
																																					birthPlace: "France",
																																					deathPlace: "UNKNOWN",
																																					birthDate: "UNKNOWN",
																																					deathDate: "UNKNOWN",
																																					parents: [
																																						{
																																							name: "Doda N.",
																																							sex: "Female",
																																							birthPlace: "UNKNOWN",
																																							deathPlace: "UNKNOWN",
																																							birthDate: "UNKNOWN",
																																							deathDate: "UNKNOWN"
																																						},
																																						{
																																							name: "Fulbert de Falaise",
																																							sex: "Male",
																																							birthPlace: "France",
																																							deathPlace: "UNKNOWN",
																																							birthDate: "978",
																																							deathDate: "UNKNOWN"
																																						}
																																					]
																																				},
																																				{
																																					// Returning from pilgrimage to Jerusalem. he set out on pilgrimage to Jerusalem.[14] According to the Gesta Normannorum Ducum he travelled by way of Constantinople, reached Jerusalem, fell seriously ill and died[b] on the return journey at Nicaea on 2 July 1
																																					// ROBERT II Duke of Normandy
																																					// Sculpture
																																					name: "Robert II of Normandie",
																																					sex: "Male",
																																					birthPlace: "France",
																																					deathPlace: "Nikaia, Attiki, Attiki, Greece",
																																					birthDate: "22 June 1000",
																																					deathDate: "22 July 1035",
																																					parents: [
																																						{
																																							name: "Judith de Bretagne",
																																							sex: "Female",
																																							birthPlace: "UNKNOWN",
																																							deathPlace: "UNKNOWN",
																																							birthDate: "982",
																																							deathDate: "1017",
																																							parents: [
																																								{
																																									name: "Ermengarde d'Anjou",
																																									sex: "Female",
																																									birthPlace: "France",
																																									deathPlace: "UNKNOWN",
																																									birthDate: "<965",
																																									deathDate: ">982",
																																									parents: [
																																										{
																																											// Countess of Chalon and later Countess of Anjou.
																																											name: "Adele of Meaux",
																																											sex: "Female",
																																											birthPlace: "Caen, France",
																																											deathPlace: "France",
																																											birthDate: "934",
																																											deathDate: "982",
																																											parents: [
																																												{
																																													name: "Adelaide (Wera) de Bourgogne",
																																													sex: "Female",
																																													birthPlace: "Marmagne, Departement de la Côte-d'Or, Bourgogne, France",
																																													deathPlace: "Departement de l'Aisne, Picardie, France",
																																													birthDate: "~918",
																																													deathDate: "19 August 967",
																																													parents: [
																																														{
																																															name: "Ermengarde de Bourgogne",
																																															sex: "Female",
																																															birthPlace: "Dijon, Departement de la Côte-d'Or, Bourgogne, France",
																																															deathPlace: "Departement de l'Yonne, Bourgogne, France",
																																															birthDate: "UNKNOWN",
																																															deathDate: "UNKNOWN",
																																															parents: [
																																																{
																																																	name: "Adelaide d'Auxerre",
																																																	sex: "Female",
																																																	birthPlace: "Auxerre, Departement de l'Yonne, Bourgogne, France",
																																																	deathPlace: "Departement de l'Yonne, Bourgogne, France",
																																																	birthDate: "UNKNOWN",
																																																	deathDate: "UNKNOWN",
																																																	parents: []
																																																},
																																																{
																																																	// Comte d’Autun. Comte d'Auxerre in 886. RICHARD "le Justicier" Duke of Burgundy,
																																																	name: "Richard de Bourgogne",
																																																	sex: "Male",
																																																	birthPlace: "France",
																																																	deathPlace: "France",
																																																	birthDate: "858",
																																																	deathDate: "921",
																																																	parents: []
																																																}
																																															]
																																														},
																																														{
																																															// GISELBERT Duke of Burgundy,
																																															name: "Giselbert de Bourgogne",
																																															sex: "Male",
																																															birthPlace: "France",
																																															deathPlace: "Paris, France",
																																															birthDate: "UNKNOWN",
																																															deathDate: "> Easter 956",
																																															parents: [
																																																{
																																																	name: "Ermengarde de Provence",
																																																	sex: "Female",
																																																	birthPlace: "Châlons-En-Champagne, Champagne-Ardenne, France",
																																																	deathPlace: "Reulle Vergy, Cote D'or, Bourgogne, France",
																																																	birthDate: "~873",
																																																	deathDate: "12 April 935",
																																																	parents: [
																																																		{
																																																			// queen and regent of Provence.
																																																			name: "Ermengarde d'Italie",
																																																			sex: "Female",
																																																			birthPlace: "Frankish Empire (Within Present Italy)",
																																																			deathPlace: "Vienne, Département De L'isère, Kingdom of Provence (Present Rhône-Alpes), Frankish Empire (Within Present France)",
																																																			birthDate: "852-855",
																																																			deathDate: "2-22 June 896",
																																																			parents: [
																																																				{
																																																					// Holy Roman Emperess
																																																					name: "Engelberga of Italy",
																																																					sex: "Female",
																																																					birthPlace: "UNKNOWN",
																																																					deathPlace: "UNKNOWN",
																																																					birthDate: "UNKNOWN",
																																																					deathDate: "896-901",
																																																					parents: [
																																																						{
																																																							// 824 as ADELGIS I Duke of Spoleto, Count of Parma. Cremona after 841, and eventually of Brescia.
																																																							name: "Adelgis I of Spoleto",
																																																							sex: "Male",
																																																							birthPlace: "UNKNOWN",
																																																							deathPlace: "UNKNOWN",
																																																							birthDate: "UNKNOWN",
																																																							deathDate: ">861",
																																																							parents: [
																																																								{
																																																									// Count of Brescia, Parma, Piacenza, Modena, and Bergamo SUPPO I Duke of Spoleto in 822
																																																									// Frankish nobleman, wife probably Lombard
																																																									name: "Suppo I of Spoleto",
																																																									sex: "Male",
																																																									birthPlace: "UNKNOWN",
																																																									deathPlace: "UNKNOWN",
																																																									birthDate: "UNKNOWN",
																																																									deathDate: "5 March 824"
																																																								}
																																																							]
																																																						}
																																																					]
																																																				},
																																																				{
																																																					name: "UNKNOWN",
																																																					sex: "Male",
																																																					birthPlace: "UNKNOWN",
																																																					deathPlace: "UNKNOWN",
																																																					birthDate: "UNKNOWN",
																																																					deathDate: "UNKNOWN",
																																																				}
																																																			]
																																																		},
																																																		{
																																																			// appointed count of Lyon and Vienne,; Comte de Vienne in 870 ; King BOSON of Provence
																																																			name: "Boso de Provence",
																																																			sex: "Male",
																																																			birthPlace: "Metz, Moselle, Lorraine, France",
																																																			deathPlace: "Provence, France",
																																																			birthDate: "850-860",
																																																			deathDate: "11 January 887-945",
																																																			parents: []
																																																		}
																																																	]
																																																},
																																																{
																																																	// Comte de Dijon
																																																	name: "Manasses II de Dijon",
																																																	sex: "Male",
																																																	birthPlace: "France",
																																																	deathPlace: "UNKNOWN",
																																																	birthDate: "900",
																																																	deathDate: "925",
																																																	parents: [
																																																		{
																																																			// Comte de Dijon
																																																			name: "Manasses I de Dijon",
																																																			sex: "Male",
																																																			birthPlace: "France",
																																																			deathPlace: "UNKNOWN",
																																																			birthDate: "875",
																																																			deathDate: "918"
																																																		}
																																																	]
																																																}
																																															]
																																														}
																																													]
																																												},
																																												{
																																													name: "Robert de Vermandois",
																																													sex: "Male",
																																													birthPlace: "Meaux, Departement de Seine-et-Marne, Île-de-France, France",
																																													deathPlace: "Departement de Seine-et-Marne, Île-de-France, France",
																																													birthDate: "~916",
																																													deathDate: "29 August 968",
																																													parents: [
																																														{
																																															name: "Adela of France",
																																															sex: "Female",
																																															birthPlace: "Vermandois, East Picardy, France",
																																															deathPlace: "St Quentin, Pas De Calais, Normandy, France",
																																															birthDate: "895",
																																															deathDate: "23 Februrary 942",
																																															parents: [
																																																{
																																																	name: "Aelis of Maine",
																																																	sex: "Female",
																																																	birthPlace: "France",
																																																	deathPlace: "UNKNOWN",
																																																	birthDate: "UNKNOWN",
																																																	deathDate: "UNKNOWN"
																																																},
																																																robertIConfig
																																															]
																																														},
																																														{
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
																																														}
																																													]
																																												}
																																											]
																																										},
																																										{
																																											// 958 as GEOFFROY I "Grisegonelle" Comte d'Anjou
																																											name: "Geoffroy I d'Anjou",
																																											sex: "Male",
																																											birthPlace: "Departement de Maine-et-Loire, Pays de la Loire, France",
																																											deathPlace: "Marcon, Departement de la Sarthe, Pays de la Loire, France",
																																											birthDate: "938/940",
																																											deathDate: "21 July 987",
																																											parents: [
																																												{
																																													name: "Gerberge du Maine",
																																													sex: "Female",
																																													birthPlace: "Maine-de-Boixe, Departement de Maine-et-Loire, Pays de la Loire, France",
																																													deathPlace: "Tours, Departement de Maine-et-Loire, Pays de la Loire, France",
																																													birthDate: "UNKNOWN",
																																													deathDate: "UNKNOWN"
																																												},
																																												{
																																													name: "Fulques II d'Anjou",
																																													sex: "Male",
																																													birthPlace: "Departement de Maine-et-Loire, Pays de la Loire, France",
																																													deathPlace: "Tours, Departement de Maine-et-Loire, Pays de la Loire, France",
																																													birthDate: "905",
																																													deathDate: "11 November 958",
																																													parents: [
																																														{
																																															name: "Roscille de Loches",
																																															sex: "Female",
																																															birthPlace: "Loches, Departement d'Indre-et-Loire, Centre, France",
																																															deathPlace: "Angers, Departement de Maine-et-Loire, Pays de la Loire, France",
																																															birthDate: "UNKNOWN",
																																															deathDate: "UNKNOWN",
																																															parents: [
																																																{
																																																	name: "Tescenda N.",
																																																	sex: "Female",
																																																	birthPlace: "France",
																																																	deathPlace: "UNKNOWN",
																																																	birthDate: "UNKNOWN",
																																																	deathDate: "UNKNOWN"
																																																},
																																																{
																																																	name: "Garnier de Loches",
																																																	sex: "Male",
																																																	birthPlace: "France",
																																																	deathPlace: "UNKNOWN",
																																																	birthDate: "UNKNOWN",
																																																	deathDate: "UNKNOWN",
																																																	parents: [
																																																		{
																																																			name: "Adalhard de Loches",
																																																			sex: "Male",
																																																			birthPlace: "France",
																																																			deathPlace: "UNKNOWN",
																																																			birthDate: "UNKNOWN",
																																																			deathDate: "UNKNOWN"
																																																		}
																																																	]
																																																}
																																															]
																																														},
																																														{
																																															name: "Foulques I de Anjou",
																																															sex: "Male",
																																															birthPlace: "France",
																																															deathPlace: "UNKNOWN",
																																															birthDate: "870",
																																															deathDate: "August 941/942",
																																															parents: [
																																																{
																																																	name: "Adelais of Amboise",
																																																	sex: "Female",
																																																	birthPlace: "France",
																																																	deathPlace: "UNKNOWN",
																																																	birthDate: "UNKNOWN",
																																																	deathDate: "UNKNOWN"
																																																},
																																																{
																																																	name: "Ingelger D'Anjou",
																																																	sex: "Male",
																																																	birthPlace: "Rennes, Ille Et Vilaine, Bretagne, France",
																																																	deathPlace: "UNKNOWN",
																																																	birthDate: "845",
																																																	deathDate: "888",
																																																	parents: [
																																																		{
																																																			name: "Petronilla de Bourgogne",
																																																			sex: "Female",
																																																			birthPlace: "France",
																																																			deathPlace: "UNKNOWN",
																																																			birthDate: "UNKNOWN",
																																																			deathDate: "UNKNOWN",
																																																			parents: [
																																																				{
																																																					name: "Hugues de Bourgogne",
																																																					sex: "Male",
																																																					birthPlace: "France",
																																																					deathPlace: "UNKNOWN",
																																																					birthDate: "UNKNOWN",
																																																					deathDate: "UNKNOWN"
																																																				}
																																																			]
																																																		},
																																																		{
																																																			name: "Tertullus d'Anjou",
																																																			sex: "Male",
																																																			birthPlace: "France",
																																																			deathPlace: "UNKNOWN",
																																																			birthDate: "821",
																																																			deathDate: "UNKNOWN",
																																																			parents: [
																																																				{
																																																					name: "Torcato de Anjou",
																																																					sex: "Male",
																																																					birthPlace: "France",
																																																					deathPlace: "Rennes, Ille-et-Vilaine, Bretagne, Franc",
																																																					birthDate: "800",
																																																					deathDate: "853",
																																																					parents: [
																																																						{
																																																							name: "Lucius Torquatius",
																																																							sex: "Male",
																																																							birthPlace: "Anjou, France",
																																																							deathPlace: "UNKNOWN",
																																																							birthDate: "UNKNOWN",
																																																							deathDate: "UNKNOWN"
																																																						}
																																																					]
																																																				}
																																																			]
																																																		}
																																																	]
																																																}
																																															]
																																														}
																																													]
																																												}
																																											]
																																										}
																																									]
																																								},
																																								{
																																									// Killed in battle. died fighting his brother-in-law Fulk Nerra, Count of Anjou at the Battle of Conquereuil on 27 June 992
																																									// Duke of Brittany from 990 to his death
																																									name: "Conan I de Rennes",
																																									sex: "Male",
																																									birthPlace: "France",
																																									deathPlace: "Conquereuil, Loire-Atlantique, Pays de la Loire, France",
																																									birthDate: "UNKNOWN",
																																									deathDate: "27 June 992",
																																									parents: [
																																										{
																																											// he fought alongside Alan II, Duke of Brittany and Hugh II of Maine against the Vikings at the Battle of Trans-la-Forêt.[
																																											// Count of Rennes
																																											name: "Judicael Berengar",
																																											sex: "Male",
																																											birthPlace: "France",
																																											deathPlace: "UNKNOWN",
																																											birthDate: "931",
																																											deathDate: "970",
																																											parents: [
																																												{
																																													name: "N. de Bretagne",
																																													sex: "Female",
																																													birthPlace: "France",
																																													deathPlace: "UNKNOWN",
																																													birthDate: "UNKNOWN",
																																													deathDate: "UNKNOWN",
																																													parents: [
																																														{
																																															// Duke of Brittany
																																															name: "Gurwent de Bretagne",
																																															sex: "Male",
																																															birthPlace: "France",
																																															deathPlace: "UNKNOWN",
																																															birthDate: "UNKNOWN",
																																															deathDate: "877"
																																														}
																																													]
																																												},
																																												{
																																													// Count of Rennes
																																													name: "Berenger de Rennes",
																																													sex: "Male",
																																													birthPlace: "France",
																																													deathPlace: "UNKNOWN",
																																													birthDate: "UNKNOWN",
																																													deathDate: "UNKNOWN"
																																												}
																																											]
																																										}
																																									]
																																								}
																																							]
																																						},
																																						{
																																							// repelled an English attack on the Cotentin Peninsula that was led by Ethelred II of England.[
																																							// RICHARD II "le Bon/l'Irascible" Comte de Normandie. Duke of Normandy [1015]. “
																																							// PAINTING https://www.ancestry.com/family-tree/person/tree/44204929/person/430054484199/facts
																																							name: "Richard II of Normandie",
																																							sex: "Male",
																																							birthPlace: "France",
																																							deathPlace: "France",
																																							birthDate: "23 August 963",
																																							deathDate: "28 August 1026",
																																							parents: [
																																								{	// PAINTING  https://www.ancestry.com/family-tree/person/tree/44204929/person/430054497758/facts
																																									name: "Gunnora N.",
																																									sex: "Female",
																																									birthPlace: "France",
																																									deathPlace: "UNKNOWN",
																																									birthDate: "~940",
																																									deathDate: "1031"
																																								},
																																								{
																																									// RICHARD I "Sans Peur" Comte [de Normandie]. Comte de Rouen/
																																									// https://www.ancestry.com/family-tree/person/tree/44204929/person/430054497715/facts
																																									name: "Richard I of Normandy",
																																									sex: "Male",
																																									birthPlace: "France",
																																									deathPlace: "Fecamp, Normandie, France",
																																									birthDate: "28 August 933",
																																									deathDate: "20 November 966",
																																									parents: [
																																										{
																																											// Breton captive
																																											name: "Espriota Sproata Adela De Bretagne",
																																											sex: "Female",
																																											birthPlace: "France",
																																											deathPlace: "UNKNOWN",
																																											birthDate: "911",
																																											deathDate: "945",
																																											parents: [
																																												{
																																													name: "Bertha de Morvis",
																																													sex: "Female",
																																													birthPlace: "Vermandois, Aisne, Picardie, France",
																																													deathPlace: "Bohain-En-Vermandois, Aisne, Picardie, France",
																																													birthDate: "30 August 854",
																																													deathDate: "15 June 923",
																																													parents: [
																																														{
																																															name: "Eve de Roussillon",
																																															sex: "Female",
																																															birthPlace: "France",
																																															deathPlace: "UNKNOWN",
																																															birthDate: "~820",
																																															deathDate: "UNKNOWN"
																																														}
																																													]
																																												}
																																											]
																																										},
																																										{
																																											// murdered
																																											// William Longsword; GUILLAUME I "Longuespee" Comte [de Normandie]
																																											name: "William of Normandy I",
																																											sex: "Male",
																																											birthPlace: "France",
																																											deathPlace: "Pequigny, France",
																																											birthDate: "893",
																																											deathDate: "17 December 942",
																																											parents: [
																																												{
																																													name: "Poppa of Bayeaux",
																																													sex: "Female",
																																													birthPlace: "France",
																																													deathPlace: "UNKNOWN",
																																													birthDate: "UNKNOWN",
																																													deathDate: "UNKNOWN",
																																													parents: [
																																														{
																																															// Comte de Bayeux.
																																															name: "Berengar II of Bayeux",
																																															sex: "Male",
																																															birthPlace: "France",
																																															deathPlace: "UNKNOWN",
																																															birthDate: "UNKNOWN",
																																															deathDate: "866"
																																														}
																																													]
																																												},
																																												{
																																													// when Rollo took Bayeux by force, he carried off with him the beautiful Popa or Poppa, a daughter of Berenger, Count of Rennes,
																																													// Medieval sources contradict each other regarding whether Rollo's family was Norwegian or Danish in origin.
																																													name: "Rollo of Normandy",
																																													sex: "Male",
																																													birthPlace: "Norway",
																																													deathPlace: "Rouen, Normandie, France",
																																													birthDate: "846",
																																													deathDate: "930",
																																													imageUrl: "./images/rollo.jpg",
																																													parents: [
																																														{
																																															name: "Ragnhild N.",
																																															sex: "Female",
																																															birthPlace: "Norway",
																																															deathPlace: "UNKNOWN",
																																															birthDate: "UNKNOWN",
																																															deathDate: "UNKNOWN"
																																														},
																																														{
																																															// jarl of North and South Möre and of Raumsdal in Norway
																																															name: "Ragnevald of Normandy",
																																															sex: "Male",
																																															birthPlace: "Norway",
																																															deathPlace: "UNKNOWN",
																																															birthDate: "UNKNOWN",
																																															deathDate: "894",
																																															parents: [
																																																{
																																																	// Jarl of the Uplanders in Norway
																																																	name: "Eystein of Normandy",
																																																	sex: "Male",
																																																	birthPlace: "Norway",
																																																	deathPlace: "UNKNOWN",
																																																	birthDate: "UNKNOWN",
																																																	deathDate: "UNKNOWN",
																																																	parents: [
																																																		{
																																																			// from saga. Jarl of the Uplanders in Norway
																																																			name: "Ivar of Normandy",
																																																			sex: "Male",
																																																			birthPlace: "Norway",
																																																			deathPlace: "UNKNOWN",
																																																			birthDate: "UNKNOWN",
																																																			deathDate: "UNKNOWN",
																																																			parents: [
																																																				{
																																																					// from saga
																																																					name: "Halfdan of Normandy",
																																																					sex: "Male",
																																																					birthPlace: "Norway",
																																																					deathPlace: "UNKNOWN",
																																																					birthDate: "UNKNOWN",
																																																					deathDate: "UNKNOWN"
																																																				}
																																																			]
																																																		}
																																																	]
																																																}
																																															]
																																														}
																																													]
																																												}
																																											]
																																										}
																																									]
																																								}
																																							]
																																						}
																																					]
																																				}
																																			]
																																		}
																																	]
																																},
																																{
																																	// murdered
																																	// first crusade
																																	// ETIENNE Comte de Blois, de Chartres, de Châteaudun, de Sancerre et de Meaux.
																																	name: "Etienne Henri II de Blois",
																																	sex: "Male",
																																	birthPlace: "Blois, Loir-et-Cher, Centre, France",
																																	deathPlace: "Ramla (Ramleh), Palestine",
																																	birthDate: "1045",
																																	deathDate: "19 MAY 1102",
																																	parents: []
																																}
																															]
																														},
																													]
																												},
																												{	// he went to England to assist King Stephen in the war against Matilda.
																													// Vicomte de Léon. was created Earl of Wiltshire in early 1140. the honour of Eye
																													name: "Herve II de Leon",
																													sex: "Male",
																													birthPlace: "France",
																													deathPlace: "UNKNOWN",
																													birthDate: "1110",
																													deathDate: "1168",
																													parents: [
																														{
																															name: "Nobilise de Leon",
																															sex: "Female",
																															birthPlace: "France",
																															deathPlace: "UNKNOWN",
																															birthDate: "UNKNOWN",
																															deathDate: "UNKNOWN"
																														},
																														{
																															// Vicomte de Léon.
																															name: "Guyomar III de Leon",
																															sex: "Male",
																															birthPlace: "France",
																															deathPlace: "UNKNOWN",
																															birthDate: "1080",
																															deathDate: "<1128"
																														}
																													]
																												}
																											]
																										}
																									]
																								}
																							]
																						},
																						{
																							name: "Payen II de Malestroit",
																							sex: "Male",
																							birthPlace: "France",
																							deathPlace: "UNKNOWN",
																							birthDate: "1180",
																							deathDate: "1229",
																							parents: [
																								{
																									name: "P. Largoet en Elven",
																									sex: "Female",
																									birthPlace: "France",
																									deathPlace: "UNKNOWN",
																									birthDate: "1160",
																									deathDate: "UNKNOWN"
																								},
																								{
																									name: "Judicael de Malestroit",
																									sex: "Male",
																									birthPlace: "France",
																									deathPlace: "UNKNOWN",
																									birthDate: "1150",
																									deathDate: "UNKNOWN",
																									parents: [
																										{
																											name: "Payen de Malestroit",
																											sex: "Male",
																											birthPlace: "France",
																											deathPlace: "UNKNOWN",
																											birthDate: "1110",
																											deathDate: "UNKNOWN",
																											parents: [
																												{	// 1st crusade
																													name: "Jahael de Malestroit",
																													sex: "Male",
																													birthPlace: "France",
																													deathPlace: "UNKNOWN",
																													birthDate: "1085",
																													deathDate: "1120"
																												}
																											]
																										}
																									]
																								}
																							]
																						}

																					]
																				}
																			]
																		}
																	]

																}
															]
														},
														{	// lord of Pont-Abbe and Goarlot
															name: "Geoffrey I du Pont-I'Abbe",
															sex: "Male",
															birthPlace: "France",
															deathPlace: "UNKNOWN",
															birthDate: "UNKNOWN",
															deathDate: "<1328",
															parents: [
																{
																	name: "Plezou de Rostrenen",
																	sex: "Female",
																	birthPlace: "France",
																	deathPlace: "UNKNOWN",
																	birthDate: "~1237",
																	deathDate: "UNKNOWN",
																	parents: [
																		jeanneDeParthenayConfig,
																		pierreIIIConfig
																	]
																},
																herveIIIConfig
															]
														}
													]
												}
											]
										}
									]
								}
							]
						}
                    ]
                }
            ]
        }
    ]
}