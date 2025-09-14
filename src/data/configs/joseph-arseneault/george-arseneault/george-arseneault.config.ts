import { georgeLouisArseneaultStory } from "../../../stories/george-louis-arseneault";
import { louisArseneauStory } from "../../../stories/louis-arseneau";
import { nicolasBaronIIStory } from "../../../stories/nicolas-barron-ii";
import { pierreBaronLupienStory } from "../../../stories/pierre-baron-lupien";
import { antoineArseneauConfig } from "./antoine-arseneau/antoine-arseneau.config";
import { isaacMineauConfig } from "./isaac-mineau/isaac-mineau.config";
import { rosalieLambertConfig } from "./rosalie-lambert.config";

export const georgeArseneaultConfig = {
    name: "George Louis Arseneault",
    sex: "Male",
    birthPlace: "St-Etienne-Des-Gras, St-Maurice, PQ, Canada",
    deathPlace: "Flint, Genesee, Michigan",
    birthDate: "31 May 1863",
    deathDate: "4 March 1931",
    imageUrl: "./images/george-louis-arseneault.jpg",
    story: georgeLouisArseneaultStory,
    parents: [
        {   
            name: "Emerentienne Marie Laurence Mineau",
            sex: "Female",
            birthPlace: "Louiseville, Maskinongé, Quebec, Canada",
            deathPlace: "St-Mathieu, St-Maurice County, Quebec, Canada",
            birthDate: "20 December 1832",
            deathDate: "6 August 1912",
            parents: [
                {
                    name: "Emelie Marie Beland",
                    sex: "Female",
                    birthPlace: "Louiseville, Maskinongé, Quebec, Canada",
                    deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
                    birthDate: "19 October 1805",
                    deathDate: "18 November 1875",
                    parents: [
                        {
                            name: "Magdeleine Baron dit Lupien",
                            sex: "Female",
                            birthPlace: "Maskinongé, Quebec, Canada",
                            deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
                            birthDate: "10 November 1775",
                            deathDate: "31 July 1818",
                            parents: [
                                {
                                    name: "Marie Madeleine Brule",
                                    sex: "Female",
                                    birthPlace: "Louiseville, Maskinongé, Quebec, Canada",
                                    deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
                                    birthDate: "30 July 1753",
                                    deathDate: "8 March 1803",
                                    parents: [
                                        {
                                            name: "Marie Madeleine Billy",
                                            sex: "Female",
                                            birthPlace: "Richelieu, Québec, Canada",
                                            deathPlace: "St-Antoine-de-Riviere-du-Loup, Louisevillle, Maskinonge, Quebec, Canada",
                                            birthDate: "29 March 1717",
                                            deathDate: "3 March 1790",
                                            parents: []
                                        },
                                        {
                                            name: "Louis Antoine Brulé",
                                            sex: "Male",
                                            birthPlace: "Ile Dupas, Berthier, Montmagny, Quebec, Canada",
                                            deathPlace: "Saint-Antoine-De-La-Rivière-Du-Loup, Québec, Canada",
                                            birthDate: "1703",
                                            deathDate: "2 January 1769",
                                            parents: [
                                                {
                                                    name: "Marie Renee Cottenoire",
                                                    sex: "Female",
                                                    birthPlace: "Cap-de-la-Madeleine, Les Chenaux, Quebec, Canada",
                                                    deathPlace: "Sorel, Pierre-De Saurel, Quebec, Canada",
                                                    birthDate: "15 February 1683",
                                                    deathDate: "9 February 1711",
                                                    parents: [] // https://www.ancestry.com/family-tree/person/tree/24629615/person/12210903269/facts
                                                },
                                                {
                                                    name: "Antoine Francoeur Brule Jr",
                                                    sex: "Male",
                                                    birthPlace: "Amiens, Departement de la Somme, Picardie, France",
                                                    deathPlace: "La Visitation-de-l'Île-Dupas, Lanaudiere Region, Quebec, Canada",
                                                    birthDate: "19 June 1668",
                                                    deathDate: "14 May 1743",
                                                    parents: [
                                                        {
                                                            name: "Marie Madeleine Normandin",
                                                            sex: "Female",
                                                            birthPlace: "Pointe-Aux-Trembles, Québec, Canada",
                                                            deathPlace: "Québec, Québec, Canada",
                                                            birthDate: "14 July 1694",
                                                            deathDate: "1761",
                                                            parents: [
                                                                {
                                                                    name: "Marie Louise Ayotte",
                                                                    sex: "Female",
                                                                    birthPlace: "29 April 1664",
                                                                    deathPlace: "26 March 1720",
                                                                    birthDate: "Sillery, Quebec, Canada",
                                                                    deathDate: "Champlain, Quebec, Canada",
                                                                },
                                                                {
                                                                    name: "Daniel Normandin",
                                                                    sex: "Male",
                                                                    birthPlace: "La Rochelle, Manche, Basse-Normandie, France",
                                                                    deathPlace: "Batiscan, Quebec, Canada",
                                                                    birthDate: "11 April 1661",
                                                                    deathDate: "18 September 1729",
                                                                    parents: [] // https://www.ancestry.com/family-tree/person/tree/24629615/person/12501545758/facts
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            name: "Guillaume De Billy dit St-Louis",
                                                            sex: "Male",
                                                            birthPlace: "Nicolet, Quebec, Canada",
                                                            deathPlace: "Louiseville, Quebec, Canada",
                                                            birthDate: "9 March 1687",
                                                            deathDate: "19 December 1779",
                                                            parents: [
                                                                {
                                                                    name: "Catherine Marguerite DeLaMarche",
                                                                    sex: "Female",
                                                                    birthPlace: "Beauvais, Oise, Picardie, France",
                                                                    deathPlace: "Champlain, Quebec, Canada",
                                                                    birthDate: "27 April 1646",
                                                                    deathDate: "11 April 1731",
                                                                    parents: [] // https://www.ancestry.com/family-tree/person/tree/24629615/person/48579565416/facts
                                                                },
                                                                {
                                                                    name: "Jean-Francois de Billy",
                                                                    sex: "Male",
                                                                    birthPlace: "Des Champs, Paris, Ile-de-France, France",
                                                                    deathPlace: "Champlain, Quebec, Canada",
                                                                    birthDate: "27 December 1649",
                                                                    deathDate: "30 January 1716",
                                                                    parents: [] // https://www.ancestry.com/family-tree/person/tree/24629615/person/48579565415/facts
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
                                    name: "Jacques Antoine Baron Lupien",
                                    sex: "Male",
                                    birthPlace: "Saint-Léon-le-Grand, Mauricie Region, Quebec, Canada",
                                    deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
                                    birthDate: "20 November 1744",
                                    deathDate: "20 July 1806",
                                    parents: [
                                        {   // IS SOMETHING WRONG - this disagrees with Our French-Canadian ancestors; Vol. 8 (see Pierre Baron Lupien)
                                            name: "Marie Anne Fafard",
                                            sex: "Female",
                                            birthPlace: "Québec, Quebec, Canada",
                                            deathPlace: "Montréal, Quebec, Canada",
                                            birthDate: "1700",
                                            deathDate: "3 February 1752",
                                            parents: [
                                                {
                                                    name: "Marie Francoise Goupil (Beloy)",
                                                    sex: "Female",
                                                    birthPlace: "Sillery, Capitale-Nationale Region, Quebec, Canada",
                                                    deathPlace: "Montreal, Montreal Region, Quebec, Canada",
                                                    birthDate: "11 February 1655",
                                                    deathDate: "30 October 1747",
                                                    parents: [
                                                        {
                                                            name: "Anne Marie Pelletier",
                                                            sex: "Female",
                                                            birthPlace: "Québec, Québec, Canada",
                                                            deathPlace: "Québec, Québec, Canada",
                                                            birthDate: "3 April 1638",
                                                            deathDate: "9 March 1711",
                                                            parents: [
                                                                {
                                                                    name: "Jeanne de Vousy",
                                                                    sex: "Female",
                                                                    birthPlace: "Gallardon, Departement d'Eure-et-Loir, Centre, France",
                                                                    deathPlace: "Sorel, Monteregie Region, Quebec, Canada",
                                                                    birthDate: "27 April 1612",
                                                                    deathDate: "12 December 1689",
                                                                    parents: [] // https://www.ancestry.com/family-tree/person/tree/75033915/person/392339564622/facts
                                                                },
                                                                {
                                                                    name: "Nicolas Pelletier",
                                                                    sex: "Male",
                                                                    birthPlace: "Gallardon, Departement d'Eure-et-Loir, Centre, France",
                                                                    deathPlace: "Sillery, Capitale-Nationale Region, Quebec, Canada",
                                                                    birthDate: "4 June 1596",
                                                                    deathDate: "9 November 1674",
                                                                    parents: [] // https://www.ancestry.com/family-tree/person/tree/75033915/person/392339564618/facts
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            name: "Nicolas Goupil",
                                                            sex: "Male",
                                                            birthPlace: "Le Mesnil Durand, Calvados, Normandie, France",
                                                            deathPlace: "Sillery, Québec, Canada",
                                                            birthDate: "1630",
                                                            deathDate: "24 August 1655"
                                                        }
                                                    ]
                                                },
                                                {
                                                    name: "Joseph Courrault Courraut",
                                                    sex: "Male",
                                                    birthPlace: "Saint-André, Angoulême, Charente, Poitou-Charentes, France",
                                                    deathPlace: "Lachine, Jacques Cartier, QC Canada, Québec, Canada",
                                                    birthDate: "9 November 1642",
                                                    deathDate: "19 October 1696",
                                                    parents: [] // https://www.ancestry.com/family-tree/person/tree/24629615/person/252582603898/facts
                                                }
                                            ]
                                        },
                                        {
                                            name: "Pierre Baron Lupien",
                                            sex: "Male",
                                            birthPlace: "Montréal, Quebec, Canada",
                                            deathPlace: "Montréal, Quebec, Canada",
                                            birthDate: "10 October 1683",
                                            deathDate: "25 May 1744",
                                            story: pierreBaronLupienStory,
                                            parents: [
                                                {
                                                    name: "Marie Madeline Marthie Chavin",
                                                    sex: "Female",
                                                    birthPlace: "Notre-Dame-de-Montréal, Quebec, Canada",
                                                    deathPlace: "Maskinongé, Maskinongé, Quebec, Canada",
                                                    birthDate: "17 January 1662",
                                                    deathDate: "11 February 1728",
                                                    parents: [
                                                        {
                                                            name: "Marie Marthe Hautreux Autreuil",
                                                            sex: "Female",
                                                            birthPlace: "Saint-Germain-de-Noyen-sur-Sarthe, La Flèche, Sarthe, Pays de la Loire, France",
                                                            deathPlace: "Saint-François-de-Sales-de-L'Île-Jèsus, Le Domaine-du-Roy, Quebec, Canada",
                                                            birthDate: "17 January 1636",
                                                            deathDate: "25 February 1714",
                                                            parents: [] // https://www.ancestry.com/family-tree/person/tree/24629615/person/252580293950/facts
                                                        },
                                                        {
                                                            name: "Pierre dit La Grand Pierre Chauvin",
                                                            sex: "Male",
                                                            birthPlace: "Bourseul, Cotes d'Armor, Bretagne, France",
                                                            deathPlace: "Notre-Dame-de-Montréal, Quebec, Canada",
                                                            birthDate: "18 February 1635",
                                                            deathDate: "4 August 1699",
                                                            parents: [] // https://www.ancestry.com/family-tree/person/tree/24629615/person/252313835874/facts
                                                        }
                                                    ]
                                                },
                                                {
                                                    name: "Nicolas Baron II",
                                                    sex: "Male",
                                                    birthPlace: "Villenavar, Nogent-sur-Seine, Troyes, Champagne (Aube), France",
                                                    deathPlace: "Lachenaie, Quebec, Canada",
                                                    birthDate: "17 June 1645",
                                                    deathDate: "31 October 1697",
                                                    story: nicolasBaronIIStory,
                                                    imageUrl: "./images/nicolas-baron-ii.jpg",
                                                    parents: [] // https://www.ancestry.com/family-tree/person/tree/24629615/person/12501173837/facts
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        {
                            name: "Francois de Sales (Frank) Beland III",
                            sex: "Male",
                            birthPlace: "Yamachiche, Québec, Canada",
                            deathPlace: "Louiseville, Maskinonge, Quebec, Canada",
                            birthDate: "12 January 1775",
                            deathDate: "25 March 1842",
                            parents: [
                                {
                                    name: "Marie Antoinelle Lamy",
                                    sex: "Female",
                                    birthPlace: "Yamachiche, Mauricie, Québec, Canada",
                                    deathPlace: "Maskinongé, Quebec, Canada",
                                    birthDate: "4 April 1755",
                                    deathDate: "27 April 1826",
                                    parents: [
                                        {
                                            name: "Madeleine Genevieve Lefebvre (Lemay)",
                                            sex: "Female",
                                            birthPlace: "Louiseville, Maskinongé, Québec, Canada",
                                            deathPlace: "Yamachiche, Québec, Canada",
                                            birthDate: "29 September 1723",
                                            deathDate: "21 June 1765",
                                            parents: []
                                        },
                                        {
                                            name: "Joseph Marie Lamy",
                                            sex: "Male",
                                            birthPlace: "Berthier En Bas, Quebec, Canada",
                                            deathPlace: "Yamachiche, Quebec, Canada",
                                            birthDate: "21 March 1723",
                                            deathDate: "1 January 1764",
                                            parents: []
                                        }
                                    ]
                                },
                                {
                                    name: "François de Sales (Charles) Béland Jr",
                                    sex: "Male",
                                    birthPlace: "Neuville, Portneuf, Quebec, Canada",
                                    deathPlace: "Louiseville (St-Antoine-de-Rivière-Du-Loup), Québec, Canada",
                                    birthDate: "10 October 1743",
                                    deathDate: "14 May 1813",
                                    parents: [
                                        {
                                            name: "Marie-Francoise Aide-Créquy",
                                            sex: "Female",
                                            birthPlace: "Neuville, Québec, Canada",
                                            deathPlace: "Neuville, Québec, Canada",
                                            birthDate: "25 July 1725",
                                            deathDate: "27 January 1795",
                                            parents: [
                                                {
                                                    name: "Marie-Madeleine Angelique Pinel",
                                                    sex: "Female",
                                                    birthPlace: "Riviere Ouelle, Québec, Canada",
                                                    deathPlace: "Les Écureuils, Portneuf, Québec, Canada",
                                                    birthDate: "28 January 1700",
                                                    deathDate: "20 June 1769",
                                                    parents: [
                                                        {
                                                            name: "Marie-Louise Constantineau",
                                                            sex: "Female",
                                                            birthPlace: "Quebec City, Quebec, Canada",
                                                            deathPlace: "Neuville, Portneuf County, Quebec, Canada",
                                                            birthDate: "14 June 1670",
                                                            deathDate: "October 1736"
                                                        },
                                                        {
                                                            name: "Francois Xavier Pinel",
                                                            sex: "Male",
                                                            birthPlace: "Sillery, Quebec, Canada",
                                                            deathPlace: "Neuville, Portneuf County, Quebec, Canada",
                                                            birthDate: "<15 January 1664",
                                                            deathDate: "February 1709"
                                                        }
                                                    ]
                                                },
                                                {
                                                    name: "Ignace Aide Crequy",
                                                    sex: "Male",
                                                    birthPlace: "Portneuf, Québec, Canada",
                                                    deathPlace: "Neuville, Quebec, Canada",
                                                    birthDate: "21 June 1700",
                                                    deathDate: "9 July 1765",
                                                    parents: [
                                                        {
                                                            name: "Marie Catherine-Angelique de l'Isle",
                                                            sex: "Female",
                                                            birthPlace: "Montreal, Québec, Canada",
                                                            deathPlace: "Neuville, Quebec, Canada",
                                                            birthDate: "11 June 1674",
                                                            deathDate: "12 December 1726",
                                                            parents: [
                                                                {   // (“ Filles du Roi-The King’s Daughters”)
                                                                    name: "Louise Desgranges",
                                                                    sex: "Female",
                                                                    birthPlace: "Montmorency, val-d’oise, Ile-de-France, France",
                                                                    deathPlace: "Neuville, Capitale-Nationale Region, Quebec",
                                                                    birthDate: "5 November 1648",
                                                                    deathDate: "11 November 1721",
                                                                    parents: [] // https://www.ancestry.com/family-tree/person/tree/90282466/person/322669828468/facts
                                                                },
                                                                {
                                                                    name: "Louis de L'Isle",
                                                                    sex: "Male",
                                                                    birthPlace: "Dampierre-en-Bray, France",
                                                                    deathPlace: "Quebec, Canada",
                                                                    birthDate: "11 April 1645",
                                                                    deathDate: "10 September 1693",
                                                                    parents: [] // https://www.ancestry.com/family-tree/person/tree/90282466/person/322669828467/facts
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            name: "Jean Aide Dit Crequi",
                                                            sex: "Male",
                                                            birthPlace: "La Rochelle, Manche, Basse-Normandie, France",
                                                            deathPlace: "Portneuf, Québec, Canada",
                                                            birthDate: "9 April 1661",
                                                            deathDate: "12 December 1726"
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            name: "François-de-Sales Béland Sr",
                                            sex: "Male",
                                            birthPlace: "Montréal, Quebec, Canada",
                                            deathPlace: "Neuville (Pointe aux Trembles), Quebec, Canada",
                                            birthDate: "18 March 1720",
                                            deathDate: "19 September 1791",
                                            parents: [
                                                {
                                                    name: "Marie Jeanne Anne Morel",
                                                    sex: "Female",
                                                    birthPlace: "Beauport, Quebec (Urban Agglomeration), Quebec, Canada",
                                                    deathPlace: "Neuville, Portneuf, Quebec, Canada",
                                                    birthDate: "26 April 1691",
                                                    deathDate: "23 July 1744",
                                                    parents: [
                                                        {
                                                            name: "Marie Joncourt",
                                                            sex: "Female",
                                                            birthPlace: "Quebec, Capitale-Nationale, Quebec, Canada",
                                                            deathPlace: "Portneuf, Quebec, Canada",
                                                            birthDate: "18 October 1659",
                                                            deathDate: "3 March 1739",
                                                            parents: [
                                                                {
                                                                    name: "Marie Marguerite Riton",
                                                                    sex: "Female",
                                                                    birthPlace: "Le Bourg-sur-la-Roche, Lucon, Poitou, France",
                                                                    deathPlace: "Beauport, Quebec, Canada",
                                                                    birthDate: "~1623",
                                                                    deathDate: "13 November 1672"
                                                                },
                                                                {
                                                                    name: "Leonard Leblanc",
                                                                    sex: "Male",
                                                                    birthPlace: "St-Martin de Blanzac, Limoges, Marche, France",
                                                                    deathPlace: "Hotel-Dieu-du-Precieux-Sang-de-Quebec, Quebec, Capital-Nationale, Quebec, Canada",
                                                                    birthDate: "~1626",
                                                                    deathDate: "6 November 1691"
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            name: "Pierre Morel",
                                                            sex: "Male",
                                                            birthPlace: "St-Hillaire de Roicille, Poitiers, Poitou, Vienne, Poitou-Charentes, France",
                                                            deathPlace: "Beauport Quebec, Québec, Canada",
                                                            birthDate: "1646",
                                                            deathDate: "5 December 1699",
                                                        }
                                                    ]
                                                },
                                                {
                                                    name: "Mathurin Beland",
                                                    sex: "Male",
                                                    birthPlace: "Neuville, Québec, Canada",
                                                    deathPlace: "Neuville, Québec, Canada",
                                                    birthDate: "25 March 1678",
                                                    deathDate: "24 April 1759",
                                                    parents: [
                                                        {
                                                            name: "Geneviève Gaudin",
                                                            sex: "Female",
                                                            birthPlace: "Quebec, Capitale-Nationale Region, Quebec, Canada",
                                                            deathPlace: "Neuville, Capitale-Nationale Region, Quebec, Canada",
                                                            birthDate: "30 January 1649",
                                                            deathDate: "4 December 1726",
                                                            parents: [
                                                                {
                                                                    name: "Marthe Cognac",
                                                                    sex: "Female",
                                                                    birthPlace: "La Rochelle, Departement de la Charente-Maritime, Poitou-Charentes, France",
                                                                    deathPlace: "Neuville, Capitale-Nationale Region, Quebec, Canada",
                                                                    birthDate: "1606",
                                                                    deathDate: "29 May 1689"
                                                                },
                                                                {
                                                                    name: "Barthelemy Gaudin",
                                                                    sex: "Male",
                                                                    birthPlace: "La Rochelle, Departement de la Charente-Maritime, Poitou-Charentes, France",
                                                                    deathPlace: "Neuville, Capitale-Nationale Region, Quebec, Canada",
                                                                    birthDate: "9 October 1613",
                                                                    deathDate: "19 March 1697",
                                                                    parents: [] // https://www.ancestry.com/family-tree/person/tree/24629615/person/1675407125/facts
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            name: "Jean Baptiste Beland, Jr",
                                                            sex: "Male",
                                                            birthPlace: "Rouen, Seine-Maritime, Haute-Normandie, France",
                                                            deathPlace: "Neuville, Capitale-Nationale Region, Quebec, Canada",
                                                            birthDate: "17 October 1655",
                                                            deathDate: "8 March 1731",
                                                            parents: [] // Some semi famous descendants https://www.ancestry.com/family-tree/person/tree/24629615/person/1672129250/facts
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
                isaacMineauConfig
            ]
        },
        {
            name: "Louis R Arsenault",
            sex: "Male",
            birthPlace: "Louiseville, Maskinongé, Quebec, Canada",
            deathPlace: "St-Etienne-des-Gres, Quebec, Canada",
            birthDate: "15 February 1830",
            deathDate: "14 March 1868",
            story: louisArseneauStory,
            parents: [
                rosalieLambertConfig,
                antoineArseneauConfig
            ]
        }
    ]
}