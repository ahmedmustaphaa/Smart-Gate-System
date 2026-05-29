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
const port = process.env.PORT || 4000;

// Middlewares
app.use(express.json());

// CORS لأي هوست
app.use(cors({
    origin: true,
    credentials: true
}));

// HTTP Server
const httpServer = createServer(app);

// Socket.io
const io = new Server(httpServer, {
    cors: {
        origin: true,
        credentials: true
    }
});

global.io = io;

// Socket Test
io.on('connection', (socket) => {
    console.log(`A user connected: ${socket.id}`);

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });
});

// Routes
app.get('/', (req, res) => {
    res.send('server is running now');
});

app.use('/api/user', UserRouter);
app.use('/api/owner', OwnerRouter);
app.use('/api/gate', GateRouter);
app.use('/api', qrRouter);
app.use('/api/logs', logsRouter);

// DB Connection
connectedDb();

// Start Server
httpServer.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});