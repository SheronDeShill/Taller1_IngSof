import 'package:http/http.dart' as http;
import 'dart:convert';
import '../models/group_model.dart';
import '../models/message_model.dart';
import 'auth_service.dart';

class GroupService {
  final String baseUrl = "http://192.168.1.81:3000/api/chat/grupos"; // CAMBIAR IP POR LA DEL COMPUTADOR EN USO

  Future<List<Group>> getGroups() async {
    final response = await http.get(Uri.parse(baseUrl),
    headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ${AuthService.userToken}', // token
    },);

    if (response.statusCode == 200) {
      List jsonResponse = json.decode(response.body);
      return jsonResponse.map((data) => Group.fromJson(data)).toList();
    } else {
      throw Exception('Fallo al cargar grupos');
    }
  }

  Future<List<Message>> getMessages(int groupId) async {
  final response = await http.get(
    Uri.parse("http://192.168.1.81:3000/api/chat/grupos/$groupId/mensajes"),
    headers: {
      'Authorization': 'Bearer ${AuthService.userToken}',
    },
  );

  if (response.statusCode == 200) {
    List jsonResponse = json.decode(response.body);
    return jsonResponse.map((data) => Message.fromJson(data)).toList();
  } else {
    throw Exception('Error al cargar mensajes');
  }
}


Future<bool> sendMessage(int groupId, String content) async {
  final response = await http.post(
    Uri.parse("http://192.168.1.81:3000/api/chat/grupos/$groupId/mensajes"),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${AuthService.userToken}', // Enviamos la "llave"
    },
    body: json.encode({'contenido': content}),
  );

  return response.statusCode == 201;
}


Future<int?> createNewGroup(String name) async {
  final response = await http.post(
    Uri.parse("http://192.168.1.81:3000/api/chat/grupos"),
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ${AuthService.userToken}',
    },
    body: json.encode({'nombre_grupo': name, 'es_privado': 0}),
  );

  print("Respuesta del servidor: ${response.body}"); //////////////////////

  if (response.statusCode == 201) {
    final data = json.decode(response.body);
    
    return int.tryParse(data['idgrupo'].toString());
    //return data['idgrupo']; // Retornamos el ID que viene de MySQL
  }
  return null;
}


}
