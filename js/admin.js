import { LessonManager } from "./modules/LessonManager.js";
import { DOM } from "./modules/DOM.js";
import { createFetchAPI } from "./modules/fetch.js";

// Khởi tạo fetch API cho CRUD
const api = createFetchAPI("https://word-server.onrender.com/toeic");

// Khởi tạo lesson manager (tận dụng để lấy nhóm từ)
const lessonManager = new LessonManager();

// Gắn lại render lesson buttons cho lessonGrid bên admin
lessonManager.createLessonButtons = function () {
  const lessonGrid = document.getElementById("lessonGrid");
  if (!lessonGrid) return;
  lessonGrid.innerHTML = "";
  const totalLessons = Math.ceil(this.words.length / this.wordsPerLesson);
  for (let i = 1; i <= totalLessons; i++) {
    const btn = document.createElement("button");
    const start = (i - 1) * this.wordsPerLesson;
    const end = start + Math.min(this.wordsPerLesson, this.words.length - start);
    btn.className = "lesson-circle-btn";
    btn.dataset.index = i;
    btn.innerText = `${start + 1} - ${end}`;
    btn.onclick = () => loadLessonTable(i);
    lessonGrid.appendChild(btn);
  }
};

// Hàm hiển thị bảng từ vựng của nhóm
function loadLessonTable(lessonIndex) {
  const start = (lessonIndex - 1) * lessonManager.wordsPerLesson;
  const end = start + Math.min(lessonManager.wordsPerLesson, lessonManager.words.length - start);
  const lessonWords = lessonManager.words.slice(start, end);
  const tableRows = lessonWords.map((word, idx) => `
    <tr>
      <td>${word.id}</td>
      <td>${word.word}</td>
      <td>${word.meaning}</td>
      <td>
        <button class="word-edit-btn" data-id="${word.id}" title="Sửa từ vựng">
          <i class="fa-solid fa-pen-to-square"></i>
        </button>
      </td>
    </tr>
  `).join("");
  document.getElementById("adminMain").innerHTML = `
    <div class="vocab-card">
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
    </div>
  `;
  // Gắn event cho nút edit
  document.querySelectorAll(".word-edit-btn").forEach(btn => {
    btn.onclick = () => openEditModal(btn.dataset.id);
  });
}

// Hàm mở modal edit từ vựng
function openEditModal(wordId) {
  const word = lessonManager.words.find(w => String(w.id) === String(wordId));
  if (!word) return;
  // Render form edit chuyên nghiệp
  const details = word.details || {};
  const examples = Array.isArray(details.examples) ? details.examples : [];
  document.getElementById("editWordBody").innerHTML = `
    <form id="editWordForm">
      <label>Từ vựng</label>
      <input name="word" value="${word.word}" required />
      <label>Ý nghĩa</label>
      <input name="meaning" value="${word.meaning}" required />
      <label>Phát âm</label>
      <input name="pronunciation" value="${details.pronunciation||''}" />
      <label>Loại từ</label>
      <input name="type" value="${details.type||''}" />
      <label>Audio URL</label>
      <input name="audioSrc" value="${details.audioSrc||''}" />
      <label>Ví dụ</label>
      <table class="example-table" id="exampleTable">
        <thead><tr><th>EN</th><th>VI</th><th></th></tr></thead>
        <tbody>
          ${examples.map((ex,i)=>`
            <tr>
              <td><input name="ex_en_${i}" value="${ex.en||''}" /></td>
              <td><input name="ex_vi_${i}" value="${ex.vi||''}" /></td>
              <td><button type="button" class="example-action-btn" onclick="this.closest('tr').remove()">X</button></td>
            </tr>`).join('')}
        </tbody>
      </table>
      <button type="button" class="example-action-btn add" id="addExampleBtn">+ Thêm ví dụ</button>
      <div class="modal-footer">
        <button type="submit" class="save-btn">Lưu</button>
        <button type="button" class="delete-btn" id="deleteWordBtn">Xóa</button>
      </div>
    </form>
  `;
  const modal = document.getElementById("editWordModal");
  modal.style.visibility = "visible";
  modal.style.opacity = "1";
  document.body.classList.add("no-scroll");
  // Đóng modal
  modal.querySelector(".modal-close").onclick = () => {
    modal.style.visibility = "hidden";
    modal.style.opacity = "0";
    document.body.classList.remove("no-scroll");
  };
  // Thêm ví dụ mới
  document.getElementById("addExampleBtn").onclick = () => {
    const tbody = document.querySelector("#exampleTable tbody");
    const idx = tbody.children.length;
    const tr = document.createElement("tr");
    tr.innerHTML = `<td><input name="ex_en_${idx}" /></td><td><input name="ex_vi_${idx}" /></td><td><button type="button" class="example-action-btn" onclick="this.closest('tr').remove()">X</button></td>`;
    tbody.appendChild(tr);
  };
  // Xử lý submit
  document.getElementById("editWordForm").onsubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const newWord = {
      ...word,
      word: formData.get("word").trim(),
      meaning: formData.get("meaning").trim(),
      details: {
        pronunciation: formData.get("pronunciation").trim(),
        type: formData.get("type").trim(),
        audioSrc: formData.get("audioSrc").trim(),
        examples: []
      }
    };
    // Lấy ví dụ
    const exRows = form.querySelectorAll("#exampleTable tbody tr");
    exRows.forEach((tr, i) => {
      const en = tr.querySelector(`[name^='ex_en_']`).value.trim();
      const vi = tr.querySelector(`[name^='ex_vi_']`).value.trim();
      if (en) newWord.details.examples.push({ en, vi });
    });
    // Validate cơ bản
    if (!newWord.word || !newWord.meaning) {
      alert("Từ vựng và ý nghĩa không được để trống!");
      return;
    }
    // Gọi API cập nhật
    try {
      await api.put(word.id, newWord);
      // Cập nhật local
      Object.assign(word, newWord);
      modal.style.visibility = "hidden";
      modal.style.opacity = "0";
      document.body.classList.remove("no-scroll");
      // Reload lại bảng
      const idx = Math.ceil(word.id / lessonManager.wordsPerLesson);
      loadLessonTable(idx);
    } catch (err) {
      alert("Lỗi khi lưu: " + err.message);
    }
  };
  // Xử lý xóa
  document.getElementById("deleteWordBtn").onclick = async () => {
    if (!confirm("Bạn có chắc muốn xóa từ này?")) return;
    try {
      await api.delete(word.id);
      // Xóa local
      lessonManager.words = lessonManager.words.filter(w => String(w.id) !== String(word.id));
      modal.style.visibility = "hidden";
      modal.style.opacity = "0";
      document.body.classList.remove("no-scroll");
      // Reload lại bảng
      const idx = Math.ceil(word.id / lessonManager.wordsPerLesson);
      loadLessonTable(idx);
    } catch (err) {
      alert("Lỗi khi xóa: " + err.message);
    }
  };
}

// Khởi động lại lesson buttons khi đã load xong từ vựng
lessonManager.init = async function () {
  await this.loadWords();
  this.createLessonButtons();
};

// Gọi lại init
lessonManager.init(); 