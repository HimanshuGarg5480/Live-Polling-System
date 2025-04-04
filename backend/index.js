import express from 'express';
import { createServer } from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import { handleSocketEvents } from './socketHandlers.js';

const app = express();
app.use(cors());

const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

handleSocketEvents(io);

server.listen(4000, () => 
  console.log('!!Server is live on port 4000!!')
);
