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

app.use(express.json());

// CORS لأي هوست
app.use(cors({
    origin: true,
    credentials: true
}));

app.options('*', cors({
    origin: true,
    credentials: true
}));

const httpServer = createServer(app);

// Socket.io CORS لأي هوست
const io = new Server(httpServer, {
    cors: {
        origin: true,
        credentials: true
    }
});

global.io = io;

io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

app.get('/', (req, res) => {
    res.end("server is running now");
});

app.use('/api/user', UserRouter);
app.use('/api/owner', OwnerRouter);
app.use('/api/gate', GateRouter);
app.use('/api', qrRouter);
app.use('/api/logs', logsRouter);

connectedDb();

httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});