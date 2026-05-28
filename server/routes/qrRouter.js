import express from 'express';
import { 
  residentLogin, 
  generatePersonalQr, 
  generateVisitorQr, 
  verifyQrCode 
} from '../controller/qrController.js'; 

const qrRouter = express.Router();

// 1. مسار تسجيل دخول الساكن
qrRouter.post('/auth/resident-login', residentLogin);

// 2. مسار توليد الـ QR الشخصي (مؤمن داخلياً بالتوكن)
qrRouter.post('/qr/generate-personal', generatePersonalQr);

// 3. مسار إنشاء تصريح زائر وتوليد كود (مؤمن داخلياً بالتوكن)
qrRouter.post('/qr/generate-visitor', generateVisitorQr);

// 4. مسار الفحص والتحقق عند البوابة (خاص بجهاز فرد الأمن)
qrRouter.post('/qr/verify', verifyQrCode);

export default qrRouter;