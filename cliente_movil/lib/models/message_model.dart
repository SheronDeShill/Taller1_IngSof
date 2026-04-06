class Message {
  final int id;
  final String senderName;
  final String content;
  final DateTime timestamp;

  Message({required this.id, required this.senderName, required this.content, required this.timestamp});

  factory Message.fromJson(Map<String, dynamic> json) {
    return Message(
      id: json['idmensaje'],
      senderName: json['nombre_usuario'], //
      content: json['contenido'],
      timestamp: DateTime.parse(json['fecha_envio']),
    );
  }
}