document.addEventListener("DOMContentLoaded", function () {
  const menuBtn = document.querySelector(".menu-btn");
  const settingsBtn = document.querySelector(".settings-btn");
  const menuPanel = document.querySelector(".menu-panel");
  const settingsPanel = document.querySelector(".settings-panel");

  const footerBar = document.querySelector(".footer-bar");
  const footerStatus = document.querySelector(".footer-status");

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

  vocabWord?.addEventListener("click", () => {
    showFooter("correct", "Đáp án đúng");
  });

  vocabMeaning?.addEventListener("click", () => {
    showFooter("wrong", "Đáp án sai");
  });

  vocabExample?.addEventListener("click", () => {
    showFooter("", "");
  });

  function showFooter(type, statusText) {
    footerBar.classList.add("show");
    footerBar.classList.remove("correct", "wrong");

    if (type === "correct") {
      footerBar.classList.add("correct");
    } else if (type === "wrong") {
      footerBar.classList.add("wrong");
    }

    footerStatus.textContent = statusText;
  }
});
