"""
Unit Tests for Smart Energy Management System (IE211)
Tests Flask Backend, Routing, and Energy Calculation Engine
"""

import unittest
import json
from app import app, calculate_progressive_bill


class TestSmartEnergyApp(unittest.TestCase):
    def setUp(self):
        self.app = app.test_client()
        self.app.testing = True

    def test_health_check(self):
        """ทดสอบ Health check endpoint"""
        response = self.app.get('/api/health')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertEqual(data.get('status'), 'healthy')
        self.assertEqual(data.get('framework'), 'Flask')

    def test_index_route(self):
        """ทดสอบการเข้าถึงหน้าแรก"""
        response = self.app.get('/')
        self.assertEqual(response.status_code, 200)
        self.assertIn(b'Smart Energy', response.data)

    def test_tariffs_api(self):
        """ทดสอบการดึงข้อมูลอัตราค่าไฟฟ้า"""
        response = self.app.get('/api/tariffs')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertIn('type1_2', data)
        self.assertIn('type1_1', data)

    def test_zero_kwh_calculation(self):
        """ทดสอบการคำนวณกรณีไม่มีการใช้ไฟฟ้า (0 kWh)"""
        result = calculate_progressive_bill(0, 'type1_2', 0.3972, 24.62)
        self.assertEqual(result['totalKwh'], 0.0)
        self.assertEqual(result['baseTariff'], 0.0)
        self.assertEqual(result['ftCost'], 0.0)
        # ค่าบริการ 24.62 + VAT 7% (1.72) = 26.34
        self.assertAlmostEqual(result['totalBill'], 26.34, places=1)

    def test_calculate_api_progressive(self):
        """ทดสอบ API คำนวณค่าไฟแบบอัตราก้าวหน้าประเภท 1.2"""
        # 100 หน่วย: 100 * 3.2484 = 324.84 + บริการ 24.62 + Ft 39.72 = 389.18 + VAT 7% (27.24) = 416.42 บาท
        payload = {
            'totalKwh': 100,
            'tariffType': 'type1_2',
            'ftRate': 0.3972,
            'serviceFee': 24.62
        }
        response = self.app.post('/api/calculate',
                                 data=json.dumps(payload),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertAlmostEqual(data['totalBill'], 416.42, places=1)

    def test_calculate_api_flat_rate(self):
        """ทดสอบ API คำนวณค่าไฟแบบอัตราคงที่ / หอพัก (Flat Rate)"""
        # 100 หน่วย * 7 บาท = 700 บาท + VAT 7% (49 บาท) = 749 บาท
        payload = {
            'totalKwh': 100,
            'tariffType': 'flat',
            'ftRate': 0,
            'serviceFee': 0,
            'flatRate': 7.00
        }
        response = self.app.post('/api/calculate',
                                 data=json.dumps(payload),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = response.get_json()
        self.assertAlmostEqual(data['totalBill'], 749.00, places=1)


if __name__ == '__main__':
    unittest.main()
