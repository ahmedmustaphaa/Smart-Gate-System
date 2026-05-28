import express from 'express';
import { 
    getGates, 
    toggleGateStatus, 
    createGate, 
    updateGate, 
    deleteGate, 
    getDashBoardData 
} from '../controller/gatecontroller.js';

export const GateRouter = express.Router();

GateRouter.post('/create', createGate);             // إضافة بوابة جديدة
GateRouter.get('/all', getGates);                   // جلب كل البوابات للجدول
GateRouter.patch('/toggle/:gateId', toggleGateStatus); // فتح وقفل البوابة لايف
GateRouter.put('/update/:gateId', updateGate);      // تعديل بيانات البوابة (القلم)
GateRouter.delete('/delete/:gateId', deleteGate);   // مسح البوابة (السلة)
GateRouter.get('/dashboard', getDashBoardData);   // مسح البوابة (السلة)

GateRouter.get('/dashboard-stats', getDashBoardData); // إحصائيات كروت الـ Overview