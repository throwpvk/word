/**
 * Module quản lý Theme
 * Xử lý việc chuyển đổi giữa các theme (sáng/tối)
 */

import { DOM } from "./DOM.js";

export class ThemeManager {
  constructor() {
    this.themes = {
      dark: {
        "--color-bg": "#292929",
        "--color-bg-panel": "#1e201e",
        "--color-text": "#ecdfcc",
        icon: "fa-moon",
      },
      light: {
        "--color-bg": "#fff8e5",
        "--color-bg-panel": "#fdf3d7",
        "--color-text": "#403d39",
        icon: "fa-sun",
      },
    };

    this.init();
  }

  /**
   * Khởi tạo theme manager
   */
  init() {
    this.bindEvents();
    this.loadSavedTheme();
  }

  /**
   * Gắn các event listeners cho theme
   */
  bindEvents() {
    // Toggle dropdown
    DOM.themeToggle?.addEventListener("pointerup", () => this.toggleDropdown());

    // Click outside để đóng dropdown
    document.addEventListener("pointerup", (e) => {
      if (
        !DOM.themeToggle?.contains(e.target) &&
        !DOM.themeDropdown?.contains(e.target)
      ) {
        this.hideDropdown();
      }
    });

    // Chọn theme
    DOM.themeDropdown?.querySelectorAll("div").forEach((option) => {
      option.addEventListener("pointerup", () => {
        this.applyTheme(option.dataset.theme);
      });
    });
  }

  /**
   * Toggle dropdown theme
   */
  toggleDropdown() {
    if (!DOM.themeDropdown) return;

    DOM.themeDropdown.style.display =
      DOM.themeDropdown.style.display === "flex" ? "none" : "flex";
  }

  /**
   * Ẩn dropdown theme
   */
  hideDropdown() {
    if (DOM.themeDropdown) {
      DOM.themeDropdown.style.display = "none";
    }
  }

  /**
   * Áp dụng theme
   * @param {string} theme - Tên theme (light/dark)
   */
  applyTheme(theme) {
    const selectedTheme = this.themes[theme];
    if (!selectedTheme) return;

    // Áp dụng CSS variables
    Object.entries(selectedTheme).forEach(([key, value]) => {
      if (key.startsWith("--")) {
        document.documentElement.style.setProperty(key, value);
      }
    });

    // Cập nhật icon
    if (DOM.iconToggle) {
      DOM.iconToggle.className = `fa-solid ${selectedTheme.icon}`;
    }

    // Lưu theme vào localStorage
    localStorage.setItem("app-theme", theme);

    // Ẩn dropdown
    this.hideDropdown();
  }

  /**
   * Load theme đã lưu từ localStorage
   */
  loadSavedTheme() {
    const savedTheme = localStorage.getItem("app-theme") || "light";
    this.applyTheme(savedTheme);
  }
}
