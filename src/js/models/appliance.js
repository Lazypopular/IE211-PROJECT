/**
 * Smart Energy Management System - Appliance Models & Presets
 * หมวดหมู่และฐานข้อมูลแม่แบบเครื่องใช้ไฟฟ้าทั่วไป
 */

export const APPLIANCE_CATEGORIES = {
    cooling: {
        id: 'cooling',
        name: 'เครื่องปรับอากาศ & พัดลม',
        icon: 'fa-snowflake',
        color: '#06b6d4', // Cyan
        badgeBg: 'bg-cyan-500/10',
        badgeText: 'text-cyan-400',
        badgeBorder: 'border-cyan-500/20'
    },
    kitchen: {
        id: 'kitchen',
        name: 'เครื่องใช้ในครัว',
        icon: 'fa-utensils',
        color: '#f59e0b', // Amber
        badgeBg: 'bg-amber-500/10',
        badgeText: 'text-amber-400',
        badgeBorder: 'border-amber-500/20'
    },
    lighting: {
        id: 'lighting',
        name: 'ระบบแสงสว่าง',
        icon: 'fa-lightbulb',
        color: '#eab308', // Yellow
        badgeBg: 'bg-yellow-500/10',
        badgeText: 'text-yellow-400',
        badgeBorder: 'border-yellow-500/20'
    },
    entertainment: {
        id: 'entertainment',
        name: 'ความบันเทิง & ภาพ/เสียง',
        icon: 'fa-tv',
        color: '#a855f7', // Purple
        badgeBg: 'bg-purple-500/10',
        badgeText: 'text-purple-400',
        badgeBorder: 'border-purple-500/20'
    },
    cleaning: {
        id: 'cleaning',
        name: 'สุขอนามัย & ซักล้าง',
        icon: 'fa-soap',
        color: '#3b82f6', // Blue
        badgeBg: 'bg-blue-500/10',
        badgeText: 'text-blue-400',
        badgeBorder: 'border-blue-500/20'
    },
    office: {
        id: 'office',
        name: 'คอมพิวเตอร์ & สำนักงาน',
        icon: 'fa-laptop',
        color: '#10b981', // Emerald
        badgeBg: 'bg-emerald-500/10',
        badgeText: 'text-emerald-400',
        badgeBorder: 'border-emerald-500/20'
    },
    other: {
        id: 'other',
        name: 'อื่นๆ',
        icon: 'fa-plug',
        color: '#94a3b8', // Slate
        badgeBg: 'bg-slate-500/10',
        badgeText: 'text-slate-400',
        badgeBorder: 'border-slate-500/20'
    }
};

/**
 * แม่แบบเครื่องใช้ไฟฟ้าสำเร็จรูปสำหรับเลือกกรอกอัตโนมัติ (Quick Presets)
 */
export const APPLIANCE_PRESETS = [
    { name: 'เครื่องปรับอากาศ Inverter 12,000 BTU', category: 'cooling', watts: 1000, hours: 8, days: 30, note: 'เปิดช่วงกลางคืน' },
    { name: 'เครื่องปรับอากาศ 9,000 BTU', category: 'cooling', watts: 800, hours: 8, days: 30, note: 'ห้องนอนขนาดเล็ก' },
    { name: 'เครื่องปรับอากาศ 18,000 BTU', category: 'cooling', watts: 1500, hours: 8, days: 30, note: 'ห้องนั่งเล่น/โถง' },
    { name: 'ตู้เย็น 2 ประตู (10-15 คิว)', category: 'kitchen', watts: 150, hours: 24, days: 30, note: 'ทำงานต่อเนื่อง 24 ชม.' },
    { name: 'พัดลมตั้งโต๊ะ / ตั้งพื้น 16 นิ้ว', category: 'cooling', watts: 50, hours: 10, days: 30, note: 'เปิดระบายอากาศ' },
    { name: 'เครื่องทำน้ำอุ่น (3,500W)', category: 'cleaning', watts: 3500, hours: 0.5, days: 30, note: 'อาบน้ำ เช้า-เย็น' },
    { name: 'ทีวี Smart TV 55 นิ้ว', category: 'entertainment', watts: 100, hours: 5, days: 30, note: 'ดูหนัง/สตรีมมิ่ง' },
    { name: 'คอมพิวเตอร์ Desktop / Gaming PC', category: 'office', watts: 350, hours: 6, days: 30, note: 'เล่นเกม/ทำงานกราฟิก' },
    { name: 'โน้ตบุ๊กสำหรับทำงาน (Laptop)', category: 'office', watts: 65, hours: 8, days: 26, note: 'Work From Home' },
    { name: 'เครื่องซักผ้าฝาหน้า/บน', category: 'cleaning', watts: 500, hours: 1, days: 15, note: 'ซักผ้า 2-3 ครั้ง/สัปดาห์' },
    { name: 'เตาไมโครเวฟ (Microwave)', category: 'kitchen', watts: 1000, hours: 0.3, days: 30, note: 'อุ่นอาหารสั้นๆ' },
    { name: 'หม้อหุงข้าวไฟฟ้า', category: 'kitchen', watts: 600, hours: 0.5, days: 30, note: 'หุงข้าววันละ 1 ครั้ง' },
    { name: 'หลอดไฟ LED 9W', category: 'lighting', watts: 9, hours: 6, days: 30, note: 'หลอดประหยัดพลังงาน' },
    { name: 'เตารีดไอน้ำ', category: 'cleaning', watts: 1200, hours: 1, days: 4, note: 'รีดผ้าสัปดาห์ละครั้ง' },
    { name: 'เครื่องฟอกอากาศ (Air Purifier)', category: 'cooling', watts: 40, hours: 12, days: 30, note: 'กรองฝุ่น PM2.5' }
];

/**
 * ข้อมูลจำลองเริ่มต้นเมื่อเปิดเว็บครั้งแรก (Seed Data)
 */
export const INITIAL_DEMO_APPLIANCES = [
    {
        id: 'demo-1',
        name: 'แอร์ห้องนอน Inverter (12,000 BTU)',
        category: 'cooling',
        watts: 1000,
        quantity: 1,
        hoursPerDay: 8,
        daysPerMonth: 30,
        note: 'เปิด 25°C ช่วงเวลานอน'
    },
    {
        id: 'demo-2',
        name: 'ตู้เย็น 2 ประตู 12 คิว',
        category: 'kitchen',
        watts: 150,
        quantity: 1,
        hoursPerDay: 24,
        daysPerMonth: 30,
        note: 'เสียบปลั๊กตลอดเวลา'
    },
    {
        id: 'demo-3',
        name: 'พัดลมตั้งพื้น 16 นิ้ว',
        category: 'cooling',
        watts: 50,
        quantity: 2,
        hoursPerDay: 8,
        daysPerMonth: 30,
        note: 'ห้องนั่งเล่นและห้องนอน'
    },
    {
        id: 'demo-4',
        name: 'เครื่องทำน้ำอุ่น',
        category: 'cleaning',
        watts: 3500,
        quantity: 1,
        hoursPerDay: 0.5,
        daysPerMonth: 30,
        note: 'ใช้งานเฉลี่ยวันละ 30 นาที'
    },
    {
        id: 'demo-5',
        name: 'คอมพิวเตอร์ตั้งโต๊ะ WFH',
        category: 'office',
        watts: 200,
        quantity: 1,
        hoursPerDay: 8,
        daysPerMonth: 22,
        note: 'ทำงาน จันทร์-ศุกร์'
    },
    {
        id: 'demo-6',
        name: 'Smart TV 55 นิ้ว',
        category: 'entertainment',
        watts: 110,
        quantity: 1,
        hoursPerDay: 4,
        daysPerMonth: 30,
        note: 'ดูข่าวและ Netflix'
    },
    {
        id: 'demo-7',
        name: 'หลอดไฟ LED ในบ้าน',
        category: 'lighting',
        watts: 9,
        quantity: 8,
        hoursPerDay: 5,
        daysPerMonth: 30,
        note: 'รวมทุกห้องในบ้าน'
    }
];
