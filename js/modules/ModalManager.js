/**
 * Module quản lý modal hiển thị thông tin chi tiết từ vựng
 */
import { DOM } from "./DOM.js";
import { QuizManager } from "./QuizManager.js";

export class ModalManager {
  constructor(lessonManager) {
    this.lessonManager = lessonManager;
    this.init();
  }

  /**
   * Khởi tạo modal và gắn event
   */
  init() {
    this.createModalElement();
    this.bindEvents();
  }

  /**
   * Tạo modal nếu chưa có trong DOM
   */
  createModalElement() {
    if (!document.getElementById("wordDetailModal")) {
      const modal = document.createElement("div");
      modal.id = "wordDetailModal";
      modal.className = "modal";
      modal.innerHTML = `
        <div class="modal-content">
          <i class="fa-solid fa-xmark modal-close"></i>
          <div class="modal-body"></div>
        </div>
      `;
      document.body.appendChild(modal);
    }
    this.modal = document.getElementById("wordDetailModal");
    this.modalBody = this.modal.querySelector(".modal-body");
    this.closeBtn = this.modal.querySelector(".modal-close");
  }

  /**
   * Gắn event cho modal
   */
  bindEvents() {
    if (this.closeBtn) {
      this.closeBtn.addEventListener("click", () => this.hide());
    }
    // Đóng modal khi click ra ngoài
    this.modal.addEventListener("click", (e) => {
      // Đóng modal khi click vào overlay (bên ngoài modal-content)
      if (e.target === this.modal) this.hide();
    });
  }

  /**
   * Hiển thị modal với thông tin chi tiết từ vựng
   * @param {string} word - Từ cần hiển thị
   */
  showWordDetail(word) {
    if (!this.lessonManager) return;
    const words = this.lessonManager.words || [];
    const wordData = words.find((w) => w.word === word);
    if (!wordData) {
      this.modalBody.innerHTML = `<p>Không tìm thấy thông tin từ vựng.</p>`;
    } else {
      // Sử dụng getIntroHTML từ QuizManager để render nội dung
      const quizManager = new QuizManager();
      this.modalBody.innerHTML = quizManager.getIntroHTML(wordData);
      quizManager.bindAudioBtnEvent();
    }
    this.show();
  }

  /**
   * Hiện modal
   */
  show() {
    this.modal.style.visibility = "visible";
    this.modal.style.opacity = "1";
    document.body.classList.add("no-scroll");
  }

  /**
   * Ẩn modal
   */
  hide() {
    this.modal.style.visibility = "hidden";
    this.modal.style.opacity = "0";
    document.body.classList.remove("no-scroll");
  }
}
