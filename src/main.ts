// src/main.ts
import "./style.css";
import { setupGlobalModalFunctions } from "./components/modal";
import { initializeMainApplication } from "./main-initialization";

// Setup global modal functions
setupGlobalModalFunctions();

// Initialize the application when DOM is ready
document.addEventListener("DOMContentLoaded", () => {
  try {
    initializeMainApplication();
  } catch (error) {
    console.error("Failed to initialize application:", error);
  }
});