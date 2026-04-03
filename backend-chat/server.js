const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());

console.log('Inicio de server.js');

require('./src/config/db');

app.get('/',(req , res) => {
    res.send('Servidor funcionando');
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () =>{
    console.log(`Servidor en http://localhost:${PORT}`);
})

const authRoutes = require('./src/routes/auth.routes');
app.use(express.json());
app.use('/api/auth', authRoutes);
