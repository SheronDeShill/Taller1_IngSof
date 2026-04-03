import 'dart:convert';
import 'package:http/http.dart' as http;

class AuthService {
  // localhost es 10.0.2.2 en android
  final String baseUrl = "http://10.189.66.124:3000/api/auth";

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
    final response = await http.post(
      Uri.parse('$baseUrl/login'),
      headers: {"Content-Type": "application/json"},
      body: jsonEncode({"email": email, "contrasena": password}),
    );
    
    if (response.statusCode == 200) {
      // Aquí se guarda el ID del usuario que viene de del MySQL
      return true;
    }
    return false;
  }
}