import jwt from "jsonwebtoken";

export const authAdmin = async (req, res, next) => {
  try {
    const token = req.headers.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }
    const decoded_token = jwt.verify(token, process.env.JWT_TOKEN);
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Invalid Token" });
  }
};


const JWT_SECRET = process.env.JWT_SECRET || 'ahmed';

export const verifyToken = (req, res, next) => {
  try {
    // 1. نقرأ التوكن من الـ Header
    const token = req.headers.authorization?.split(" ")[1];
    
    if (!token) {
      return res.status(401).json({ success: false, message: "غير مصرح لك، التوكن مفقود" });
    }

    // 2. نفك التوكن ونطلع البيانات المتشفرة جواه (الـ ID والـ Role)
    const decoded = jwt.verify(token, JWT_SECRET);
    
    // 3. نحط البيانات دي جوه req.user عشان الدوال اللي بعده تشوفها
    req.user = decoded; 
    
    next(); // كمّل وروح للدالة اللي عليها الدور (زي generatePersonalQr)
  } catch (error) {
    return res.status(403).json({ success: false, message: "جلسة منتهية أو توكن غير صالح" });
  }
};