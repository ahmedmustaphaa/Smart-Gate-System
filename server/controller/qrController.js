import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Owner } from '../models/Owner.js'; 
import Invitation from '../models/Invitation.js';

// مفاتيح التشفير من ملف .env
const JWT_SECRET = process.env.JWT_SECRET || 'ahmed';
const QR_SECRET = process.env.QR_SECRET || 'ahmed_qr_secret_key';

/**
 * 🛠️ دالة الـ Auth المدمجة للتحقق وفك التوكن داخلياً
 */
const getAuthUser = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  const token = authHeader.split(" ")[1];
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return null;
  }
};

/**
 * 1. تسجيل دخول الساكن
 */
export const residentLogin = async (req, res) => {
  try {
    const { phone, unitNumber } = req.body;
    if (!phone || !unitNumber) {
      return res.status(400).json({ success: false, message: 'برجاء إدخال رقم الموبايل ورقم الشقة' });
    }

    const resident = await Owner.findOne({ 
      phone: phone.trim(),
      unitNumber: unitNumber.trim()
    });

    if (!resident) {
      return res.status(404).json({ success: false, message: 'بيانات الدخول غير صحيحة' });
    }

    const token = jwt.sign(
      { id: resident._id, role: 'resident' },
      JWT_SECRET,
      { expiresIn: '30d' }
    );

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: resident._id,
        name: resident.name,
        phone: resident.phone,
        email: resident.email,
        unitNumber: resident.unitNumber,
        propertyId: resident.unitNumber
      }
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ success: false, message: 'مشكلة في خادم تسجيل الدخول' });
  }
};


export const generatePersonalQr = async (req, res) => {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'جلسة منتهية، يرجى تسجيل الدخول' });
    }

    const qrToken = jwt.sign(
      { id: user.id, type: 'personal' }, 
      QR_SECRET, 
      { expiresIn: '2m' }
    );

    return res.status(200).json({ success: true, qrToken });
  } catch (error) {
    console.error("Personal QR Error:", error);
    return res.status(500).json({ success: false, message: 'خطأ في توليد الكود' });
  }
};


export const generateVisitorQr = async (req, res) => {
  try {
    const user = getAuthUser(req);
    if (!user) {
      return res.status(401).json({ success: false, message: 'جلسة منتهية، يرجى تسجيل الدخول' });
    }

    const { guestName } = req.body;
    if (!guestName) {
      return res.status(400).json({ success: false, message: 'اسم الضيف مطلوب' });
    }

    const newInvitation = await Invitation.create({
      residentId: user.id,
      guestName,
      isUsed: false
    });

    const visitorToken = jwt.sign(
      { invitationId: newInvitation._id, type: 'visitor' },
      QR_SECRET,
      { expiresIn: '24h' }
    );

    return res.status(201).json({ success: true, visitorToken, guestName });
  } catch (error) {
    console.error("Visitor QR Error:", error);
    return res.status(500).json({ success: false, message: 'خطأ في إنشاء التصريح' });
  }
};

/**
 * 4. الفحص والتحقق (عند البوابة)
 */
export const verifyQrCode = async (req, res) => {
  try {
    const { qrToken } = req.body;
    if (!qrToken) {
      return res.status(400).json({ success: false, message: 'الكود مفقود' });
    }

    let decoded;
    try {
      decoded = jwt.verify(qrToken, QR_SECRET);
    } catch (err) {
      return res.status(401).json({ success: false, message: 'كود غير صالح' });
    }

    if (decoded.type === 'personal') {
      const resident = await Owner.findById(decoded.id).select('-password');
      if (!resident) return res.status(404).json({ success: false, message: 'ساكن غير موجود' });
      
      return res.status(200).json({
        success: true,
        accessGranted: true,
        userType: 'resident',
        data: resident
      });
    } 
    
    if (decoded.type === 'visitor') {
      const invitation = await Invitation.findById(decoded.invitationId).populate('residentId', 'name unitNumber propertyId');
      
      if (!invitation) return res.status(404).json({ success: false, message: 'تصريح غير صحيح' });
      if (invitation.isUsed) return res.status(400).json({ success: false, message: 'الكود مستخدم' });

      invitation.isUsed = true;
      await invitation.save();

      return res.status(200).json({
        success: true,
        accessGranted: true,
        userType: 'visitor',
        data: {
          guestName: invitation.guestName,
          hostName: invitation.residentId?.name,
          unit: invitation.residentId?.unitNumber || invitation.residentId?.propertyId
        }
      });
    }
  } catch (error) {
    console.error("Verify QR Error:", error);
    return res.status(500).json({ success: false, message: 'خطأ في التحقق' });
  }
};