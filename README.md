# Ứng Dụng Học Từ Vựng

Ứng dụng web học từ vựng tiếng Anh với giao diện hiện đại và nhiều tính năng hữu ích.

## 🚀 Tính Năng

- **Học từ vựng theo bài**: Chia thành 60 bài học, mỗi bài 30 từ
- **Theo dõi tiến độ**: Hiển thị phần trăm đã học của từng bài
- **Chế độ theme**: Hỗ trợ giao diện sáng/tối
- **Quiz đa dạng**: Nhiều loại câu hỏi khác nhau
- **Responsive design**: Tương thích với mọi thiết bị

## 📁 Cấu Trúc Dự Án

```
word/
├── index.html              # Trang chính
├── css/
│   └── styles.css         # CSS styles
├── js/
│   ├── main.js            # Entry point
│   └── modules/           # Các module JavaScript
│       ├── DOM.js         # Quản lý DOM elements
│       ├── ThemeManager.js # Quản lý theme
│       ├── PanelManager.js # Quản lý panel
│       ├── FooterManager.js # Quản lý footer
│       ├── LessonManager.js # Quản lý lesson
│       ├── QuizManager.js  # Quản lý quiz
│       └── DataRenderer.js # Xử lý dữ liệu
├── words/
│   └── toeicWords.json    # Dữ liệu từ vựng
└── pages/
    └── data.html          # Trang xử lý dữ liệu
```

## 🛠️ Cài Đặt

1. Clone repository:

```bash
git clone <repository-url>
cd word
```

2. Mở file `index.html` trong trình duyệt hoặc sử dụng local server:

```bash
# Sử dụng Python
python -m http.server 8000

# Hoặc sử dụng Node.js
npx serve .
```

## 📖 Cách Sử Dụng

### Học Từ Vựng

1. Mở ứng dụng trong trình duyệt
2. Chọn bài học từ menu bên trái (1-60)
3. Xem danh sách từ vựng và tiến độ học
4. Sử dụng các nút "Ôn tập", "Học mới", "Bỏ qua"

### Cài Đặt

- Click vào icon cài đặt (⚙️) để mở panel cài đặt
- Chọn chế độ theme (sáng/tối)
- Các cài đặt sẽ được lưu tự động

### Xử Lý Dữ Liệu

1. Mở file `pages/data.html`
2. Chọn file txt chứa từ vựng (định dạng: word\tmeaning)
3. Click "Bắt đầu" để xử lý
4. File JSON sẽ được tải về tự động

## 🔧 Cấu Trúc Code

### Module System

Dự án sử dụng ES6 modules để tổ chức code:

- **DOM.js**: Quản lý tất cả DOM elements
- **ThemeManager.js**: Xử lý chuyển đổi theme
- **PanelManager.js**: Quản lý menu và settings panel
- **FooterManager.js**: Hiển thị thông báo và footer
- **LessonManager.js**: Tải và hiển thị dữ liệu lesson
- **QuizManager.js**: Tạo và quản lý các loại quiz
- **DataRenderer.js**: Xử lý và chuyển đổi dữ liệu

### Cách Thêm Tính Năng Mới

1. Tạo module mới trong thư mục `js/modules/`
2. Import và khởi tạo trong `main.js`
3. Tuân thủ cấu trúc class với methods `init()` và `bindEvents()`

### Ví dụ Module Mới:

```javascript
// js/modules/NewFeature.js
import { DOM } from "./DOM.js";

export class NewFeature {
  constructor() {
    this.init();
  }

  init() {
    this.bindEvents();
  }

  bindEvents() {
    // Gắn event listeners
  }
}
```

## 🎨 Tùy Chỉnh Giao Diện

### Thêm Theme Mới

1. Mở `js/modules/ThemeManager.js`
2. Thêm theme vào object `themes`
3. Cập nhật HTML trong `index.html`

### Thêm Loại Quiz Mới

1. Mở `js/modules/QuizManager.js`
2. Thêm template vào `createQuizTemplates()`
3. Implement logic xử lý trong class

## 📝 Ghi Chú

- Dữ liệu từ vựng được lưu trong `words/toeicWords.json`
- Tiến độ học được lưu trong localStorage
- Theme được lưu tự động khi thay đổi
- Tất cả modules đều có comment tiếng Việt để dễ hiểu

## 🤝 Đóng Góp

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.
