import { antoineArseneauConfig } from "./antoine-arseneau.config";
import { rosalieLambertConfig } from "./rosalie-lambert.config";

export const georgeArseneaultConfig = {
    name: "George Louis Arseneault", // Mill operative
    sex: "Male",
    birthPlace: "St-Etienne-Des-Gras, St-Maurice, PQ, Canada",
    deathPlace: "Flint, Genesee, Michigan",
    birthDate: "31 May 1863",
    deathDate: "4 March 1931",
    imageUrl: "./images/george-louis-arseneault.jpg",
    parents: [
        {   
            name: "Marie Laurence Mineau",
            sex: "Female",
            birthPlace: "Louiseville, Maskinongé, Quebec, Canada",
            deathPlace: "St-Mathieu, St-Maurice County, Quebec, Canada",
            birthDate: "20 December 1832",
            deathDate: "6 August 1912",
            parents: [ //https://en.wikipedia.org/wiki/Marin_Boucher
                {
                    name: "Emelie Beland",
                    sex: "Female",
                    birthPlace: "Louiseville, Maskinongé, Quebec, Canada",
                    deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
                    birthDate: "19 October 1805",
                    deathDate: "18 November 1875"
                },
                {
                    name: "Isaac Mineau",
                    sex: "Male",
                    birthPlace: "Louiseville, Maskinongé, Quebec, Canada",
                    deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
                    birthDate: "19 May 1807",
                    deathDate: "16 December 1881",
                    parents: [
                        {
                            name: "Angelique Desmarais",
                            sex: "Female",
                            birthPlace: "St Ours, Richelieu, Quebec, Canada",
                            deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
                            birthDate: "30 October 1784",
                            deathDate: "6 June 1862"
                        },
                        {
                            name: "Pierre Mineau",
                            sex: "Male",
                            birthPlace: "Louiseville, Maskinongé, Quebec, Canada",
                            deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
                            birthDate: "1 April 1780",
                            deathDate: "20 November 1856",
                            parents: [
                                {
                                    name: "Marie Marguerite Joly",
                                    sex: "Female",
                                    birthPlace: "Berthier, Montmagny, Quebec, Canada",
                                    deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
                                    birthDate: "20 September 1753",
                                    deathDate: "7 May 1840",
                                    parents: [
                                        {
                                            name: "Marie Amable Charbonneau",
                                            sex: "Female",
                                            birthPlace: "Varennes, Verchères, Québec, Canada",
                                            deathPlace: "L'Assomption, Quebec, Canada",
                                            birthDate: "19 April 1730",
                                            deathDate: "17 July 1800"
                                        },
                                        {
                                            name: "Antoine Joly",
                                            sex: "Male",
                                            birthPlace: "I'Ile-Dupas, Quebec, Canada",
                                            deathPlace: "Berthier, Montmagny, Quebec, Canada",
                                            birthDate: "9 January 1722",
                                            deathDate: "23 June 1763",
                                            parents: [
                                                {
                                                    name: "Marie Anne Boucher",
                                                    sex: "Female",
                                                    birthPlace: "Berthier, Montmagny, Quebec, Canada",
                                                    deathPlace: "Berthier, Montmagny, Quebec, Canada",
                                                    birthDate: "1 July 1704",
                                                    deathDate: "11 January 1784",
                                                    parents: [
                                                        {
                                                            name: "Marguerite Agnes Pelletier",
                                                            sex: "Female",
                                                            birthPlace: "Sillery, Quebec, Canada",
                                                            deathPlace: "Quebec, Quebec, Canada",
                                                            birthDate: "30 August 1666",
                                                            deathDate: "1708",
                                                            parents: [
                                                                {
                                                                    name: "Marguerite Madeleine Morisseau",
                                                                    sex: "Female",
                                                                    birthPlace: "Amiens, Somme, Picardie, France",
                                                                    deathPlace: "Hotel, Quebec, Canada",
                                                                    birthDate: "1637",
                                                                    deathDate: "15 December 1707"
                                                                },
                                                                {
                                                                    name: "Francois Pelletier",
                                                                    sex: "Male",
                                                                    birthPlace: "Québec, Quebec, Canada",
                                                                    deathPlace: "Quebec, Quebec, Canada",
                                                                    birthDate: "1636",
                                                                    deathDate: "14 May 1690",
                                                                    parents: [
                                                                        {
                                                                            name: "Jeanne DeVousy",
                                                                            sex: "Female",
                                                                            birthPlace: "Beaucé, Ille-et-Vilaine, Bretagne, France",
                                                                            deathPlace: "Richelieu, Quebec, Canada",
                                                                            birthDate: "27 April 1612",
                                                                            deathDate: "12 December 1689",
                                                                            parents: [
                                                                                {
                                                                                    name: "Jeanne Gardony",
                                                                                    sex: "Female",
                                                                                    birthPlace: "Gallardon, Eure-et-Loir, Centre, France",
                                                                                    deathPlace: "Beaucé, Ille-et-Vilaine, Bretagne, France",
                                                                                    birthDate: "~1590",
                                                                                    deathDate: "~1641"
                                                                                },
                                                                                {
                                                                                    name: "Barthelemy Jean De Vouzy",
                                                                                    sex: "Male",
                                                                                    birthPlace: "Gallardon, Eure-et-Loir, Centre, France",
                                                                                    deathPlace: "Ille, Pyrenees-Orientales, Languedoc-Roussillon, France",
                                                                                    birthDate: "~1585",
                                                                                    deathDate: "~1652"
                                                                                }
                                                                            ]
                                                                        },
                                                                        {   // https://www.tfcg.ca/nicolas-pelletier-and-jeanne-devoisy Pioneer of New France
                                                                            name: "Nicolas Pelletier",
                                                                            sex: "Female",
                                                                            birthPlace: "Beaucé, Ille-et-Vilaine, Bretagne, France",
                                                                            deathPlace: "Sillery, Quebec, Canada",
                                                                            birthDate: "1 January 1590",
                                                                            deathDate: "9 November 1674",
                                                                            parents: [
                                                                                {
                                                                                    name: "Simonne Pichereau",
                                                                                    sex: "Female",
                                                                                    birthPlace: "France",
                                                                                    deathPlace: "UNKNOWN",
                                                                                    birthDate: "UNKNOWN",
                                                                                    deathDate: "UNKNOWN"
                                                                                },
                                                                                {
                                                                                    name: "François Pelletier",
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
                                                            name: "Charles Boucher",
                                                            sex: "Male",
                                                            birthPlace: "Sillery, Quebec, Canada",
                                                            deathPlace: "Berthierville, Berthier, Quebec, Canada",
                                                            birthDate: "4 April 1658",
                                                            deathDate: "10 August 1728",
                                                            parents: [
                                                                {
                                                                    name: "Julienne Baril",
                                                                    sex: "Female",
                                                                    birthPlace: "France",
                                                                    deathPlace: "UNKNOWN",
                                                                    birthDate: "UNKNOWN",
                                                                    deathDate: "UNKNOWN"
                                                                },
                                                                {
                                                                    name: "Marin Boucher",
                                                                    sex: "Male",
                                                                    birthPlace: "Mortagne, Perche, France",
                                                                    deathPlace: "Chateau Richer, Quebec, Canada",
                                                                    birthDate: "15 April 1589",
                                                                    deathDate: "25 March 1671",
                                                                    imageUrl: "./images/marin-boucher.jpg"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                },
                                                {
                                                    name: "Antoine Joly",
                                                    sex: "Male",
                                                    birthPlace: "Berthier, St Cuthbert, Quebec, Canada",
                                                    deathPlace: "Berthierville, Quebec, Canada",
                                                    birthDate: "1691",
                                                    deathDate: "1752",
                                                    parents: [
                                                        {
                                                            name: "Genevieve Tessier",
                                                            sex: "Female",
                                                            birthPlace: "Champagne, Dordogne, Aquitaine, France",
                                                            deathPlace: "L'Île-Dupas, Quebec, Canada",
                                                            birthDate: "1653",
                                                            deathDate: "12 November 1721",
                                                        },
                                                        {
                                                            name: "Pierre Joly Laforest dit Delbec",
                                                            sex: "Male",
                                                            birthPlace: "Brugge, West-Vlaanderen, Belgium",
                                                            deathPlace: "L'Île-Dupas, Quebec, Canada",
                                                            birthDate: "1651",
                                                            deathDate: "12 November 1721",
                                                            parents: [
                                                                {
                                                                    name: "Jeanne Feziere Fezier",
                                                                    sex: "Female",
                                                                    birthPlace: "Brugge, West-Vlaanderen, Belgium",
                                                                    deathPlace: "Brugge, West-Vlaanderen, Belgium",
                                                                    birthDate: "1621",
                                                                    deathDate: "4 July 1673",
                                                                    parents: [
                                                                        {
                                                                            name: "Anne Boucher",
                                                                            sex: "Female",
                                                                            birthPlace: "l'aube, France",
                                                                            deathPlace: "l'aube, France",
                                                                            birthDate: "~1600",
                                                                            deathDate: "UNKNOWN"
                                                                        },
                                                                        {
                                                                            name: "Nicholas Tessier",
                                                                            sex: "Male",
                                                                            birthPlace: "Troyes, Aube, Champagne-Ardenne, France",
                                                                            deathPlace: "Troyes, Aube, Champagne-Ardenne, France",
                                                                            birthDate: "~1600",
                                                                            deathDate: "~1690"
                                                                        },
                                                                    ]
                                                                },
                                                                {
                                                                    name: "Armand Delbec Joly",
                                                                    sex: "Male",
                                                                    birthPlace: "Brugge, West-Vlaanderen, Belgium",
                                                                    deathPlace: "Brugge, West-Vlaanderen, Belgium",
                                                                    birthDate: "1631",
                                                                    deathDate: "4 July 1673",
                                                                    parents: [
                                                                        {
                                                                            name: "Maria",
                                                                            sex: "Female",
                                                                            birthPlace: "Belgium",
                                                                            deathPlace: "UNKNOWN",
                                                                            birthDate: "~1610",
                                                                            deathDate: "UNKNOWN"
                                                                        },
                                                                        {
                                                                            name: "Antonius Delbec",
                                                                            sex: "Male",
                                                                            birthPlace: "Warneton, Hainaut, Belgium",
                                                                            deathPlace: "Comines, Nord, Nord-Pas-de-Calais, France",
                                                                            birthDate: "~1600",
                                                                            deathDate: "~1644"
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
                                    name: "Claude Mineau",
                                    sex: "Male",
                                    birthPlace: "Louiseville, Maskinongé, Quebec, Canada",
                                    deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
                                    birthDate: "3 March 1744",
                                    deathDate: "13 August 1817",
                                    parents: [ // keep going for archembault!
                                        {
                                            name: "Marie Josephte Morneau",
                                            sex: "Female",
                                            birthPlace: "Quebec, Canada",
                                            deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
                                            birthDate: "22 September 1709",
                                            deathDate: "4 January 1774",
                                            parents: []
                                        },
                                        {
                                            name: "Rene Mineau",
                                            sex: "Male",
                                            birthPlace: "Beaumont, Bellechasse, Quebec, Canada",
                                            deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
                                            birthDate: "1 April 1705",
                                            deathDate: "9 September 1767",
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
            name: "Louis Arsenault",
            sex: "Male",
            birthPlace: "Louiseville, Maskinongé, Quebec, Canada",
            deathPlace: "St-Etienne-des-Gres, Quebec, Canada",
            birthDate: "15 February 1830",
            deathDate: "14 March 1868",
            parents: [
                rosalieLambertConfig,
                antoineArseneauConfig
            ]
        }
    ]
}