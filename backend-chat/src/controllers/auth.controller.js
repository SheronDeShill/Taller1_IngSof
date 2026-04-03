const db = require('../config/db');
const bcrypt = require('bcryptjs');
const { json } = require('express');
const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    try{
        const { nombre_usuario, email, contrasena } = req.body;

        if (!nombre_usuario || !email || !contrasena){
            return res.status(400).json({
                message: 'Todos los campos son obligatorios'
            });
        }

        db.query('SELECT * FROM usuario WHERE email = ?' , [email], async(err, results) => {
            if(err){
                return res.status(500).json({
                    message: 'Error en el servidor',
                    error: err.message
                });
            }

            if(results.length > 0){
                return res.status(400).json({
                    message: 'El correo ya esta registrado'
                });
            }

            const hashedPassword = await bcrypt.hash(contrasena, 10);

            db.query(
                'INSERT INTO usuario (nombre_usuario, email, contrasena) VALUES (?, ?, ?)',[nombre_usuario, email, hashedPassword],
                (err, result) => {
                    if(err){
                        return res.status(500).json({
                            message: 'Error al registrar el usuario',
                            error: err.message
                        });
                    }

                    return res.status(201).json({
                        message: 'usuario registrado correctamente',
                        userId: result.insertId
                    });
                }
            );
        });
    } catch (error){
        return res.status(500).json({
            message: 'Error interno',
            error: error.message
        });
    }
};

const login = (req, res) => {
    try{
        const{ email, contrasena } =req.body;

        if(!email || !contrasena){
            return res.status(400).json({
                message: 'Email y contrasena son obligatorios'
            });
        }
        
        db.query('SELECT * FROM usuario WHERE email = ?' , [email] , async (err, results) => {
            if(err){
                return res.status(500).json({
                    message: 'Error en el servidor',
                    error: err.message
                });
            }

            if(results.length === 0){
                return res.status(401).json({
                    message: 'Credenciales incorrectas'
                });
            }

            const usuario = results[0];

            const passwordMatch = await bcrypt.compare(contrasena, usuario.contrasena);

            if(!passwordMatch){
                return res.status(400).json({
                    message: 'Credendciales incorrectas'
                });
            }

            const token = jwt.sign(
                {
                    id: usuario.idusuario,
                    email: usuario.email,
                    nombre_usuario: usuario.nombre_usuario
                },
                process.env.JWT_SECRET,
                { expiresIn: '2h' }
            );

            return res.status(200).json({
                message: 'Login exitoso',
                token,
                User: {
                    id: usuario.idusuario,
                    nombre_usuario: usuario.nombre_usuario,
                    email: usuario.email
                }
            });
        });
    } catch(error){
        return res.status(500).json({
            message: 'Error interno',
            error: error.message
        });
    }
};

module.exports = { register, login };