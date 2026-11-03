/**
 * Smart Energy Management System - Analytics & Recommendations Service
 * ระบบวิเคราะห์การใช้พลังงาน ตรวจจับอุปกรณ์กินไฟสูง และให้คำแนะนำประหยัดพลังงานอัจฉริยะ
 */

import { calculateApplianceEnergy, calculateProgressiveTariff, calculateApplianceCostShare } from './calculationService.js';
import { APPLIANCE_CATEGORIES } from '../models/appliance.js';

/**
 * วิเคราะห์และสร้างชุดคำแนะนำการประหยัดพลังงาน (Energy Saving Insights)
 * @param {Array} appliances รายการอุปกรณ์
 * @param {object} tariffSettings การตั้งค่าค่าไฟ
 * @returns {object} ผลการวิเคราะห์
 */
export function generateEnergyInsights(appliances, tariffSettings) {
    if (!appliances || appliances.length === 0) {
        return {
            totalMonthlyKwh: 0,
            totalBill: 0,
            insights: [],
            topConsumers: [],
            energyGrade: 'N/A',
            categorySummary: {}
        };
    }

    // 1. คำนวณพลังงานของแต่ละชิ้น
    let totalMonthlyKwh = 0;
    const enrichedAppliances = appliances.map(app => {
        const energy = calculateApplianceEnergy(app.watts, app.quantity, app.hoursPerDay, app.daysPerMonth);
        totalMonthlyKwh += energy.monthlyKwh;
        return {
            ...app,
            dailyKwh: energy.dailyKwh,
            monthlyKwh: energy.monthlyKwh,
            totalWatts: energy.totalWatts
        };
    });

    // 2. คำนวณค่าไฟฟ้ารวม
    const tariffResult = calculateProgressiveTariff(
        totalMonthlyKwh,
        tariffSettings.type,
        tariffSettings.ftRate,
        tariffSettings.serviceFee,
        tariffSettings.vatRate,
        tariffSettings.flatRate
    );

    // 3. จัดอันดับอุปกรณ์ที่กินไฟสูงสุด (Top Energy Consumers)
    enrichedAppliances.sort((a, b) => b.monthlyKwh - a.monthlyKwh);
    const topConsumers = enrichedAppliances.slice(0, 5).map(app => {
        const share = calculateApplianceCostShare(app.monthlyKwh, totalMonthlyKwh, tariffResult.totalBill);
        return {
            ...app,
            cost: share.cost,
            percentage: share.percentage
        };
    });

    // 4. สรุปการใช้พลังงานแยกตามหมวดหมู่ (Category Aggregation)
    const categorySummary = {};
    Object.keys(APPLIANCE_CATEGORIES).forEach(catId => {
        categorySummary[catId] = {
            id: catId,
            name: APPLIANCE_CATEGORIES[catId].name,
            kwh: 0,
            cost: 0,
            percentage: 0,
            count: 0,
            color: APPLIANCE_CATEGORIES[catId].color
        };
    });

    enrichedAppliances.forEach(app => {
        const cat = app.category || 'other';
        if (!categorySummary[cat]) {
            categorySummary[cat] = {
                id: cat,
                name: 'อื่นๆ',
                kwh: 0,
                cost: 0,
                percentage: 0,
                count: 0,
                color: '#94a3b8'
            };
        }
        categorySummary[cat].kwh += app.monthlyKwh;
        categorySummary[cat].count += 1;
    });

    Object.keys(categorySummary).forEach(catId => {
        const cat = categorySummary[catId];
        const share = calculateApplianceCostShare(cat.kwh, totalMonthlyKwh, tariffResult.totalBill);
        cat.cost = share.cost;
        cat.percentage = share.percentage;
    });

    // 5. คำนวณเกรดประสิทธิภาพพลังงาน (Energy Efficiency Benchmark)
    let energyGrade = 'A';
    if (totalMonthlyKwh > 700) energyGrade = 'D';
    else if (totalMonthlyKwh > 450) energyGrade = 'C';
    else if (totalMonthlyKwh > 250) energyGrade = 'B';
    else energyGrade = 'A';

    // 6. สร้างคำแนะนำอัจฉริยะ (Smart Actionable Insights)
    const insights = [];

    // เช็คแอร์ (Air Conditioner check)
    const acAppliances = enrichedAppliances.filter(a => a.category === 'cooling' && a.watts >= 700);
    if (acAppliances.length > 0) {
        const topAc = acAppliances[0];
        // คำนวณว่าถ้าลดเวลาเปิดลง 1 ชั่วโมงต่อวัน จะประหยัดได้เท่าไร
        const savedKwh = ((topAc.watts * topAc.quantity * 1) / 1000) * (topAc.daysPerMonth || 30);
        const savedMoney = savedKwh * tariffResult.averageRatePerKwh;
        insights.push({
            type: 'ac_optimization',
            title: `เพิ่มอุณหภูมิแอร์หรือลดเวลาเปิด ${topAc.name}`,
            severity: 'high',
            icon: 'fa-snowflake',
            description: `หากลดเวลาใช้งานลงวันละ 1 ชม. หรือปรับอุณหภูมิเป็น 26°C จะช่วยประหยัดไฟได้ประมาณ ~${savedKwh.toFixed(1)} หน่วย/เดือน (คิดเป็นเงินประมาณ ${savedMoney.toFixed(0)} บาท/เดือน)`
        });
    }

    // เช็คเครื่องทำน้ำอุ่น (High Wattage Check)
    const heaterAppliances = enrichedAppliances.filter(a => a.watts >= 3000);
    if (heaterAppliances.length > 0) {
        insights.push({
            type: 'water_heater',
            title: 'การใช้งานเครื่องทำน้ำอุ่นกำลังไฟสูง',
            severity: 'medium',
            icon: 'fa-temperature-arrow-up',
            description: 'เครื่องทำน้ำอุ่นกินกำลังไฟสูงมาก (3,000-4,500W) ควรเปิดเฉพาะช่วงอาบจริง และปิดสวิตช์เบรกเกอร์เมื่อไม่ได้ใช้งานนานๆ'
        });
    }

    // เช็คหลอดไฟแสงสว่าง (Lighting Check)
    const lightingAppliances = enrichedAppliances.filter(a => a.category === 'lighting');
    const oldBulbs = lightingAppliances.filter(b => b.watts > 30);
    if (oldBulbs.length > 0) {
        insights.push({
            type: 'led_upgrade',
            title: 'เปลี่ยนหลอดไส้หรือฟลูออเรสเซนต์เป็น LED',
            severity: 'low',
            icon: 'fa-lightbulb',
            description: 'พบหลอดไฟที่กินกำลังวัตต์สูงกว่าปกติ การเปลี่ยนเป็นหลอด LED ขนาด 9W จะช่วยประหยัดไฟในหมวดแสงสว่างได้สูงสุดถึง 75%'
        });
    }

    // เช็ค Standby Power
    insights.push({
        type: 'standby_power',
        title: 'ระวัง Standby Power (ไฟแฝง)',
        severity: 'low',
        icon: 'fa-power-off',
        description: 'การเสียบปลั๊กทีวี กล่องเคเบิล และไมโครเวฟทิ้งไว้ กินไฟเฉลี่ย 5-10 วัตต์ตลอด 24 ชั่วโมง การใช้ปลั๊กพ่วงแบบมีสวิตช์ปิด-เปิดจะช่วยตัดไฟรั่วไหลได้'
    });

    return {
        totalMonthlyKwh: Number(totalMonthlyKwh.toFixed(2)),
        totalDailyKwh: Number((totalMonthlyKwh / 30).toFixed(2)),
        tariffResult,
        topConsumers,
        categorySummary,
        energyGrade,
        insights
    };
}
