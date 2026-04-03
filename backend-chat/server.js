const express = require('express');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

const authRoutes = require('./src/routes/auth.routes');
const chatRoutes = require('./src/routes/chat.routes');
const socketAuth = require('./src/middlewares/socketAuth');
const registerChatHandlers = require('./src/socket/chat.socket');
const { Socket } = require('dgram');

app.use(cors());

console.log('Inicio de server.js');

require('./src/config/db');

app.get('/',(req , res) => {
    res.send('Servidor funcionando');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () =>{
    console.log(`Servidor en http://localhost:${PORT}`);
})

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes)

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


