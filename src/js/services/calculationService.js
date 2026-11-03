/**
 * Smart Energy Management System - Calculation Engine
 * เครื่องยนต์คำนวณพลังงานไฟฟ้า (kWh) และค่าไฟฟ้าตามอัตราโครงสร้างจริง
 * ออกแบบเป็น Pure Functions เพื่อความแม่นยำสูงและทดสอบได้ 100%
 */

// ตรวจสอบ environment สำหรับโหลด Config
let TARIFFS = null;
if (typeof require !== 'undefined') {
    try {
        const tariffsModule = require('../config/tariffs.js');
        TARIFFS = tariffsModule.TARIFF_CONFIG;
    } catch (e) {
        // Fallback if imported differently
    }
}

/**
 * คำนวณปริมาณพลังงานไฟฟ้า (kWh หรือ หน่วยไฟฟ้า) ของเครื่องใช้ไฟฟ้า
 * @param {number} watts กำลังไฟฟ้า (วัตต์)
 * @param {number} quantity จำนวนเครื่อง
 * @param {number} hoursPerDay ชั่วโมงใช้งานต่อวัน
 * @param {number} daysPerMonth จำนวนวันใช้งานต่อเดือน (ค่าเริ่มต้น 30 วัน)
 * @returns {{ dailyKwh: number, monthlyKwh: number, totalWatts: number }}
 */
export function calculateApplianceEnergy(watts, quantity = 1, hoursPerDay = 1, daysPerMonth = 30) {
    const safeWatts = Math.max(0, Number(watts) || 0);
    const safeQuantity = Math.max(1, Number(quantity) || 1);
    const safeHours = Math.max(0, Math.min(24, Number(hoursPerDay) || 0));
    const safeDays = Math.max(0, Math.min(31, Number(daysPerMonth) || 30));

    const totalWatts = safeWatts * safeQuantity;
    // สูตร: (Watts * ชั่วโมง) / 1000 = kWh
    const dailyKwh = (totalWatts * safeHours) / 1000;
    const monthlyKwh = dailyKwh * safeDays;

    return {
        dailyKwh: Number(dailyKwh.toFixed(3)),
        monthlyKwh: Number(monthlyKwh.toFixed(2)),
        totalWatts
    };
}

/**
 * คำนวณค่าไฟฟ้าแบบอัตราก้าวหน้า (Progressive Tariff) หรืออัตราคงที่
 * @param {number} totalMonthlyKwh หน่วยไฟฟ้ารวมต่อเดือน
 * @param {string} tariffType ประเภทอัตรา ('type1_2' | 'type1_1' | 'flat')
 * @param {number} customFt ค่า Ft (บาท/หน่วย)
 * @param {number} customServiceFee ค่าบริการรายเดือน (บาท)
 * @param {number} customVatRate อัตราภาษี (0.07)
 * @param {number} customFlatRate อัตราคงที่กรณีเลือกแบบ flat (บาท/หน่วย)
 * @returns {object} ผลลัพธ์การคำนวณอย่างละเอียด
 */
export function calculateProgressiveTariff(
    totalMonthlyKwh,
    tariffType = 'type1_2',
    customFt = 0.3972,
    customServiceFee = null,
    customVatRate = 0.07,
    customFlatRate = 7.00
) {
    const kwh = Math.max(0, Number(totalMonthlyKwh) || 0);
    const ftRate = Number(customFt) || 0;
    const vatRate = Number(customVatRate) || 0.07;

    let baseTariff = 0;
    let serviceFee = 0;
    let tierBreakdown = [];

    if (tariffType === 'flat') {
        // อัตราคงที่ / หอพัก
        const rate = Number(customFlatRate) || 7.00;
        baseTariff = kwh * rate;
        serviceFee = customServiceFee !== null ? Number(customServiceFee) : 0;
        tierBreakdown.push({
            label: `อัตราคงที่ (${rate.toFixed(2)} บาท/หน่วย)`,
            units: kwh,
            rate: rate,
            cost: baseTariff
        });
    } else if (tariffType === 'type1_1') {
        // อัตราประเภท 1.1 (ใช้ไฟฟ้าไม่เกิน 150 หน่วย)
        serviceFee = customServiceFee !== null ? Number(customServiceFee) : 8.19;
        const tiers = [
            { min: 0, max: 15, rate: 2.3488, label: '15 หน่วยแรก (1-15)' },
            { min: 15, max: 25, rate: 2.9882, label: '10 หน่วยต่อไป (16-25)' },
            { min: 25, max: 35, rate: 3.2405, label: '10 หน่วยต่อไป (26-35)' },
            { min: 35, max: 100, rate: 3.6237, label: '65 หน่วยต่อไป (36-100)' },
            { min: 100, max: 150, rate: 3.7171, label: '50 หน่วยต่อไป (101-150)' },
            { min: 150, max: 400, rate: 4.2218, label: '250 หน่วยต่อไป (151-400)' },
            { min: 400, max: Infinity, rate: 4.4217, label: 'เกินกว่า 400 หน่วย' }
        ];
        tierBreakdown = computeTiers(kwh, tiers);
        baseTariff = tierBreakdown.reduce((sum, item) => sum + item.cost, 0);
    } else {
        // อัตราประเภท 1.2 (มาตรฐาน - ใช้ไฟฟ้าเกิน 150 หน่วย)
        serviceFee = customServiceFee !== null ? Number(customServiceFee) : 24.62;
        const tiers = [
            { min: 0, max: 150, rate: 3.2484, label: '150 หน่วยแรก (1-150)' },
            { min: 150, max: 400, rate: 4.2218, label: '250 หน่วยต่อไป (151-400)' },
            { min: 400, max: Infinity, rate: 4.4217, label: 'เกินกว่า 400 หน่วยขึ้นไป' }
        ];
        tierBreakdown = computeTiers(kwh, tiers);
        baseTariff = tierBreakdown.reduce((sum, item) => sum + item.cost, 0);
    }

    // คำนวณค่า Ft (หน่วยไฟฟ้ารวม * ค่า Ft)
    const ftCost = kwh * ftRate;

    // ยอดรวมก่อนภาษี
    const subtotalBeforeVat = baseTariff + serviceFee + ftCost;

    // ภาษีมูลค่าเพิ่ม (VAT 7%)
    const vatCost = subtotalBeforeVat * vatRate;

    // ยอดรวมสุทธิ
    const totalBill = subtotalBeforeVat + vatCost;

    // อัตราเฉลี่ยต่อหน่วย (Effective Rate per kWh)
    const averageRatePerKwh = kwh > 0 ? totalBill / kwh : 0;

    return {
        totalKwh: Number(kwh.toFixed(2)),
        baseTariff: Number(baseTariff.toFixed(2)),
        serviceFee: Number(serviceFee.toFixed(2)),
        ftRate: Number(ftRate.toFixed(4)),
        ftCost: Number(ftCost.toFixed(2)),
        subtotalBeforeVat: Number(subtotalBeforeVat.toFixed(2)),
        vatCost: Number(vatCost.toFixed(2)),
        totalBill: Number(totalBill.toFixed(2)),
        averageRatePerKwh: Number(averageRatePerKwh.toFixed(2)),
        tierBreakdown
    };
}

/**
 * ฟังก์ชันช่วยคิดขั้นบันได
 */
function computeTiers(kwh, tiers) {
    const results = [];
    let remaining = kwh;

    for (let i = 0; i < tiers.length; i++) {
        if (remaining <= 0) break;
        const tier = tiers[i];
        const tierCapacity = tier.max === Infinity ? Infinity : (tier.max - tier.min);
        const unitsInTier = Math.min(remaining, tierCapacity);

        if (unitsInTier > 0) {
            const cost = unitsInTier * tier.rate;
            results.push({
                label: tier.label,
                units: Number(unitsInTier.toFixed(2)),
                rate: tier.rate,
                cost: Number(cost.toFixed(2))
            });
            remaining -= unitsInTier;
        }
    }
    return results;
}

/**
 * ประมาณการสัดส่วนค่าไฟของอุปกรณ์แต่ละชิ้นจากยอดรวม
 * @param {number} applianceMonthlyKwh หน่วยไฟฟ้าของอุปกรณ์ชิ้นนั้น
 * @param {number} totalMonthlyKwh หน่วยไฟฟ้ารวมทั้งบ้าน
 * @param {number} totalBill ยอดค่าไฟฟ้ารวมทั้งสิ้น
 * @returns {{ cost: number, percentage: number }}
 */
export function calculateApplianceCostShare(applianceMonthlyKwh, totalMonthlyKwh, totalBill) {
    if (!totalMonthlyKwh || totalMonthlyKwh <= 0) {
        return { cost: 0, percentage: 0 };
    }
    const ratio = applianceMonthlyKwh / totalMonthlyKwh;
    const cost = ratio * totalBill;
    const percentage = ratio * 100;

    return {
        cost: Number(cost.toFixed(2)),
        percentage: Number(percentage.toFixed(1))
    };
}

// สำหรับรองรับ CommonJS สำหรับรัน Unit Tests ใน CI/CD
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        calculateApplianceEnergy,
        calculateProgressiveTariff,
        calculateApplianceCostShare
    };
}
