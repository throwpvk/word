/**
 * Module quản lý Panel
 * Xử lý việc mở/đóng menu panel và settings panel
 */

import { DOM } from "./DOM.js";

export class PanelManager {
  constructor() {
    this.init();
  }

  /**
   * Khởi tạo panel manager
   */
  init() {
    this.bindEvents();
  }

  /**
   * Gắn các event listeners cho panel
   */
  bindEvents() {
    // Menu panel toggle
    DOM.menuBtn?.addEventListener("pointerup", () => {
      this.togglePanel(
        DOM.menuPanel,
        DOM.settingsPanel,
        DOM.menuBtn,
        "fa-bars"
      );
    });

    // Settings panel toggle
    DOM.settingsBtn?.addEventListener("pointerup", () => {
      this.togglePanel(
        DOM.settingsPanel,
        DOM.menuPanel,
        DOM.settingsBtn,
        "fa-gear"
      );
    });

    // Click outside để đóng panel
    DOM.vocabMain?.addEventListener("pointerup", () => this.hideAllPanels());
    DOM.headerBar?.addEventListener("pointerup", () => this.hideAllPanels());
  }

  /**
   * Toggle panel
   * @param {HTMLElement} showPanel - Panel cần hiển thị
   * @param {HTMLElement} hidePanel - Panel cần ẩn
   * @param {HTMLElement} btn - Button điều khiển
   * @param {string} defaultIcon - Icon mặc định
   */
  togglePanel(showPanel, hidePanel, btn, defaultIcon) {
    if (!showPanel || !btn) return;

    const isShown = showPanel.classList.toggle("show");

    // Cập nhật z-index
    if (showPanel) showPanel.style.zIndex = "9010";
    if (hidePanel) hidePanel.style.zIndex = "9009";

    // Cập nhật icon
    btn.innerHTML = isShown
      ? `<i class="fa-solid fa-xmark"></i>`
      : `<i class="fas ${defaultIcon}"></i>`;
  }

  /**
   * Ẩn tất cả panels
   */
  hideAllPanels() {
    if (DOM.menuPanel) DOM.menuPanel.classList.remove("show");
    if (DOM.settingsPanel) DOM.settingsPanel.classList.remove("show");

    if (DOM.menuBtn) {
      DOM.menuBtn.innerHTML = `<i class="fas fa-bars"></i>`;
    }
    if (DOM.settingsBtn) {
      DOM.settingsBtn.innerHTML = `<i class="fas fa-gear"></i>`;
    }
  }
}
