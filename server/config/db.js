import mongoose from 'mongoose';

export const connectedDb = async () => {
     try {
        // 1. الاتصال أولاً
        await mongoose.connect(process.env.MONGODB);
        
        // 2. الطباعة بعد نجاح الاتصال فعلياً
        console.log("MongoDB Connected Successfully");
     } catch (error) {
        console.log("MongoDB Connection Error:", error.message);
        process.exit(1); // إيقاف السيرفر فوراً لعدم استمرار تشغيله معطل بالخطأ
     }
}