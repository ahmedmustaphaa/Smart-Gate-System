import { Gates } from "../models/Gate.js"; 
import { Owner } from "../models/Owner.js";

// 1. إضافة بوابة جديدة (للفورم والمودال)
export const createGate = async (req, res) => {
    try {
        const { gateName, type, ipAddress, apiKey } = req.body;
        
        const existingGate = await Gates.findOne({ gateName });
        if (existingGate) {
            return res.status(400).json({ success: false, message: "البوابة دي مسجلة بالفعل" });
        }

        const newGate = await Gates.create({ gateName, type, ipAddress, apiKey });
        return res.status(201).json({ success: true, data: newGate });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 2. جلب كل البوابات (عشان الجدول والتحكم الـ Live)
export const getGates = async (req, res) => {
    try {
        const gates = await Gates.find();
        return res.status(200).json({ success: true, data: gates });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 3. فتح وقفل البوابة بالسوكيت (الـ Live Control)
export const toggleGateStatus = async (req, res) => {
    try {
        const { gateId } = req.params;
        const { status } = req.body;

        const updatedGate = await Gates.findByIdAndUpdate(gateId, { status }, { new: true });
        if (!updatedGate) {
            return res.status(404).json({ success: false, message: "البوابة مش موجودة" });
        }

        if (global.io) {
            global.io.emit("gate_status_changed", updatedGate);
        }

        return res.status(200).json({ success: true, data: updatedGate });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 4. تعديل بيانات البوابة (أيقونة القلم في الجدول)
export const updateGate = async (req, res) => {
    try {
        const { gateId } = req.params;
        const { gateName, type, ipAddress, apiKey } = req.body;

        const updatedGate = await Gates.findByIdAndUpdate(
            gateId,
            { gateName, type, ipAddress, apiKey },
            { new: true }
        );

        if (!updatedGate) {
            return res.status(404).json({ success: false, message: "البوابة مش موجودة" });
        }

        return res.status(200).json({ success: true, message: "تم تحديث البيانات بنجاح", data: updatedGate });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 5. مسح البوابة نهائياً (أيقونة السلة في الجدول)
export const deleteGate = async (req, res) => {
    try {
        const { gateId } = req.params;

        const deletedGate = await Gates.findByIdAndDelete(gateId);
        if (!deletedGate) {
            return res.status(404).json({ success: false, message: "البوابة مش موجودة اصلاً" });
        }

        return res.status(200).json({ success: true, message: "تم مسح البوابة بنجاح" });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};

// 6. إحصائيات الكروت (لكروت صفحة الـ Overview)
export const getDashBoardData = async (req, res) => {
    try {
        const openGatesCount = await Gates.countDocuments({ status: "open" });
        const closedGatesCount = await Gates.countDocuments({ status: "closed" });
        const totalOwnersCount = await Owner.countDocuments(); 

        return res.status(200).json({
            success: true,
            data: {
                totalOpenGates: openGatesCount,
                totalClosedGates: closedGatesCount,
                totalResidents: totalOwnersCount
            }
        });
    } catch (error) {
        return res.status(500).json({ success: false, message: error.message });
    }
};