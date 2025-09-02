import { michelArsenaultIConfig } from "./michel-arsenault-i.config";

export const louisJosephArsenaultConfig = {
    name: "  Arsenault",
    sex: "Male",
    birthPlace: "Rivière du Loup, Louiseville, Maskinongé, Quebec, Canada",
    deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
    birthDate: "9 July 1745",
    deathDate: "5 January 1811",
    parents: [
        {
            name: "Marie Josephe Brisard St-Germain",
            sex: "Female",
            birthPlace: "Trois Rivieres, St Maurice, Quebec, Canada",
            deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
            birthDate: "~1724",
            deathDate: "17 March 1748",
            parents: [
                {
                    name: "Marie Anne Dejarlais",
                    sex: "Female",
                    birthPlace: "Trois Rivieres, St Maurice, Quebec, Canada",
                    deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
                    birthDate: "1685",
                    deathDate: "24 November 1771",
                    parents: [
                        {
                            name: "Marie Jeanne Trudel",
                            sex: "Female",
                            birthPlace: "Quebec, Capitale-Nationale Region, Quebec, Canada",
                            deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
                            birthDate: "22 July 1656",
                            deathDate: "30 November 1734",
                            parents: [
                                {
                                    name: "Marguerite Thomas",
                                    sex: "Female",
                                    birthPlace: "Stavelot, Province de Liège, Walloon Region, Liège, Belgium",
                                    deathPlace: "L'Ange-Gardien, Capitale-Nationale, Québec, Canada",
                                    birthDate: "1633",
                                    deathDate: "1 September 1695",
                                    parents: []
                                },
                                {
                                    name: "Jean-Pierre Trudel",
                                    sex: "Male",
                                    birthPlace: "Parfondeval, Mortagne, Perche, France",
                                    deathPlace: "L'Ange-Gardien, Capitale-Nationale, Québec, Canada",
                                    birthDate: "1629",
                                    deathDate: "25 November 1699",
                                    parents: [] // leads to an interesting hugenot line (or maybe the wife does)
                                }
                            ]
                        },
                        {
                            name: "Jean Jacques DesJarlais-dit-St-Amand",
                            sex: "Female",
                            birthPlace: "Liège, Belgium",
                            deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
                            birthDate: "1640",
                            deathDate: "19 December 1722",
                            parents: [] // poor quality
                        }
                    ]
                },
                {
                    name: "Jean Baptise Brisard St Germain",
                    sex: "Male",
                    birthPlace: "UNKNOWN",
                    deathPlace: "UNKNOWN",
                    birthDate: "5 October 1681",
                    deathDate: "25 September 1732",
                    parents: [] // low quality
                }
            ]
        },
        {
            name: "Pierre Paul Arsenault",
            sex: "Male",
            birthPlace: "Quebec, Canada",
            deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
            birthDate: "~1708",
            deathDate: "19 January 1785",
            parents: [
                {
                    name: "Marie Madeleine Leblanc Labrie",
                    sex: "Female",
                    birthPlace: "Trois-Rivières, Mauricie Region, Quebec, Canada",
                    deathPlace: "Champlain, Les Chenaux, Québec, Canada",
                    birthDate: "1672",
                    deathDate: "11 April 1707",
                    parents: [
                        {
                            name: "Madeleine Duteau",
                            sex: "Female",
                            birthPlace: "Saint-Nicolas de la Rochelle, (Aunis) Basse Normandie, France",
                            deathPlace: "Champlain, Les Chenaux, Québec, Canada",
                            birthDate: "5 July 1649",
                            deathDate: "7 January 1704"
                        },
                        {
                            name: "Nicolas Leblanc Dit Labrie",
                            sex: "Female",
                            birthPlace: "Chennevières-sur-Marne, Nogent-sur-Marne, Champagne-Ardenne, Ile-de-France",
                            deathPlace: "Cap-de-la-Madeleine, Les Chenaux, Québec, Canada",
                            birthDate: "1634",
                            deathDate: "7 January 1702"
                        }
                    ]
                },
                michelArsenaultIConfig
            ]
        }
    ]
}