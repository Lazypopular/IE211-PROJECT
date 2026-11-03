/**
 * Smart Energy Management System - Chart Controller
 * ควบคุมการวาดกราฟิกและโต้ตอบด้วย Chart.js (Donut Chart & Horizontal Bar Chart)
 */

let categoryChartInstance = null;
let topConsumersChartInstance = null;

/**
 * อัปเดตหรือสร้างกราฟสัดส่วนการใช้พลังงานตามหมวดหมู่ (Donut Chart)
 * @param {HTMLCanvasElement} canvas
 * @param {object} categorySummary
 */
export function renderCategoryChart(canvas, categorySummary) {
    if (!canvas || typeof Chart === 'undefined') return;

    const labels = [];
    const dataValues = [];
    const backgroundColors = [];

    if (categorySummary) {
        Object.values(categorySummary).forEach(cat => {
            if (cat.kwh > 0) {
                labels.push(cat.name);
                dataValues.push(cat.kwh);
                backgroundColors.push(cat.color || '#94a3b8');
            }
        });
    }

    if (dataValues.length === 0) {
        labels.push('ยังไม่มีการใช้ไฟฟ้า');
        dataValues.push(1);
        backgroundColors.push('#334155');
    }

    if (categoryChartInstance) {
        categoryChartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    categoryChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels,
            datasets: [{
                data: dataValues,
                backgroundColor: backgroundColors,
                borderWidth: 2,
                borderColor: '#0f172a',
                hoverOffset: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                    labels: {
                        color: '#94a3b8',
                        font: { family: 'Kanit, sans-serif', size: 12 },
                        boxWidth: 14,
                        padding: 16
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            if (labels[0] === 'ยังไม่มีการใช้ไฟฟ้า') return ' ยังไม่มีข้อมูลการใช้ไฟฟ้า';
                            const val = context.raw;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const pct = total > 0 ? ((val / total) * 100).toFixed(1) : 0;
                            return ` ${context.label}: ${val.toLocaleString()} หน่วย (${pct}%)`;
                        }
                    }
                }
            },
            cutout: '68%'
        }
    });
}

/**
 * อัปเดตหรือสร้างกราฟจัดอันดับเครื่องใช้ไฟฟ้าที่กินพลังงานสูงสุด (Horizontal Bar Chart)
 * @param {HTMLCanvasElement} canvas
 * @param {Array} topConsumers
 */
export function renderTopConsumersChart(canvas, topConsumers) {
    if (!canvas || typeof Chart === 'undefined') return;

    if (topConsumersChartInstance) {
        topConsumersChartInstance.destroy();
        topConsumersChartInstance = null;
    }

    const ctx = canvas.getContext('2d');

    if (!topConsumers || topConsumers.length === 0) {
        topConsumersChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['ยังไม่มีข้อมูลเครื่องใช้ไฟฟ้า'],
                datasets: [{
                    label: 'ค่าไฟ (บาท/เดือน)',
                    data: [0],
                    backgroundColor: 'rgba(51, 65, 85, 0.4)',
                    borderRadius: 6,
                    barThickness: 16
                }]
            },
            options: {
                indexAxis: 'y',
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        grid: { color: 'rgba(255, 255, 255, 0.05)' },
                        ticks: { color: '#64748b', font: { family: 'Kanit, sans-serif' }, callback: (v) => `${v} ฿` },
                        suggestedMax: 100
                    },
                    y: {
                        grid: { display: false },
                        ticks: { color: '#64748b', font: { family: 'Kanit, sans-serif', size: 12 } }
                    }
                },
                plugins: {
                    legend: { display: false }
                }
            }
        });
        return;
    }

    const labels = topConsumers.map(item => item.name);
    const costValues = topConsumers.map(item => item.cost);
    const kwhValues = topConsumers.map(item => item.monthlyKwh);

    topConsumersChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'ค่าไฟโดยประมาณ (บาท/เดือน)',
                data: costValues,
                backgroundColor: 'rgba(16, 185, 129, 0.75)',
                borderColor: '#10b981',
                borderWidth: 1,
                borderRadius: 6,
                barThickness: 16
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.05)' },
                    ticks: {
                        color: '#94a3b8',
                        font: { family: 'Kanit, sans-serif' },
                        callback: (v) => `${v.toLocaleString()} ฿`
                    }
                },
                y: {
                    grid: { display: false },
                    ticks: {
                        color: '#cbd5e1',
                        font: { family: 'Kanit, sans-serif', size: 12 }
                    }
                }
            },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function (context) {
                            const index = context.dataIndex;
                            const cost = costValues[index];
                            const kwh = kwhValues[index];
                            return ` ค่าไฟ: ~${cost.toLocaleString()} บาท/เดือน (${kwh.toLocaleString()} หน่วย)`;
                        }
                    }
                }
            }
        }
    });
}
