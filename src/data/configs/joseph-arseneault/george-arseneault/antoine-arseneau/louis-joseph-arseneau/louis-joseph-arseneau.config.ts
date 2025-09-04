import { marieDejarlaisConfig } from "./marie-dejarlais.config";
import { michelArsenaultIConfig } from "./michel-arsenault-i.config";

export const louisJosephArsenaultConfig = {
    name: "Louis Joseph Arsenault",
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
                marieDejarlaisConfig,
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
        {   // ?? The founders of Tignish were Joseph DesRoches, Joseph Richard, Jacques Chiasson, Pierre Arsenault, Pierre Poirier, Basile Poirier, Germain DesRoches and Grégoire Bernard
            // On Jan 7, 1737, the Ursuline nuns of Trois-Rivieres ceded a grant of land to their miller, Pierre Arsenaux.  This land was held in litigation.  In this time it was believed that "a colonist who was able to at least sign his own name had climed a run of a social ladder in the parish hierarchy."  Pierre had signed his name on several documents, se we can assume that he was one of the ones who climbed a rung of a social ladder.  (Source:  Descendants of Francois Arseneau by Estelle Arseneault McGlynn)
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