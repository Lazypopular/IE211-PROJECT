# Software Architecture & System Design
## Smart Energy Management System (ระบบจัดการและวิเคราะห์การใช้พลังงานไฟฟ้าอัจฉริยะ)

เอกสารนี้ระบุมาตรฐานสถาปัตยกรรมซอฟต์แวร์ การคำนวณทางวิศวกรรมไฟฟ้า และการจัดระเบียบโครงสร้างระบบสำหรับโปรเจกต์ **Smart Energy Management System (IE211)** เพื่อให้ระบบมีความถูกต้อง แม่นยำ ขยายต่อได้ง่าย (Maintainable) และมีความปลอดภัยตามมาตรฐานสากล

---

## 1. ปรัชญาและแนวคิดการออกแบบ (Core Architectural Principles)

1. **Clean Layered Architecture (การแบ่งสถาปัตยกรรมแบบแยกส่วน):**
   - **Presentation / UI Layer:** จัดการแสดงผล DOM, การตอบสนองผู้ใช้, และการวาดกราฟิก (Dashboard, Modals, Toasts)
   - **Service / Business Logic Layer:** ศูนย์กลางประมวลผลการคำนวณหน่วยไฟฟ้า (kWh), การคิดอัตราค่าไฟแบบก้าวหน้า (Progressive Tariff Tiers), และการวิเคราะห์แนะนำการประหยัดพลังงาน
   - **Data & Configuration Layer:** การจัดการโครงสร้างข้อมูลเครื่องใช้ไฟฟ้า (Appliance Schema), ฐานข้อมูลอัตราค่าไฟของการไฟฟ้านครหลวง/ส่วนภูมิภาค (Tariff Rates), และการจัดเก็บข้อมูลแบบ Local-First
2. **Deterministic Calculation Engine (เครื่องยนต์คำนวณที่มีความแม่นยำสูง):**
   - โค้ดส่วนคำนวณทางคณิตศาสตร์ต้องเป็น **Pure Functions** ไม่ขึ้นกับ DOM หรือ Side Effects เพื่อให้ทดสอบความถูกต้อง (Unit Testing) ได้ 100%
   - คิดคำนวณตามมาตรฐานโครงสร้างค่าไฟฟ้าฐานของการไฟฟ้านครหลวง (กฟน.) และการไฟฟ้าส่วนภูมิภาค (กฟภ.) รวมค่า Ft และภาษีมูลค่าเพิ่ม (VAT 7%)
3. **Client-First Privacy & Zero Server Dependency:**
   - ข้อมูลการใช้ไฟฟ้าของผู้ใช้เป็นข้อมูลส่วนบุคคล ระบบจึงถูกออกแบบให้ทำงานแบบ **Client-side First** ข้อมูลถูกบันทึกลงบน `localStorage` ของเบราว์เซอร์ผู้ใช้โดยตรง ไม่มีการส่งข้อมูลส่วนบุคคลออกนอกเครื่อง
   - มีระบบ Export / Import ในรูปแบบ JSON และ CSV เพื่อให้ผู้ใช้สำรองข้อมูลหรือนำไปวิเคราะห์ต่อในโปรแกรม Excel ได้อย่างอิสระ

---

## 2. โมเดลการคำนวณทางวิศวกรรมไฟฟ้า (Mathematical & Tariff Models)

### 2.1 สูตรคำนวณหน่วยการใช้ไฟฟ้า (Energy Consumption Formula)
การคำนวณปริมาณพลังงานไฟฟ้าที่ใช้ มีหน่วยเป็น **กิโลวัตต์-ชั่วโมง (kWh หรือ หน่วยไฟฟ้า)**:

$$
\text{พลังงานไฟฟ้าต่อวัน (kWh)} = \frac{\text{กำลังไฟฟ้า (Watts)} \times \text{จำนวนเครื่อง} \times \text{ชั่วโมงใช้งานต่อวัน}}{1000}
$$

$$
\text{พลังงานไฟฟ้าต่อเดือน (kWh)} = \text{พลังงานไฟฟ้าต่อวัน (kWh)} \times \text{จำนวนวันใช้งานต่อเดือน}
$$

### 2.2 โครงสร้างอัตราค่าไฟฟ้า (Electricity Tariff Structure)
ระบบรองรับอัตราค่าไฟฟ้า 3 รูปแบบหลัก:

1. **อัตราประเภทบ้านอยู่อาศัยเกิน 150 หน่วย/เดือน (ประเภท 1.2 - อัตราก้าวหน้า):**
   | ขั้นหน่วยการใช้ไฟฟ้า (kWh) | อัตราค่าไฟฟ้าต่อหน่วย (บาท) |
   |---|---|
   | 150 หน่วยแรก (1 – 150) | 3.2484 |
   | 250 หน่วยต่อไป (151 – 400) | 4.2218 |
   | เกินกว่า 400 หน่วยขึ้นไป (401 เป็นต้นไป) | 4.4217 |
   - **ค่าบริการรายเดือน (Service Fee):** 24.62 บาท/เดือน

2. **อัตราประเภทบ้านอยู่อาศัยไม่เกิน 150 หน่วย/เดือน (ประเภท 1.1 - อัตราก้าวหน้า):**
   | ขั้นหน่วยการใช้ไฟฟ้า (kWh) | อัตราค่าไฟฟ้าต่อหน่วย (บาท) |
   |---|---|
   | 15 หน่วยแรก (1 – 15) | 2.3488 |
   | 10 หน่วยต่อไป (16 – 25) | 2.9882 |
   | 10 หน่วยต่อไป (26 – 35) | 3.2405 |
   | 65 หน่วยต่อไป (36 – 100) | 3.6237 |
   | 50 หน่วยต่อไป (101 – 150) | 3.7171 |
   | 250 หน่วยต่อไป (151 – 400) | 4.2218 |
   | เกินกว่า 400 หน่วยขึ้นไป | 4.4217 |
   - **ค่าบริการรายเดือน (Service Fee):** 8.19 บาท/เดือน

3. **อัตราคงที่ / อัตราหอพัก (Flat Rate / Custom Rate):**
   - คำนวณตามสูตร: $\text{ค่าไฟฐาน} = \text{หน่วยไฟฟ้ารวม} \times \text{อัตราต่อหน่วยที่กำหนด (เช่น 7-8 บาท)}$

### 2.3 การคำนวณยอดเงินสุทธิ (Total Bill Calculation)
$$
\text{ค่าไฟฐาน} = \text{ผลรวมค่าไฟจากการคำนวณตามขั้นบันได (Progressive Tiers)}
$$

$$
\text{ค่าไฟฟ้าผันแปร (Ft)} = \text{หน่วยไฟฟ้ารวม (kWh)} \times \text{อัตราค่า Ft (บาท/หน่วย)}
$$

$$
\text{ยอดรวมก่อนภาษี} = \text{ค่าไฟฐาน} + \text{ค่าบริการรายเดือน} + \text{ค่า Ft}
$$

$$
\text{ภาษีมูลค่าเพิ่ม (VAT 7\%)} = \text{ยอดรวมก่อนภาษี} \times 0.07
$$

$$
\text{ค่าไฟฟ้าสุทธิทั้งสิ้น (Total Electricity Bill)} = \text{ยอดรวมก่อนภาษี} + \text{ภาษีมูลค่าเพิ่ม (VAT)}
$$

---

## 3. โครงสร้างโฟลเดอร์ของระบบ (Project Directory Structure)

โครงสร้างโฟลเดอร์ถูกจัดวางตามหลักการ Separation of Concerns:

```text
IE211/
├── .github/
│   └── workflows/
│       └── ci.yml                 # Automated Quality Gate & CI/CD Pipeline
├── docs/
│   ├── ARCHITECTURE.md            # สถาปัตยกรรมระบบและสูตรการคำนวณ
│   ├── CONTRIBUTING.md            # ข้อกำหนด Git Workflow และมาตรฐานโค้ด
│   ├── TOOLCHAIN.md               # รายละเอียดเครื่องมือและ Tech Stack
│   └── CI_CD.md                   # การทำงานของระบบ Continuous Integration
├── src/
│   ├── css/
│   │   └── style.css              # Custom Styles & Glassmorphism Theme
│   └── js/
│       ├── config/
│       │   └── tariffs.js         # ตารางอัตราค่าไฟ กฟน./กฟภ. และค่าเริ่มต้น
│       ├── models/
│       │   └── appliance.js       # Data Model & Preset อุปกรณ์ไฟฟ้าทั่วไป
│       ├── services/
│       │   ├── calculationService.js # Core Engine คำนวณ kWh และค่าไฟฟ้า
│       │   ├── storageService.js     # บันทึก LocalStorage และ Import/Export
│       │   └── analyticsService.js   # วิเคราะห์จุดเสี่ยงและให้คำแนะนำประหยัดไฟ
│       ├── ui/
│       │   ├── chartController.js    # จัดการ Chart.js (Donut, Bar, Breakdown)
│       │   ├── modalController.js    # จัดการ Dialog เพิ่ม/แก้ไข และ Settings
│       │   └── uiController.js       # เรนเดอร์การ์ด รายการอุปกรณ์ และ Toast Alert
│       └── app.js                 # Application Entry Point & Event Wiring
├── index.html                     # Main Dashboard Application
└── README.md                      # ภาพรวมโปรเจกต์และวิธีเริ่มต้นใช้งาน
```

---

## 4. ความปลอดภัยและความถูกต้องของข้อมูล (Data Validation & Sanity Checks)

1. **Input Sanitization & Validation:**
   - ค่ากำลังไฟฟ้า (Watts) ต้องเป็นตัวเลขบวก ($> 0$ และ $\le 50,000\text{ W}$)
   - ชั่วโมงใช้งานต่อวัน ต้องอยู่ระหว่าง $0 < \text{hours} \le 24$
   - จำนวนวันต่อเดือน ต้องอยู่ระหว่าง $1 \le \text{days} \le 31$
   - ป้องกันการเกิดค่า `NaN`, `Infinity`, หรือข้อความแปลกปลอมที่อาจทำให้การคำนวณผิดพลาด
2. **XSS Protection:**
   - การนำข้อมูลที่ผู้ใช้กรอกมาแสดงบนหน้าเว็บ ต้องผ่านการ Escape อักขระพิเศษ (`&`, `<`, `>`, `"`, `'`) เสมอ ป้องกันการโจมตีแบบ Cross-Site Scripting
3. **Data Migration & Schema Resilience:**
   - หากมีการอัปเดตเวอร์ชันของ Schema ข้อมูลในอนาคต `storageService` มีฟังก์ชัน Reconcile ค่า Default อัตโนมัติ ป้องกันข้อมูลเก่าของผู้ใช้เสียหาย
