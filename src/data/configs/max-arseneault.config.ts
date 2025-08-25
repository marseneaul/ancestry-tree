import { charlesDeibelConfig } from "./charles-diebel/charles-deibel.config";
import { josephArseneaultConfig } from "./joseph-arseneault/joseph-arseneault.config";
import { lucilleArseneaultConfig } from "./lucille-arseneault/lucille-arseneault.config";
import { margaretDeibelConfig } from "./margaret-deibel/margaret-deibel.config";

// COMPLETE
export const maxArseneaultConfig = {
    name: "Max Arseneault",
    sex: "Male",
    birthPlace: "Torrance, California, United States",
    birthDate: "13 August 1997",
    deathDate: "N/A",
    parents: [
        {
            name: "Nancy Elizabeth Arseneault",
            sex: "Female",
            birthPlace: "Mount Pleasant, Michigan, United States",
            birthDate: "1 December 1956",
            deathDate: "N/A",
            imageUrl: "./images/nancy-arseneault.jpg",
            parents: [
                margaretDeibelConfig,
                charlesDeibelConfig
            ]
        },
        {
            name: "Michael Joseph Arseneault",
            sex: "Male",
            birthPlace: "Flint, Michigan, United States",
            birthDate: "16 May 1955",
            deathDate: "N/A",
            imageUrl: "./images/michael-arseneault.jpg",
            parents: [
                lucilleArseneaultConfig,
                josephArseneaultConfig
            ]
        },
    ]
}