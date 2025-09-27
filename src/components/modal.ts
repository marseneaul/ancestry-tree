// src/components/modal.ts
import { Person } from "../interfaces/person";
import { calculateAgeAtDate, getInitials, getOrdinalFromNumber } from "../utils/utils";
import { cleanUnknown } from "../utils/helpers";

/**
 * Create modal HTML structure dynamically
 */
export function createModal(): HTMLElement {
  const modal = document.createElement('div');
  modal.id = 'detail-modal';
  modal.className = 'hidden';
  modal.style.background = 'var(--overlay)';
  
  const modalContent = document.createElement('div');
  modalContent.className = 'modal-content rounded-lg shadow-lg w-full p-6 relative';
  modalContent.style.background = 'var(--bg-secondary)';
  modalContent.style.border = '1px solid var(--border-secondary)';
  
  const modalInnerContent = document.createElement('div');
  modalInnerContent.id = 'modal-inner-content';
  
  modalContent.appendChild(modalInnerContent);
  modal.appendChild(modalContent);
  document.body.appendChild(modal);
  
  return modal;
}

/**
 * Enhanced modal with better design and close functionality
 */
export function showPersonModal(d: Person, depth: number): void {
  const modal = document.getElementById("detail-modal")!;
  const content = document.getElementById("modal-inner-content")!;
  if (!modal || !content) return;

  const initials = getInitials(d?.name);
  const isDeceased = d.deathDate !== "N/A";
  const age = isDeceased 
    ? calculateAgeAtDate(d.birthDate ?? "", d.deathDate ?? "") 
    : calculateAgeAtDate(d.birthDate ?? "");

  // Prefer a large image if available, fall back to avatar
  const imgSrc = (d as any)?.largeImageUrl || d.imageUrl || null;

  // Image HTML (hidden on error and reveals placeholder)
  const imageHtml = imgSrc
    ? `<img
         src="${imgSrc}"
         alt="${(d.name || "Person").replace(/"/g, "&quot;")}"
         style="width: min(80vw, 320px); height: min(80vw, 320px); max-width:320px; max-height:320px; object-fit:cover; border-radius:12px; box-shadow:0 6px 18px rgba(0,0,0,0.15);"
         onerror="this.style.display='none'; const p=this.parentElement.querySelector('.modal-placeholder'); if(p) p.style.display='flex';"
       />`
    : "";

  // Placeholder (shown when no image available or when image fails)
  const placeholderHtml = `
    <div class="modal-placeholder"
         style="width: min(80vw, 320px); height: min(80vw, 320px); max-width:320px; max-height:320px; border-radius:12px; background:#f2f2f2; display:${imgSrc ? "none" : "flex"}; align-items:center; justify-content:center; font-size:48px; color:#666;">
      ${initials}
    </div>`;

  let relation = "";
  if (depth === 0) {
    relation = "You";
  } else if (depth === 1) {
    relation = d.sex === "Female" ? "Mother" : "Father";
  } else if (depth === 2) {
    relation = d.sex === "Female" ? "Grandmother" : "Grandfather";
  } else {
    const ordinal = getOrdinalFromNumber(depth - 2);
    const greats = `${depth === 3 ? "" : ordinal + " "}Great-`;
    relation = `${greats}Grand${d.sex === "Female" ? "mother" : "father"}`;
  }
  if (depth !== 0) relation += ` (${depth} generation${depth > 1 ? "s" : ""} back)`;

  // Clean up data for display
  const cleanName = cleanUnknown(d.name);
  const cleanBirthDate = cleanUnknown(d.birthDate);
  const cleanBirthPlace = cleanUnknown(d.birthPlace);
  const cleanDeathDate = cleanUnknown(d.deathDate);
  const cleanDeathPlace = cleanUnknown(d.deathPlace);
  const cleanStory = cleanUnknown((d as Person).story);

  content.innerHTML = `
    <button class="modal-close-btn" onclick="closeModal()" aria-label="Close modal">×</button>
    <div style="display:flex; flex-direction:column; align-items:center; gap:16px; text-align:center; padding:8px;">
      ${imageHtml}
      ${placeholderHtml}
      <h2 style="margin:0; font-size:20px; font-weight:700; color: var(--text-primary);">${cleanName || "Name not available"}</h2>
      ${relation ? `<div style="color: var(--text-secondary);"><strong>Relation:</strong> ${relation}</div>` : ""}
      ${cleanBirthDate || cleanBirthPlace ? `<div style="color: var(--text-secondary);">${cleanBirthDate ? `<strong>Born:</strong> ${cleanBirthDate}` : ""} ${cleanBirthPlace ? `${cleanBirthDate ? " " : ""}(${cleanBirthPlace})` : ""}</div>` : ""}
      <div style="color: var(--text-secondary);"><strong>Died:</strong> ${cleanDeathDate || "—"} ${age !== null && isDeceased ? `(age ${age})` : ""}</div>
      ${age !== null && !isDeceased ? `<div style="color: var(--text-secondary);"><strong>Age:</strong> ${age}</div>` : ""}
      ${cleanStory ? `<div style="margin-top:8px; color: var(--text-tertiary); font-style:italic; max-width:70vw">${cleanStory}</div>` : ""}
    </div>
  `;

  modal.classList.remove("hidden");
}

/**
 * Close modal function
 */
export function closeModal(): void {
  const modal = document.getElementById("detail-modal");
  if (modal) {
    modal.classList.add("hidden");
  }
}

/**
 * Make modal functions globally available for onclick handlers
 */
export function setupGlobalModalFunctions(): void {
  (window as any).closeModal = closeModal;
  (window as any).showPersonModal = showPersonModal;
}
