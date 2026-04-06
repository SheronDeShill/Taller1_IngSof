
const db = require('../config/db');

const getUserGroups = (userId) => {
    return new Promise((resolve, reject) => {
    db.query(
      // ARREGLO PARA GRUPOS PUBLICOS:
      `SELECT DISTINCT g.idgrupo, g.nombre_grupo, g.es_privado
      FROM grupos g
      LEFT JOIN miembros_grupo mg ON g.idgrupo = mg.idgrupo
      WHERE g.es_privado = 0 OR mg.idusuario = ?`,
       [userId], (err, results) => {
        if (err) reject(err);
        else resolve(results);
       }
    );
 });  
};

const isUserInGroup = (userId, groupId) => {
    return new Promise ((resolve, reject) => {
        db.query(
        `SELECT * FROM miembros_grupo
        WHERE idusuario = ? AND idgrupo = ?`,
        [userId, groupId],
        (err, results) => {
            if(err) reject(err);
            else resolve(results.length > 0);
        }
        );
    });
};

const saveMessage = (groupId, userId , contenido) =>{
    return new Promise((resolve, reject) =>{
        db.query(
       `INSERT INTO mensajes (idgrupo, idusuario_emisor, contenido)
        VALUES (?, ?, ?)`,
        [groupId, userId , contenido],
        (err, results) =>{
            if (err) {
                    console.error("ERROR EN MYSQL:", err); // para ver el error
                    reject(err);
                } else {
                    // Cambia 'results.length > 0' por 'results' o 'true'
                    // Los INSERT no devuelven .length, por eso fallaba el resolve
                    resolve(results); 
                }
            }
        );
    });
};

const getMessagesByGroup = (groupId) => {
    return new Promise ((resolve, reject) => {
        db.query(
         `SELECT 
         m.idmensaje,
         m.idgrupo,
         m.idusuario_emisor,
         u.nombre_usuario,
         m.contenido,
         m.fecha_envio
       FROM mensajes m
       INNER JOIN usuario u ON m.idusuario_emisor = u.idusuario
       WHERE m.idgrupo = ?
       ORDER BY m.fecha_envio ASC`,
       [groupId],
       (err, results) => {
        if (err) reject(err);
        else resolve(results);
       }
    );
    });
};

const createGroup = (nombre_grupo, es_privado) => {
    return new Promise((resolve, reject) => {
        db.query(
      `INSERT INTO grupos (nombre_grupo, es_privado) VALUES (?, ?)`,
      [nombre_grupo, es_privado],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};

const addMemberToGroup = (userId, groupId) => {
  return new Promise((resolve, reject) => {
    db.query(
      `INSERT INTO miembros_grupo (idusuario, idgrupo) VALUES (?, ?)`,
      [userId, groupId],
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
  });
};


module.exports = {
  getUserGroups,
  isUserInGroup,
  saveMessage,
  getMessagesByGroup,
  createGroup,
  addMemberToGroup
};