export const marieDejarlaisConfig = {
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
};