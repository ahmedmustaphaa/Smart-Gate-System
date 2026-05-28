import { Logs } from "../models/LogsSchema.js";

// 1. دالة تسجيل حركة جديدة (بتتنده أوتوماتيك لما الكود يتقرأ عند البوابة)
export const createLog = async (req, res) => {
    try {
        const { ownerId, gateName, activityType, status } = req.body;
        const newLog = await Logs.create({
            owner: ownerId, 
            gateName,
            activityType,
            status
        });


        const savedLog = await Logs.findById(newLog._id).populate('owner');


        if (global.io) {
            global.io.emit('new_activity', savedLog);
        }

        return res.status(201).json({ success: true, data: savedLog });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 2. دالة جلب كل السجلات (بتتنده أول ما الأدمن يفتح صفحة الـ Logs في الداشبورد عشان يعرض التاريخ القديم)
export const getLogs = async (req, res) => {
    try {
        // بنجيب السجلات وبنعمل populate لبيانات المالك، وبنرتبهم من الأحدث للأقدم (.sort)
        const logs = await Logs.find()
            .populate('owner')
            .sort({ createdAt: -1 }); // أو حسب حقل الـ timestamp عندك

        return res.status(200).json({ success: true, count: logs.length, data: logs });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};