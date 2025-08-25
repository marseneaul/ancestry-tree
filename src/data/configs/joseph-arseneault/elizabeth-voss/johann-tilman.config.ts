import { franzTilmanConfig } from "./franz-tilman.config";
import { johannHommesConfig } from "./johann-hommes.config";
import { susanneCochemConfig } from "./susanne-cochem.config";

// COMPLETE
export const johannTilmanConfig = {
    name: "Johann Peter Tilman",
    sex: "Male",
    birthPlace: "Ernst, Cochem, Rhineland, Prussia",
    birthDate: "1 October 1742",
    deathDate: "UNKNOWN",
    parents: [
        {
            name: "Anna Christina Hommes",
            sex: "Female",
            birthPlace: "Fankel, Cochem, Rhineland, Prussia",
            birthDate: "~1708",
            deathDate: "24 April 1784",
            parents: [
                {
                    name: "Annae Mariae Graas",
                    sex: "Female",
                    birthPlace: "Fankel, Cochem, Rhineland, Prussia",
                    birthDate: "~1687",
                    deathDate: "UNKNOWN"
                },
                johannHommesConfig
            ]
        },
        {
            name: "Peter Nikolaus Tilman",
            sex: "Male",
            birthPlace: "Ernst, Cochem, Rhineland, Prussia",
            birthDate: "1 March 1709",
            deathDate: "UNKNOWN",
            parents: [
                susanneCochemConfig,
                franzTilmanConfig
            ]
        }
    ]
}