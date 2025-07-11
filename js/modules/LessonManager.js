/**
 * Module quản lý Lesson
 * Xử lý việc tải và hiển thị dữ liệu lesson
 */

import { DOM } from "./DOM.js";

export class LessonManager {
  constructor() {
    this.words = [];
    this.currentLesson = 1;
    this.wordsPerLesson = 50;
    this.init();
  }

  /**
   * Khởi tạo lesson manager
   */
  async init() {
    await this.loadWords();
    this.createLessonButtons();
    this.loadLessonData(1);
    this.bindEvents();
  }

  /**
   * Bind các event listeners
   */
  bindEvents() {}

  /**
   * Tải dữ liệu từ vựng từ file JSON
   */
  async loadWords() {
    try {
      const response = await fetch("./words/toeicWords.json");
      this.words = await response.json();
      // Truyền từ vựng sang QuizManager nếu có
      if (window.vocabApp && window.vocabApp.quizManager) {
        window.vocabApp.quizManager.setAllWords(this.words);
      }
    } catch (error) {
      console.error("❌ Lỗi khi tải dữ liệu từ vựng:", error);
    }
  }

  /**
   * Tạo các nút lesson
   */
  createLessonButtons() {
    if (!DOM.lessonGrid) return;

    const totalLessons = Math.ceil(this.words.length / this.wordsPerLesson);

    for (let i = 1; i <= totalLessons; i++) {
      const btn = document.createElement("button");
      const start = (i - 1) * this.wordsPerLesson;
      const end =
        start + Math.min(this.wordsPerLesson, this.words.length - start);
      btn.className = "lesson-circle-btn";
      btn.dataset.index = i;
      btn.innerText = `${start + 1} - ${end}`;

      btn.onclick = () => this.loadLessonData(i);
      DOM.lessonGrid.appendChild(btn);
    }
  }

  /**
   * Tải dữ liệu lesson theo index
   * @param {number} lessonIndex
   */
  async loadLessonData(lessonIndex) {
    this.currentLesson = lessonIndex;
    const start = (lessonIndex - 1) * this.wordsPerLesson;
    const end =
      start + Math.min(this.wordsPerLesson, this.words.length - start);
    const lessonWords = this.words.slice(start, end);

    // TODO: Tính toán tiến độ học
    const learnedCount = lessonWords.filter((word) => word.learned).length;
    // const percent =
    //   lessonWords.length > 0
    //     ? Math.round((learnedCount / lessonWords.length) * 100)
    //     : 0;

    const percent = 30;

    // Tạo HTML cho bảng từ vựng
    const tableRows = lessonWords
      .map(
        (word) =>
          `<tr><td>${word.id}</td><td>${word.word}</td><td>${word.meaning}</td><td><button class="word-info-btn" title="Xem chi tiết"><i class="fa-solid fa-ellipsis-vertical"></i></i></button></td></tr>`
      )
      .join("");

    // Render lesson content
    if (DOM.vocabMain) {
      DOM.vocabMain.innerHTML = `
        <div class="lesson-header">
          <div class="lesson-title"><span class="lesson-number">${
            start + 1
          } - ${end}</span></div>
          <div class="lesson-progress-bar">
            <div class="progress-label">Đã học: ${percent}%</div>
            <div class="lesson-progress" style="--lesson-progress: ${percent}%"></div>
          </div>
          <div class="lesson-actions">
            <button class="lesson-btn review-btn">Ôn tập</button>
            <button class="lesson-btn new-btn" data-start="${
              start + 1
            }" >Học mới</button>
            <button class="lesson-btn skip-btn">Bỏ qua</button>
          </div>
        </div>
        <table class="lesson-table">
          <thead>
            <tr>
              <th>No.</th>
              <th>Từ vựng</th>
              <th>Ý nghĩa</th>
              <th></th>
            </tr>
          </thead>
          <tbody>${tableRows}</tbody>
        </table>
      `;
    }

    // Ẩn panel sau khi load lesson
    this.hidePanel();

    // Truyền từ vựng sang QuizManager nếu có
    if (window.vocabApp && window.vocabApp.quizManager) {
      window.vocabApp.quizManager.setLessonWords(lessonWords);
      window.vocabApp.quizManager.bindQuizBtnEvent();
    }
  }

  /**
   * Ẩn tất cả panels
   */
  hidePanel() {
    if (DOM.menuPanel) DOM.menuPanel.classList.remove("show");
    if (DOM.settingsPanel) DOM.settingsPanel.classList.remove("show");

    if (DOM.menuBtn) {
      DOM.menuBtn.innerHTML = `<i class="fas fa-bars"></i>`;
    }
    if (DOM.settingsBtn) {
      DOM.settingsBtn.innerHTML = `<i class="fas fa-gear"></i>`;
    }

    // Bật tắt cuộn cho body, tránh cuộn kép khi mở panel
    const menuOpen = DOM.menuPanel?.classList.contains("show");
    const settingsOpen = DOM.settingsPanel?.classList.contains("show");

    if (menuOpen || settingsOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }

  /**
   * Lấy từ vựng của lesson hiện tại
   * @returns {Array} Danh sách từ vựng
   */
  getCurrentLessonWords() {
    const start = (this.currentLesson - 1) * this.wordsPerLesson;
    const end = start + this.wordsPerLesson;
    return this.words.slice(start, end);
  }

  /**
   * Cập nhật trạng thái học của từ
   * @param {string} word - Từ cần cập nhật
   * @param {boolean} learned - Trạng thái đã học
   */
  updateWordStatus(word, learned) {
    const wordIndex = this.words.findIndex((w) => w.word === word);
    if (wordIndex !== -1) {
      this.words[wordIndex].learned = learned;
      // Có thể lưu vào localStorage hoặc gửi lên server
      localStorage.setItem("vocab-progress", JSON.stringify(this.words));
    }
  }
}
