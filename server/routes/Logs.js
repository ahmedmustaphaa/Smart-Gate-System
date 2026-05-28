import express from 'express';
import { createLog, getLogs } from '../controller/LogsController.js'; // تأكد من مسار الفايل الصح

export const logsRouter = express.Router(); // هنا بنعرف الـ Router نفسه

// 1. راوت جلب السجلات عشان تعرضها في الداشبورد
logsRouter.get('/get', getLogs);

// 2. راوت تسجيل حركة جديدة اللي جاي من البوابة
logsRouter.post('/create', createLog);