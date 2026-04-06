import 'package:flutter/material.dart';
import '../services/group_service.dart'; 
import '../models/message_model.dart';
import 'package:socket_io_client/socket_io_client.dart' as IO;
import '../services/auth_service.dart';

class ChatScreen extends StatefulWidget {
  final int groupId;
  final String groupName;

  ChatScreen({required this.groupId, required this.groupName});

  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final TextEditingController _messageController = TextEditingController();

late IO.Socket socket;
  List<Message> messages = []; //

  @override
  void initState() {
    super.initState();
    _loadInitialMessages(); // 
    _initSocket();          //
  }

  void _loadInitialMessages() async {
    try {
      
      final initialMessages = await GroupService().getMessages(widget.groupId);
      setState(() {
        messages = initialMessages;
      });
    } catch (e) {
      print("Error cargando historial: $e");
    }
  }

  void _initSocket() {
    // USAR IP DEL COMPUTADOR EN USO
    socket = IO.io('http://192.168.1.81:3000', <String, dynamic>{
      'transports': ['websocket'],
      'autoConnect': false, // Lo manejaremos nosotros manualmente
      'auth': {'token': AuthService.userToken} 
    });

    socket.connect();

    socket.onConnect((_) {
    print('✅ SOCKET CONECTADO'); 
    socket.emit('join_group', {'groupId': widget.groupId}); // Esto DEBE salir en Node
  });

    //
    socket.on('new_message', (data) {
  print("📩 ¡Mensaje recibido por Socket!: $data"); // DEBUG PARA TU SAMSUNG
  if (mounted) {
    setState(() {
      // Usamos insert(0, ...) si quieres que aparezca arriba, o add() para abajo
      messages.add(Message.fromJson(data));
    });
  }
});
socket.onConnectError((data) => print('❌ ERROR DE CONEXIÓN: $data'));
  }

  @override
void dispose() {
  // 1. Avisamos al servidor que nos vamos de la sala antes de cerrar
  socket.emit('leave_group', {'groupId': widget.groupId}); 
  
  // 2. Quitamos todos los "oídos" (listeners) para que no se dupliquen al volver a entrar
  socket.clearListeners(); 
  
  // 3. Cerramos la conexión de radio
  socket.disconnect(); 
  
  _messageController.dispose();
  super.dispose();
}
///////////////////////////
  void _handleSendMessage() {
    String text = _messageController.text.trim(); 

    if (text.isEmpty) return;

    // 1. Enviamos al Socket (Él se encarga de MySQL y del tiempo real)
    socket.emit('send_message', {
      'groupId': widget.groupId,
      'contenido': text,
    });

    // 2. Limpiamos el campo de texto inmediatamente
    _messageController.clear();
  } // <--- AQUÍ SE CIERRA LA FUNCIÓN CORRECTAMENTE

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.groupName),
        backgroundColor: Color(0xFF075E54),
      ),
      body: Column(
        children: [
          Expanded(
          child: ListView.builder(
            itemCount: messages.length, // Usa la lista local que definimos
            itemBuilder: (context, index) {
              final msg = messages[index];
              return ListTile(
                title: Text(
                  msg.senderName, 
                  style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 12)
                ),
                subtitle: Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: Colors.grey[200], 
                    borderRadius: BorderRadius.circular(10)
                  ),
                  child: Text(msg.content),
                ),
              );
            },
          ),
          ),
          _buildMessageInput(),
        ],
      ),
    );
  }

  Widget _buildMessageInput() {
    return Padding(
      padding: EdgeInsets.all(8.0),
      child: Row(
        children: [
          Expanded(child: TextField(controller: _messageController, decoration: InputDecoration(hintText: "Escribe un mensaje..."))),
          IconButton(icon: Icon(Icons.send, color: Color(0xFF075E54)),
          onPressed: _handleSendMessage, //
          ),
        ],
      ),
    );
  }
}