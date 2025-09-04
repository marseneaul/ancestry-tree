import { marinBoucherStory } from "../../../../stories/marin-boucher";
import { nicolasPelletierStory } from "../../../../stories/nicolas-pelletier";

export const marieJolyConfig = {
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
                                            sex: "Male",
                                            birthPlace: "Beaucé, Ille-et-Vilaine, Bretagne, France",
                                            deathPlace: "Sillery, Quebec, Canada",
                                            birthDate: "1 January 1590",
                                            deathDate: "9 November 1674",
                                            imageUrl: "./images/nicolas-pelletier.jpg",
                                            story: nicolasPelletierStory,
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
                                    imageUrl: "./images/marin-boucher.jpg",
                                    story: marinBoucherStory
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
};