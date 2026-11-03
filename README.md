# ⚡ Smart Energy Management System (IE211)
### ระบบจัดการและวิเคราะห์การใช้พลังงานไฟฟ้าอัจฉริยะ (Flask Web Application)

[![Framework](https://img.shields.io/badge/Backend-Python%20Flask-emerald?style=flat-square&logo=flask)](app.py)
[![CI/CD Pipeline](https://img.shields.io/badge/CI%2FCD-Passing-emerald?style=flat-square&logo=githubactions)](./docs/CI_CD.md)
[![Architecture](https://img.shields.io/badge/Architecture-Clean%20Layered-blue?style=flat-square)](./docs/ARCHITECTURE.md)
[![Course](https://img.shields.io/badge/Course-IE211-orange?style=flat-square)](#)

---

## 📌 แนวคิดของโปรเจกต์ (Project Concept)

เว็บแอปพลิเคชัน Full-Stack ขับเคลื่อนด้วย **Python Flask Backend** สำหรับคำนวณและวิเคราะห์การใช้พลังงานไฟฟ้าของเครื่องใช้ไฟฟ้าภายในบ้าน อาคาร หรือสำนักงาน โดยผู้ใช้สามารถเพิ่ม/จัดการเครื่องใช้ไฟฟ้า ระบุค่ากำลังไฟฟ้า (Watts) จำนวนเครื่อง และชั่วโมงการใช้งานในแต่ละวัน

ระบบประมวลผลทั้งในระดับ Client-Side และ Server-Side REST API:
1. **คำนวณหน่วยไฟฟ้า (kWh หรือ หน่วยไฟฟ้า)** ทั้งแบบรายวันและรายเดือน
2. **ประมาณการค่าไฟฟ้าสุทธิ (บาท)** โดยคำนวณตามโครงสร้างอัตราค่าไฟฟ้าจริงของการไฟฟ้านครหลวง (กฟน.) และการไฟฟ้าส่วนภูมิภาค (กฟภ.) ครบถ้วนทั้งค่าไฟฐานแบบอัตราก้าวหน้า (Progressive Tiers), ค่าบริการรายเดือน, ค่าไฟฟ้าผันแปร (Ft) และภาษีมูลค่าเพิ่ม (VAT 7%)
3. **การแสดงผลเชิงภาพและกราฟิก (Interactive Data Visualizations)** ผ่านกราฟแสดงสัดส่วนการใช้พลังงานตามหมวดหมู่ (Donut Chart) และกราฟจัดอันดับเครื่องใช้ไฟฟ้าที่กินพลังงานสูงสุด (Bar Chart)
4. **ระบบจำลองลดค่าไฟอัจฉริยะ (What-If Simulation)** ช่วยคำนวณแบบเรียลไทม์ว่าหากลดการใช้งานเครื่องใช้ไฟฟ้าลงจะประหยัดเงินได้เท่าใดต่อเดือน/ต่อปี พร้อมแสดงปริมาณการลดการปล่อยก๊าซเรือนกระจก (kg CO₂e)

---

## 💻 วิธีการเปิดใช้งานด้วย Flask (How to Run)

### วิธีที่ 1: ดับเบิลคลิกไฟล์ `run.bat` (ง่ายที่สุดบน Windows)
1. ดับเบิลคลิกที่ไฟล์ `run.bat`
2. ระบบจะสั่งเปิดเซิร์ฟเวอร์ Flask อัตโนมัติ
3. เปิดเว็บเบราว์เซอร์แล้วไปที่: **`http://127.0.0.1:5000`**

### วิธีที่ 2: รันผ่าน Terminal / Command Prompt
```bash
# ติดตั้ง Library (ทำเพียงครั้งแรก)
pip install -r requirements.txt

# รันเซิร์ฟเวอร์ Flask
python app.py
```
เมื่อรันสำเร็จ หน้าต่าง Terminal จะแสดง:
```text
 * Running on http://127.0.0.1:5000
```
เปิดเบราว์เซอร์ไปที่ **`http://127.0.0.1:5000`** เพื่อเริ่มใช้งานได้ทันที

---

## 🔌 Backend REST API Endpoints (Flask)

| Method | Endpoint | รายละเอียด |
|---|---|---|
| `GET` | `/` | เรนเดอร์หน้า Dashboard หลัก (`templates/index.html`) |
| `GET` | `/api/health` | ตรวจสอบสถานะการทำงานของ Flask Server |
| `GET` | `/api/tariffs` | ดึงโครงสร้างอัตราค่าไฟฟ้ามาตรฐาน (กฟน./กฟภ.) |
| `POST` | `/api/calculate` | คำนวณค่าไฟฟ้าตามหน่วย kWh และอัตราก้าวหน้าบน Backend |

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

- 🏗️ **[ARCHITECTURE.md](./docs/ARCHITECTURE.md)**: สถาปัตยกรรม Clean Architecture, Backend REST API และสูตรคำนวณ
- 🤝 **[CONTRIBUTING.md](./docs/CONTRIBUTING.md)**: ระเบียบ Git Branching, Conventional Commits และ PR Checklist
- 🛠️ **[TOOLCHAIN.md](./docs/TOOLCHAIN.md)**: ชุดเครื่องมือ Python 3.12, Flask, Jinja2 และการตั้งค่า Environment
- 🔄 **[CI_CD.md](./docs/CI_CD.md)**: Automated Quality Gate บน GitHub Actions
