import "./style.css";
import { maxArseneaultConfig } from "./data/configs/max-arseneault.config";
import { Person } from "./interfaces/person";

function buildTree(person: Person): HTMLElement {
  const li = document.createElement("li");

  // Display person details
  const details = document.createElement("div");
  details.innerHTML = `
    <strong>${person.name}</strong><br>
    Born: ${person.birthDate || "Unknown"} in ${person.birthPlace || "Unknown"}<br>
    Died: ${person.deathDate !== "N/A" ? person.deathDate : "N/A"}
  `;
  li.appendChild(details);

  // Recurse for parents (if any)
  if (person.parents && person.parents.length > 0) {
    const ul = document.createElement("ul");
    person.parents.forEach(parent => {
      ul.appendChild(buildTree(parent));
    });
    li.appendChild(ul);
  }

  return li;
}

document.addEventListener("DOMContentLoaded", () => {
  const app = document.querySelector("#app");
  if (app) {
    const treeContainer = document.createElement("div");
    treeContainer.className = "family-tree";

    const rootUl = document.createElement("ul");
    rootUl.appendChild(buildTree(maxArseneaultConfig));  // Start from root person
    treeContainer.appendChild(rootUl);

    app.appendChild(treeContainer);
  }
});