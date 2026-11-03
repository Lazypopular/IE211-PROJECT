# Modern Web Toolchain & Project Configuration (Flask)
## Smart Energy Management System (IE211)

เอกสารนี้อธิบายชุดเครื่องมือสำหรับนักพัฒนา สภาพแวดล้อมการทำงานของ Python Flask และขั้นตอนการติดตั้ง/ทดสอบระบบ

---

## 1. รายชื่อเครื่องมือหลัก (Core Tech Stack & Tools)

| เครื่องมือ | หน้าที่ | คำอธิบาย |
|---|---|---|
| **Python 3.12+** | Backend Runtime | สภาพแวดล้อมการทำงานหลักของเซิร์ฟเวอร์ ประสิทธิภาพสูงและเสถียร |
| **Flask 3.x** | Web Framework | ไมโครเฟรมเวิร์กจัดการ Routing, REST API, และส่งต่อ Template ไปยัง Client |
| **Jinja2** | Template Engine | เรนเดอร์ HTML Template พร้อมเชื่อมโยง Static Assets อัตโนมัติ |
| **Tailwind CSS (CDN)** | Styling Engine | Utility-first CSS framework สำหรับจัดหน้าและออกแบบ Modern Glassmorphism Dashboard |
| **Chart.js** | Data Visualization | Library แสดงผลกราฟิกเชิงโต้ตอบ (Interactive Donut & Bar Charts) |
| **FontAwesome** | Iconography | ชุดไอคอนมาตรฐานสำหรับหมวดหมู่อุปกรณ์และสถิติพลังงาน |
| **Gunicorn** | Production WSGI | เซิร์ฟเวอร์รองรับการ Deploy สำหรับ Production สากล |

---

## 2. โครงสร้างโปรเจกต์ (Flask Directory Structure)

```text
IE211/
├── app.py                      # Flask Application Server (Entry Point)
├── requirements.txt            # Python Dependencies
├── run.bat                     # Windows Quickstart Batch Script
├── templates/
│   └── index.html              # Main Dashboard Template (Jinja2)
├── static/
│   ├── css/
│   │   └── style.css           # Glassmorphism Theme & Print Layout
│   └── js/
│       ├── config/tariffs.js   # Tariff configurations
│       ├── models/appliance.js # Appliance models & presets
│       ├── services/           # Core calculations & storage
│       ├── ui/                 # DOM, Chart.js & Modals
│       └── app.js              # Frontend Orchestrator
├── docs/                       # เอกสารสถาปัตยกรรมและคู่มือ
└── README.md
```

---

## 3. ขั้นตอนการเริ่มต้นใช้งาน (Quickstart Workflow)

### 3.1 การรันผ่านไฟล์สคริปต์ (แนะนำ)
ดับเบิลคลิกที่ไฟล์ **`run.bat`** จากนั้นเปิดเบราว์เซอร์ไปที่:
👉 **`http://127.0.0.1:5000`**

### 3.2 การรันด้วยตนเองผ่าน Terminal
1. ติดตั้ง Dependencies:
   ```bash
   pip install -r requirements.txt
   ```
2. รัน Flask Server:
   ```bash
   python app.py
   ```
3. เปิดเบราว์เซอร์ที่ `http://127.0.0.1:5000`
