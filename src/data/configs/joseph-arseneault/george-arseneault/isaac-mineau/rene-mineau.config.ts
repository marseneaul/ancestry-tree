import { reneMineau1683Config } from "./rene-mineau-1683.config";

export const reneMineauConfig = {   
    // Leads to Pierre V De Rostrenen, who has a photo
    // https://www.ancestry.com/family-tree/person/tree/44204929/person/430055040707/facts who has a photo
    name: "Rene Mineau",
    sex: "Male",
    birthPlace: "Beaumont, Bellechasse, Quebec, Canada",
    deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
    birthDate: "1 April 1705",
    deathDate: "9 September 1767",
    parents: [
        {
            name: "Marie-Anne Moreau",
            sex: "Female",
            birthPlace: "Saint-Laurent, Ile D'Orléans, Québec, Canada",
            deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
            birthDate: "30 April 1682",
            deathDate: "1782",
            parents: []
        },
        {
            name: "Rene Mineau",
            sex: "Male",
            birthPlace: "St Laurent, Ile, Quebec, Canada",
            deathPlace: "Louiseville, Maskinongé, Quebec, Canada",
            birthDate: "10 October 1683",
            deathDate: "2 January 1750",
            parents: [
                {
                    name: "Marie-Anne Moreau",
                    sex: "Female",
                    birthPlace: "Saint-Laurent, Ile D'Orléans, Québec, Canada",
                    deathPlace: "Maskinongé, Quebec, Canada",
                    birthDate: "30 April 1682",
                    deathDate: "1782",
                    parents: [
                        {
                            name: "Anne Couture",
                            sex: "Female",
                            birthPlace: "Chartres, Ille-et-Vilaine, Bretagne, France",
                            deathPlace: "Saint-Laurent, Ile D'Orléans, Québec, Canada",
                            birthDate: "1641",
                            deathDate: "13 May 1715"
                        },
                        {   // French Canadian Descendents Volume 27
                            name: "Jean Moreau dit La Grange",
                            sex: "Male",
                            birthPlace: "Rennes, Ille-Et-Vilaine, Brittany, France",
                            deathPlace: "Montmorency, Quebec, Canada",
                            birthDate: "~1635",
                            deathDate: "13 March 1704"
                        }
                    ]
                },
                reneMineau1683Config
            ]
        }
    ] 
}