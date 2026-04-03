const db = require('../config/db');

const findUserByEmail = (email) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM usuario WHERE email = ?', [email], (err, results) => {
            if(err) reject(err);
            else resolve(results);
        });
    });
};

const createUser = (nombre_usuario, email, contrasena) => {
    return new Promise ((resolve, reject) => {
        db.query('INSERT INTO usuario (nombre_usuario, email, contrasena) VALUES (?, ?, ?)', [nombre_usuario, email, contrasena],
            (err, result) => {
                if (err) reject (err);
                else resolve(result);
            }
        );
    });
};

module.exports = {
    findUserByEmail,
    createUser
};