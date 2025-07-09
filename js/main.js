/**
 * Main Application Entry Point
 * Khởi tạo và quản lý toàn bộ ứng dụng học từ vựng
 */

import { DOM, validateDOM } from "./modules/DOM.js";
import { ThemeManager } from "./modules/ThemeManager.js";
import { PanelManager } from "./modules/PanelManager.js";
import { FooterManager } from "./modules/FooterManager.js";
import { LessonManager } from "./modules/LessonManager.js";
import { QuizManager } from "./modules/QuizManager.js";

/**
 * Class quản lý ứng dụng chính
 */
class VocabApp {
  constructor() {
    this.themeManager = null;
    this.panelManager = null;
    this.footerManager = null;
    this.lessonManager = null;
    this.quizManager = null;

    this.init();
  }

  /**
   * Khởi tạo ứng dụng
   */
  async init() {
    try {
      // Kiểm tra DOM elements
      validateDOM();

      // Khởi tạo các managers
      this.themeManager = new ThemeManager();
      this.panelManager = new PanelManager();
      this.footerManager = new FooterManager();
      this.lessonManager = new LessonManager();
      this.quizManager = new QuizManager();

      console.log("✅ Ứng dụng đã được khởi tạo thành công!");
    } catch (error) {
      console.error("❌ Lỗi khi khởi tạo ứng dụng:", error);
    }
  }

  /**
   * Lấy instance của lesson manager
   */
  getLessonManager() {
    return this.lessonManager;
  }

  /**
   * Lấy instance của quiz manager
   */
  getQuizManager() {
    return this.quizManager;
  }

  /**
   * Lấy instance của footer manager
   */
  getFooterManager() {
    return this.footerManager;
  }
}

// Khởi tạo ứng dụng khi DOM đã sẵn sàng
document.addEventListener("DOMContentLoaded", () => {
  window.vocabApp = new VocabApp();
});

// Export cho việc sử dụng từ bên ngoài
export { VocabApp };
