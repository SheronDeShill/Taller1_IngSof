const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());

/// VER LAS PETICIONES
app.use((req, res, next) => {
    console.log(`Petición recibida: ${req.method} ${req.url}`);
    next();
});
////

const authRoutes = require('./src/routes/auth.routes');
const chatRoutes = require('./src/routes/chat.routes');
const socketAuth = require('./src/middlewares/socketAuth');
const registerChatHandlers = require('./src/socket/chat.socket');
const { Socket } = require('dgram');

require('./src/config/db');

app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);

app.get('/',(req , res) => {
    res.send('Servidor funcionando');
});

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
});

io.use(socketAuth);

io.on('connection', (socket) => {
    console.log(`Usuario conectado: ${socket.id} - ${socket.user.nombre_usuario}`);
  registerChatHandlers(io, socket);
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () =>{
    console.log(`Servidor en http://localhost:${PORT}`);
})

console.log('Inicio de server.js');
