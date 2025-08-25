import { abigailRayConfig } from "./abigail-ray.config";
import { benoniGriffinIIIConfig } from "./benoni-griffin-iii.config";
import { sethStJohnConfig } from "./seth-st-john.config";

// COMPLETE
export const leviSaintJohnConfig = {
    name: "Levi St. John",
    sex: "Male",
    birthPlace: "Hubbardton, Rutland, Vermont, United States",
    birthDate: "~1822",
    deathDate: "March 1892",
    parents: [
        {
            name: "Sophia Griffin",
            sex: "Female",
            birthPlace: "Rutland, Vermont, United States",
            birthDate: "30 September 1800",
            deathDate: "15 June 1836",
            parents: [
                abigailRayConfig,
                benoniGriffinIIIConfig
            ]
        },
        {
            name: "Samuel Wheeler St. John",
            sex: "Male",
            birthPlace: "Vermont, United States",
            birthDate: "13 December 1795",
            deathDate: "2 September 1849",
            parents: [
                {
                    name: "Rebecca Foster",
                    sex: "Female",
                    birthPlace: "Hubbardton, Rutland, Vermont, United States",
                    birthDate: "1776",
                    deathDate: "7 January 1851"
                },
                sethStJohnConfig
            ]
        }
    ]
}