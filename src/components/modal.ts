// src/components/modal.ts
import { Person } from "../interfaces/person";
import { calculateAgeAtDate, getInitials, getOrdinalFromNumber } from "../utils/utils";
import { cleanUnknown } from "../utils/helpers";

let previouslyFocusedElement: HTMLElement | null = null;

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const selector = [
    'a[href]',
    'button:not([disabled])',
    'input:not([disabled])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',');

  return Array.from(container.querySelectorAll<HTMLElement>(selector))
    .filter(element => !element.hasAttribute('disabled') && element.offsetParent !== null);
}

function handleModalKeydown(event: KeyboardEvent): void {
  const modal = document.getElementById("detail-modal") as HTMLElement | null;
  if (!modal || modal.classList.contains("hidden")) return;

  if (event.key === "Escape") {
    closeModal();
    return;
  }

  if (event.key !== "Tab") return;

  const focusableElements = getFocusableElements(modal);
  if (focusableElements.length === 0) {
    event.preventDefault();
    modal.focus();
    return;
  }

  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];

  if (event.shiftKey && document.activeElement === firstElement) {
    event.preventDefault();
    lastElement.focus();
  } else if (!event.shiftKey && document.activeElement === lastElement) {
    event.preventDefault();
    firstElement.focus();
  }
}

/**
 * Create modal HTML structure dynamically
 */
export function createModal(): HTMLElement {
  const modal = document.createElement('div');
  modal.id = 'detail-modal';
  modal.className = 'hidden';
  modal.style.background = 'var(--overlay)';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-hidden', 'true');
  modal.setAttribute('aria-labelledby', 'modal-person-title');
  modal.tabIndex = -1;
  
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
  previouslyFocusedElement = document.activeElement instanceof HTMLElement ? document.activeElement : null;

  const initials = getInitials(d?.name);
  const isDeceased = d.deathDate !== "N/A";
  const age = isDeceased 
    ? calculateAgeAtDate(d.birthDate ?? "", d.deathDate ?? "") 
    : calculateAgeAtDate(d.birthDate ?? "");

  // Prefer a large image if available, fall back to avatar
  const imgSrc = (d as any)?.largeImageUrl || d.imageUrl || null;
  const safeInitials = escapeHtml(initials);
  const safeImageAlt = escapeHtml(d.name || "Person");
  const safeImageSrc = imgSrc ? escapeHtml(imgSrc) : null;

  // Image HTML (hidden on error and reveals placeholder)
  const imageHtml = safeImageSrc
    ? `<img
         class="modal-person-image"
         src="${safeImageSrc}"
         alt="${safeImageAlt}"
         style="width: min(80vw, 320px); height: min(80vw, 320px); max-width:320px; max-height:320px; object-fit:cover; border-radius:12px; box-shadow:0 6px 18px rgba(0,0,0,0.15);"
       />`
    : "";

  // Placeholder (shown when no image available or when image fails)
  const placeholderHtml = `
    <div class="modal-placeholder"
         style="width: min(80vw, 320px); height: min(80vw, 320px); max-width:320px; max-height:320px; border-radius:12px; background:#f2f2f2; display:${safeImageSrc ? "none" : "flex"}; align-items:center; justify-content:center; font-size:48px; color:#666;">
      ${safeInitials}
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
  const safeName = escapeHtml(cleanName || "Name not available");
  const safeRelation = escapeHtml(relation);
  const safeBirthDate = cleanBirthDate ? escapeHtml(cleanBirthDate) : "";
  const safeBirthPlace = cleanBirthPlace ? escapeHtml(cleanBirthPlace) : "";
  const safeDeathDate = cleanDeathDate ? escapeHtml(cleanDeathDate) : "";
  const safeDeathPlace = cleanDeathPlace ? escapeHtml(cleanDeathPlace) : "";
  const safeStory = cleanStory ? escapeHtml(cleanStory) : "";

  content.innerHTML = `
    <button class="modal-close-btn" aria-label="Close modal">×</button>
    <div style="display:flex; flex-direction:column; align-items:center; gap:16px; text-align:center; padding:8px;">
      ${imageHtml}
      ${placeholderHtml}
      <h2 id="modal-person-title" style="margin:0; font-size:20px; font-weight:700; color: var(--text-primary);">${safeName}</h2>
      ${safeRelation ? `<div style="color: var(--text-secondary);"><strong>Relation:</strong> ${safeRelation}</div>` : ""}
      ${safeBirthDate || safeBirthPlace ? `<div style="color: var(--text-secondary);">${safeBirthDate ? `<strong>Born:</strong> ${safeBirthDate}` : ""} ${safeBirthPlace ? `${safeBirthDate ? " " : ""}(${safeBirthPlace})` : ""}</div>` : ""}
      <div style="color: var(--text-secondary);"><strong>Died:</strong> ${safeDeathDate || "—"} ${age !== null && isDeceased ? `(age ${age})` : ""}</div>
      ${safeDeathPlace ? `<div style="color: var(--text-secondary);"><strong>Place:</strong> ${safeDeathPlace}</div>` : ""}
      ${age !== null && !isDeceased ? `<div style="color: var(--text-secondary);"><strong>Age:</strong> ${age}</div>` : ""}
      ${safeStory ? `<div style="margin-top:8px; color: var(--text-tertiary); font-style:italic; max-width:70vw">${safeStory}</div>` : ""}
    </div>
  `;

  content.querySelector('.modal-close-btn')?.addEventListener('click', closeModal);
  content.querySelector('.modal-person-image')?.addEventListener('error', (event) => {
    const image = event.currentTarget as HTMLImageElement;
    const placeholder = image.parentElement?.querySelector<HTMLElement>('.modal-placeholder');
    image.style.display = 'none';
    if (placeholder) {
      placeholder.style.display = 'flex';
    }
  });

  modal.classList.remove("hidden");
  modal.setAttribute('aria-hidden', 'false');
  document.addEventListener('keydown', handleModalKeydown);

  requestAnimationFrame(() => {
    const closeButton = content.querySelector<HTMLButtonElement>('.modal-close-btn');
    closeButton?.focus();
  });
}

/**
 * Close modal function
 */
export function closeModal(): void {
  const modal = document.getElementById("detail-modal");
  if (modal) {
    modal.classList.add("hidden");
    modal.setAttribute('aria-hidden', 'true');
    document.removeEventListener('keydown', handleModalKeydown);
    previouslyFocusedElement?.focus();
    previouslyFocusedElement = null;
  }
}
