let rawText = "";

const fileInput = document.getElementById("fileInput");
const startBtn = document.getElementById("startBtn");

fileInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    rawText = event.target.result;
    console.log("📄 Đã đọc file txt thành công!");
    startBtn.disabled = false; // cho phép bấm nút bắt đầu
  };
  reader.readAsText(file);
});

startBtn.addEventListener("click", () => {
  startBtn.disabled = true; // tránh bấm nhiều lần
  renderData().then(() => {
    startBtn.disabled = false;
  });
});

async function renderData() {
  const delay = (ms) => new Promise((r) => setTimeout(r, ms));
  const lines = rawText.split("\n").filter((l) => l.trim() !== "");
  const wordList = lines.map((line, index) => {
    const [word, meaning] = line.split("\t");
    return {
      id: index + 1,
      word: word.trim(),
      meaning: meaning?.trim() || "",
    };
  });

  for (let i = 0; i < wordList.length; i++) {
    const item = wordList[i];
    console.log(`🔍 Đang xử lý: ${item.word} (${i + 1}/${wordList.length})`);

    try {
      const res = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(
          item.word
        )}`
      );
      const data = await res.json();

      if (!Array.isArray(data)) {
        item.details = null;
        console.warn(`⚠️ Không tìm thấy dữ liệu cho từ "${item.word}"`);
        continue;
      }

      const entry = data[0];
      const usPhonetic = entry.phonetics.find((p) => p.audio?.includes("-us."));
      const pronunciation = usPhonetic?.text || entry.phonetic || "";
      const audioSrc = usPhonetic?.audio || "";

      let type = "";
      const examples = [];

      for (const meaning of entry.meanings) {
        if (!type && meaning.partOfSpeech) {
          type = meaning.partOfSpeech;
        }

        for (const def of meaning.definitions || []) {
          if (def.example) {
            const vi = ""; // giữ nguyên phần vi nếu cần sửa sau
            // Tách câu theo các dấu ngắt câu: . ! ? ; :
            const sentences = def.example
              .split(/[.!?;:](?!\d)/)
              .map((s) => s.trim())
              .filter(Boolean);

            const wordLower = item.word.toLowerCase();
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
        }
      }

      item.details = {
        pronunciation,
        type,
        audioSrc,
        examples,
      };
    } catch (err) {
      console.error(`❌ Lỗi khi fetch từ "${item.word}":`, err.message);
      item.details = null;
    }

    await delay(300); // tránh spam API
  }

  console.log("✅ Kết quả cuối cùng:");
  console.log(wordList);

  // Xuất file JSON
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
