/**
 * Module quản lý Quiz
 * Xử lý các loại câu hỏi khác nhau (multiple choice, audio, spelling)
 */

import { DOM } from "./DOM.js";

export class QuizManager {
  constructor() {
    this.words = [];
    this.currentLessonWords = [];
    this.isEnableAudioQuiz = true;
    this.isEnableSpellQuiz = true;
    this.currentQuizIndex = 0;
    this.wordsPerSesssion = 5;
    this.audioInstance = null;
    this.currentNewLearnStartId = 0;
    this.currentNewLearnPhase = 1;
    this.init();
  }

  /**
   * Khởi tạo các loại quiz
   */
  QUIZ_TYPES = {
    INTRO: 1,
    ENTOVI: 2,
    VITOEN: 3,
    AUDIO: 4,
    SPELL: 5,
  };

  /**
   * Các giai đoạn học
   * 1: Học mới từ đầu
   * 2: Luyện tập lần 2
   */
  LEARN_PHASE = {
    LEARN: 1,
    PRACTICE: 2,
  };

  /**
   * Khởi tạo quiz manager
   */
  init() {
    this.bindEvents();
  }

  /**
   * Bind các event listeners
   */
  bindEvents() {
    // Nút tiếp
    document
      .querySelector(".footer-next")
      ?.addEventListener("pointerup", () => {
        // this.nextQuiz();
        DOM.vocabMain.innerHTML = this.getQuizHTMLByType(
          1,
          2,
          Math.floor(Math.random() * 5) + 1
        );
        this.bindQuizBtnEvent();
      });
  }

  /**
   * Xử lý sự kiện nhấn nút Audio
   */
  audioBtnHandler = (e) => {
    const src = e.currentTarget.dataset.src;
    this.playAudio(src);
  };

  /**
   * Xử lý sự kiện nhấn nút trong bài quiz spell
   */
  spellBtnHandler = (e) => {
    const vocabMain = e.currentTarget.closest(".vocab-main");
    const answer = vocabMain.querySelector(".answer-text");
    const char = e.currentTarget.dataset.char;
    answer.textContent += char === "⎵" ? " " : char;
  };

  /**
   * Xử lý sự kiện nhấn nút del trong bài quiz spell
   */
  delBtnHandler = (e) => {
    const vocabMain = e.currentTarget.closest(".vocab-main");
    const answer = vocabMain.querySelector(".answer-text");
    if (!answer) return;
    let text = answer.textContent || "";
    if (text.length === 0) return;
    // Xóa 1 ký tự cuối
    text = text.slice(0, -1);
    // Cập nhật lại nội dung
    answer.textContent = text;
  };

  /**
   * Xử lý sự kiện nhấn nút gợi ý trong bài quiz spell
   */
  hintBtnHandler = (e) => {
    const vocabMain = e.currentTarget.closest(".vocab-main");
    const answer = vocabMain.querySelector(".answer-text");
    const text = answer.textContent || "";
    let word = (answer.dataset.word || "").toUpperCase();

    // Xóa hết nội dung cũ
    answer.textContent = "";

    if (word.startsWith(text)) {
      word = word.replace(text, "");
      // Gán lại text đã nhập (nếu đúng)
      answer.textContent += text;
    }

    // Thêm chữ cái đầu của phần còn lại nếu còn
    if (word.length > 0) {
      answer.textContent += word[0];
    }
  };

  /**
   * Xử lý sự kiện nhấn nút Học mới
   */
  newLearnHandler = (e) => {
    if (this.currentNewLearnStartId < e.currentTarget.dataset.start) {
      this.currentNewLearnStartId = e.currentTarget.dataset.start;
    }

    const start = Number(this.currentNewLearnStartId);

    if (this.currentNewLearnPhase === this.LEARN_PHASE.LEARN) {
      const wordIds = [start, start + 1, start + 2, start + 3, start + 4];
      const quizzes = this.getQuizOrder(wordIds, this.LEARN_PHASE.LEARN);
      console.log(quizzes);
      // TODO
    }
  };
  /**
   * Xử lý sự kiện nhấn nút Kiểm tra trong bài quiz spell
   */
  spellCheckBtnHandler = (e) => {
    const vocabMain = e.currentTarget.closest(".vocab-main");
    const answer = vocabMain.querySelector(".answer-text");
    const word = answer.dataset.word;
    let isCorrect = false;
    if (word.toLowerCase() === answer.textContent.toLowerCase()) {
      isCorrect = true;
      window.vocabApp.footerManager.showFooter("correct");
    } else {
      window.vocabApp.footerManager.showFooter("wrong");
    }
    // TODO
  };

  /**
   * Xử lý sự kiện nhấn chọn kết quả trong bài quiz spell
   */
  choiceCheckHandler = (e) => {
    const vocaMain = e.currentTarget.closest(".vocab-main");
    const choices = vocaMain.querySelectorAll(".choice");
    const result = e.currentTarget.dataset.result;
    const isCorrect = result === "correct";

    e.currentTarget.classList.add(`${isCorrect ? "correct" : "wrong"}`);
    choices.forEach((choice) => {
      if (choice.dataset.result === "correct") {
        choice.classList.add("correct");
      }
      choice.removeEventListener("pointerup", this.choiceCheckHandler);
      choice.classList.add("chosen");
    });

    // TODO
    window.vocabApp.footerManager.showFooter(result);
  };

  /**
   * Khởi tạo DOM event cho nút Audio, gọi sau khi add nút Audio vào DOM
   */
  bindQuizBtnEvent() {
    document.querySelectorAll(".audio-btn").forEach((btn) => {
      btn.removeEventListener("pointerup", this.audioBtnHandler); // remove handle cũ
      btn.addEventListener("pointerup", this.audioBtnHandler);
    });

    document.querySelectorAll(".spellcheck-char").forEach((btn) => {
      btn.removeEventListener("pointerup", this.spellBtnHandler);
      btn.addEventListener("pointerup", this.spellBtnHandler);
    });

    document.querySelectorAll(".spellcheck-check-btn").forEach((btn) => {
      btn.removeEventListener("pointerup", this.spellCheckBtnHandler);
      btn.addEventListener("pointerup", this.spellCheckBtnHandler);
    });

    document.querySelectorAll(".input-del-btn").forEach((btn) => {
      btn.removeEventListener("pointerup", this.delBtnHandler);
      btn.addEventListener("pointerup", this.delBtnHandler);
    });

    document.querySelectorAll(".spellcheck-hint-btn").forEach((btn) => {
      btn.removeEventListener("pointerup", this.hintBtnHandler);
      btn.addEventListener("pointerup", this.hintBtnHandler);
    });

    document.querySelectorAll(".choice").forEach((btn) => {
      btn.removeEventListener("pointerup", this.choiceCheckHandler);
      btn.addEventListener("pointerup", this.choiceCheckHandler);
    });

    document.querySelectorAll(".new-btn").forEach((btn) => {
      btn.removeEventListener("pointerup", this.newLearnHandler);
      btn.addEventListener("pointerup", this.newLearnHandler);
    });
  }

  /**
   * Kiểm tra xem thư viện compromise đã được load chưa
   * @returns {boolean} True nếu compromise đã sẵn sàng
   */
  isCompromiseReady() {
    // Thử nhiều cách khác nhau để truy cập compromise
    return (
      typeof window.nlp === "function" ||
      typeof nlp === "function" ||
      typeof window.compromise === "function" ||
      typeof compromise === "function"
    );
  }

  /**
   * Fallback: Highlight từ đơn giản không dùng compromise
   * @param {string} sentence - Câu ví dụ
   * @param {string} baseWord - Từ gốc cần highlight
   * @returns {string} Câu đã được highlight
   */
  simpleHighlight(sentence, baseWord) {
    const lowerBase = baseWord.toLowerCase();
    const regex = new RegExp(`\\b${baseWord}\\b`, "gi");
    return sentence.replace(regex, `<span class="highlighted-word">$&</span>`);
  }

  /**
   * Highlight từ trong câu nếu là biến thể (động từ dạng chia, danh từ số nhiều, ...)
   * @param {string} sentence - Câu ví dụ
   * @param {string} baseWord - Từ gốc cần highlight (dạng nguyên thể)
   * @returns {string} Câu đã được bọc <span> highlight
   */
  highlightWordInSentence(sentence, baseWord) {
    const lowerBase = baseWord.toLowerCase();

    return sentence
      .split(/\b/)
      .map((token) => {
        const tokenLower = token.toLowerCase().replace(/[^a-z]/g, "");

        // Kiểm tra nếu token rỗng hoặc chỉ chứa ký tự đặc biệt
        if (!tokenLower) {
          return token;
        }

        // Chỉ sử dụng compromise nếu thư viện đã được load
        if (this.isCompromiseReady()) {
          try {
            const nlpFunction =
              window.nlp || nlp || window.compromise || compromise;

            // Lấy nguyên thể động từ
            const verbBase = nlpFunction(token)
              .verbs()
              .toInfinitive()
              .out("text")
              .toLowerCase();

            // Lấy dạng số ít danh từ
            const nounBase = nlpFunction(token)
              .nouns()
              .toSingular()
              .out("text")
              .toLowerCase();

            if (
              tokenLower === lowerBase ||
              tokenLower.includes(lowerBase) ||
              verbBase === lowerBase ||
              nounBase === lowerBase
            ) {
              return `<span class="highlighted-word">${token}</span>`;
            }
          } catch (error) {
            console.warn("Lỗi khi xử lý với compromise:", error);
          }
        }

        // Fallback: chỉ so sánh trực tiếp nếu compromise không khả dụng
        if (tokenLower === lowerBase) {
          return `<span class="highlighted-word">${token}</span>`;
        }

        return token;
      })
      .join("");
  }

  /**
   * Highlight từ với fallback nếu compromise không khả dụng
   * @param {string} sentence - Câu ví dụ
   * @param {string} baseWord - Từ gốc cần highlight
   * @returns {string} Câu đã được highlight
   */
  highlightWordInSentenceWithFallback(sentence, baseWord) {
    if (this.isCompromiseReady()) {
      return this.highlightWordInSentence(sentence, baseWord);
    } else {
      console.warn("Compromise không khả dụng, sử dụng fallback");
      return this.simpleHighlight(sentence, baseWord);
    }
  }

  /**
   * Phát audio từ đầu, nếu đang phát thì bỏ qua
   * @param {string} src - đường dẫn audio
   */
  playAudio(src) {
    if (!src) return;

    // Nếu đang phát rồi thì không phát lại
    if (this.audioInstance && !this.audioInstance.paused) {
      return;
    }

    // Nếu chưa có hoặc src khác → tạo mới
    if (!this.audioInstance || this.audioInstance.src !== src) {
      this.audioInstance = new Audio(src);
    } else {
      this.audioInstance.currentTime = 0;
    }

    this.audioInstance
      .play()
      .then(() => {
        console.log("✅ Audio phát thành công!");
      })
      .catch((e) => {
        console.log("❌ Không thể phát audio:", e);
      });
  }

  /**
   * Tạo card dạng intro
   * @param {Object} wordData - Dữ liệu từ vựng
   */
  getIntroHTML(wordData, quizId = 1) {
    let examplesHtml = `<label class="vocab-label">Ví dụ</label>`;
    const exampleLength = wordData.details.examples.length;
    const word = wordData.word.toLowerCase();

    if (exampleLength > 0) {
      for (let i = 0; i < exampleLength; i++) {
        let example = wordData.details.examples[i].en;
        const highlighted = this.highlightWordInSentenceWithFallback(
          example,
          word
        );

        examplesHtml += `
        <div class="vocab-example">
          <p class="example">${highlighted}</p>
          <p class="example-translation">${wordData.details.examples[i].vi}</p>
        </div>
      `;
      }
    } else {
      examplesHtml = "";
    }

    return `
    <div class="vocab-card intro" data-quiz-id="${quizId}">
      <label class="vocab-label">Từ vựng</label>
      <h2 class="word-text">${wordData.word}</h2>
      <label class="vocab-label">Tiếng Việt</label>
      <h3 class="vocab-meaning">${wordData.meaning}</h3>
      <label class="vocab-label">Từ loại</label>
      <div class="vocab-sub-item">
        <div class="vocab-type">
          <span>${wordData.details.type}</span>
        </div>
      </div>
      <label class="vocab-label">Phát âm</label>
      <div class="vocab-sub-item">
        <div class="vocab-pronun">
          <span>${wordData.details.pronunciation}</span>
        </div>
        <button class="audio-btn" title="Phát âm" data-src="${wordData.details.audioSrc}">
          <svg
            width="44"
            height="36"
            viewBox="0 0 44 36"
            xmlns="http://www.w3.org/2000/svg"
            class="sc-1ourjn0-0 hExTzv"
          >
            <path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M23.9344 9.57506C23.6084 9.81708 23.2685 10.0694 23.344 10.7807C23.3768 10.892 23.4125 11.0211 23.4517 11.1624L23.4518 11.1626L23.4518 11.1627L23.4518 11.1627C23.5539 11.5312 23.6792 11.9836 23.8368 12.425C24.0785 13.1019 24.3612 13.2114 25.0803 12.9822C25.2759 12.9198 25.4667 12.8377 25.6516 12.7484C28.8733 11.1894 32.095 9.63028 35.3139 8.06576L35.5291 7.96117C36.7888 7.34897 38.0487 6.73672 39.2949 6.09861C40.0669 5.70343 40.1229 5.51924 39.8531 4.74557C39.7037 4.31725 39.5438 3.89243 39.3839 3.46764L39.3837 3.46722L39.3051 3.25833C39.2194 3.02997 39.1348 2.80114 39.0502 2.5723L39.0502 2.57214C38.8246 1.96186 38.5991 1.35153 38.3514 0.749968C37.997 -0.110613 37.6569 -0.196306 36.8492 0.318092C36.7612 0.374177 36.6774 0.436778 36.5936 0.499392L36.5936 0.499446L36.5935 0.499496L36.5935 0.499514C36.5456 0.53525 36.4978 0.570989 36.4492 0.605522C35.5315 1.25823 34.6135 1.91057 33.6955 2.56292C31.5356 4.09776 29.3758 5.63261 27.2193 7.17214C26.1176 7.95861 25.0291 8.76312 23.9421 9.56934L23.9344 9.57506ZM19.27 32.826L19.27 32.8259L19.27 32.8259C19.2579 32.7436 19.2456 32.6599 19.2347 32.5741C19.2947 32.0118 19.2064 31.4565 19.1175 30.8979L19.1175 30.8978C19.0631 30.5562 19.0086 30.2134 18.9876 29.867C18.8849 28.1689 18.7504 26.4726 18.6056 24.7775C18.5326 23.9236 18.4501 23.0705 18.3677 22.2174L18.3677 22.2173L18.3677 22.2173C18.2662 21.168 18.1648 20.1188 18.081 19.0681C17.9374 17.2677 17.8052 15.4665 17.6731 13.6653L17.673 13.6646C17.5773 12.3607 17.4816 11.0567 17.3816 9.75306C17.3532 9.38173 17.3059 9.00041 17.1899 8.65016C16.9093 7.80406 16.2393 7.60342 15.575 8.19036C14.8543 8.82707 14.1604 9.4954 13.4668 10.1635L13.4667 10.1635L13.4662 10.164C13.3286 10.2965 13.1911 10.4289 13.0534 10.5611C12.0285 11.5446 11.0067 12.5312 9.98478 13.5179L9.98461 13.518C9.43441 14.0492 8.88421 14.5805 8.33355 15.1112L8.32955 15.1151C8.12252 15.3148 7.91613 15.5139 7.60043 15.5225C6.94816 15.5401 6.29591 15.56 5.64364 15.58L5.64346 15.58L5.64328 15.58C4.25065 15.6226 2.85799 15.6652 1.4651 15.6848C0.22781 15.7023 -0.0936113 15.9728 0.0219034 17.2343C0.0647786 17.7028 0.0830841 18.1708 0.101383 18.6386C0.112255 18.9166 0.123124 19.1945 0.139142 19.4724L0.15879 19.8125L0.158791 19.8125C0.336651 22.8915 0.51453 25.9709 0.742701 29.0465C0.847871 30.4637 1.30205 30.7817 2.68305 30.5234C4.18841 30.242 5.68733 29.9244 7.18591 29.6069L7.18593 29.6069L7.18619 29.6068L7.50191 29.5399C8.29106 29.3729 8.99831 29.421 9.73351 29.8694C11.3624 30.8629 13.0135 31.819 14.6646 32.7751L14.6653 32.7755C15.2906 33.1377 15.916 33.4998 16.5401 33.8639C16.6422 33.9235 16.7433 33.985 16.8445 34.0464L16.8446 34.0465L16.8446 34.0465C17.0956 34.1991 17.3468 34.3517 17.6112 34.4747C18.7341 34.9974 19.3935 34.5549 19.329 33.3354C19.3201 33.1671 19.2955 32.9997 19.27 32.826ZM41.7786 35.2977C41.7675 35.2945 41.7542 35.2908 41.7391 35.2865C41.6255 35.2546 41.4066 35.1931 41.1953 35.1133C36.5332 33.3522 31.8727 31.5878 27.2121 29.8234C27.058 29.765 26.9041 29.7048 26.7548 29.6361C25.9634 29.2726 25.8653 29.0986 26.1359 28.3448C26.3247 27.8185 26.5475 27.3003 26.7988 26.7988C27.1146 26.1691 27.3564 26.0712 28.0997 26.2827C29.3305 26.6327 30.5556 27.0016 31.7762 27.3833C34.2881 28.1689 36.7983 28.9595 39.3085 29.7501C40.4179 30.0995 41.5273 30.4489 42.6368 30.7979C42.7032 30.8188 42.7704 30.8374 42.8376 30.8559C42.9297 30.8813 43.0217 30.9067 43.1115 30.9381C44.0495 31.2676 44.1422 31.4332 43.8588 32.3417C43.609 33.1423 43.3526 33.9414 43.0796 34.735C42.9153 35.213 42.5663 35.4442 41.8059 35.3057C41.7993 35.3036 41.7901 35.301 41.7786 35.2977ZM26.3694 17.7811C25.4527 17.9852 25.2947 18.2319 25.3404 19.5328C25.3503 19.6089 25.3604 19.6999 25.3717 19.8013C25.4017 20.0693 25.4398 20.4108 25.5031 20.7469C25.6444 21.4949 25.7846 21.6266 26.4801 21.596C27.0096 21.5727 27.539 21.4947 28.0641 21.4105C31.6554 20.8341 35.2461 20.2529 38.8358 19.6657C39.9252 19.4876 41.0138 19.3021 42.0978 19.0909C43.4221 18.8329 43.4853 18.7118 43.1863 17.2683C43.1378 17.0346 43.084 16.802 43.0302 16.5695C42.9969 16.4256 42.9636 16.2817 42.9316 16.1375L42.931 16.1351C42.5063 14.2225 42.5022 14.204 40.6349 14.6143C36.6891 15.4814 32.7456 16.3603 28.802 17.2391C27.9912 17.4198 27.1803 17.6005 26.3694 17.7811Z"
            ></path>
          </svg>
      </div>
      ${examplesHtml}
    </div>
  `;
  }

  /**
   * Tạo quiz trắc nghiệm en to vi
   * @param {Object} wordData - Dữ liệu từ vựng
   */
  getEnToViHTML(wordData, quizId = 1) {
    // Lấy danh sách nghĩa sai ngẫu nhiên (khác nghĩa đúng)
    const wrongChoices = this.currentLessonWords
      .filter((w) => w.meaning !== wordData.meaning)
      .sort(() => Math.random() - 0.5) // shuffle
      .slice(0, 3)
      .map((w) => w.meaning);

    // Chèn nghĩa đúng và trộn thứ tự
    const allChoices = [...wrongChoices, wordData.meaning].sort(
      () => Math.random() - 0.5
    );

    // Tạo HTML cho các đáp án
    const choicesHTML = allChoices
      .map((choice) => {
        const isCorrect = choice === wordData.meaning;
        return `<div class="choice" data-result="${
          isCorrect ? "correct" : "wrong"
        }">${choice}</div>`;
      })
      .join("\n");

    return `
      <div class="vocab-card multiple-choice-quiz" data-quiz-id="${quizId}">
        <div class="question-area">
          <label class="vocab-label">Câu hỏi</label>
          <div class="question-text word-text">${wordData.word}</div>
        </div>
        <label class="vocab-label">Chọn đáp án</label>
        <div class="choices-area">
          ${choicesHTML}
        </div>
      </div>
    `;
  }

  /**
   * Tạo quiz trắc nghiệm vi to en
   * @param {Object} wordData - Dữ liệu từ vựng
   */
  getViToEnHTML(wordData, quizId = 1) {
    // Lấy danh sách nghĩa sai ngẫu nhiên (khác nghĩa đúng)
    const wrongChoices = this.currentLessonWords
      .filter((w) => w.word !== wordData.word)
      .sort(() => Math.random() - 0.5) // shuffle
      .slice(0, 3)
      .map((w) => w.word);

    // Chèn nghĩa đúng và trộn thứ tự
    const allChoices = [...wrongChoices, wordData.word].sort(
      () => Math.random() - 0.5
    );

    // Tạo HTML cho các đáp án
    const choicesHTML = allChoices
      .map((choice) => {
        const isCorrect = choice === wordData.word;
        return `<div class="choice" data-result="${
          isCorrect ? "correct" : "wrong"
        }">${choice}</div>`;
      })
      .join("\n");

    return `
      <div class="vocab-card multiple-choice-quiz" data-quiz-id="${quizId}">
        <div class="question-area">
          <label class="vocab-label">Câu hỏi</label>
          <div class="question-text word-text">${wordData.meaning}</div>
        </div>
        <label class="vocab-label">Chọn đáp án</label>
        <div class="choices-area">
          ${choicesHTML}
        </div>
      </div>
    `;
  }

  /**
   * Tạo quiz trắc nghiệm audio to vi
   * @param {Object} wordData - Dữ liệu từ vựng
   */
  getAudioToViHTML(wordData, quizId = 1) {
    // Lấy danh sách nghĩa sai ngẫu nhiên (khác nghĩa đúng)
    const wrongChoices = this.currentLessonWords
      .filter((w) => w.meaning !== wordData.meaning)
      .sort(() => Math.random() - 0.5) // shuffle
      .slice(0, 3)
      .map((w) => w.meaning);

    // Chèn nghĩa đúng và trộn thứ tự
    const allChoices = [...wrongChoices, wordData.meaning].sort(
      () => Math.random() - 0.5
    );

    // Tạo HTML cho các đáp án
    const choicesHTML = allChoices
      .map((choice) => {
        const isCorrect = choice === wordData.meaning;
        return `<div class="choice" data-result="${
          isCorrect ? "correct" : "wrong"
        }">${choice}</div>`;
      })
      .join("\n");

    const hasAudio =
      wordData.details?.audioSrc &&
      wordData.details.audioSrc !== "" &&
      this.isEnableAudioQuiz;
    const questionHTML = hasAudio
      ? `
            <label class="vocab-label">Nhấn để nghe</label>
              <button class="question-audio-btn audio-btn" title="Phát âm" data-src="${wordData.details.audioSrc}">
                <svg
                  width="44"
                  height="36"
                  viewBox="0 0 44 36"
                  xmlns="http://www.w3.org/2000/svg"
                  class="sc-1ourjn0-0 hExTzv"
                >
                  <path
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                    d="M23.9344 9.57506C23.6084 9.81708 23.2685 10.0694 23.344 10.7807C23.3768 10.892 23.4125 11.0211 23.4517 11.1624L23.4518 11.1626L23.4518 11.1627L23.4518 11.1627C23.5539 11.5312 23.6792 11.9836 23.8368 12.425C24.0785 13.1019 24.3612 13.2114 25.0803 12.9822C25.2759 12.9198 25.4667 12.8377 25.6516 12.7484C28.8733 11.1894 32.095 9.63028 35.3139 8.06576L35.5291 7.96117C36.7888 7.34897 38.0487 6.73672 39.2949 6.09861C40.0669 5.70343 40.1229 5.51924 39.8531 4.74557C39.7037 4.31725 39.5438 3.89243 39.3839 3.46764L39.3837 3.46722L39.3051 3.25833C39.2194 3.02997 39.1348 2.80114 39.0502 2.5723L39.0502 2.57214C38.8246 1.96186 38.5991 1.35153 38.3514 0.749968C37.997 -0.110613 37.6569 -0.196306 36.8492 0.318092C36.7612 0.374177 36.6774 0.436778 36.5936 0.499392L36.5936 0.499446L36.5935 0.499496L36.5935 0.499514C36.5456 0.53525 36.4978 0.570989 36.4492 0.605522C35.5315 1.25823 34.6135 1.91057 33.6955 2.56292C31.5356 4.09776 29.3758 5.63261 27.2193 7.17214C26.1176 7.95861 25.0291 8.76312 23.9421 9.56934L23.9344 9.57506ZM19.27 32.826L19.27 32.8259L19.27 32.8259C19.2579 32.7436 19.2456 32.6599 19.2347 32.5741C19.2947 32.0118 19.2064 31.4565 19.1175 30.8979L19.1175 30.8978C19.0631 30.5562 19.0086 30.2134 18.9876 29.867C18.8849 28.1689 18.7504 26.4726 18.6056 24.7775C18.5326 23.9236 18.4501 23.0705 18.3677 22.2174L18.3677 22.2173L18.3677 22.2173C18.2662 21.168 18.1648 20.1188 18.081 19.0681C17.9374 17.2677 17.8052 15.4665 17.6731 13.6653L17.673 13.6646C17.5773 12.3607 17.4816 11.0567 17.3816 9.75306C17.3532 9.38173 17.3059 9.00041 17.1899 8.65016C16.9093 7.80406 16.2393 7.60342 15.575 8.19036C14.8543 8.82707 14.1604 9.4954 13.4668 10.1635L13.4667 10.1635L13.4662 10.164C13.3286 10.2965 13.1911 10.4289 13.0534 10.5611C12.0285 11.5446 11.0067 12.5312 9.98478 13.5179L9.98461 13.518C9.43441 14.0492 8.88421 14.5805 8.33355 15.1112L8.32955 15.1151C8.12252 15.3148 7.91613 15.5139 7.60043 15.5225C6.94816 15.5401 6.29591 15.56 5.64364 15.58L5.64346 15.58L5.64328 15.58C4.25065 15.6226 2.85799 15.6652 1.4651 15.6848C0.22781 15.7023 -0.0936113 15.9728 0.0219034 17.2343C0.0647786 17.7028 0.0830841 18.1708 0.101383 18.6386C0.112255 18.9166 0.123124 19.1945 0.139142 19.4724L0.15879 19.8125L0.158791 19.8125C0.336651 22.8915 0.51453 25.9709 0.742701 29.0465C0.847871 30.4637 1.30205 30.7817 2.68305 30.5234C4.18841 30.242 5.68733 29.9244 7.18591 29.6069L7.18593 29.6069L7.18619 29.6068L7.50191 29.5399C8.29106 29.3729 8.99831 29.421 9.73351 29.8694C11.3624 30.8629 13.0135 31.819 14.6646 32.7751L14.6653 32.7755C15.2906 33.1377 15.916 33.4998 16.5401 33.8639C16.6422 33.9235 16.7433 33.985 16.8445 34.0464L16.8446 34.0465L16.8446 34.0465C17.0956 34.1991 17.3468 34.3517 17.6112 34.4747C18.7341 34.9974 19.3935 34.5549 19.329 33.3354C19.3201 33.1671 19.2955 32.9997 19.27 32.826ZM41.7786 35.2977C41.7675 35.2945 41.7542 35.2908 41.7391 35.2865C41.6255 35.2546 41.4066 35.1931 41.1953 35.1133C36.5332 33.3522 31.8727 31.5878 27.2121 29.8234C27.058 29.765 26.9041 29.7048 26.7548 29.6361C25.9634 29.2726 25.8653 29.0986 26.1359 28.3448C26.3247 27.8185 26.5475 27.3003 26.7988 26.7988C27.1146 26.1691 27.3564 26.0712 28.0997 26.2827C29.3305 26.6327 30.5556 27.0016 31.7762 27.3833C34.2881 28.1689 36.7983 28.9595 39.3085 29.7501C40.4179 30.0995 41.5273 30.4489 42.6368 30.7979C42.7032 30.8188 42.7704 30.8374 42.8376 30.8559C42.9297 30.8813 43.0217 30.9067 43.1115 30.9381C44.0495 31.2676 44.1422 31.4332 43.8588 32.3417C43.609 33.1423 43.3526 33.9414 43.0796 34.735C42.9153 35.213 42.5663 35.4442 41.8059 35.3057C41.7993 35.3036 41.7901 35.301 41.7786 35.2977ZM26.3694 17.7811C25.4527 17.9852 25.2947 18.2319 25.3404 19.5328C25.3503 19.6089 25.3604 19.6999 25.3717 19.8013C25.4017 20.0693 25.4398 20.4108 25.5031 20.7469C25.6444 21.4949 25.7846 21.6266 26.4801 21.596C27.0096 21.5727 27.539 21.4947 28.0641 21.4105C31.6554 20.8341 35.2461 20.2529 38.8358 19.6657C39.9252 19.4876 41.0138 19.3021 42.0978 19.0909C43.4221 18.8329 43.4853 18.7118 43.1863 17.2683C43.1378 17.0346 43.084 16.802 43.0302 16.5695C42.9969 16.4256 42.9636 16.2817 42.9316 16.1375L42.931 16.1351C42.5063 14.2225 42.5022 14.204 40.6349 14.6143C36.6891 15.4814 32.7456 16.3603 28.802 17.2391C27.9912 17.4198 27.1803 17.6005 26.3694 17.7811Z"
                  ></path>
                </svg>
              </button>
        `
      : `
              <label class="vocab-label">Câu hỏi</label>
              <div class="question-text word-text">${wordData.word}</div>
      `;

    return `
          <div class="vocab-card multiple-choice-quiz" data-quiz-id="${quizId}">
            <div class="question-area">
              ${questionHTML}
            </div>
            <label class="vocab-label">Chọn đáp án</label>
            <div class="choices-area">
              ${choicesHTML}
            </div>
          </div>
    `;
  }

  /**
   * Tạo bàn phím từ Từ vựng (viết hoa, không trùng, xáo trộn)
   * @param {String} word - Từ vựng
   * @returns {String} HTML các ký tự
   */
  getSpellCharsHTML(word) {
    const seen = new Set();
    const uniqueChars = word
      .toUpperCase()
      .split("")
      .map((char) => (char === " " ? "⎵" : char))
      .filter((char) => {
        if (seen.has(char)) return false;
        seen.add(char);
        return true;
      });

    // Xáo trộn mảng
    for (let i = uniqueChars.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [uniqueChars[i], uniqueChars[j]] = [uniqueChars[j], uniqueChars[i]];
    }

    return uniqueChars
      .map(
        (char) =>
          `<div class="spellcheck-char" data-char="${char}">${char}</div>`
      )
      .join("");
  }

  /**
   * Tạo quiz spell check
   * @param {Object} wordData - Dữ liệu từ vựng
   */
  getSpellHTML(wordData, quizId = 1) {
    if (!this.isEnableSpellQuiz) {
      return this.getViToEnHTML(wordData, quizId);
    }

    return `
    <div class="vocab-card spellcheck-quiz" data-quiz-id="${quizId}">
        <div class="question-area">
          <label class="vocab-label">Câu hỏi</label>
          <div class="question-text word-text">${wordData.meaning}</div>
        </div>
        <label class="vocab-label">Đáp án</label>
        <div class="answer-area">
          <div
            class="answer-text"
            data-vocab="Goodbye world"
            placeholder="Nhập từ đúng"
            contenteditable="false"
            data-word="${wordData.word}"
          ></div>
          <button class="input-del-btn" title="backspace">
            <i class="fa-solid fa-delete-left"></i>
          </button>
        </div>
        <label class="vocab-label">Gõ để nhập thành từ đúng</label>
        <div class="spellcheck-container">
          ${this.getSpellCharsHTML(wordData.word)}
        </div>

        <div class="spellcheck-button">
          <button class="spellcheck-check-btn" title="Kiểm tra">
            <i class="fas fa-check-circle"></i> Kiểm tra
          </button>
          <button class="spellcheck-hint-btn" title="Gợi ý">
            <i class="fa-solid fa-wand-magic-sparkles"></i> Gợi ý
          </button>
        </div>
      </div>
    `;
  }

  /**
   * Lấy từ vựng từ id
   * @param {Number} id - id từ vựng
   */
  getWordById(id) {
    return this.words.find((word) => word.id === id);
  }

  /**
   * Lấy html quiz bởi id từ vựng và type
   * @param {Number} wordId - id từ vựng
   * @param {Number} type - loại quiz
   */
  getQuizHTMLByType(quizId, wordId, type) {
    switch (type) {
      case this.QUIZ_TYPES.INTRO:
        return this.getIntroHTML(this.getWordById(wordId), quizId);
      case this.QUIZ_TYPES.ENTOVI:
        return this.getEnToViHTML(this.getWordById(wordId), quizId);
      case this.QUIZ_TYPES.VITOEN:
        return this.getViToEnHTML(this.getWordById(wordId), quizId);
      case this.QUIZ_TYPES.AUDIO:
        return this.getAudioToViHTML(this.getWordById(wordId), quizId);
      case this.QUIZ_TYPES.SPELL:
        return this.getSpellHTML(this.getWordById(wordId), quizId);
    }
  }

  /**
   * Tạo thứ tự quiz
   * @param {Array} wordIds - Dữ liệu từ vựng
   * @param {Number} phase - Phiên học, 1; learn, 2: practice
   */
  getQuizOrder(wordIds, phase) {
    const ids = wordIds;
    let quizId = 1;

    // Hàm hỗ trợ chọn quizType tùy theo điều kiện
    const choose = (type) => {
      if (type === this.QUIZ_TYPES.AUDIO && !this.isEnableAudioQuiz)
        return this.QUIZ_TYPES.ENTOVI;
      if (type === this.QUIZ_TYPES.SPELL && !this.isEnableSpellQuiz)
        return this.QUIZ_TYPES.ENTOVI;
      return type;
    };

    // Hàm tạo object quiz với html
    const createQuiz = (wordId, type) => {
      if (!wordId) return null;
      const quizType = choose(type);
      const quizIndex = quizId++;
      return {
        quizId: quizIndex,
        wordId,
        quizType,
        html: this.getQuizHTMLByType(quizIndex, wordId, quizType),
        isCorrect: false,
      };
    };

    // Danh sách quiz theo phase
    const quizzes =
      phase === this.LEARN_PHASE.LEARN
        ? [
            createQuiz(ids[0], this.QUIZ_TYPES.INTRO),
            createQuiz(ids[1], this.QUIZ_TYPES.INTRO),
            createQuiz(ids[0], this.QUIZ_TYPES.ENTOVI),
            createQuiz(ids[1], this.QUIZ_TYPES.ENTOVI),
            createQuiz(ids[2], this.QUIZ_TYPES.INTRO),
            createQuiz(ids[0], this.QUIZ_TYPES.VITOEN),
            createQuiz(ids[2], this.QUIZ_TYPES.ENTOVI),
            createQuiz(ids[1], this.QUIZ_TYPES.VITOEN),
            createQuiz(ids[3], this.QUIZ_TYPES.INTRO),
            createQuiz(ids[2], this.QUIZ_TYPES.VITOEN),
            createQuiz(ids[3], this.QUIZ_TYPES.ENTOVI),
            createQuiz(ids[0], this.QUIZ_TYPES.AUDIO),
            createQuiz(ids[1], this.QUIZ_TYPES.AUDIO),
            createQuiz(ids[3], this.QUIZ_TYPES.VITOEN),
            createQuiz(ids[2], this.QUIZ_TYPES.AUDIO),
            createQuiz(ids[4], this.QUIZ_TYPES.INTRO),
            createQuiz(ids[3], this.QUIZ_TYPES.AUDIO),
            createQuiz(ids[4], this.QUIZ_TYPES.ENTOVI),
            createQuiz(ids[0], this.QUIZ_TYPES.ENTOVI),
            createQuiz(ids[4], this.QUIZ_TYPES.VITOEN),
            createQuiz(ids[2], this.QUIZ_TYPES.ENTOVI),
            createQuiz(ids[1], this.QUIZ_TYPES.ENTOVI),
            createQuiz(ids[4], this.QUIZ_TYPES.AUDIO),
            createQuiz(ids[3], this.QUIZ_TYPES.ENTOVI),
            createQuiz(ids[4], this.QUIZ_TYPES.ENTOVI),
            createQuiz(ids[3], this.QUIZ_TYPES.SPELL),
            createQuiz(ids[2], this.QUIZ_TYPES.SPELL),
            createQuiz(ids[0], this.QUIZ_TYPES.SPELL),
            createQuiz(ids[4], this.QUIZ_TYPES.SPELL),
            createQuiz(ids[1], this.QUIZ_TYPES.SPELL),
          ]
        : phase === this.LEARN_PHASE.PRACTICE
        ? [
            createQuiz(ids[2], this.QUIZ_TYPES.ENTOVI),
            createQuiz(ids[1], this.QUIZ_TYPES.ENTOVI),
            createQuiz(ids[0], this.QUIZ_TYPES.ENTOVI),
            createQuiz(ids[4], this.QUIZ_TYPES.ENTOVI),
            createQuiz(ids[3], this.QUIZ_TYPES.ENTOVI),

            createQuiz(ids[1], this.QUIZ_TYPES.VITOEN),
            createQuiz(ids[4], this.QUIZ_TYPES.VITOEN),
            createQuiz(ids[0], this.QUIZ_TYPES.VITOEN),
            createQuiz(ids[3], this.QUIZ_TYPES.VITOEN),
            createQuiz(ids[2], this.QUIZ_TYPES.VITOEN),

            createQuiz(ids[4], this.QUIZ_TYPES.AUDIO),
            createQuiz(ids[0], this.QUIZ_TYPES.AUDIO),
            createQuiz(ids[3], this.QUIZ_TYPES.AUDIO),
            createQuiz(ids[1], this.QUIZ_TYPES.AUDIO),
            createQuiz(ids[2], this.QUIZ_TYPES.AUDIO),

            createQuiz(ids[1], this.QUIZ_TYPES.SPELL),
            createQuiz(ids[2], this.QUIZ_TYPES.SPELL),
            createQuiz(ids[4], this.QUIZ_TYPES.SPELL),
            createQuiz(ids[3], this.QUIZ_TYPES.SPELL),
            createQuiz(ids[0], this.QUIZ_TYPES.SPELL),

            createQuiz(ids[0], this.QUIZ_TYPES.ENTOVI),
            createQuiz(ids[1], this.QUIZ_TYPES.ENTOVI),
            createQuiz(ids[2], this.QUIZ_TYPES.ENTOVI),
            createQuiz(ids[3], this.QUIZ_TYPES.ENTOVI),
            createQuiz(ids[4], this.QUIZ_TYPES.ENTOVI),

            createQuiz(ids[3], this.QUIZ_TYPES.SPELL),
            createQuiz(ids[2], this.QUIZ_TYPES.SPELL),
            createQuiz(ids[0], this.QUIZ_TYPES.SPELL),
            createQuiz(ids[4], this.QUIZ_TYPES.SPELL),
            createQuiz(ids[1], this.QUIZ_TYPES.SPELL),
          ]
        : [];

    return quizzes.filter(Boolean);
  }

  /**
   * Kiểm tra đáp án
   * @param {string} selectedAnswer - Đáp án được chọn
   * @param {string} correctAnswer - Đáp án đúng
   * @returns {boolean} Kết quả đúng/sai
   */
  checkAnswer(selectedAnswer, correctAnswer) {
    return selectedAnswer === correctAnswer;
  }

  /**
   * Chuyển sang quiz tiếp theo
   */
  nextQuiz() {
    if (!DOM.vocabMain) return;

    DOM.vocabMain.innerHTML = this.quizTemplates[this.currentQuizIndex].html;
    this.currentQuizIndex =
      (this.currentQuizIndex + 1) % this.quizTemplates.length;
  }

  /**
   * Nhận danh sách từ vựng từ LessonManager
   * @param {Array} words - Danh sách từ vựng
   */
  setAllWords(words) {
    this.words = words;
  }

  /**
   * Nhận danh sách từ vựng từ LessonManager
   * @param {Array} words - Danh sách từ vựng
   */
  setLessonWords(words) {
    this.currentLessonWords = words;
  }
}
