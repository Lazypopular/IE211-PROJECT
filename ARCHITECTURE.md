# Project Documentation Index
## Smart Energy Management System (ระบบจัดการและวิเคราะห์การใช้พลังงานไฟฟ้าอัจฉริยะ)

เอกสารชุดนี้เป็นโครงสร้างและมาตรฐานการพัฒนาสำหรับโปรเจกต์ **Smart Energy Management System (IE211)** ที่ถอดแบบแนวคิดการทำงานระดับ Enterprise (Clean Architecture, Git Workflow, Calculation Security, Automated CI/CD Pipeline)

---

## สารบัญเอกสาร (Documentation Index)

1. [ARCHITECTURE.md (สถาปัตยกรรมระบบและสูตรการคำนวณ)](./docs/ARCHITECTURE.md)
   - สถาปัตยกรรม Clean Layered Architecture (UI, Service, Models)
   - สูตรการคำนวณหน่วยไฟฟ้า (kWh) และโครงสร้างอัตราค่าไฟฟ้าขั้นบันได (MEA/PEA Tariff Tiers)
   - โครงสร้างโฟลเดอร์ของโปรเจกต์
   - มาตรฐานความปลอดภัยของข้อมูล และการจัดเก็บข้อมูลแบบ Client-First (localStorage)

2. [CONTRIBUTING.md (คู่มือการทำงานร่วมกันและ Git Workflow)](./docs/CONTRIBUTING.md)
   - โมเดล Branching (`main`, `develop`, `feat/*`, `fix/*`)
   - มาตรฐาน Conventional Commits
   - กฎการเขียนโค้ดและมาตรฐานการจัดหน้า
   - Pull Request Checklist ก่อนรวมโค้ดเข้าสู่ระบบจริง

3. [TOOLCHAIN.md (ชุดเครื่องมือและการตั้งค่าโปรเจกต์)](./docs/TOOLCHAIN.md)
   - รายละเอียดเครื่องมือที่ใช้ (HTML5, ES6 Modules, Tailwind CSS, Chart.js)
   - สถาปัตยกรรม Zero-Dependency
   - ขั้นตอนการเริ่มต้นใช้งานและรันบนคอมพิวเตอร์ (VS Code Live Server)

4. [CI_CD.md (ระบบตรวจสอบคุณภาพโค้ดอัตโนมัติ)](./docs/CI_CD.md)
   - ระบบ Automated Quality Gate บน GitHub Actions
   - ขั้นตอนการตรวจสอบและ Deploy ขึ้น GitHub Pages อัตโนมัติ
