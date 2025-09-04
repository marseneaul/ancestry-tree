import { francoisDuboisStory } from "../../../stories/francois-dubois";
import { thomasTherrienConfig } from "./thomas-therrien.config";

export const marieDuboisConfig = {
    name: "Marie Leonie Dubois",
    sex: "Female",
    birthPlace: "Nicolet, Canada East, British North America",
    deathPlace: "Flint, Genesee County, Michigan, United States",
    birthDate: "31 March 1861",
    deathDate: "27 November 1934",
    imageUrl: "./images/marie-leonie-dubois.jpg",
    parents: [
        {
            name: "Sophie Marie Therrien dit Landry",
            sex: "Female",
            birthPlace: "Baie-du-Febvre, Nicolet-Yamaska, Quebec, Canada",
            deathPlace: "Gentilly, Nicolet, Quebec",
            birthDate: "23 February 1838",
            deathDate: "9 October 1915",
            imageUrl: "./images/sophie-landry.jpg",
            parents: [ // QUESTIONABLE LINEAGE
                {
                    name: "Sophie Desilets",
                    sex: "Female",
                    birthPlace: "Nicolet, Nicolet-Yamaska, Quebec, Canada",
                    deathPlace: "Nicolet, Nicolet-Yamaska, Quebec, Canada",
                    birthDate: "3 January 1808",
                    deathDate: "6 March 1865",
                    parents: [
                        {
                            name: "Marie Anne Benoit",
                            sex: "Female",
                            birthPlace: "Baie-du-Febvre, Yamaska, Quebec, Canada",
                            deathPlace: "St-Gregoire, Nicolet, Quebec, Canada",
                            birthDate: "14 January 1786",
                            deathDate: "16 April 1846"
                        },
                        {
                            name: "Antoine Desilets",
                            sex: "Male",
                            birthPlace: "Becancour, Nicolet, Quebec, Canada",
                            deathPlace: "St. Gregoire, Quebec, Canada",
                            birthDate: "29 June 1776",
                            deathDate: "18 December 1856"
                        }
                    ]
                },
                thomasTherrienConfig
            ]
        },
        {
            name: "Francois Dubois",
            sex: "Male",
            birthPlace: "Gentilly, Nicolet, Quebec, Canada",
            deathPlace: "Gentilly, Nicolet, Quebec, Canada",
            birthDate: "23 April 1831",
            deathDate: "16 March 1905",
            imageUrl: "./images/francois-dubois.jpg",
            story: francoisDuboisStory,
            parents: [ // QUESTIONABLE LINEAGE
                {
                    name: "Sophie Beaufort-Brunelle",
                    sex: "Female",
                    birthPlace: "UNKNOWN",
                    deathPlace: "Manchester, Hillsborough, New Hampshire, United States",
                    birthDate: "2 April 1796",
                    deathDate: "3 August 1832",
                    parents: [
                        {
                            name: "Marguerite Rivard",
                            sex: "Female",
                            birthPlace: "Champlain, Quebec, Canada",
                            deathPlace: "Richelieu, Quebec, Canada",
                            birthDate: "21 June 1761",
                            deathDate: "14 February 1827"
                        },
                        {
                            name: "Joseph Antoine Beaufort Brunel",
                            sex: "Male",
                            birthPlace: "Bécancour, Quebec, Canada",
                            deathPlace: "Gentilly, Quebec, Canada",
                            birthDate: "15 January 1763",
                            deathDate: "4 June 1830"
                        }
                    ]
                },
                {
                    name: "Francois Dubois dit LaFrance",
                    sex: "Male",
                    birthPlace: "Gentilly, Nicolet County, Quebec, Canada",
                    deathPlace: "Gentilly, Nicolet County, Quebec, Canada",
                    birthDate: "3 September 1799",
                    deathDate: "8 July 1877",
                    parents: [
                        {
                            name: "Marie Gaudet (Godet)",
                            sex: "Female",
                            birthPlace: "Becancour, Nicolet County, Quebec, Canada",
                            deathPlace: "Gentilly, Nicolet County, Quebec, Canada",
                            birthDate: "20 October 1778",
                            deathDate: "22 April 1852",
                            parents: [
                                {
                                    name: "Marie-Francoise Poisson dit Gentilly",
                                    sex: "Female",
                                    birthPlace: "Canada",
                                    deathPlace: "Becancour, Nicolet County, Quebec, Canada",
                                    birthDate: "21 July 1756",
                                    deathDate: "12 April 1794"
                                },
                                {
                                    name: "Francois Gaudet dit Mar(a)in",
                                    sex: "Male",
                                    birthPlace: "Beaubassin, Acadia, Canada",
                                    deathPlace: "Nicolet County, Quebec, Canada",
                                    birthDate: "11 January 1743",
                                    deathDate: "2 May 1810"
                                }
                            ]
                        },
                        {
                            name: "Charles Dubois dit LaFrance",
                            sex: "Male",
                            birthPlace: "St-Antoine-de-Tilly, Lotbiniere County, Quebec, Canada",
                            deathPlace: "Gentilly, Nicolet County, Quebec, Canada",
                            birthDate: "25 December 1762",
                            deathDate: "6 March 1827",
                            parents: [
                                {
                                    name: "Marie Elisabeth Rondeau",
                                    sex: "Female",
                                    birthPlace: "St-Antoine-de-Tilly, Lotbiniere County, Quebec, Canada",
                                    deathPlace: "St-Antoine-de-Tilly, Lotbiniere County, Quebec, Canada",
                                    birthDate: "11 November 1736",
                                    deathDate: "17 April 1771"
                                },
                                {
                                    name: "Charles Dubois dit LaFrance",
                                    sex: "Male",
                                    birthPlace: "St-Antoine-de-Tilly, Lotbiniere County, Quebec, Canada",
                                    deathPlace: "St-Antoine-de-Tilly, Lotbiniere County, Quebec, Canada",
                                    birthDate: "2 February 1717",
                                    deathDate: "9 June 1776",
                                    parents: [
                                        {
                                            name: "Marie-Angelique Bisson",
                                            sex: "Female",
                                            birthPlace: "Quebec, Canada",
                                            deathPlace: "St-Antoine-de-Tilly, Lotbiniere County, Quebec, Canada",
                                            birthDate: "2 November 1689",
                                            deathDate: "5 June 1732",
                                            parents: [
                                                {
                                                    name: "Ursule Trud",
                                                    sex: "Female",
                                                    birthPlace: "UNKNOWN",
                                                    deathPlace: "UNKNOWN",
                                                    birthDate: "UNKNOWN",
                                                    deathDate: "UNKNOWN"
                                                },
                                                {
                                                    name: "Antoine Bisson",
                                                    sex: "Male",
                                                    birthPlace: "UNKNOWN",
                                                    deathPlace: "UNKNOWN",
                                                    birthDate: "UNKNOWN",
                                                    deathDate: "UNKNOWN"
                                                }
                                            ]
                                        },
                                        {
                                            name: "Jean Baptiste Dubois LaFrance",
                                            sex: "Male",
                                            birthPlace: "Lauzon (St Joseph de la Pointe Levy), Quebec, Canada",
                                            deathPlace: "Lotbinière, Quebec, Canada",
                                            birthDate: "10 January 1680",
                                            deathDate: "21 January 1728",
                                            parents: [
                                                {
                                                    name: "Aunne Guillaume",
                                                    sex: "Female",
                                                    birthPlace: "City of Paris, Île-de-France, France",
                                                    deathPlace: "Saint-Nicolas, Chaudiere-Appalaches Region, Quebec, Canada",
                                                    birthDate: "~1651",
                                                    deathDate: "29 January 1716"
                                                },
                                                {
                                                    name: "François Dubois dit LaFrance",
                                                    sex: "Male",
                                                    birthPlace: "Saint-Pôtan, Dinan, Cotes d'Armor, Bretagne, France",
                                                    deathPlace: "St Nicolas, Levis, Quebec, Canada",
                                                    birthDate: "23 February 1650",
                                                    deathDate: "9 July 1712",
                                                    parents: [
                                                        {
                                                            name: "Marie Claude Fayenne",
                                                            sex: "Female",
                                                            birthPlace: "St Poyan, St Brieuc, Bretagne, France",
                                                            deathPlace: "Saint-Pôtan, Dinan, Cotes d'Armor, Bretagne, France",
                                                            birthDate: "4 Mary 1632",
                                                            deathDate: "29 January 1715",
                                                            parents: [
                                                                {
                                                                    name: "Elizabeth Francoise Dubois",
                                                                    sex: "Female",
                                                                    birthPlace: "France",
                                                                    deathPlace: "France",
                                                                    birthDate: "1605",
                                                                    deathDate: "8 January 1640"
                                                                },
                                                                {
                                                                    name: "Fayenne Ancetre",
                                                                    sex: "Male",
                                                                    birthPlace: "Brieux, Orne, Basse-Normandie, France",
                                                                    deathPlace: "France",
                                                                    birthDate: "1605",
                                                                    deathDate: ">1632"
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            name: "François Dubois dit LaFrance",
                                                            sex: "Male",
                                                            birthPlace: "Poitiers, Vienne, Poitou-Charentes, France",
                                                            deathPlace: "Sainte-Famille, L'Île-d'Orléans, Québec, Canada",
                                                            birthDate: "9 December 1616",
                                                            deathDate: "12 October 1674"
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
};