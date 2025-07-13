/**
 * Module xử lý dữ liệu từ vựng
 * Chuyển đổi file txt thành JSON với thông tin chi tiết từ API
 */

export class DataRenderer {
  constructor() {
    this.rawText = "";
    this.init();
  }

  /**
   * Khởi tạo data renderer
   */
  init() {
    this.bindEvents();
  }

  /**
   * Gắn event listeners
   */
  bindEvents() {
    const fileInput = document.getElementById("fileInput");
    const startBtn = document.getElementById("startBtn");

    if (fileInput) {
      fileInput.addEventListener("change", (e) => this.handleFileSelect(e));
    }

    if (startBtn) {
      startBtn.addEventListener("click", () => this.startProcessing());
    }
  }

  /**
   * Xử lý khi chọn file
   * @param {Event} event - File input event
   */
  handleFileSelect(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      this.rawText = e.target.result;
      console.log("📄 Đã đọc file txt thành công!");

      const startBtn = document.getElementById("startBtn");
      if (startBtn) {
        startBtn.disabled = false; // Cho phép bấm nút bắt đầu
      }
    };
    reader.readAsText(file);
  }

  /**
   * Bắt đầu xử lý dữ liệu
   */
  async startProcessing() {
    const startBtn = document.getElementById("startBtn");
    if (startBtn) {
      startBtn.disabled = true; // Tránh bấm nhiều lần
    }

    try {
      await this.renderData();
    } finally {
      if (startBtn) {
        startBtn.disabled = false;
      }
    }
  }

  /**
   * Xử lý và render dữ liệu
   */
  async renderData() {
    const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // Parse dữ liệu từ text
    const lines = this.rawText.split("\n").filter((line) => line.trim() !== "");
    const wordList = lines.map((line, index) => {
      const [word, meaning] = line.split("\t");
      return {
        id: index + 1,
        word: word?.trim() || "",
        meaning: meaning?.trim() || "",
      };
    });

    console.log(`🔍 Bắt đầu xử lý ${wordList.length} từ vựng...`);

    // Xử lý từng từ vựng
    for (let i = 0; i < wordList.length; i++) {
      const item = wordList[i];
      console.log(`🔍 Đang xử lý: ${item.word} (${i + 1}/${wordList.length})`);

      try {
        const details = await this.fetchWordDetails(item.word);
        item.details = details;
      } catch (err) {
        console.log(`❌ Lỗi khi fetch từ "${item.word}":`, err.message);
        item.details = null;
      }

      await delay(300); // Tránh spam API
    }

    console.log("✅ Kết quả cuối cùng:", wordList);
    this.downloadJSON(wordList);
  }

  /**
   * Fetch thông tin chi tiết từ API
   * @param {string} word - Từ cần tìm
   * @returns {Object|null} Thông tin chi tiết
   */
  async fetchWordDetails(word) {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
        word
      )}`
    );
    const data = await response.json();

    if (!Array.isArray(data)) {
      console.warn(`⚠️ Không tìm thấy dữ liệu cho từ "${word}"`);
      return null;
    }

    const entry = data[0];
    const usPhonetic = entry.phonetics.find((p) => p.audio?.includes("-us."));
    const pronunciation = usPhonetic?.text || entry.phonetic || "";
    const audioSrc = usPhonetic?.audio || "";

    let type = "";
    const examples = [];

    // Xử lý meanings và examples
    for (const meaning of entry.meanings) {
      if (!type && meaning.partOfSpeech) {
        type = meaning.partOfSpeech;
      }

      for (const def of meaning.definitions || []) {
        if (def.example) {
          const vi = ""; // Giữ nguyên phần vi nếu cần sửa sau

          // Tách câu theo các dấu ngắt câu: . ! ? ; :
          const sentences = def.example
            .split(/[.!?;:](?!\d)/)
            .map((s) => s.trim())
            .filter(Boolean);

          const wordLower = word.toLowerCase();
          const allContainWord =
            sentences.length > 1 &&
            sentences.every((s) => s.toLowerCase().includes(wordLower));

          if (allContainWord) {
            for (const sentence of sentences) {
              examples.push({ en: sentence, vi });
            }
          } else {
            examples.push({ en: def.example, vi });
          }
        }
        if (examples.length >= 3) break;
      }
      if (examples.length >= 3) break;
    }

    return {
      pronunciation,
      type,
      audioSrc,
      examples,
    };
  }

  /**
   * Tải xuống file JSON
   * @param {Array} wordList - Danh sách từ vựng
   */
  downloadJSON(wordList) {
    const blob = new Blob([JSON.stringify(wordList, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "wordList.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    console.log("✅ Đã tạo file wordList.json và tải về.");
  }
}
