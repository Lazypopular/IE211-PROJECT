/**
 * Smart Energy Management System - Modal Controller
 * จัดการหน้าต่าง Pop-up Modal (เพิ่ม/แก้ไขอุปกรณ์, ตั้งค่าอัตราค่าไฟ, เครื่องมือจำลองการประหยัดไฟ)
 */

import { APPLIANCE_PRESETS, APPLIANCE_CATEGORIES } from '../models/appliance.js';
import { TARIFF_CONFIG } from '../config/tariffs.js';

let onSaveApplianceCallback = null;
let onSaveTariffCallback = null;
let editingApplianceId = null;

/**
 * กำหนด Callback เมื่อมีการบันทึกข้อมูล
 */
export function initModalListeners({ onSaveAppliance, onSaveTariff }) {
    onSaveApplianceCallback = onSaveAppliance;
    onSaveTariffCallback = onSaveTariff;

    populatePresetDropdown();
    setupPresetChangeListener();
}

/**
 * เติมรายการเครื่องใช้ไฟฟ้าใน Preset Dropdown
 */
function populatePresetDropdown() {
    const select = document.getElementById('presetSelect');
    if (!select) return;

    select.innerHTML = '<option value="">-- เลือกจากแม่แบบสำเร็จรูป (กรอกค่าอัตโนมัติ) --</option>';
    APPLIANCE_PRESETS.forEach((preset, index) => {
        const opt = document.createElement('option');
        opt.value = index;
        opt.textContent = `${preset.name} (${preset.watts}W)`;
        select.appendChild(opt);
    });
}

/**
 * เมื่อผู้ใช้เลือก Preset ให้เติมฟอร์มอัตโนมัติ
 */
function setupPresetChangeListener() {
    const select = document.getElementById('presetSelect');
    if (!select) return;

    select.addEventListener('change', (e) => {
        const index = e.target.value;
        if (index === '') return;

        const preset = APPLIANCE_PRESETS[index];
        if (preset) {
            document.getElementById('applianceName').value = preset.name;
            document.getElementById('applianceCategory').value = preset.category;
            document.getElementById('applianceWatts').value = preset.watts;
            document.getElementById('applianceHours').value = preset.hours;
            document.getElementById('applianceDays').value = preset.days;
            document.getElementById('applianceNote').value = preset.note || '';
        }
    });
}

/**
 * เปิด Modal เพิ่มอุปกรณ์ใหม่
 */
export function openAddApplianceModal() {
    editingApplianceId = null;
    const form = document.getElementById('applianceForm');
    if (form) form.reset();

    const title = document.getElementById('applianceModalTitle');
    if (title) title.textContent = 'เพิ่มเครื่องใช้ไฟฟ้าใหม่';

    const modal = document.getElementById('applianceModal');
    if (modal) modal.classList.remove('hidden');
}

/**
 * เปิด Modal แก้ไขอุปกรณ์เดิม
 * @param {object} appliance
 */
export function openEditApplianceModal(appliance) {
    editingApplianceId = appliance.id;

    document.getElementById('applianceName').value = appliance.name;
    document.getElementById('applianceCategory').value = appliance.category;
    document.getElementById('applianceWatts').value = appliance.watts;
    document.getElementById('applianceQuantity').value = appliance.quantity || 1;
    document.getElementById('applianceHours').value = appliance.hoursPerDay;
    document.getElementById('applianceDays').value = appliance.daysPerMonth || 30;
    document.getElementById('applianceNote').value = appliance.note || '';

    const title = document.getElementById('applianceModalTitle');
    if (title) title.textContent = 'แก้ไขข้อมูลเครื่องใช้ไฟฟ้า';

    const modal = document.getElementById('applianceModal');
    if (modal) modal.classList.remove('hidden');
}

/**
 * ปิด Modal เครื่องใช้ไฟฟ้า
 */
export function closeApplianceModal() {
    const modal = document.getElementById('applianceModal');
    if (modal) modal.classList.add('hidden');
    editingApplianceId = null;
}

/**
 * จัดการ Submit ฟอร์มเครื่องใช้ไฟฟ้า
 * @param {Event} e
 */
export function handleApplianceFormSubmit(e) {
    e.preventDefault();

    const name = document.getElementById('applianceName').value.trim();
    const category = document.getElementById('applianceCategory').value;
    const watts = parseFloat(document.getElementById('applianceWatts').value);
    const quantity = parseInt(document.getElementById('applianceQuantity').value, 10) || 1;
    const hoursPerDay = parseFloat(document.getElementById('applianceHours').value);
    const daysPerMonth = parseInt(document.getElementById('applianceDays').value, 10) || 30;
    const note = document.getElementById('applianceNote').value.trim();

    if (!name || isNaN(watts) || isNaN(hoursPerDay)) {
        alert('กรุณากรอกข้อมูลให้ครบถ้วนและถูกต้อง');
        return;
    }

    const payload = {
        id: editingApplianceId || `app-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        name,
        category,
        watts,
        quantity,
        hoursPerDay,
        daysPerMonth,
        note
    };

    if (onSaveApplianceCallback) {
        onSaveApplianceCallback(payload, Boolean(editingApplianceId));
    }

    closeApplianceModal();
}

/**
 * เปิด Modal ตั้งค่าอัตราค่าไฟฟ้า
 * @param {object} currentSettings
 */
export function openTariffModal(currentSettings) {
    document.getElementById('tariffTypeSelect').value = currentSettings.type || 'type1_2';
    document.getElementById('tariffFtInput').value = currentSettings.ftRate ?? TARIFF_CONFIG.defaultFt;
    document.getElementById('tariffServiceFeeInput').value = currentSettings.serviceFee ?? 24.62;
    document.getElementById('tariffFlatRateInput').value = currentSettings.flatRate ?? 7.00;

    toggleFlatRateField(currentSettings.type === 'flat');

    const modal = document.getElementById('tariffModal');
    if (modal) modal.classList.remove('hidden');
}

/**
 * ปิด Modal ตั้งค่าอัตราค่าไฟฟ้า
 */
export function closeTariffModal() {
    const modal = document.getElementById('tariffModal');
    if (modal) modal.classList.add('hidden');
}

/**
 * แสดงหรือซ่อนช่อง Flat rate ตามประเภทที่เลือก
 */
export function toggleFlatRateField(isFlat) {
    const container = document.getElementById('flatRateContainer');
    if (container) {
        if (isFlat) container.classList.remove('hidden');
        else container.classList.add('hidden');
    }
}

/**
 * บันทึกการตั้งค่าอัตราค่าไฟฟ้า
 * @param {Event} e
 */
export function handleTariffFormSubmit(e) {
    e.preventDefault();

    const type = document.getElementById('tariffTypeSelect').value;
    const ftRate = parseFloat(document.getElementById('tariffFtInput').value) || 0;
    const serviceFee = parseFloat(document.getElementById('tariffServiceFeeInput').value) || 0;
    const flatRate = parseFloat(document.getElementById('tariffFlatRateInput').value) || 7.00;

    const newSettings = {
        type,
        ftRate,
        serviceFee,
        flatRate,
        vatRate: 0.07
    };

    if (onSaveTariffCallback) {
        onSaveTariffCallback(newSettings);
    }

    closeTariffModal();
}

/**
 * เปิด Modal จำลองการประหยัดพลังงาน (What-If Simulation)
 * @param {Array} appliances
 * @param {object} tariffSettings
 */
export function openSimulationModal(appliances, tariffSettings) {
    const select = document.getElementById('simulationApplianceSelect');
    if (!select) return;

    select.innerHTML = '';
    appliances.forEach(app => {
        const opt = document.createElement('option');
        opt.value = app.id;
        opt.textContent = `${app.name} (${app.watts}W, ${app.hoursPerDay} ชม./วัน)`;
        select.appendChild(opt);
    });

    const modal = document.getElementById('simulationModal');
    if (modal) modal.classList.remove('hidden');

    updateSimulationCalculations(appliances, tariffSettings);
}

/**
 * ปิด Modal จำลองการประหยัดพลังงาน
 */
export function closeSimulationModal() {
    const modal = document.getElementById('simulationModal');
    if (modal) modal.classList.add('hidden');
}

/**
 * คำนวณผลการจำลองลดพลังงานแบบเรียลไทม์
 */
export function updateSimulationCalculations(appliances, tariffSettings) {
    const select = document.getElementById('simulationApplianceSelect');
    const hoursReduceSlider = document.getElementById('simulationHoursSlider');
    const hoursValLabel = document.getElementById('simulationHoursValue');

    if (!select || !hoursReduceSlider) return;

    const targetId = select.value;
    const targetApp = appliances.find(a => a.id === targetId);
    if (!targetApp) return;

    const reduceHours = parseFloat(hoursReduceSlider.value) || 0;
    if (hoursValLabel) hoursValLabel.textContent = `${reduceHours} ชม./วัน`;

    // คำนวณพลังงานที่ลดได้
    // (Watts * Qty * ReduceHours * Days) / 1000 = kWh saved per month
    const savedMonthlyKwh = (targetApp.watts * (targetApp.quantity || 1) * reduceHours * (targetApp.daysPerMonth || 30)) / 1000;
    const estRate = tariffSettings.type === 'flat' ? (tariffSettings.flatRate || 7) : 4.2; // ประมาณการค่าไฟเฉลี่ย
    const savedMonthlyMoney = savedMonthlyKwh * estRate * 1.07;
    const savedYearlyMoney = savedMonthlyMoney * 12;
    // ก๊าซเรือนกระจกที่ลดได้ (Emission factor ไทย ~ 0.4999 kg CO2e / kWh)
    const savedCo2 = savedMonthlyKwh * 0.4999;

    document.getElementById('simSavedKwh').textContent = `${savedMonthlyKwh.toFixed(1)} หน่วย/เดือน`;
    document.getElementById('simSavedMoney').textContent = `${savedMonthlyMoney.toLocaleString('th-TH', { maximumFractionDigits: 0 })} บาท/เดือน`;
    document.getElementById('simSavedYearly').textContent = `${savedYearlyMoney.toLocaleString('th-TH', { maximumFractionDigits: 0 })} บาท/ปี`;
    document.getElementById('simSavedCo2').textContent = `${savedCo2.toFixed(1)} kg CO₂e`;
}
