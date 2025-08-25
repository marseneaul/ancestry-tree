import { margarethaZeiligerConfig } from "./margaretha-zeilinger.config";

// COMPLETE
export const maryZeilingerConfig = {
    name: "Mary Barbara Zeilinger",
    sex: "Female",
    birthPlace: "Tuscola, Tuscola Township, Tuscola, Michigan, United States",
    deathPlace: "Denmark Township, Tuscola County, Michigan",
    birthDate: "13 November 1874",
    deathDate: "30 June 1945",
    parents: [
        {
            name: "Eva Maria Ulrich",
            sex: "Female",
            birthPlace: "Blumfield Township, Saginaw County, Michigan, United States",
            deathPlace: "Tuscola, Tuscola Township, Tuscola, Michigan, United States",
            birthDate: "4 December 1847",
            deathDate: "15 October 1902",
            parents: [
                {
                    name: "Maria Ashbach",
                    sex: "Female",
                    birthPlace: "Thalheim, Wurtemberg, Germany",
                    deathPlace: "Traverse City, Grand Traverse, Michigan, United States",
                    birthDate: "11 August 1826",
                    deathDate: "30 July 1910"
                },
                {
                    name: "Jacob Ulrich",
                    sex: "Male",
                    birthPlace: "Württemberg, Germany",
                    deathPlace: "Blumfield Township, Saginaw County, Michigan, United States",
                    birthDate: "8 May 1824",
                    deathDate: "7 July 1884"
                }
            ]
        },
        {
            name: "Johann Georg Adam Zeilinger",
            sex: "Male",
            birthPlace: "Ebersdorf, Dietenhofen, Ansbach, Bavaria, Germany",
            deathPlace: "Tuscola, Tuscola Township, Tuscola, Michigan, United States",
            birthDate: "20 November 1842",
            deathDate: "18 May 1931",
            parents: [ // MAY BE A MIXUP AROUND HERE
                margarethaZeiligerConfig,
                {
                    name: "Henry Heinlein",
                    sex: "Male",
                    birthPlace: "Middle Franconia, Bavaria, Germany",
                    birthDate: "~1798",
                    deathDate: "<1870"
                }
            ]
        }
    ]
}