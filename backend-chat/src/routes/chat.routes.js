const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { getUserGroups, isUserInGroup, getMessagesByGroup, createGroup, addMemberToGroup } = require ('../models/chat.model');

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

router.get('/grupos/:id/mensajes', authMiddleware, async (req, res) => {
    try{
        const groupId = Number(req.params.id);
        const allowed = await isUserInGroup(req.user.id, groupId);

        if(!allowed) {
            return res.status(403).json ({ message: 'No perteneces a este grupo'});
        }

        const mensajes = await getMessagesByGroup(groupId);
        res.json(mensajes);
    }catch (error) {
        res.status(500).json ({ message: 'Error al obtener mensajes', error: error.message });
    }
});

router.post('/grupos', authMiddleware, async (req, res) => {
  try {
    const { nombre_grupo, es_privado } = req.body;

    if (!nombre_grupo) {
      return res.status(400).json({ message: 'El nombre del grupo es obligatorio' });
    }

    const result = await createGroup(nombre_grupo, es_privado ? 1 : 0);

    await addMemberToGroup(req.user.id, result.insertId);

    res.status(201).json({
      message: 'Grupo creado correctamente',
      idgrupo: result.insertId
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al crear grupo',
      error: error.message
    });
  }
});

router.post('/grupos/:id/miembros', authMiddleware, async (req, res) => {
  try {
    const groupId = Number(req.params.id);
    const { idusuario } = req.body;

    if (!idusuario) {
      return res.status(400).json({ message: 'El id del usuario es obligatorio' });
    }

    await addMemberToGroup(idusuario, groupId);

    res.status(201).json({
      message: 'Usuario agregado al grupo correctamente'
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error al agregar usuario al grupo',
      error: error.message
    });
  }
});

module.exports = router;