const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { json } = require('express');
const jwt = require('jsonwebtoken');

const { findUserByEmail, createUser } = require('../models/auth.model');

const register = async (req, res) => {
    try{
        const { nombre_usuario, email, contrasena } = req.body;

        if (!nombre_usuario || !email || !contrasena){
            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            });
        }

        const existingUser = await findUserByEmail(email);
        if (existingUser.length > 0){
            return res.status(400).json ({ message: 'Usuario ya existente' });
        }
        
        const hashedPassword = await bcrypt.hash(contrasena, 10);

        await createUser(nombre_usuario, email, hashedPassword);

        return res.status(201).json({ message: 'Usuario registrado correctamente'});

        } catch (error) {
        return res.status(500).json({
            message: 'Error interno',
            error: error.message
        });
    }
    }; 

const login = async (req, res) => {
    try{
        const{ email, contrasena } = req.body;
        
        const results = await findUserByEmail(email);
        if (results.length === 0){
            return res.status(401).json({ message: 'Credenciales incorrectas'});
        }

        const user = results[0];

        const match = await bcrypt.compare(contrasena, user.contrasena);

        if(!match){
            return res.status(401).json({ message: 'Credenciales incorrectas'});
        }

        const token = jwt.sign(
        { 
            id: user.idusuario,
            email: user.email,
            nombre_usuario: user.nombre_usuario
        },
         process.env.JWT_SECRET,
         { expiresIn: '2h' }
       );

       res.json({ message: 'Login exitoso', token,
    user: {
        id: user.idusuario,
        nombre: user.nombre_usuario
    }
});

    } catch (error) {
    res.status(500).json({ message: 'Error interno', error: error.message });
  }
};

module.exports = { register, login };