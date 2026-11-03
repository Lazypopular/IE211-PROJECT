# Modern Web Toolchain & Project Configuration
## Smart Energy Management System (IE211)

เอกสารนี้อธิบายชุดเครื่องมือสำหรับนักพัฒนา (Modern Web Toolchain) สภาพแวดล้อมการทำงาน และขั้นตอนการติดตั้ง/ทดสอบระบบ

---

## 1. รายชื่อเครื่องมือหลัก (Core Tech Stack & Tools)

| เครื่องมือ | หน้าที่ | คำอธิบาย |
|---|---|---|
| **HTML5 & Vanilla ES6+** | Core Foundation | สถาปัตยกรรม Native ES Modules ประสิทธิภาพสูง ไม่ต้องรอ Bundler Compile โหลดได้ทันที |
| **Tailwind CSS (CDN / Modern)** | Styling Engine | Utility-first CSS framework สำหรับจัดหน้าและออกแบบ Modern Glassmorphism Dashboard |
| **Chart.js** | Data Visualization | Library แสดงผลกราฟิกเชิงโต้ตอบ (Interactive Donut & Bar Charts) รองรับ Responsive และ Tooltip |
| **FontAwesome / Lucide Icons** | Iconography | ชุดไอคอนมาตรฐานสำหรับหมวดหมู่อุปกรณ์และสถิติพลังงาน |
| **HTML5 LocalStorage** | Client Persistence | พื้นที่เก็บข้อมูลแบบ Local-First ไม่ต้องติดตั้งฐานข้อมูลแยก ปลอดภัยและรวดเร็ว |
| **VS Code + Live Server** | Development Server | รันเซิร์ฟเวอร์จำลองบนเครื่องคอมพิวเตอร์พร้อมฟังก์ชัน Hot Reloading อัตโนมัติ |
| **GitHub Actions** | CI/CD Quality Gate | ระบบตรวจสอบความถูกต้องของสคริปต์และการทดสอบคำนวณอัตโนมัติบน Cloud |

---

## 2. โครงสร้างและการตั้งค่าโปรเจกต์ (Project Configuration)

### 2.1 สถาปัตยกรรมแบบ Zero-Dependency (เปิดใช้งานได้ทันที)
โปรเจกต์ถูกออกแบบให้สามารถรันได้ทันทีโดยไม่ต้องผ่านขั้นตอน `npm install` ที่ซับซ้อน ทำให้ผู้ตรวจหรืออาจารย์ผู้สอนสามารถดับเบิลคลิกไฟล์ `index.html` หรือเปิดผ่าน VS Code เพื่อทดสอบระบบได้โดยไม่มีปัญหาเรื่อง Version Conflict ของ Node.js หรือ Environment

### 2.2 โครงสร้างไฟล์ในระดับ Source Code
```text
src/
├── css/style.css                  # Custom animations, card glows, scrollbars, print layout
└── js/
    ├── config/tariffs.js          # Thai MEA/PEA tariff rates and presets
    ├── models/appliance.js        # Appliance models, categories, default power ratings
    ├── services/
    │   ├── calculationService.js  # Pure mathematical calculation functions
    │   ├── storageService.js      # LocalStorage wrapper & Import/Export logic
    │   └── analyticsService.js    # Energy saving recommendations & insights
    ├── ui/
    │   ├── chartController.js     # Chart.js initialization & dynamic updates
    │   ├── modalController.js     # Modal states & form handlers
    │   └── uiController.js        # DOM renderers, metric cards, notifications
    └── app.js                     # Root controller & initialization
```

---

## 3. ขั้นตอนการเริ่มต้นใช้งาน (Quickstart Workflow)

### วิธีที่ 1: เปิดใช้งานผ่าน VS Code Live Server (แนะนำสำหรับนักพัฒนา)
1. ติดตั้ง Extension **Live Server** ใน VS Code (โดย Ritwick Dey)
2. เปิดโฟลเดอร์โปรเจกต์ `IE211` ใน VS Code
3. คลิกขวาที่ไฟล์ `index.html` แล้วเลือก **"Open with Live Server"**
4. เบราว์เซอร์จะเปิดที่ `http://127.0.0.1:5500/index.html` พร้อมใช้งาน

### วิธีที่ 2: เปิดใช้งานโดยตรงผ่านเว็บเบราว์เซอร์
1. ดับเบิลคลิกที่ไฟล์ `index.html`
2. ระบบจะโหลดและทำงานบนเบราว์เซอร์ (Google Chrome, Microsoft Edge, Firefox, Safari) ได้ทันที 100%

---

## 4. การจัดการแพ็กเกจและการต่อยอดในอนาคต (Extensibility)
หากต้องการต่อยอดโปรเจกต์ให้เป็น Fullstack (เช่น เพิ่ม Node.js, Express, MongoDB หรือ Next.js):
- สามารถติดตั้ง `package.json` เพิ่มเติมได้
- สามารถแยกส่วน Service Layer ใน `src/js/services/` ไปเป็น REST API บนฝั่ง Server ได้โดยไม่ต้องแก้ Logic การคำนวณ เนื่องจากระบบถูกแยกส่วนไว้อย่างชัดเจน
