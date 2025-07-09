/**
 * Module quản lý Footer
 * Xử lý việc hiển thị/ẩn footer và các thông báo
 */

import { DOM } from "./DOM.js";

export class FooterManager {
  constructor() {
    this.init();
  }

  /**
   * Khởi tạo footer manager
   */
  init() {
    this.bindEvents();
  }

  /**
   * Gắn các event listeners cho footer
   */
  bindEvents() {
    // Next button
    document
      .querySelector(".footer-next")
      ?.addEventListener("pointerup", () => {
        this.hideFooter();
      });

    // Test events (có thể xóa sau)
    DOM.h1?.addEventListener("pointerup", () => {
      const status = this.testCount % 3;
      if (status === 0) {
        this.showFooter("correct", "Chính xác. Tuyệt vời!");
      } else if (status === 1) {
        this.showFooter("wrong", "Sai mất rồi. Cố gắng chút nữa!");
      } else {
        this.showFooter("", "");
      }
      this.testCount++;
    });

    // Test elements (có thể xóa sau)
    DOM.vocabLabel?.addEventListener("pointerup", () => {
      this.showFooter("correct", "Chính xác. Tuyệt vời!");
    });

    DOM.progressBar?.addEventListener("pointerup", () => {
      this.showFooter("wrong", "Sai mất rồi. Cố gắng chút nữa!");
    });

    DOM.vocabExample?.addEventListener("pointerup", () => {
      this.showFooter("", "");
    });
  }

  /**
   * Hiển thị footer với thông báo
   * @param {string} type - Loại thông báo (correct/wrong/empty)
   * @param {string} text - Nội dung thông báo
   */
  showFooter(type, text) {
    if (!DOM.footerBar || !DOM.footerStatus) return;

    DOM.footerBar.className = `footer-bar show ${type}`;

    const iconMap = {
      correct: `<i class="fa-solid fa-circle-check" style="margin-right:10px"></i>`,
      wrong: `<i class="fa-solid fa-circle-xmark" style="margin-right:10px"></i>`,
    };

    DOM.footerStatus.innerHTML = (iconMap[type] || "") + text;

    // Cập nhật padding cho main content
    setTimeout(() => {
      if (DOM.vocabMain && DOM.footerBar) {
        DOM.vocabMain.style.paddingBottom = `${DOM.footerBar.offsetHeight}px`;
      }
    }, 300);
  }

  /**
   * Ẩn footer
   */
  hideFooter() {
    if (!DOM.footerBar || !DOM.footerStatus) return;

    DOM.footerBar.className = "footer-bar";
    DOM.footerStatus.innerHTML = "";

    if (DOM.vocabMain) {
      DOM.vocabMain.style.paddingBottom = "0";
    }
  }

  // Biến test (có thể xóa sau)
  testCount = 0;
}
