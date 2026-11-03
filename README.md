# ⚡ Smart Energy Management System (IE211)
### ระบบจัดการและวิเคราะห์การใช้พลังงานไฟฟ้าอัจฉริยะ

[![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-Passing-emerald?style=flat-square&logo=githubactions)](./docs/CI_CD.md)
[![Architecture](https://img.shields.io/badge/Architecture-Clean%20Layered-blue?style=flat-square)](./docs/ARCHITECTURE.md)
[![License](https://img.shields.io/badge/License-MIT-lightgrey?style=flat-square)](LICENSE)
[![Subject](https://img.shields.io/badge/Course-IE211-orange?style=flat-square)](#)

---

## 📌 แนวคิดของโปรเจกต์ (Project Concept)

เว็บแอปพลิเคชันสำหรับคำนวณและวิเคราะห์การใช้พลังงานไฟฟ้าของเครื่องใช้ไฟฟ้าภายในบ้าน อาคาร หรือสำนักงาน โดยผู้ใช้สามารถเพิ่ม/จัดการเครื่องใช้ไฟฟ้า ระบุค่ากำลังไฟฟ้า (Watts) จำนวนเครื่อง และชั่วโมงการใช้งานในแต่ละวัน 

ระบบจะทำหน้าที่คำนวณ:
1. **ปริมาณพลังงานไฟฟ้า (kWh หรือ หน่วยไฟฟ้า)** ทั้งแบบรายวันและรายเดือน
2. **ประมาณการค่าไฟฟ้าสุทธิ (บาท)** โดยคำนวณตามโครงสร้างอัตราค่าไฟฟ้าจริงของการไฟฟ้านครหลวง (กฟน.) และการไฟฟ้าส่วนภูมิภาค (กฟภ.) ครบถ้วนทั้งค่าไฟฐานแบบอัตราก้าวหน้า (Progressive Tiers), ค่าบริการรายเดือน, ค่าไฟฟ้าผันแปร (Ft) และภาษีมูลค่าเพิ่ม (VAT 7%)
3. **การแสดงผลเชิงภาพและกราฟิก (Interactive Data Visualizations)** ผ่านกราฟแสดงสัดส่วนการใช้พลังงานตามหมวดหมู่ (Donut Chart) และกราฟจัดอันดับเครื่องใช้ไฟฟ้าที่กินพลังงานสูงสุด (Bar Chart)
4. **ระบบให้คำแนะนำอัจฉริยะ (Smart Energy Saving Insights & Simulation)** ช่วยจำลองสถานการณ์ (What-If Analysis) ว่าหากปรับลดการใช้งานเครื่องใช้ไฟฟ้าลงจะประหยัดเงินได้เท่าใด เพื่อช่วยผู้ใช้วางแผนลดภาระค่าใช้จ่ายและใช้พลังงานอย่างมีประสิทธิภาพ

---

## 🚀 ฟังก์ชันหลักของระบบ (Key Features)

- ⚡ **Real-time Energy & Cost Calculation:** อัปเดตหน่วยไฟฟ้าและค่าไฟแบบเรียลไทม์ทันทีที่มีการเพิ่มหรือแก้ไขเครื่องใช้ไฟฟ้า
- 📊 **Interactive Analytics Dashboard:** แสดงสถิติภาพรวม พลังงานต่อวัน/เดือน, ค่าไฟโดยประมาณ, และอุปกรณ์ที่กินไฟสูงสุด
- 🏷️ **Pre-configured Appliance Presets:** มีปุ่มลัดเลือกเครื่องใช้ไฟฟ้าทั่วไปพร้อมค่าวัตต์มาตรฐาน (เช่น แอร์ Inverter, ตู้เย็น, เครื่องทำน้ำอุ่น, พัดลม, ทีวี, คอมพิวเตอร์) เพื่อความสะดวกรวดเร็ว
- 📈 **Visual Breakdown Charts:** กราฟวงกลมและกราฟแท่งเปรียบเทียบสัดส่วนค่าไฟและหน่วยไฟแต่ละหมวดหมู่
- 💡 **Smart Energy Saving Recommendations:** ระบบตรวจจับอุปกรณ์ที่ใช้ไฟเกินมาตรฐาน และเสนอแนะแนวทางประหยัดพลังงาน
- 🎛️ **Customizable Tariff Settings:** ปรับแต่งประเภทอัตราค่าไฟฟ้า (อัตราก้าวหน้า >150 หน่วย, <150 หน่วย หรือ อัตราคงที่/หอพัก), ค่า Ft และค่าบริการรายเดือนได้ตามต้องการ
- 💾 **Local-First Persistence & Export:** บันทึกข้อมูลอัตโนมัติในเบราว์เซอร์ พร้อมปุ่ม Export เป็น JSON/CSV และรองรับการสั่งพิมพ์ (Print-friendly Report)

---

## 📐 สูตรการคำนวณทางวิศวกรรม (Engineering Calculations)

$$
\text{พลังงานไฟฟ้า (kWh)} = \frac{\text{กำลังไฟฟ้า (Watts)} \times \text{จำนวนเครื่อง} \times \text{ชั่วโมง/วัน} \times \text{วัน/เดือน}}{1000}
$$

$$
\text{ค่าไฟฟ้ารวมสุทธิ} = (\text{ค่าไฟฐานขั้นบันได} + \text{ค่าบริการรายเดือน} + (\text{หน่วยไฟฟ้ารวม} \times \text{ค่า Ft})) \times 1.07
$$

---

## 📚 เอกสารมาตรฐานการพัฒนา (Documentation Index)

โปรเจกต์นี้ได้รับการออกแบบตามมาตรฐานวิศวกรรมซอฟต์แวร์ระดับ Enterprise:

- 🏗️ **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)**: สถาปัตยกรรม Clean Layered Architecture, สูตรคำนวณ และความปลอดภัยของข้อมูล
- 🤝 **[CONTRIBUTING.md](./docs/CONTRIBUTING.md)**: ระเบียบ Git Branching, Conventional Commits และ Pull Request Checklist
- 🛠️ **[TOOLCHAIN.md](./docs/TOOLCHAIN.md)**: ชุดเครื่องมือ Modern Web Stack, Zero-Dependency และการรันด้วย VS Code Live Server
- 🔄 **[CI_CD.md](./docs/CI_CD.md)**: Automated Quality Gate บน GitHub Actions พร้อมการตรวจสอบ Unit Test

---

## 💻 วิธีการเปิดใช้งาน (Quickstart)

### วิธีที่ 1: ดับเบิลคลิกเปิดไฟล์
ดับเบิลคลิกที่ไฟล์ `index.html` เพื่อเปิดใช้งานบน Google Chrome, Microsoft Edge, หรือเบราว์เซอร์ใดก็ได้ทันที (ไม่ต้องติดตั้งโปรแกรมเสริม)

### วิธีที่ 2: รันผ่าน VS Code Live Server
1. เปิดโฟลเดอร์นี้ใน **VS Code**
2. คลิกขวาที่ไฟล์ `index.html` แล้วเลือก **"Open with Live Server"**
3. ระบบจะเปิดหน้าเว็บที่ `http://127.0.0.1:5500/index.html`

---

## 👥 ข้อมูลโครงงาน
- **วิชา:** IE211
- **ชื่อโปรเจกต์:** Smart Energy Management System (ระบบจัดการและวิเคราะห์การใช้พลังงานไฟฟ้าอัจฉริยะ)
