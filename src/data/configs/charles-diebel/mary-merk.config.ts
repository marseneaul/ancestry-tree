import { maryMerkStory } from "../../stories/mary-merk";
import { valentineMerkStory } from "../../stories/valentine-merk";

// COMPLETE
export const maryMerkConfig = {
    name: "Mary Victoria Merk",
    sex: "Female",
    birthPlace: "Columbus, Franklin, Ohio, United States",
    deathPlace: "Columbus, Franklin, Ohio, United States",
    birthDate: "8 August 1867",
    deathDate: "5 March 1946",
    imageUrl: "./images/mary-victoria-merk.jpg",
    story: maryMerkStory,
    parents: [
        {
            name: "Barbara Pfeiffer",
            sex: "Female",
            birthPlace: "Bayern, Germany",
            deathPlace: "Columbus, Franklin, Ohio, United States",
            birthDate: "17 November 1827",
            deathDate: "18 September 1896",
            parents: [
                {
                    name: "Josepha Betz",
                    sex: "Female",
                    birthPlace: "Germany",
                    birthDate: "UNKNOWN",
                    deathDate: "UNKNOWN"
                },
                {
                    name: "Andreas Pfeifer",
                    sex: "Male",
                    birthPlace: "Germany",
                    birthDate: "UNKNOWN",
                    deathDate: "UNKNOWN"
                }
            ]
        },
        {
            name: "Valentine Merk",
            sex: "Male",
            birthPlace: "Bavaria, Germany",
            deathPlace: "Columbus, Franklin, Ohio, United States",
            birthDate: "19 December 1827",
            deathDate: "1 December 1880",
            story: valentineMerkStory,
            parents: [
                {
                    name: "John Merk",
                    sex: "Male",
                    birthPlace: "Germany",
                    birthDate: "UNKNOWN",
                    deathDate: "UNKNOWN"
                }
            ]
        }
    ]
}