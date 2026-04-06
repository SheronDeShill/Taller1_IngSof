const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getUserGroups, isUserInGroup, getMessagesByGroup, createGroup, addMemberToGroup, saveMessage } = require ('../models/chat.model');

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if(!authHeader) {
        return res.status(401).json ({ message: 'Token no propocionado' })
    }

    const token = authHeader.split(' ')[1];

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch{
        return res.status(401).json ({ message: 'Token Invalido'});
    }
};

router.get('/grupos', authMiddleware, async (req, res) => {
    try{
        const grupos = await getUserGroups(req.user.id);
        res.json(grupos);
    } catch(error){
        res.status(500).json ({ message: 'Error al obtener grupos', error: error.message });
    }
});

//router.get('/grupos/:id/mensajes', authMiddleware, async (req, res) => {
//    try{
//        const groupId = Number(req.params.id);
//        const allowed = await isUserInGroup(req.user.id, groupId);
//
//        if(!allowed) {
//            return res.status(403).json ({ message: 'No perteneces a este grupo'});
//        }
//
//        const mensajes = await getMessagesByGroup(groupId);
//        res.json(mensajes);
//    }catch (error) {
//        res.status(500).json ({ message: 'Error al obtener mensajes', error: error.message });
//    }
//});


router.get('/grupos/:id/mensajes', authMiddleware, async (req, res) => {
    try {
        const groupId = Number(req.params.id);
        const userId = req.user.id;

        // 1. Verificar si ya es miembro
        let allowed = await isUserInGroup(userId, groupId);

        // 2. Si no es miembro, lo unimos automáticamente
        if (!allowed) {
            await addMemberToGroup(userId, groupId); // Usa la función de tu chat.model.js
            console.log(`Usuario ${userId} unido automáticamente al grupo ${groupId}`);
        }

        // 3. traer los mensajes de MySQL
        const mensajes = await getMessagesByGroup(groupId);
        res.json(mensajes);
    } catch (error) {
        res.status(500).json({ message: 'Error al unirse', error: error.message });
    }
});


router.post('/grupos', authMiddleware, async (req, res) => {
  try {
    const { nombre_grupo, es_privado } = req.body;
    const userId = req.user.id;

    if (!nombre_grupo) {
      return res.status(400).json({ message: 'El nombre del grupo es obligatorio' });
    }

    const result = await createGroup(nombre_grupo, es_privado || 0);
    const newGroupId = result.insertId;

    await addMemberToGroup(userId, newGroupId);

    res.status(201).json({
            message: 'Grupo creado con éxito',
            idgrupo: newGroupId,
            nombre_grupo: nombre_grupo
        });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear grupo',
      error: error.message
    });
  }
});


//router.post('/grupos/:id/miembros', authMiddleware, async (req, res) => {
//  try {
//    const groupId = Number(req.params.id);
//    const { idusuario } = req.body;
//
//    if (!idusuario) {
//      return res.status(400).json({ message: 'El id del usuario es obligatorio' });
//    }
//
//    await addMemberToGroup(idusuario, groupId);
//
//    res.status(201).json({
//      message: 'Usuario agregado al grupo correctamente'
//    });
//  } catch (error) {
//    res.status(500).json({
//      message: 'Error al agregar usuario al grupo',
//      error: error.message
//    });
//  }
//});

router.post('/grupos/:id/mensajes', authMiddleware, async (req, res) => {
    try {
        const groupId = Number(req.params.id);
        const { contenido } = req.body;
        const userId = req.user.id; // Extraído del Token por el middleware

        if (!contenido) {
            return res.status(400).json({ message: 'El mensaje no puede estar vacío' });
        }

        console.log(`Intentando guardar mensaje de usuario ${userId} en grupo ${groupId}`);


        // Ejecuta el INSERT en la tabla mensajes
        await saveMessage(groupId, userId, contenido);

        res.status(201).json({ message: 'Mensaje guardado' });
    } catch (error) {
        console.error("ERROR EN RUTA POST MENSAJES:", error.message);
        res.status(500).json({ message: 'Error al guardar mensaje', error: error.message });
    }
});

module.exports = router;