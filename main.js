// ===================== DOM ELEMENTS =====================
const menuBtn = document.querySelector(".menu-btn");
const settingsBtn = document.querySelector(".settings-btn");
const menuPanel = document.querySelector(".menu-panel");
const settingsPanel = document.querySelector(".settings-panel");

const headerBar = document.querySelector(".header-bar");
const footerBar = document.querySelector(".footer-bar");
const footerStatus = document.querySelector(".footer-status");
const vocabMain = document.querySelector(".vocab-main");

const vocabWord = document.querySelector(".vocab-word");
const vocabMeaning = document.querySelector(".vocab-meaning");
const vocabExample = document.querySelector(".example");
const h1 = document.querySelector("h1");

// ===================== MENU TOGGLE =====================
menuBtn?.addEventListener("pointerup", () => {
  const isShown = menuPanel.classList.toggle("show");
  menuPanel.style.zIndex = "2010";
  settingsPanel.style.zIndex = "2009";
  menuBtn.innerHTML = isShown
    ? `<i class="fa-solid fa-xmark"></i>`
    : `<i class="fas fa-bars"></i>`;
});

// ===================== SETTINGS TOGGLE =====================
settingsBtn?.addEventListener("pointerup", () => {
  const isShown = settingsPanel.classList.toggle("show");
  menuPanel.style.zIndex = "2009";
  settingsPanel.style.zIndex = "2010";
  settingsBtn.innerHTML = isShown
    ? `<i class="fa-solid fa-xmark"></i>`
    : `<i class="fas fa-gear"></i>`;
});

vocabMain?.addEventListener("pointerup", hidePanel);
headerBar?.addEventListener("pointerup", hidePanel);

function hidePanel() {
  menuPanel.classList.remove("show");
  settingsPanel.classList.remove("show");

  menuBtn.innerHTML = `<i class="fas fa-bars"></i>`;
  settingsBtn.innerHTML = `<i class="fas fa-gear"></i>`;
}

// ===================== FOOTER STATUS =====================
function showFooter(type, text) {
  footerBar.className = `footer-bar show ${type}`;
  const iconMap = {
    correct: `<i class="fa-solid fa-circle-check" style="margin-right:10px"></i>`,
    wrong: `<i class="fa-solid fa-circle-xmark" style="margin-right:10px"></i>`,
  };
  footerStatus.innerHTML = (iconMap[type] || "") + text;

  setTimeout(() => {
    vocabMain.style.paddingBottom = `${footerBar.offsetHeight}px`;
  }, 300);
}

function hideFooter() {
  footerBar.className = "footer-bar";
  footerStatus.innerHTML = "";
  vocabMain.style.paddingBottom = "0";
}

vocabWord?.addEventListener("pointerup", () =>
  showFooter("correct", "Chính xác. Tuyệt vời!")
);
vocabMeaning?.addEventListener("pointerup", () =>
  showFooter("wrong", "Sai mất rồi. Cố gắng chút nữa!")
);
vocabExample?.addEventListener("pointerup", () => showFooter("", ""));
h1?.addEventListener("pointerup", hideFooter);
// ===================== THEME DROPDOWN =====================
const themeToggle = document.getElementById("themeSelectToggle");
const themeDropdown = document.getElementById("themeDropdown");
const iconToggle = themeToggle.querySelector("i");

themeToggle.addEventListener("pointerup", () => {
  themeDropdown.style.display =
    themeDropdown.style.display === "flex" ? "none" : "flex";
});

// Click outside to close dropdown
document.addEventListener("pointerup", (e) => {
  if (!themeToggle.contains(e.target) && !themeDropdown.contains(e.target)) {
    themeDropdown.style.display = "none";
  }
});

// Change theme
themeDropdown.querySelectorAll("div").forEach((option) => {
  option.addEventListener("pointerup", () => {
    const theme = option.dataset.theme;
    const root = document.documentElement;

    const themes = {
      dark: {
        "--color-bg": "#292929",
        "--color-bg-panel": "#1e201e",
        "--color-text": "#ecdfcc",
        icon: "fa-moon",
      },
      light: {
        "--color-bg": "#fff8e5",
        "--color-bg-panel": "#fdf3d7",
        "--color-text": "#403d39",
        icon: "fa-sun",
      },
    };

    const selected = themes[theme];
    if (selected) {
      for (const prop in selected) {
        if (prop.startsWith("--")) {
          root.style.setProperty(prop, selected[prop]);
        }
      }
      iconToggle.className = `fa-solid ${selected.icon}`;
    }

    themeDropdown.style.display = "none";
  });
});

// Nhấn vào list
document.querySelectorAll(".lesson-menu > li.level-item").forEach((item) => {
  item.addEventListener("click", function (e) {
    document.querySelectorAll(".sub-item").forEach((subItem) => {
      subItem.classList.remove("active");
    });
    if (e.currentTarget !== e.target) {
      if (e.target.classList.contains("sub-item")) {
        e.target.classList.add("active");
      }
    } else {
      // Bỏ active tất cả các mục khác
      document
        .querySelectorAll(".lesson-menu > li.level-item")
        .forEach((li) => {
          if (li !== item) {
            li.classList.remove("active");
          }
        });

      // Toggle chính item được click
      item.classList.toggle("active");
    }
  });
});
