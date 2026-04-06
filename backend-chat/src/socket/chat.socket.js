const {
    isUserInGroup,
    saveMessage
} = require('../models/chat.model');

const registerChatHandlers = (io, socket) =>{
    socket.on('join_group', async ({ groupId }) => {
    try {
        // 1. Salir de cualquier sala previa para evitar "ecos"
        const rooms = Array.from(socket.rooms);
        rooms.forEach(room => {
            if (room.startsWith('grupo_')) socket.leave(room);
        });

        const allowed = await isUserInGroup(socket.user.id, groupId);
        if (!allowed) return socket.emit('chat_error', { message: 'No perteneces' });

        // 2. Unirse a la nueva sala de forma limpia
        socket.join(`grupo_${groupId}`);
        console.log(`✅ Usuario ${socket.user.id} unido a sala: grupo_${groupId}`);
    } catch (error) {
        socket.emit('chat_error', { message: 'Error al unirse' });
    }
});

    socket.on('send_message', async ({ groupId, contenido }) => {
        try{
            if(!contenido || !contenido.trim()) return;

            const allowed = await isUserInGroup(socket.user.id, groupId);
            if (!allowed) {
                return socket.emit('chat_error', { message: 'No puedes escribir en este grupo' });
            }


      const result = await saveMessage(groupId, socket.user.id, contenido.trim());

      const payload = {
        idmensaje: result.insertId,
        idgrupo: groupId,
        idusuario_emisor: socket.user.id,
        nombre_usuario: socket.user.nombre_usuario || "Usuario",
        contenido: contenido.trim(),
        fecha_envio: new Date()
      };

      io.to(`grupo_${groupId}`).emit('new_message', payload);
        }catch (error){
            socket.emit('chat_error', { message: 'Error al enviar mensaje' });
        }
    });

    socket.on('leave_group', ({ groupId }) => {
        socket.leave(`grupo_${groupId}`);
        console.log(`Usuario salió de la sala: grupo_${groupId}`);
    });

    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.user.nombre_usuario}`);
    });
};

module.exports = registerChatHandlers