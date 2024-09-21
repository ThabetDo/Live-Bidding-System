import express from 'express';
import 'dotenv';
import http from 'http';
import SocketService from './services/socket';
const app = express();

async function start() {

    const socketService = new SocketService();

    const httpServer = http.createServer(app);
    const PORT = process.env.PORT || 8000;

    socketService.io.attach(httpServer);

    httpServer.listen(PORT, () => {
        console.log('Server running at PORT' + PORT);
    });

    socketService.startListners();
}

start();