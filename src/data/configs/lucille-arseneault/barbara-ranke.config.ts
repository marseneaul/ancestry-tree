import { barbaraRankeStory } from "../../stories/barbara-ranke";
import { christianRankeStory } from "../../stories/christian-ranke";
import { mariaZehnderStory } from "../../stories/maria-zehnder";
import { johannZehnderConfig } from "./johann-zehnder.config";

// COMPLETE
export const barbaraRankeConfig = {
    name: "Barbara Gertrud Caroline Ranke",
    sex: "Female",
    birthPlace: "Frankenmuth, Saginaw, Michigan, United States",
    deathPlace: "UNKNOWN",
    birthDate: "20 January 1864",
    deathDate: "1922",
    imageUrl: "./images/barbara-ranke.jpg",
    story: barbaraRankeStory,
    parents: [
        {
            name: "Maria Margaretha Zehnder",
            sex: "Female",
            birthPlace: "Weißenbronn, Ansbach, Bayern, Germany",
            deathPlace: "Frankenmuth, Saginaw, Michigan, United States",
            birthDate: "2 May 1841",
            deathDate: "8 December 1919",
            imageUrl: "./images/maria-zehnder.jpg",
            story: mariaZehnderStory,
            parents: [
                {
                    name: "Maria Margaretha Fuerwitt",
                    sex: "Female",
                    birthPlace: "Weissenbronn, Middle Franconia, Bavaria, Germany",
                    deathPlace: "Frankenmuth, Saginaw County, Michigan, United States",
                    birthDate: "30 March 1812",
                    deathDate: "7 September 1888",
                    parents: [
                        {   // UNCLEAR IF THIS ONE IS RIGHT
                            name: "Anna Barbara Wittmann",
                            sex: "Female",
                            birthPlace: "Germany",
                            birthDate: "UNKNOWN",
                            deathDate: "28 December 1763",
                            parents: [
                                {
                                    name: "Stephan Whittmann",
                                    sex: "Male",
                                    birthPlace: "Germany",
                                    birthDate: "1736",
                                    deathDate: "1797"
                                }
                            ]
                        },
                        {
                            name: "John Fuerwitt",
                            sex: "Male",
                            birthPlace: "Bayern, Germany",
                            birthDate: "~1780",
                            deathDate: "~1840"
                        }
                    ]
                },
                {
                    name: "Johann Stephan Zehnder", // "My great-great-great-great grandparents, Johann Stephan Zehnder and Margaretha Fuerwitt Zehnder came to Frankenmuth in 1846 as part of the second group of missionaries sent by the Pastor Wilhelm Loehe from Neuendettelsau
                    sex: "Male",
                    birthPlace: "Weißenbronn, Heilsbronn, Landkreis Ansbach, Bayern, Germany",
                    deathPlace: "Frankenmuth, Saginaw, Michigan, United States",
                    birthDate: "10 May 1810",
                    deathDate: "30 March 1875",
                    parents: [
                        {
                            name: "Maria Barbara Weber",
                            sex: "Female",
                            birthPlace: "Önsbach Achern Bad, Germany",
                            deathPlace: "Weißenbronn, Bayern, Germany",
                            birthDate: "1 June 1765",
                            deathDate: "15 May 1816",
                            parents: [
                                {
                                    name: "Anna Catharina Klausmann",
                                    sex: "Female",
                                    birthPlace: "Önsbach, Ortenaukreis, Baden-Wuerttemberg, Germany",
                                    deathPlace: "Önsbach, Ortenaukreis, Baden-Wuerttemberg, Germany",
                                    birthDate: "15 December 1736",
                                    deathDate: "12 December 1796",
                                    parents: [
                                        {
                                            name: "Barbara Schindler",
                                            sex: "Female",
                                            birthPlace: "Önsbach, Ortenaukreis, Baden-Wuerttemberg, Germany",
                                            deathPlace: "Önsbach, Ortenaukreis, Baden-Wuerttemberg, Germany",
                                            birthDate: "1708",
                                            deathDate: "4 January 1778",
                                            parents: [
                                                {
                                                    name: "Appolonia Wursthorn",
                                                    sex: "Female",
                                                    birthPlace: "Önsbach, Ortenaukreis, Baden-Wuerttemberg, Germany",
                                                    deathPlace: "Önsbach, Ortenaukreis, Baden-Wuerttemberg, Germany",
                                                    birthDate: "1660",
                                                    deathDate: "28 August 1741"
                                                },
                                                {
                                                    name: "Mathias Schindler",
                                                    sex: "Male",
                                                    birthPlace: "Erlach, Ansbach, Bayern, Germany",
                                                    deathPlace: "Erlach, Ansbach, Bayern, Germany",
                                                    birthDate: "13 February 1661",
                                                    deathDate: "1730",
                                                    parents: [
                                                        {
                                                            name: "Maria Anna Unbekannt",
                                                            sex: "Female",
                                                            birthPlace: "Renchen, Ortenaukreis, Baden-Wuerttemberg, Germany",
                                                            deathPlace: "UNKNOWN",
                                                            birthDate: "1624",
                                                            deathDate: "UNKNOWN"
                                                        },
                                                        {
                                                            name: "David Schindler",
                                                            sex: "Male",
                                                            birthPlace: "Renchen, Ortenaukreis, Baden-Wuerttemberg, Germany",
                                                            deathPlace: "Renchen, Ortenaukreis, Baden-Wuerttemberg, Germany",
                                                            birthDate: "1620",
                                                            deathDate: "2 May 1665",
                                                            parents: [
                                                                {
                                                                    name: "Adam E Schindler",
                                                                    sex: "Male",
                                                                    birthPlace: "Erlach, Ortenaukreis, Baden-Württemberg, Germany",
                                                                    deathPlace: "Unterwasser, Breisgau-Hochschwarzwald, Baden-Wuerttemberg, Germany",
                                                                    birthDate: "1594",
                                                                    deathDate: "10 September 1648"
                                                                }
                                                            ]
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        {
                                            name: "Konrad Klausmann",
                                            sex: "Male",
                                            birthPlace: "Önsbach, Ortenaukreis, Baden-Wuerttemberg, Germany",
                                            deathPlace: "Önsbach, Ortenaukreis, Baden-Wuerttemberg, Germany",
                                            birthDate: "1703",
                                            deathDate: "8 March 1783"
                                        }
                                    ]
                                },
                                {
                                    name: "Franciscus Josephus Weber",
                                    sex: "Male",
                                    birthPlace: "Önsbach, Ortenaukreis, Baden-Wuerttemberg, Germany",
                                    deathPlace: "Önsbach, Ortenaukreis, Baden-Wuerttemberg, Germany",
                                    birthDate: "7 March 1734",
                                    deathDate: "3 January 1797",
                                    parents: [
                                        {
                                            name: "Anna Maria Ernst",
                                            sex: "Female",
                                            birthPlace: "Önsbach, Ortenaukreis, Baden-Wuerttemberg, Germany",
                                            deathPlace: "Offenburg, Ortenaukreis, Baden-Wuerttemberg, Germany",
                                            birthDate: "~1703",
                                            deathDate: "2 February 1753"
                                        },
                                        {
                                            name: "Jakob Weber",
                                            sex: "Male",
                                            birthPlace: "Önsbach, Ortenaukreis, Baden-Wuerttemberg, Germany",
                                            deathPlace: "Önsbach, Ortenaukreis, Baden-Wuerttemberg, Germany",
                                            birthDate: "1703",
                                            deathDate: "5 October 1769",
                                            parents: [
                                                {
                                                    name: "Anna Catharina Ganter (Gunther)",
                                                    sex: "Female",
                                                    birthPlace: "Pforzheim, Baden-Württemberg, Germany",
                                                    deathPlace: "Önsbach, Ortenaukreis, Baden-Wuerttemberg, Germany",
                                                    birthDate: "20 December 1679",
                                                    deathDate: "27 October 1745",
                                                    parents: [
                                                        {
                                                            name: "Anna Catharina Reiniger (Reinniger)",
                                                            sex: "Female",
                                                            birthPlace: "Haltingen, Lörrach, Baden-Württemberg, Germany",
                                                            deathPlace: "Pforzheim, Baden-Württemberg, Germany",
                                                            birthDate: "8 January 1656",
                                                            deathDate: "18 March 1729",
                                                            parents: [
                                                                {
                                                                    name: "Johann (Hans) Reiniger (Reinniger)",
                                                                    sex: "Male",
                                                                    birthPlace: "Haltingen, Lörrach, Baden-Württemberg, Germany",
                                                                    deathPlace: "UNKNOWN",
                                                                    birthDate: "1627",
                                                                    deathDate: "UNKNOWN"
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            name: "Jacob (Sabina) Ganter (Gunther)",
                                                            sex: "Male",
                                                            birthPlace: "Pforzheim, Baden-Württemberg, Germany",
                                                            deathPlace: "UNKNOWN",
                                                            birthDate: "15 April 1653",
                                                            deathDate: "UNKNOWN"
                                                        }
                                                    ]
                                                },
                                                {
                                                    name: "Jakob (Der Jung) Weber",
                                                    sex: "Male",
                                                    birthPlace: "Zetzwil, Aargau, Switzerland",
                                                    deathPlace: "Lindau, Baden-Württemberg, Germany",
                                                    birthDate: "1677",
                                                    deathDate: "7 April 1737",
                                                    parents: [
                                                        {
                                                            name: "Anna Maria Bolliger",
                                                            sex: "Female",
                                                            birthPlace: "Baldenheim, Bas-Rhin, Alsace, France",
                                                            deathPlace: "Bas-Rhin, Alsace, France",
                                                            birthDate: "1 April 1633",
                                                            deathDate: "24 May 1688",
                                                            parents: [
                                                                {
                                                                    name: "Samuel Bollinger",
                                                                    birthPlace: "Rued, Aargau, Switzerland",
                                                                    deathPlace: "Switzerland",
                                                                    birthDate: "1603",
                                                                    deathDate: "7 July 1672"
                                                                }
                                                            ]
                                                        },
                                                        {
                                                            name: "Hans Caspar Weber",
                                                            sex: "Male",
                                                            birthPlace: "Switzerland",
                                                            deathPlace: "UNKNOWN",
                                                            birthDate: "1632",
                                                            deathDate: "January 1689",
                                                            parents: [
                                                                {
                                                                    name: "Anna Waelti",
                                                                    sex: "Female",
                                                                    birthPlace: "Duerrenaesch, Aargau, Switzerland",
                                                                    deathPlace: "Menziken, Aargau, Switzerland",
                                                                    birthDate: "1598",
                                                                    deathDate: "13 September 1645",
                                                                    parents: []
                                                                },
                                                                {
                                                                    name: "Rudolph Weber",
                                                                    sex: "Male",
                                                                    birthPlace: "Menziken, Aargau, Switzerland",
                                                                    deathPlace: "Aargau, Switzerland",
                                                                    birthDate: "31 October 1596",
                                                                    deathDate: "UNKNOWN",
                                                                    parents: [
                                                                        {
                                                                            name: "Sara Waker",
                                                                            sex: "Female",
                                                                            birthPlace: "Menziken, Aargau, Switzerland",
                                                                            deathPlace: "Aargau, Switzerland",
                                                                            birthDate: "1568",
                                                                            deathDate: "UNKNOWN"
                                                                        },
                                                                        {
                                                                            name: "Heinrich Weber",
                                                                            sex: "Male",
                                                                            birthPlace: "Menziken, Aargau, Switzerland",
                                                                            deathPlace: "Hausen, Zurich, Switzerland",
                                                                            birthDate: "1563",
                                                                            deathDate: "1622",
                                                                            parents: [
                                                                                {
                                                                                    name: "Elsi Raber",
                                                                                    sex: "Female",
                                                                                    birthPlace: "Diemtigen, Bern, Berne, Switzerland",
                                                                                    deathPlace: "UNKNOWN",
                                                                                    birthDate: "1539",
                                                                                    deathDate: "UNKNOWN"
                                                                                },
                                                                                {
                                                                                    name: "Johann (Hans) Weber (Waeber)",
                                                                                    sex: "Male",
                                                                                    birthPlace: "Mollis, Glarus, Switzerland",
                                                                                    deathPlace: "Hausen, Canton, Zurich, Switzerland",
                                                                                    birthDate: "1533",
                                                                                    deathDate: "1 March 1569",
                                                                                    parents: [
                                                                                        {
                                                                                            name: "Anna Maria Kohl (Pellikan Weber Klugel Straubin)",
                                                                                            sex: "Female",
                                                                                            birthPlace: "Mollis, Kanton Glarus, Glarus, Switzerland",
                                                                                            deathPlace: "Netstal, Glarus, Switzerland",
                                                                                            birthDate: "9 August 1505",
                                                                                            deathDate: "1540",
                                                                                            parents: []
                                                                                        },
                                                                                        {   // Photo??
                                                                                            name: "Frantz Anton Weber",
                                                                                            sex: "Male",
                                                                                            birthPlace: "Mollis, Kanton Glarus, Glarus, Switzerland",
                                                                                            deathPlace: "Nestral, Glarus, Switzerland",
                                                                                            birthDate: "1500",
                                                                                            deathDate: "1 January 1538",
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
                                                }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        },
                        johannZehnderConfig
                    ]
                }
            ]
        },
        {
            name: "Christian Friedrich Ranke",
            sex: "Male",
            birthPlace: "Saschen, Hasselwerder, Hannover, Kingdom of Prussia, Germany",
            deathPlace: "Frankenmuth, Saginaw, Michigan, United States",
            birthDate: "16 January 1836",
            deathDate: "29 September 1918",
            imageUrl: "./images/christian-ranke.jpg",
            story: christianRankeStory,
            parents: [
                {
                    name: "Dorothea Fuecksel",
                    sex: "Female",
                    birthPlace: "Colba, Sachsen-Weimar, Germany",
                    deathPlace: "Block House, Pennsylvania, United States",
                    birthDate: "25 July 1799",
                    deathDate: "22 September, 1856"
                },
                {
                    name: "Johann Michael Jakob Ranke",
                    sex: "Male",
                    birthPlace: "Oburg, Weimar, Thueringen, Germany",
                    deathPlace: "Frankenmuth, Saginaw, Michigan, United States",
                    birthDate: "23 February 1802",
                    deathDate: "17 May 1878",
                }
            ]
        }
    ]
}