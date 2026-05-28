import express from 'express';
import 'dotenv/config';
import { createServer } from 'http';
import { Server } from 'socket.io';
import { connectedDb } from './config/db.js';
import { UserRouter } from './routes/User.js';
import { OwnerRouter } from './routes/owner.js';
import { logsRouter } from './routes/Logs.js'; 
import { GateRouter } from './routes/gates.js'; 
import cors from 'cors';
import qrRouter from './routes/qrRouter.js';

const app = express();
const port = 4000;

// الـ Middlewares
app.use(express.json());

// 1. تشغيل الـ CORS بالروابط الكاملة مكتوبة نصوص صريحة جوة المصفوفة مباشرة
app.use(cors({
    origin: ["https://sedi-henesh-gate.surge.sh", "https://sedi-henesh-gate-admin.surge.sh"],
    credentials: true
}));

app.options('*', cors({
    origin: ["https://sedi-henesh-gate.surge.sh", "https://sedi-henesh-gate-admin.surge.sh"],
    credentials: true
}));

// 2. تحويل الـ app إلى HTTP Server عشان السوكيت يشتغل صح
const httpServer = createServer(app);

// 3. إعداد الـ Socket.io وتمرير نفس الروابط الكاملة له
const io = new Server(httpServer, {
    cors: {
        origin: ["https://sedi-henesh-gate.surge.sh", "https://sedi-henesh-gate-admin.surge.sh"],
           credentials:true
    }
});
global.io = io; // الحركة دي بتخلينا ننده io.emit في أي مكان في المشروع

// اختبار السوكيت عند الاتصال (مبدئياً للتيست)
io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);
    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// الراوتس الأساسية
app.get('/', (req, res) => {
    res.end("server is running now");
});

app.use('/api/user', UserRouter);
app.use('/api/owner', OwnerRouter);
app.use('/api/gate', GateRouter);
app.use('/api', qrRouter);
app.use('/api/logs', logsRouter); // 4. تشغيل راوت اللوجز الجديد

// الاتصال بالداتا بيز
connectedDb();

// 5. تشغيل الـ httpServer بدل app.listen
httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});