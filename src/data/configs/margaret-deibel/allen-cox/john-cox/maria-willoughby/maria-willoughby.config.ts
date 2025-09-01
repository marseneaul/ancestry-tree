import { maryBlackwellConfig } from "./mary-blackwell.config";

export const mariaWilloughbyConfig = {
    name: "Maria Willoughby",
    sex: "Female",
    birthPlace: "Kiddington, Oxfordshire, England, United Kingdom",
    deathPlace: "Cote, Oxfordshire, England",
    birthDate: "9 October 1774",
    deathDate: "25 February 1817",
    parents: [
        {
            name: "Ann Heyward Willouby",
            sex: "Female",
            birthPlace: "Deddington, Oxfordshire, England, United Kingdom",
            deathPlace: "Kiddington, Oxfordshire, England, United Kingdom",
            birthDate: "28 August 1737",
            deathDate: "30 May 1796",
            parents: [
                {
                    name: "Sarah Bissill",
                    sex: "Female",
                    birthPlace: "Deddington, Oxfordshire, England, United Kingdom",
                    deathPlace: "Deddington, Oxfordshire, England, United Kingdom",
                    birthDate: "<20 February 1711",
                    deathDate: "<26 April 1744"
                },
                {
                    name: "William Haywood",
                    sex: "Male",
                    birthPlace: "Deddington, Oxfordshire, England, United Kingdom",
                    deathPlace: "UNKNOWN",
                    birthDate: "1716",
                    deathDate: "UNKNOWN"
                }
            ]
        },
        {
            name: "John Willouby", // May have gone to Barbados
            sex: "Male",
            birthPlace: "Kiddington, Oxfordshire, England, United Kingdom",
            deathPlace: "Kiddington, Oxfordshire, England, United Kingdom",
            birthDate: "~1730",
            deathDate: "<18 October 1786",
            parents: [
                maryBlackwellConfig,
                {
                    name: "Joseph Willoughby",
                    sex: "Male",
                    birthPlace: "Shrivenham, Berkshire, England, United Kingdom",
                    deathPlace: "UNKNOWN",
                    birthDate: "1695",
                    deathDate: "UNKNOWN",
                    parents: [
                        {
                            name: "Grace Barnes",
                            sex: "Female",
                            birthPlace: "Berkshire, England, United Kingdom",
                            deathPlace: "UNKNOWN",
                            birthDate: "~1660",
                            deathDate: "UNKNOWN"
                        },
                        {
                            name: "William Willoby",
                            sex: "Male",
                            birthPlace: "Shrivenham, Berkshire, England, United Kingdom",
                            deathPlace: "Shrivenham, Berkshire, England, United Kingdom",
                            birthDate: "17 November 1655",
                            deathDate: "1731",
                            parents: [
                                {
                                    name: "Jane Sparrowe",
                                    sex: "Female",
                                    birthPlace: "United Kingdom",
                                    deathPlace: "UNKNOWN",
                                    birthDate: "UNKNOWN",
                                    deathDate: "UNKNOWN"
                                },
                                {
                                    name: "William Willobee or Twilly",
                                    sex: "Male",
                                    birthPlace: "Shrivenham, Berkshire, England, United Kingdom",
                                    deathPlace: "Shrivenham, Berkshire, England, United Kingdom",
                                    birthDate: "1618",
                                    deathDate: "April 1687",
                                    parents: [
                                        {
                                            name: "Jane Williams",
                                            sex: "Female",
                                            birthPlace: "United Kingdom",
                                            deathPlace: "UNKNOWN",
                                            birthDate: "UNKNOWN",
                                            deathDate: "UNKNOWN"
                                        },
                                        {
                                            name: "John Willoughby",
                                            sex: "Male",
                                            birthPlace: "Shrivenham, Berkshire, England, United Kingdom",
                                            deathPlace: "UNKNOWN",
                                            birthDate: "~1580",
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
};