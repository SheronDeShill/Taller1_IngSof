import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {

  static String? userToken;

  // localhost es 10.0.2.2 en android
  final String baseUrl = "http://192.168.1.81:3000/api/auth"; // CAMBIAR IP POR LA DEL COMPUTADOR EN USO

  Future<bool> register(String username, String email, String password) async {
    final response = await http.post(
      Uri.parse('$baseUrl/register'),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({
        "nombre_usuario": username,
        "email": email,
        "contrasena": password,
      }),
    );
    return response.statusCode == 200 || response.statusCode == 201;
  }

  Future<bool> login(String email, String password) async {
    try {
    final response = await http.post(
      Uri.parse('$baseUrl/login'),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"email": email, "contrasena": password}),
    );
    
    if (response.statusCode == 200) {
      var data = json.decode(response.body);
      String token = data['token']; // El backend debe enviar el token

      // Aquí se guarda (una variable estática por ahora)
      AuthService.userToken = token;

      return true; // éxito

    } else {
      return false; // credenciales incorrectas
    }
  } catch (e) {
    print("Error de conexión: $e");
    return false; // error de red o servidor apagado
  }
}
}