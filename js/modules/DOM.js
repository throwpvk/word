/**
 * Module quản lý DOM Elements
 * Chứa tất cả các tham chiếu đến DOM elements được sử dụng trong ứng dụng
 */

// ===================== DOM ELEMENTS =====================
export const DOM = {
  // Header elements
  headerBar: document.querySelector(".header-bar"),
  h1: document.querySelector("h1"),
  progressBar: document.querySelector(".progress-bar"),

  // Panel elements
  menuBtn: document.querySelector(".menu-btn"),
  settingsBtn: document.querySelector(".settings-btn"),
  menuPanel: document.querySelector(".menu-panel"),
  settingsPanel: document.querySelector(".settings-panel"),

  // Main content
  vocabMain: document.querySelector(".vocab-main"),
  vocabLabel: document.querySelector(".vocab-label"),
  vocabExample: document.querySelector(".example"),

  // Footer elements
  footerBar: document.querySelector(".footer-bar"),
  footerStatus: document.querySelector(".footer-status"),

  // Theme elements
  themeToggle: document.getElementById("themeSelectToggle"),
  themeDropdown: document.getElementById("themeDropdown"),
  iconToggle: document.getElementById("themeSelectToggle")?.querySelector("i"),

  // Lesson grid
  lessonGrid: document.getElementById("lessonGrid"),

  // Overlay
  lessonOverlay: document.getElementById("lessonOverlay"),
  quizQuitBtn: document.querySelector(".quit-quiz-btn"),
};

// Kiểm tra và log warning nếu có element không tồn tại
export function validateDOM() {
  const missingElements = [];

  Object.entries(DOM).forEach(([key, element]) => {
    if (!element && key !== "iconToggle") {
      missingElements.push(key);
    }
  });

  if (missingElements.length > 0) {
    console.warn("⚠️ Các DOM elements sau không tồn tại:", missingElements);
  }
}
