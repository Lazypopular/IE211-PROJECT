/**
 * Smart Energy Management System (IE211)
 * Application Entry Point & Central Orchestrator
 */

import {
    getStoredAppliances,
    saveStoredAppliances,
    getStoredTariffSettings,
    saveStoredTariffSettings,
    exportDataAsJSON,
    exportDataAsCSV,
    importDataFromJSON,
    resetToDemoData
} from './services/storageService.js';

import { generateEnergyInsights } from './services/analyticsService.js';
import { renderCategoryChart, renderTopConsumersChart } from './ui/chartController.js';

import {
    initModalListeners,
    openAddApplianceModal,
    openEditApplianceModal,
    closeApplianceModal,
    handleApplianceFormSubmit,
    openTariffModal,
    closeTariffModal,
    handleTariffFormSubmit,
    openSimulationModal,
    closeSimulationModal,
    updateSimulationCalculations,
    toggleFlatRateField
} from './ui/modalController.js';

import {
    initUIListeners,
    showToast,
    renderMetricCards,
    renderApplianceList,
    renderInsightsList
} from './ui/uiController.js';

// Application State
let appliances = [];
let tariffSettings = {};
let currentFilter = 'all';
let currentSearch = '';

/**
 * ฟังก์ชันหลักในการรีเฟรชข้อมูลและการแสดงผลทั้งหมด
 */
function refreshApp() {
    const insights = generateEnergyInsights(appliances, tariffSettings);

    // 1. เรนเดอร์การ์ดสรุปตัวเลข
    renderMetricCards(insights);

    // 2. เรนเดอร์กราฟิก Chart.js
    const catCanvas = document.getElementById('categoryDonutChart');
    if (catCanvas) {
        renderCategoryChart(catCanvas, insights.categorySummary);
    }

    const topCanvas = document.getElementById('topConsumersBarChart');
    if (topCanvas) {
        renderTopConsumersChart(topCanvas, insights.topConsumers);
    }

    // 3. เรนเดอร์รายการเครื่องใช้ไฟฟ้า
    renderApplianceList(appliances, insights, currentFilter, currentSearch);

    // 4. เรนเดอร์กล่องคำแนะนำอัจฉริยะ
    renderInsightsList(insights.insights);
}

/**
 * บันทึกหรือแก้ไขเครื่องใช้ไฟฟ้า
 * @param {object} item
 * @param {boolean} isEdit
 */
function handleSaveAppliance(item, isEdit) {
    if (isEdit) {
        const index = appliances.findIndex(a => a.id === item.id);
        if (index !== -1) {
            appliances[index] = item;
            showToast(`แก้ไข "${item.name}" สำเร็จ`, 'success');
        }
    } else {
        appliances.push(item);
        showToast(`เพิ่ม "${item.name}" เรียบร้อยแล้ว`, 'success');
    }

    saveStoredAppliances(appliances);
    refreshApp();
}

/**
 * ลบเครื่องใช้ไฟฟ้า
 * @param {string} id
 */
function handleDeleteAppliance(id) {
    const item = appliances.find(a => a.id === id);
    appliances = appliances.filter(a => a.id !== id);
    saveStoredAppliances(appliances);
    showToast(`ลบ "${item ? item.name : 'อุปกรณ์'}" แล้ว`, 'info');
    refreshApp();
}

/**
 * บันทึกการตั้งค่าอัตราค่าไฟฟ้า
 * @param {object} newSettings
 */
function handleSaveTariff(newSettings) {
    tariffSettings = newSettings;
    saveStoredTariffSettings(tariffSettings);
    showToast('บันทึกอัตราค่าไฟฟ้าเรียบร้อยแล้ว', 'success');
    refreshApp();
}

/**
 * ผูก Event Listeners ต่างๆ ของหน้าเว็บ
 */
function setupEventListeners() {
    // 1. ปุ่มเปิด Modal เพิ่มอุปกรณ์
    const addBtn = document.getElementById('openAddApplianceBtn');
    if (addBtn) addBtn.addEventListener('click', openAddApplianceModal);

    const emptyAddBtn = document.getElementById('emptyAddApplianceBtn');
    if (emptyAddBtn) emptyAddBtn.addEventListener('click', openAddApplianceModal);

    // ปุ่มปิด Modal อุปกรณ์
    const closeAppBtn = document.getElementById('closeApplianceModalBtn');
    if (closeAppBtn) closeAppBtn.addEventListener('click', closeApplianceModal);
    const cancelAppBtn = document.getElementById('cancelApplianceBtn');
    if (cancelAppBtn) cancelAppBtn.addEventListener('click', closeApplianceModal);

    // Form Submit เพิ่ม/แก้ไขอุปกรณ์
    const appForm = document.getElementById('applianceForm');
    if (appForm) appForm.addEventListener('submit', handleApplianceFormSubmit);

    // 2. Modal ตั้งค่าอัตราค่าไฟ
    const openTariffBtn = document.getElementById('openTariffModalBtn');
    if (openTariffBtn) openTariffBtn.addEventListener('click', () => openTariffModal(tariffSettings));

    const closeTariffBtn = document.getElementById('closeTariffModalBtn');
    if (closeTariffBtn) closeTariffBtn.addEventListener('click', closeTariffModal);
    const cancelTariffBtn = document.getElementById('cancelTariffBtn');
    if (cancelTariffBtn) cancelTariffBtn.addEventListener('click', closeTariffModal);

    const tariffTypeSelect = document.getElementById('tariffTypeSelect');
    if (tariffTypeSelect) {
        tariffTypeSelect.addEventListener('change', (e) => {
            toggleFlatRateField(e.target.value === 'flat');
        });
    }

    const tariffForm = document.getElementById('tariffForm');
    if (tariffForm) tariffForm.addEventListener('submit', handleTariffFormSubmit);

    // 3. Modal จำลองการประหยัดพลังงาน (What-If Simulation)
    const openSimBtn = document.getElementById('openSimulationModalBtn');
    if (openSimBtn) openSimBtn.addEventListener('click', () => openSimulationModal(appliances, tariffSettings));

    const closeSimBtn = document.getElementById('closeSimulationModalBtn');
    if (closeSimBtn) closeSimBtn.addEventListener('click', closeSimulationModal);

    const simSelect = document.getElementById('simulationApplianceSelect');
    if (simSelect) simSelect.addEventListener('change', () => updateSimulationCalculations(appliances, tariffSettings));

    const simSlider = document.getElementById('simulationHoursSlider');
    if (simSlider) simSlider.addEventListener('input', () => updateSimulationCalculations(appliances, tariffSettings));

    // 4. ค้นหาและกรองหมวดหมู่
    const searchInput = document.getElementById('applianceSearchInput');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            currentSearch = e.target.value;
            const insights = generateEnergyInsights(appliances, tariffSettings);
            renderApplianceList(appliances, insights, currentFilter, currentSearch);
        });
    }

    const categoryTabs = document.querySelectorAll('[data-category-filter]');
    categoryTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            categoryTabs.forEach(t => t.classList.remove('active-tab', 'text-emerald-400', 'border-emerald-400'));
            categoryTabs.forEach(t => t.classList.add('text-slate-400', 'border-transparent'));

            tab.classList.remove('text-slate-400', 'border-transparent');
            tab.classList.add('active-tab', 'text-emerald-400', 'border-emerald-400');

            currentFilter = tab.getAttribute('data-category-filter');
            const insights = generateEnergyInsights(appliances, tariffSettings);
            renderApplianceList(appliances, insights, currentFilter, currentSearch);
        });
    });

    // 5. Data Management (Export / Import / Reset / Print)
    const exportJsonBtn = document.getElementById('exportJsonBtn');
    if (exportJsonBtn) exportJsonBtn.addEventListener('click', exportDataAsJSON);

    const exportCsvBtn = document.getElementById('exportCsvBtn');
    if (exportCsvBtn) exportCsvBtn.addEventListener('click', exportDataAsCSV);

    const importInput = document.getElementById('importJsonInput');
    if (importInput) {
        importInput.addEventListener('change', async (e) => {
            const file = e.target.files[0];
            if (!file) return;

            try {
                await importDataFromJSON(file);
                appliances = getStoredAppliances();
                tariffSettings = getStoredTariffSettings();
                refreshApp();
                showToast('นำเข้าข้อมูลสำเร็จแล้ว', 'success');
            } catch (err) {
                showToast(err.message || 'นำเข้าข้อมูลไม่สำเร็จ', 'error');
            }
            e.target.value = '';
        });
    }

    const resetDemoBtn = document.getElementById('resetDemoBtn');
    if (resetDemoBtn) {
        resetDemoBtn.addEventListener('click', () => {
            if (confirm('คุณต้องการรีเซ็ตข้อมูลเป็นตัวอย่างเริ่มต้นของระบบหรือไม่?')) {
                resetToDemoData();
                appliances = getStoredAppliances();
                tariffSettings = getStoredTariffSettings();
                refreshApp();
                showToast('รีเซ็ตข้อมูลเป็นตัวอย่างเริ่มต้นแล้ว', 'info');
            }
        });
    }

    const printBtn = document.getElementById('printReportBtn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }
}

/**
 * เริ่มต้นระบบเมื่อหน้าเว็บโหลดเสร็จสมบูรณ์
 */
document.addEventListener('DOMContentLoaded', () => {
    // โหลดข้อมูลจาก LocalStorage
    appliances = getStoredAppliances();
    tariffSettings = getStoredTariffSettings();

    // เริ่มต้น Module Listeners
    initModalListeners({
        onSaveAppliance: handleSaveAppliance,
        onSaveTariff: handleSaveTariff
    });

    initUIListeners({
        onEdit: openEditApplianceModal,
        onDelete: handleDeleteAppliance
    });

    setupEventListeners();

    // แสดงผลข้อมูลครั้งแรก
    refreshApp();

    console.log('⚡ Smart Energy Management System (IE211) Initialized successfully.');
});
