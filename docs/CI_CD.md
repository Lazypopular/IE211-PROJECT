# Continuous Integration & Delivery (CI/CD) Pipeline
## Smart Energy Management System (IE211)

เอกสารนี้ระบุการทำงานของระบบตรวจสอบคุณภาพโค้ดและการนำขึ้นเซิร์ฟเวอร์อัตโนมัติ (Automated Quality Gate & Deployment) ผ่าน GitHub Actions เพื่อรับประกันความถูกต้องของสูตรคำนวณและความพร้อมใช้งานของระบบ

---

## 1. ลำดับการตรวจสอบใน Pipeline (Pipeline Stages)

ทุกครั้งที่มีการเปิด Pull Request หรือ Push โค้ดเข้าสู่ Branch `main` และ `develop` ระบบ CI จะทำงานตามลำดับดังนี้:

```text
[Push / Pull Request]
       │
       ▼
 1. Checkout Code (ดึงโค้ดเวอร์ชันล่าสุด)
       │
       ▼
 2. Setup Python 3.12 & Install Dependencies (ติดตั้ง Flask และชุดไลบรารี)
       │
       ▼
 3. Validate File Integrity (ตรวจสอบความสมบูรณ์ของไฟล์ Template, Static และ Core Scripts)
       │
       ▼
 4. Run Backend Unit Tests (ทดสอบการทำงานของ Route, API และสูตรคำนวณค่าไฟ)
       │
       ▼
 5. Deploy to GitHub Pages (นำ Static Preview ขึ้นโฮสต์อัตโนมัติเฉพาะ Branch 'main')
       │
       ▼
[ ผ่านการตรวจสอบ 100% / Ready for Production ]
```

---

## 2. การทดสอบในระบบ (Automated Test Suite)

ระบบทำการทดสอบผ่าน `unittest` ใน `tests/test_backend.py` ครอบคลุม:
- การตอบสนองของเซิร์ฟเวอร์ Flask (`GET /` และ `GET /api/health`)
- การดึงโครงสร้างค่าไฟ กฟน./กฟภ. (`GET /api/tariffs`)
- ความถูกต้องของการคำนวณขั้นบันได (Progressive Tiers) และกรณีไม่มีอุปกรณ์ (0 kWh)
- การคำนวณค่าไฟแบบอัตราคงที่ / หอพัก (Flat Rate)
