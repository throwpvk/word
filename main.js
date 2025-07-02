document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.querySelector(".menu-btn");
  const settingsBtn = document.querySelector(".settings-btn");
  const menuPanel = document.querySelector(".menu-panel");
  const settingsPanel = document.querySelector(".settings-panel");

  const footerBar = document.querySelector(".footer-bar");
  const footerStatus = document.querySelector(".footer-status");
  const vocabMain = document.querySelector(".vocab-main");

  // Toggle Menu Panel
  menuBtn?.addEventListener("click", () => {
    menuPanel.classList.toggle("show");
  });

  // Toggle Settings Panel
  settingsBtn?.addEventListener("click", () => {
    settingsPanel.classList.toggle("show");
  });

  // Footer logic
  const vocabWord = document.querySelector(".vocab-word");
  const vocabMeaning = document.querySelector(".vocab-meaning");
  const vocabExample = document.querySelector(".example");
  const h1 = document.querySelector("h1");

  vocabWord?.addEventListener("click", () => {
    showFooter("correct", "Chính xác. Tuyệt vời!");
  });

  vocabMeaning?.addEventListener("click", () => {
    showFooter("wrong", "Sai mất rồi. Cố gắng chút nữa!");
  });

  vocabExample?.addEventListener("click", () => {
    showFooter("", "");
  });

  h1?.addEventListener("click", () => {
    hideFooter();
  });

  function showFooter(type, statusText) {
    footerBar.classList.add("show");
    footerBar.classList.remove("correct", "wrong");

    let iconHtml = "";
    if (type === "correct") {
      footerBar.classList.add("correct");
      iconHtml = `<i class="fa-solid fa-circle-check" style="margin-right:10px"></i>`;
    } else if (type === "wrong") {
      footerBar.classList.add("wrong");
      iconHtml = `<i class="fa-solid fa-circle-xmark" style="margin-right:10px"></i>`;
    }

    footerStatus.innerHTML = iconHtml + statusText;

    // Delay paddingBottom để khớp với animation của footer
    setTimeout(() => {
      const footerHeight = footerBar.offsetHeight;
      vocabMain.style.paddingBottom = footerHeight + "px";
    }, 300); // delay đúng bằng transition duration của footer
  }

  function hideFooter() {
    footerBar.classList.remove("show", "correct", "wrong");
    footerStatus.innerHTML = "";
    vocabMain.style.paddingBottom = "0";
  }
});

const themeToggle = document.getElementById("themeSelectToggle");
const themeDropdown = document.getElementById("themeDropdown");
const iconToggle = themeToggle.querySelector("i");

// Toggle dropdown hiển thị
themeToggle.addEventListener("click", () => {
  themeDropdown.style.display =
    themeDropdown.style.display === "flex" ? "none" : "flex";
});

// Click ra ngoài thì ẩn dropdown
document.addEventListener("click", (e) => {
  if (!themeToggle.contains(e.target) && !themeDropdown.contains(e.target)) {
    themeDropdown.style.display = "none";
  }
});

// Xử lý chọn theme
themeDropdown.querySelectorAll("div").forEach((option) => {
  option.addEventListener("click", () => {
    const theme = option.getAttribute("data-theme");
    const root = document.documentElement;

    if (theme === "dark") {
      root.style.setProperty("--color-bg", "#3c3d37");
      root.style.setProperty("--color-bg-panel", "#1e201e");
      root.style.setProperty("--color-text", "#ecdfcc");
      iconToggle.classList.replace("fa-sun", "fa-moon");
    } else {
      root.style.setProperty("--color-bg", "#fff8e5");
      root.style.setProperty("--color-bg-panel", "#fdf3d7");
      root.style.setProperty("--color-text", "#403d39");
      iconToggle.classList.replace("fa-moon", "fa-sun");
    }

    themeDropdown.style.display = "none";
  });
});
