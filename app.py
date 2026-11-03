"""
Smart Energy Management System (IE211)
Flask Web Application Backend & Server
ระบบจัดการและวิเคราะห์การใช้พลังงานไฟฟ้าอัจฉริยะ
"""

from flask import Flask, render_template, jsonify, request
import os

app = Flask(__name__, template_folder='templates', static_folder='static')
app.config['SECRET_KEY'] = 'smart-energy-ie211-secret-key'

# ฐานข้อมูลอัตราค่าไฟฟ้ามาตรฐาน (กฟน. และ กฟภ.)
TARIFF_CONFIG = {
    'type1_2': {
        'id': 'type1_2',
        'name': 'บ้านอยู่อาศัย (ใช้เกิน 150 หน่วย/เดือน)',
        'serviceFee': 24.62,
        'tiers': [
            {'min': 0, 'max': 150, 'rate': 3.2484, 'label': '150 หน่วยแรก (1-150)'},
            {'min': 150, 'max': 400, 'rate': 4.2218, 'label': '250 หน่วยต่อไป (151-400)'},
            {'min': 400, 'max': float('inf'), 'rate': 4.4217, 'label': 'เกินกว่า 400 หน่วยขึ้นไป'}
        ]
    },
    'type1_1': {
        'id': 'type1_1',
        'name': 'บ้านอยู่อาศัย (ใช้ไม่เกิน 150 หน่วย/เดือน)',
        'serviceFee': 8.19,
        'tiers': [
            {'min': 0, 'max': 15, 'rate': 2.3488, 'label': '15 หน่วยแรก (1-15)'},
            {'min': 15, 'max': 25, 'rate': 2.9882, 'label': '10 หน่วยต่อไป (16-25)'},
            {'min': 25, 'max': 35, 'rate': 3.2405, 'label': '10 หน่วยต่อไป (26-35)'},
            {'min': 35, 'max': 100, 'rate': 3.6237, 'label': '65 หน่วยต่อไป (36-100)'},
            {'min': 100, 'max': 150, 'rate': 3.7171, 'label': '50 หน่วยต่อไป (101-150)'},
            {'min': 150, 'max': 400, 'rate': 4.2218, 'label': '250 หน่วยต่อไป (151-400)'},
            {'min': 400, 'max': float('inf'), 'rate': 4.4217, 'label': 'เกินกว่า 400 หน่วยขึ้นไป'}
        ]
    },
    'defaultFt': 0.3972,
    'vatRate': 0.07
}


def calculate_progressive_bill(total_kwh, tariff_type='type1_2', ft_rate=0.3972, custom_service_fee=None, custom_flat_rate=7.0):
    """
    คำนวณค่าไฟฟ้าแบบอัตราก้าวหน้าตามโครงสร้างจริง
    """
    kwh = max(0.0, float(total_kwh))
    vat_rate = 0.07
    tier_breakdown = []
    base_tariff = 0.0

    if tariff_type == 'flat':
        rate = float(custom_flat_rate or 7.0)
        base_tariff = kwh * rate
        service_fee = float(custom_service_fee) if custom_service_fee is not None else 0.0
        tier_breakdown.append({
            'label': f'อัตราคงที่ ({rate:.2f} บาท/หน่วย)',
            'units': kwh,
            'rate': rate,
            'cost': round(base_tariff, 2)
        })
    else:
        cfg = TARIFF_CONFIG.get(tariff_type, TARIFF_CONFIG['type1_2'])
        service_fee = float(custom_service_fee) if custom_service_fee is not None else cfg['serviceFee']
        remaining = kwh

        for tier in cfg['tiers']:
            if remaining <= 0:
                break
            cap = float('inf') if tier['max'] == float('inf') else (tier['max'] - tier['min'])
            units = min(remaining, cap)
            if units > 0:
                cost = units * tier['rate']
                tier_breakdown.append({
                    'label': tier['label'],
                    'units': round(units, 2),
                    'rate': tier['rate'],
                    'cost': round(cost, 2)
                })
                base_tariff += cost
                remaining -= units

    ft_cost = kwh * float(ft_rate)
    subtotal = base_tariff + service_fee + ft_cost
    vat_cost = subtotal * vat_rate
    total_bill = subtotal + vat_cost
    avg_rate = (total_bill / kwh) if kwh > 0 else 0.0

    return {
        'totalKwh': round(kwh, 2),
        'baseTariff': round(base_tariff, 2),
        'serviceFee': round(service_fee, 2),
        'ftRate': round(ft_rate, 4),
        'ftCost': round(ft_cost, 2),
        'subtotalBeforeVat': round(subtotal, 2),
        'vatCost': round(vat_cost, 2),
        'totalBill': round(total_bill, 2),
        'averageRatePerKwh': round(avg_rate, 2),
        'tierBreakdown': tier_breakdown
    }


# ==================== ROUTES ====================

@app.route('/')
def index():
    """แสดงหน้า Dashboard หลัก"""
    return render_template('index.html')


@app.route('/api/health')
def health():
    """ตรวจสอบสถานะของ Server"""
    return jsonify({
        'status': 'healthy',
        'project': 'Smart Energy Management System (IE211)',
        'version': '2.0.0',
        'framework': 'Flask'
    })


@app.route('/api/tariffs')
def get_tariffs():
    """API ส่งข้อมูลโครงสร้างอัตราค่าไฟฟ้า"""
    return jsonify(TARIFF_CONFIG)


@app.route('/api/calculate', methods=['POST'])
def api_calculate():
    """API คำนวณค่าไฟฟ้าจากข้อมูลฝั่ง Client"""
    data = request.get_json() or {}
    total_kwh = data.get('totalKwh', 0)
    tariff_type = data.get('tariffType', 'type1_2')
    ft_rate = data.get('ftRate', 0.3972)
    service_fee = data.get('serviceFee')
    flat_rate = data.get('flatRate', 7.0)

    result = calculate_progressive_bill(total_kwh, tariff_type, ft_rate, service_fee, flat_rate)
    return jsonify(result)


if __name__ == '__main__':
    # รันเซิร์ฟเวอร์บนพอร์ต 5000 พร้อมเปิดโหมด Debug
    print("⚡ Starting Smart Energy Management System (Flask)...")
    print("👉 Open in browser: http://127.0.0.1:5000")
    app.run(host='0.0.0.0', port=5000, debug=True)
