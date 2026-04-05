const {
    isUserInGroup,
    saveMessage
} = require('../models/chat.model');

const registerChatHandlers = (io, socket) =>{
    socket.on('join_group', async ({ groupId }) => {
        try{
            const allowed = await isUserInGroup(socket.user.id, groupId);

            if (!allowed){
                return socket.emit('chat_error', { message: 'No perteneces a este grupo' });
            }
            socket.join(`grupo_${groupId}`);
            socket.emit('joined_group', {groupId});
        } catch(error) {
            socket.emit('chat_error', { message: 'Error al unirse al grupo'});
        }
    });

    socket.on('send_message', async ({ groupId, contenido }) => {
        try{
            if(!contenido || !contenido.trim()){
                return socket.emit('chat_error', { message: 'El mensaje esta vacio'});
            }

            const allowed = await isUserInGroup(socket.user.id, groupId);

            if (!allowed) {
        return socket.emit('chat_error', { message: 'No puedes escribir en este grupo' });
      }

      const result = await saveMessage(groupId, socket.user.id, contenido.trim());

      const payload = {
        idmensaje: result.insertId,
        idgrupo: groupId,
        idusuario_emisor: socket.user.id,
        nombre_usuario: socket.user.nombre_usuario,
        contenido: contenido.trim(),
        fecha_envio: new Date()
      };

      io.to(`grupo_${groupId}`).emit('new_message', payload);
        }catch (error){
            socket.emit('chat_error', { message: 'Error al enviar mensaje' });
        }
    });

    socket.on('disconnect', () => {
        console.log(`Usuario desconectado: ${socket.id}`);
    });

    socket.on('join_group', (data) => {
  console.log('JOIN recibido:', data);
  });

  socket.on('send_message', (data) => {
  console.log('MENSAJE recibido:', data);
});
};

module.exports = registerChatHandlers