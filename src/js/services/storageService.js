/**
 * Smart Energy Management System - Storage Service
 * จัดการการบันทึกข้อมูลใน LocalStorage, Export และ Import ข้อมูล
 */

import { INITIAL_DEMO_APPLIANCES } from '../models/appliance.js';
import { TARIFF_CONFIG } from '../config/tariffs.js';

const STORAGE_KEYS = {
    APPLIANCES: 'smart_energy_appliances_v1',
    TARIFF_SETTINGS: 'smart_energy_tariff_settings_v1'
};

export const DEFAULT_TARIFF_SETTINGS = {
    type: 'type1_2',
    ftRate: TARIFF_CONFIG.defaultFt,
    serviceFee: TARIFF_CONFIG.type1_2.serviceFee,
    vatRate: TARIFF_CONFIG.vatRate,
    flatRate: TARIFF_CONFIG.flat.flatRate
};

/**
 * ดึงรายการเครื่องใช้ไฟฟ้าทั้งหมด
 * @returns {Array} รายการเครื่องใช้ไฟฟ้า
 */
export function getStoredAppliances() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.APPLIANCES);
        if (!raw) {
            // โหลดข้อมูลตัวอย่างเริ่มต้นหากยังไม่มีข้อมูล
            saveStoredAppliances(INITIAL_DEMO_APPLIANCES);
            return [...INITIAL_DEMO_APPLIANCES];
        }
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        console.error('Failed to load appliances from localStorage', e);
        return [...INITIAL_DEMO_APPLIANCES];
    }
}

/**
 * บันทึกรายการเครื่องใช้ไฟฟ้าลงใน localStorage
 * @param {Array} appliances
 */
export function saveStoredAppliances(appliances) {
    try {
        localStorage.setItem(STORAGE_KEYS.APPLIANCES, JSON.stringify(appliances));
        return true;
    } catch (e) {
        console.error('Failed to save appliances to localStorage', e);
        return false;
    }
}

/**
 * ดึงการตั้งค่าอัตราค่าไฟฟ้า
 * @returns {object} การตั้งค่าค่าไฟ
 */
export function getStoredTariffSettings() {
    try {
        const raw = localStorage.getItem(STORAGE_KEYS.TARIFF_SETTINGS);
        if (!raw) {
            saveStoredTariffSettings(DEFAULT_TARIFF_SETTINGS);
            return { ...DEFAULT_TARIFF_SETTINGS };
        }
        return { ...DEFAULT_TARIFF_SETTINGS, ...JSON.parse(raw) };
    } catch (e) {
        console.error('Failed to load tariff settings from localStorage', e);
        return { ...DEFAULT_TARIFF_SETTINGS };
    }
}

/**
 * บันทึกการตั้งค่าอัตราค่าไฟฟ้าลงใน localStorage
 * @param {object} settings
 */
export function saveStoredTariffSettings(settings) {
    try {
        localStorage.setItem(STORAGE_KEYS.TARIFF_SETTINGS, JSON.stringify(settings));
        return true;
    } catch (e) {
        console.error('Failed to save tariff settings to localStorage', e);
        return false;
    }
}

/**
 * ส่งออกข้อมูลทั้งหมดเป็นไฟล์ JSON
 */
export function exportDataAsJSON() {
    const data = {
        exportedAt: new Date().toISOString(),
        version: '1.0.0',
        project: 'Smart Energy Management System (IE211)',
        tariffSettings: getStoredTariffSettings(),
        appliances: getStoredAppliances()
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `smart-energy-backup-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * ส่งออกข้อมูลเครื่องใช้ไฟฟ้าเป็นไฟล์ CSV (สำหรับเปิดใน Excel)
 */
export function exportDataAsCSV() {
    const appliances = getStoredAppliances();
    if (!appliances || appliances.length === 0) {
        alert('ไม่มีข้อมูลเครื่องใช้ไฟฟ้าสำหรับ Export');
        return;
    }

    const headers = ['ชื่อเครื่องใช้ไฟฟ้า', 'หมวดหมู่', 'กำลังไฟฟ้า (Watts)', 'จำนวน (เครื่อง)', 'ชั่วโมงใช้งาน/วัน', 'วันใช้งาน/เดือน', 'หมายเหตุ'];
    const rows = appliances.map(item => [
        `"${item.name.replace(/"/g, '""')}"`,
        `"${item.category || ''}"`,
        item.watts,
        item.quantity,
        item.hoursPerDay,
        item.daysPerMonth,
        `"${(item.note || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `appliances-energy-data-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

/**
 * นำเข้าข้อมูลจากไฟล์ JSON
 * @param {File} file
 * @returns {Promise<boolean>}
 */
export function importDataFromJSON(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const parsed = JSON.parse(e.target.result);
                if (parsed.appliances && Array.isArray(parsed.appliances)) {
                    saveStoredAppliances(parsed.appliances);
                    if (parsed.tariffSettings) {
                        saveStoredTariffSettings(parsed.tariffSettings);
                    }
                    resolve(true);
                } else {
                    reject(new Error('รูปแบบไฟล์ JSON ไม่ถูกต้อง'));
                }
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = () => reject(new Error('เกิดข้อผิดพลาดในการอ่านไฟล์'));
        reader.readAsText(file);
    });
}

/**
 * รีเซ็ตข้อมูลกลับเป็นค่าเริ่มต้น
 */
export function resetToDemoData() {
    saveStoredAppliances(INITIAL_DEMO_APPLIANCES);
    saveStoredTariffSettings(DEFAULT_TARIFF_SETTINGS);
}
