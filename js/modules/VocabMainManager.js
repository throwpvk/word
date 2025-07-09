/**
 * Module quản lý các event và logic cho vùng vocab-main
 */
import { DOM } from "./DOM.js";

export class VocabMainManager {
  constructor(modalManager) {
    this.modalManager = modalManager;
    this.init();
  }

  /**
   * Khởi tạo module và gắn event
   */
  init() {
    this.bindEvents();
  }

  /**
   * Gắn các event listener cho vocab-main
   */
  bindEvents() {
    if (!DOM.vocabMain) return;

    DOM.vocabMain.addEventListener("click", (e) => {
      // Xử lý click vào nút phát âm
      if (e.target.classList.contains("audio-btn")) {
        this.handleAudioClick(e.target);
      }
      // Xử lý click vào các nút lesson
      if (e.target.classList.contains("lesson-btn")) {
        this.handleLessonBtn(e.target);
      }
      // Xử lý click vào nút info
      if (e.target.closest(".word-info-btn")) {
        const tr = e.target.closest("tr");
        if (tr) this.handleWordRowClick(tr);
        return;
      }
      // Xử lý click vào <tr> của bảng từ vựng (nếu muốn giữ lại logic này)
      // let tr = e.target.closest('tr');
      // if (tr && tr.parentElement.tagName === 'TBODY') {
      //   this.handleWordRowClick(tr);
      // }
    });
  }

  /**
   * Xử lý khi nhấn nút phát âm
   */
  handleAudioClick(btn) {
    const audioSrc = btn.getAttribute("data-src");
    if (audioSrc) {
      const audio = new Audio(audioSrc);
      audio.play();
    }
  }

  /**
   * Xử lý khi nhấn các nút lesson
   */
  handleLessonBtn(btn) {
    if (btn.classList.contains("review-btn")) {
      // Xử lý ôn tập
    } else if (btn.classList.contains("new-btn")) {
      // Xử lý học mới
    } else if (btn.classList.contains("skip-btn")) {
      // Xử lý bỏ qua
    }
  }

  /**
   * Xử lý khi nhấn vào <tr> của bảng từ vựng
   */
  handleWordRowClick(tr) {
    const word = tr.children[0]?.innerText;
    if (word && this.modalManager) {
      this.modalManager.showWordDetail(word);
    }
  }
}
