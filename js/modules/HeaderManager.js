/**
 * Module quản lý event và logic cho header
 */
import { DOM } from "./DOM.js";

export class HeaderManager {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    if (!DOM.h1) return;
    DOM.h1.addEventListener("pointerup", () => {
      // Ví dụ: hiện thông báo khi nhấn vào tiêu đề
    });
  }
}
