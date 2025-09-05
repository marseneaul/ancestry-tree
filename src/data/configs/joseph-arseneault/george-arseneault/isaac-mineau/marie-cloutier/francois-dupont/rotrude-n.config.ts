import { charlesMartelConfig } from "./charles-martel.config";
import { chrotrudisDeTrevesConfig } from "./chrotrudis-de-treves.config";
import { pepinOfHerstalConfig } from "./pepin-of-herstal.config";

export const rotrudeNConfig = {
    name: "Rotrude N.",
    sex: "Female",
    birthPlace: "Aachen, Rheinland-Pfalz, Germany",
    deathPlace: "Maine, Charente, Poitou-Charentes, France",
    birthDate: "UNKNOWN",
    deathDate: "UNKNOWN",
    parents: [
        {
            // Carloman was instrumental in convening the Concilium Germanicum in 742, the first major synod of the Catholic Church to be held in the eastern regions of the Frankish kingdom.
            // majordomo. Carloman governed Austrasia, Alemannia, Thuringia and northern Alsace.
            name: "Carloman of the Franks",
            sex: "Male",
            birthPlace: "Aachen, Rheinland-Pfalz, Germany",
            deathPlace: "Vienne, Poitou-Charentes, France",
            birthDate: "705-716",
            deathDate: "17 August 754",
            parents: [
                chrotrudisDeTrevesConfig,
                charlesMartelConfig
            ]
        }
    ]
};