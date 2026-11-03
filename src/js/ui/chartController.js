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

    Object.values(categorySummary).forEach(cat => {
        if (cat.kwh > 0) {
            labels.push(cat.name);
            dataValues.push(cat.kwh);
            backgroundColors.push(cat.color || '#94a3b8');
        }
    });

    if (dataValues.length === 0) {
        labels.push('ไม่มีข้อมูล');
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

    const labels = topConsumers.map(item => item.name);
    const costValues = topConsumers.map(item => item.cost);
    const kwhValues = topConsumers.map(item => item.monthlyKwh);

    if (topConsumersChartInstance) {
        topConsumersChartInstance.destroy();
    }

    const ctx = canvas.getContext('2d');
    topConsumersChartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
            labels,
            datasets: [{
                label: 'ค่าไฟโดยประมาณ (บาท/เดือน)',
                data: costValues,
                backgroundColor: 'rgba(16, 185, 129, 0.75)', // Emerald
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
