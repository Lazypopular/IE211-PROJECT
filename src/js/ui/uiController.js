/**
 * Smart Energy Management System - UI Controller
 * จัดการการเรนเดอร์ DOM ของ Dashboard, รายการอุปกรณ์, สรุปสถิติ และ Toast แจ้งเตือน
 */

import { APPLIANCE_CATEGORIES } from '../models/appliance.js';
import { calculateApplianceEnergy, calculateApplianceCostShare } from '../services/calculationService.js';

let onEditApplianceCallback = null;
let onDeleteApplianceCallback = null;

/**
 * กำหนด Callback สำหรับปุ่มแก้ไขและลบอุปกรณ์
 */
export function initUIListeners({ onEdit, onDelete }) {
    onEditApplianceCallback = onEdit;
    onDeleteApplianceCallback = onDelete;
}

/**
 * แสดง Toast แจ้งเตือนชั่วคราว
 * @param {string} message
 * @param {'success' | 'info' | 'warning' | 'error'} type
 */
export function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    if (!container) return;

    const toast = document.createElement('div');
    const bgColors = {
        success: 'bg-emerald-600/90 border-emerald-500 text-white',
        info: 'bg-sky-600/90 border-sky-500 text-white',
        warning: 'bg-amber-600/90 border-amber-500 text-white',
        error: 'bg-rose-600/90 border-rose-500 text-white'
    };
    const icons = {
        success: 'fa-circle-check',
        info: 'fa-circle-info',
        warning: 'fa-triangle-exclamation',
        error: 'fa-circle-xmark'
    };

    toast.className = `flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-md transform transition-all duration-300 translate-y-2 opacity-0 text-sm font-medium ${bgColors[type] || bgColors.success}`;
    toast.innerHTML = `
        <i class="fa-solid ${icons[type] || icons.success} text-base"></i>
        <span>${escapeHtml(message)}</span>
    `;

    container.appendChild(toast);

    requestAnimationFrame(() => {
        toast.classList.remove('translate-y-2', 'opacity-0');
    });

    setTimeout(() => {
        toast.classList.add('opacity-0', 'translate-x-4');
        setTimeout(() => toast.remove(), 300);
    }, 3200);
}

/**
 * เรนเดอร์การ์ดสรุปผลตัวเลขหลัก (Metric Cards)
 * @param {object} insightsData
 */
export function renderMetricCards(insightsData) {
    const totalMonthlyKwh = insightsData?.totalMonthlyKwh || 0;
    const totalDailyKwh = insightsData?.totalDailyKwh || 0;
    const tariffResult = insightsData?.tariffResult || {
        totalBill: 0,
        totalKwh: 0,
        baseTariff: 0,
        serviceFee: 0,
        ftRate: 0,
        ftCost: 0,
        subtotalBeforeVat: 0,
        vatCost: 0,
        averageRatePerKwh: 0,
        tierBreakdown: []
    };
    const topConsumers = insightsData?.topConsumers || [];
    const energyGrade = insightsData?.energyGrade || '-';

    // 1. หน่วยไฟฟ้ารวมต่อเดือน
    const monthlyKwhEl = document.getElementById('metricMonthlyKwh');
    if (monthlyKwhEl) {
        monthlyKwhEl.textContent = totalMonthlyKwh.toLocaleString('th-TH', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    }

    // 2. ประมาณการค่าไฟต่อเดือน
    const monthlyBillEl = document.getElementById('metricMonthlyBill');
    if (monthlyBillEl) {
        monthlyBillEl.textContent = tariffResult.totalBill.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }

    // 3. หน่วยไฟฟ้ารวมต่อวัน
    const dailyKwhEl = document.getElementById('metricDailyKwh');
    if (dailyKwhEl) {
        dailyKwhEl.textContent = totalDailyKwh.toLocaleString('th-TH', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    }
    const dailyCostEl = document.getElementById('metricDailyCost');
    if (dailyCostEl) {
        const dailyCost = tariffResult.totalBill / 30;
        dailyCostEl.textContent = `~${dailyCost.toFixed(1)} ฿/วัน`;
    }

    // 4. อุปกรณ์ที่กินไฟสูงสุด
    const topConsumerNameEl = document.getElementById('metricTopConsumerName');
    const topConsumerShareEl = document.getElementById('metricTopConsumerShare');
    if (topConsumers && topConsumers.length > 0) {
        const top = topConsumers[0];
        if (topConsumerNameEl) topConsumerNameEl.textContent = top.name;
        if (topConsumerShareEl) {
            topConsumerShareEl.textContent = `${top.percentage}% (${top.cost.toLocaleString()} ฿/ด.)`;
        }
    } else {
        if (topConsumerNameEl) topConsumerNameEl.textContent = 'ไม่มีอุปกรณ์ในระบบ';
        if (topConsumerShareEl) topConsumerShareEl.textContent = '-';
    }

    // 5. เกรดประสิทธิภาพการใช้พลังงาน
    const gradeBadge = document.getElementById('metricEnergyGradeBadge');
    if (gradeBadge) {
        gradeBadge.textContent = energyGrade === '-' ? 'ยังไม่มีข้อมูล' : `เกรด ${energyGrade}`;
        const gradeColors = {
            A: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
            B: 'bg-sky-500/20 text-sky-400 border-sky-500/40',
            C: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
            D: 'bg-rose-500/20 text-rose-400 border-rose-500/40',
            '-': 'bg-slate-800 text-slate-400 border-slate-700'
        };
        gradeBadge.className = `px-3 py-1 text-xs font-bold rounded-lg border ${gradeColors[energyGrade] || gradeColors['-']}`;
    }

    // เรนเดอร์รายละเอียดแจกแจงค่าไฟ
    renderTariffBreakdown(tariffResult);
}

/**
 * เรนเดอร์แจกแจงรายการค่าไฟฟ้า (ค่าไฟฐาน, Ft, ค่าบริการ, VAT)
 * @param {object} tariffResult
 */
function renderTariffBreakdown(tariffResult) {
    const container = document.getElementById('tariffBreakdownDetails');
    if (!container) return;

    if (!tariffResult || tariffResult.totalKwh === 0) {
        container.innerHTML = `
            <div class="p-4 rounded-xl bg-slate-900/40 border border-slate-800 text-center text-xs text-slate-500">
                <i class="fa-solid fa-calculator mb-1 text-slate-600 block text-base"></i>
                ยังไม่มีข้อมูลการใช้ไฟฟ้าเพื่อคำนวณขั้นบันได
            </div>
        `;
        return;
    }

    let tierRowsHtml = '';
    (tariffResult.tierBreakdown || []).forEach(tier => {
        tierRowsHtml += `
            <div class="flex justify-between items-center text-xs text-slate-400 py-0.5">
                <span>${tier.label} (${tier.units.toLocaleString()} หน่วย × ${tier.rate.toFixed(4)} ฿)</span>
                <span class="font-mono text-slate-300">${tier.cost.toFixed(2)} ฿</span>
            </div>
        `;
    });

    container.innerHTML = `
        <div class="space-y-2">
            <div class="bg-slate-900/40 p-2.5 rounded-lg border border-slate-800">
                <div class="text-xs font-semibold text-emerald-400 mb-1">การคำนวณค่าไฟฐาน (ตามขั้นบันได):</div>
                ${tierRowsHtml}
                <div class="border-t border-slate-700/60 mt-1 pt-1 flex justify-between text-xs font-medium text-slate-200">
                    <span>รวมค่าไฟฐาน:</span>
                    <span class="font-mono">${tariffResult.baseTariff.toFixed(2)} ฿</span>
                </div>
            </div>

            <div class="flex justify-between text-xs text-slate-300">
                <span>ค่าบริการรายเดือน:</span>
                <span class="font-mono text-slate-200">${tariffResult.serviceFee.toFixed(2)} ฿</span>
            </div>

            <div class="flex justify-between text-xs text-slate-300">
                <span>ค่า Ft (${tariffResult.totalKwh.toLocaleString()} หน่วย × ${tariffResult.ftRate.toFixed(4)} ฿):</span>
                <span class="font-mono text-slate-200">${tariffResult.ftCost.toFixed(2)} ฿</span>
            </div>

            <div class="flex justify-between text-xs text-slate-300">
                <span>รวมเงินก่อนภาษีมูลค่าเพิ่ม:</span>
                <span class="font-mono text-slate-200">${tariffResult.subtotalBeforeVat.toFixed(2)} ฿</span>
            </div>

            <div class="flex justify-between text-xs text-slate-300">
                <span>ภาษีมูลค่าเพิ่ม (VAT 7%):</span>
                <span class="font-mono text-slate-200">${tariffResult.vatCost.toFixed(2)} ฿</span>
            </div>

            <div class="border-t border-slate-700 pt-2 flex justify-between text-sm font-bold text-emerald-400">
                <span>รวมค่าไฟฟ้าสุทธิทั้งสิ้น:</span>
                <span class="font-mono text-base">${tariffResult.totalBill.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ฿</span>
            </div>
            
            <div class="text-right text-[11px] text-slate-400">
                เฉลี่ยต่อหน่วย: <span class="font-mono text-emerald-300">${tariffResult.averageRatePerKwh.toFixed(2)}</span> บาท/kWh
            </div>
        </div>
    `;
}

/**
 * เรนเดอร์การ์ดรายการเครื่องใช้ไฟฟ้าทั้งหมด
 * @param {Array} appliances
 * @param {object} insightsData
 * @param {string} filterCategory
 * @param {string} searchQuery
 */
export function renderApplianceList(appliances, insightsData, filterCategory = 'all', searchQuery = '') {
    const listContainer = document.getElementById('applianceListContainer');
    const emptyState = document.getElementById('applianceEmptyState');
    const countBadge = document.getElementById('applianceCountBadge');

    if (!listContainer) return;

    let filtered = Array.isArray(appliances) ? [...appliances] : [];

    // กรองตามหมวดหมู่
    if (filterCategory && filterCategory !== 'all') {
        filtered = filtered.filter(a => a.category === filterCategory);
    }

    // กรองตามคำค้นหา
    if (searchQuery && searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase().trim();
        filtered = filtered.filter(a =>
            a.name.toLowerCase().includes(query) ||
            (a.note && a.note.toLowerCase().includes(query))
        );
    }

    if (countBadge) {
        countBadge.textContent = `${filtered.length} รายการ`;
    }

    if (filtered.length === 0) {
        listContainer.innerHTML = '';
        if (emptyState) emptyState.classList.remove('hidden');
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');

    const totalMonthlyKwh = insightsData.totalMonthlyKwh || 1;
    const totalBill = insightsData.tariffResult?.totalBill || 0;

    let html = '';
    filtered.forEach(item => {
        const energy = calculateApplianceEnergy(item.watts, item.quantity, item.hoursPerDay, item.daysPerMonth);
        const share = calculateApplianceCostShare(energy.monthlyKwh, totalMonthlyKwh, totalBill);
        const catConfig = APPLIANCE_CATEGORIES[item.category] || APPLIANCE_CATEGORIES.other;

        html += `
            <div class="appliance-card relative bg-slate-900/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700/80 rounded-2xl p-4 sm:p-5 transition-all duration-200 group shadow-lg">
                <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    
                    <!-- ส่วนข้อมูลเครื่องใช้ไฟฟ้า -->
                    <div class="flex items-start gap-3.5">
                        <div class="w-11 h-11 rounded-xl flex items-center justify-center text-lg ${catConfig.badgeBg} ${catConfig.badgeText} border ${catConfig.badgeBorder} flex-shrink-0">
                            <i class="fa-solid ${catConfig.icon}"></i>
                        </div>
                        <div>
                            <div class="flex items-center gap-2 flex-wrap">
                                <h4 class="font-semibold text-slate-100 text-base group-hover:text-emerald-300 transition-colors">${escapeHtml(item.name)}</h4>
                                <span class="text-[11px] px-2 py-0.5 rounded-full border ${catConfig.badgeBg} ${catConfig.badgeText} ${catConfig.badgeBorder}">
                                    ${catConfig.name}
                                </span>
                                ${item.quantity > 1 ? `<span class="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded-md font-medium">× ${item.quantity} เครื่อง</span>` : ''}
                            </div>
                            
                            <div class="flex items-center gap-x-4 gap-y-1 mt-1 text-xs text-slate-400 flex-wrap">
                                <span><i class="fa-solid fa-bolt text-amber-400 mr-1"></i>${item.watts}W</span>
                                <span><i class="fa-regular fa-clock text-sky-400 mr-1"></i>${item.hoursPerDay} ชม./วัน</span>
                                <span><i class="fa-regular fa-calendar text-indigo-400 mr-1"></i>${item.daysPerMonth || 30} วัน/เดือน</span>
                                ${item.note ? `<span class="italic text-slate-500"><i class="fa-regular fa-comment mr-1"></i>${escapeHtml(item.note)}</span>` : ''}
                            </div>
                        </div>
                    </div>

                    <!-- ส่วนแสดงค่าไฟและหน่วยไฟ -->
                    <div class="flex items-center justify-between sm:justify-end gap-4 border-t sm:border-t-0 border-slate-800/80 pt-3 sm:pt-0">
                        <div class="text-left sm:text-right">
                            <div class="text-base font-bold text-emerald-400 font-mono">
                                ~${share.cost.toLocaleString('th-TH', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} <span class="text-xs font-normal text-slate-400">฿/เดือน</span>
                            </div>
                            <div class="text-xs text-slate-400">
                                <span class="font-mono text-slate-300">${energy.monthlyKwh}</span> หน่วย (${share.percentage}%)
                            </div>
                        </div>

                        <!-- Action Buttons -->
                        <div class="flex items-center gap-1.5 flex-shrink-0">
                            <button data-action="edit" data-id="${item.id}" title="แก้ไขข้อมูล" class="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 flex items-center justify-center transition-colors">
                                <i class="fa-regular fa-pen-to-square text-xs"></i>
                            </button>
                            <button data-action="delete" data-id="${item.id}" title="ลบรายการ" class="w-8 h-8 rounded-lg bg-slate-800/80 hover:bg-rose-500/20 text-slate-300 hover:text-rose-400 flex items-center justify-center transition-colors">
                                <i class="fa-regular fa-trash-can text-xs"></i>
                            </button>
                        </div>
                    </div>
                </div>

                <!-- แถบแสดงสัดส่วนเปอร์เซ็นต์แบบ Progress bar -->
                <div class="w-full bg-slate-800/60 rounded-full h-1 mt-3 overflow-hidden">
                    <div class="h-full rounded-full bg-emerald-500/80" style="width: ${Math.min(100, share.percentage)}%"></div>
                </div>
            </div>
        `;
    });

    listContainer.innerHTML = html;

    // ผูก Event ให้ปุ่ม Edit และ Delete
    listContainer.querySelectorAll('button[data-action]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const action = btn.getAttribute('data-action');
            const id = btn.getAttribute('data-id');
            const targetItem = appliances.find(a => a.id === id);

            if (action === 'edit' && onEditApplianceCallback && targetItem) {
                onEditApplianceCallback(targetItem);
            } else if (action === 'delete' && onDeleteApplianceCallback && targetItem) {
                if (confirm(`คุณต้องการลบ "${targetItem.name}" หรือไม่?`)) {
                    onDeleteApplianceCallback(id);
                }
            }
        });
    });
}

/**
 * เรนเดอร์กล่องคำแนะนำประหยัดพลังงาน (Smart Insights)
 * @param {Array} insights
 */
export function renderInsightsList(insights) {
    const container = document.getElementById('insightsListContainer');
    if (!container) return;

    if (!insights || insights.length === 0) {
        container.innerHTML = '<p class="text-sm text-slate-500 text-center py-4">ไม่มีคำแนะนำเพิ่มเติมในขณะนี้</p>';
        return;
    }

    let html = '';
    insights.forEach(item => {
        const severityBg = {
            high: 'border-amber-500/30 bg-amber-500/5',
            medium: 'border-sky-500/30 bg-sky-500/5',
            low: 'border-emerald-500/30 bg-emerald-500/5'
        };
        const iconColor = {
            high: 'text-amber-400',
            medium: 'text-sky-400',
            low: 'text-emerald-400'
        };

        html += `
            <div class="p-3.5 rounded-xl border ${severityBg[item.severity] || severityBg.low} flex items-start gap-3 transition-transform hover:-translate-y-0.5 duration-200">
                <div class="mt-0.5 text-base ${iconColor[item.severity] || iconColor.low} flex-shrink-0">
                    <i class="fa-solid ${item.icon}"></i>
                </div>
                <div>
                    <h5 class="text-sm font-semibold text-slate-200 mb-0.5">${escapeHtml(item.title)}</h5>
                    <p class="text-xs text-slate-400 leading-relaxed">${escapeHtml(item.description)}</p>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

/**
 * ฟังก์ชันช่วยป้องกัน XSS
 */
function escapeHtml(str) {
    if (!str) return '';
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
