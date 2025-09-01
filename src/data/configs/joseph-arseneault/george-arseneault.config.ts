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
                                                            parents: [] // leads to famous settler Nicolas Pelletier
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
                                                    parents: []
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