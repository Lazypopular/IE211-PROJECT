# Contributing Guidelines & Engineering Workflow
## Smart Energy Management System (IE211)

คู่มือนี้กำหนดระเบียบการทำงานร่วมกัน การจัดการเวอร์ชัน (Version Control) และมาตรฐานการตรวจสอบคุณภาพโค้ดก่อนนำเข้าสู่ระบบจริงสำหรับทีมพัฒนา

---

## 1. การแบ่งสายงาน Branch (Branching Strategy)

โปรเจกต์ใช้โครงสร้าง Branch แยกสภาพแวดล้อมชัดเจน:

* **`main` (Production Branch):**
  - ตัวแทนของระบบเวอร์ชันสมบูรณ์ พร้อมส่งงานหรือขึ้นโฮสต์จริง (Production / GitHub Pages)
  - ห้าม Push โค้ดตรงเข้า `main` ทุกกรณี
  - การเปลี่ยนแปลงต้องผ่าน Pull Request จาก `develop` หรือ Hotfix ที่ผ่านการทดสอบแล้วเท่านั้น
* **`develop` (Integration / Staging Branch):**
  - ตัวแทนของโค้ดที่อยู่ระหว่างการพัฒนาและทดสอบความเข้ากันได้
  - ใช้สำหรับรวมฟีเจอร์ใหม่ก่อนปล่อย Release
* **Feature Branches (`feat/<feature-name>`):**
  - แตกกิ่งออกมาจาก `develop` เพื่อพัฒนาแต่ละฟังก์ชัน
  - ตัวอย่าง: `feat/tou-tariff-support`, `feat/export-pdf-report`, `feat/energy-saving-simulation`
* **Fix Branches (`fix/<bug-name>`):**
  - ใช้สำหรับแก้บั๊กหรือข้อผิดพลาด
  - ตัวอย่าง: `fix/progressive-tier-calculation`, `fix/chart-mobile-responsive`

---

## 2. ข้อกำหนดการเขียน Commit (Conventional Commits)

เพื่อให้ประวัติการพัฒนาอ่านเข้าใจง่าย มีแบบแผน และตรวจสอบย้อนหลังได้ ให้ใช้รูปแบบ:

`<type>(<scope>): <short description>`

### Types ที่อนุญาต:
* `feat`: เพิ่มฟีเจอร์ใหม่ (เช่น ระบบจำลองการประหยัดไฟ, กราฟแสดงสัดส่วนใหม่)
* `fix`: แก้ไขบั๊กหรือสูตรคำนวณที่ผิดพลาด
* `refactor`: ปรับปรุงโครงสร้างโค้ดโดยไม่เปลี่ยนผลลัพธ์การทำงาน
* `perf`: ปรับปรุงประสิทธิภาพ (เช่น ลดการ Re-render กราฟ, เพิ่มความเร็วโหลด)
* `style`: ปรับแต่งหน้าตา ความสวยงาม CSS/UI
* `docs`: เพิ่มหรือแก้ไขเอกสารประกอบการพัฒนา
* `test`: เพิ่มหรือปรับปรุงระบบ Unit Test ของ Calculation Engine
* `chore`: งานบำรุงรักษาทั่วไป, อัปเดตไฟล์ Config, แก้ไข CI workflow

### ตัวอย่าง:
```text
feat(calculator): implement progressive electricity tariff tier calculation
feat(ui): add category breakdown donut chart with Chart.js
fix(validation): prevent negative wattage and hour inputs in modal
perf(charts): optimize chart redraw lifecycle on appliance updates
docs(readme): add system calculation formula and user guide
chore(ci): configure automated lint and test quality gate
```

---

## 3. มาตรฐานการเขียนโค้ดและคุณภาพ (Code Quality Standards)

1. **JavaScript Standards (ES6+):**
   - ใช้ฟังก์ชันและไวยากรณ์สมัยใหม่ (`const`, `let`, Arrow functions, Destructuring, ES Modules)
   - ฟังก์ชันคำนวณทางคณิตศาสตร์ต้องเขียนเป็น **Pure Functions** (ไม่มีการแก้ไขตัวแปร Global หรือแตะต้อง DOM ภายในฟังก์ชัน)
   - มีการใส่ JSDoc อธิบายประเภทพารามิเตอร์และค่าที่ส่งกลับอย่างชัดเจน
2. **CSS / UI Standards:**
   - ใช้หลักการ Responsive Design (Mobile-First / Desktop-Friendly) แสดงผลได้สมบูรณ์ในทุกขนาดหน้าจอ
   - รักษา Palette สีในโทนระบบพลังงานสะอาด (Clean Energy Palette: Emerald, Cyan, Slate, Dark Blue)
   - มีการระบุคลาสที่ชัดเจน หลีกเลี่ยง Inline Styles ที่ไม่จำเป็น
3. **Validation & Defensive Programming:**
   - ข้อมูลนำเข้าจากฟอร์มทุกตัวต้องผ่านการ Sanitize และ Validate เสมอ
   - มี Fallback State สำหรับกรณีที่ผู้ใช้ยังไม่ได้เพิ่มอุปกรณ์ หรือลบอุปกรณ์จนหมด

---

## 4. Pull Request Checklist (รายการตรวจสอบก่อน Merge โค้ด)

ก่อนทำการเปิดหรืออนุมัติ Pull Request ให้ตรวจสอบตามรายการด้านล่างนี้:

- [ ] **Calculation Verification:** ทดสอบการคำนวณหน่วยไฟฟ้า (kWh) และค่าไฟตามอัตราขั้นบันไดว่าตรงตามสูตรของการไฟฟ้านครหลวง/ภูมิภาค
- [ ] **Sanity Check:** มีการตรวจสอบตัวเลข (Input Validation) ป้องกันค่าติดลบ หรือค่าว่าง
- [ ] **UI Responsiveness:** ทดสอบหน้าเว็บทั้งบนหน้าจอ Desktop และ Mobile (ไม่มีการตกขอบหรือปุ่มซ้อนทับกัน)
- [ ] **Clean Console:** ไม่พบ Error สีแดงหรือ Unhandled Exception ในหน้าต่าง Developer Console ของเบราว์เซอร์
- [ ] **Persistence Test:** ทดสอบว่าเมื่อกดเพิ่ม/แก้ไข/ลบอุปกรณ์ แล้วรีเฟรชหน้าเว็บ ข้อมูลใน `localStorage` ยังคงถูกต้อง
- [ ] **Documentation:** มีการบันทึกหรืออัปเดตไฟล์ Documentation (`ARCHITECTURE.md`, `README.md`) หากมีการเพิ่มสูตรหรือฟีเจอร์ใหม่
