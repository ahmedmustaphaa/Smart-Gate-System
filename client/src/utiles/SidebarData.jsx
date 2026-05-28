import { 
  LayoutDashboard, 
  ClipboardList, 
  DoorOpen, 
  ShieldCheck, 
  Settings,
  Radio,      // أيقونة الـ Online للبوابات المفتوحة والمغلقة
  Users,      // أيقونة الـ Total Residents
  Unlock,     // زرار أو حالة الـ Open
  Lock        // زرار أو حالة الـ Close
} from 'lucide-react';

// 1. داتا السايدبار القديمة (زي ما هي)
export const Data = [
  { title: "Overview", path: "/", icon: LayoutDashboard },
  { title: "Activity Logs", path: "/activity-logs", icon: ClipboardList },
  { title: "Gate Management", path: "/gate-management", icon: DoorOpen },
  { title: "Permissions & Owners", path: "/permissions-owners", icon: ShieldCheck },
  { title: "Settings", path: "/settings", icon: Settings },
];

// 2. داتا الجزء الفوقاني (Stats Cards Data)
export const dataSight = [
  {
    id: 1,
    title: "Total Open Gates",
    num: 4,
    status: "ONLINE",
    type: "open", // عشان لو حبيت تلون الكارد أو الرقم أخضر بناءً على النوع
    icon: Radio,
  },
  {
    id: 2,
    title: "Total Closed Gates",
    num: 2,
    status: "ONLINE",
    type: "closed", // عشان لو حبيت تلون الكارد أو الرقم أحمر
    icon: Radio,
  },
  {
    id: 3,
    title: "Total Residents",
    num: "1,250", // سترينج عشان الفصلة
    status: null, // مفيش ستاتس في الصورة للكارد ده
    type: "residents",
    icon: Users,
  },
];

// 3. داتا الجزء التحتاني (Live Gates Control Data)
export const liveGatesData = [
  {
    id: 1,
    name: "Main Entrance Gate",
    status: "Online",
    isClosed: true, // عشان تحدد القفل مقفول ولا مفتوح في التصميم
  },
  {
    id: 2,
    name: "Gym Entrance Gate",
    status: "Garage Gate (A)", // واخد نفس الستايل الأخضر بس بنص مختلف في الصورة
    isClosed: true,
  },
  {
    id: 3,
    name: "Gym Entrance Gate",
    status: "Online",
    isClosed: true,
  },
  {
    id: 4,
    name: "Staff Entrance Gate",
    status: "Online",
    isClosed: true,
  },
];