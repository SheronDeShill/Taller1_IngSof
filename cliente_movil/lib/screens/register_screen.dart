import 'package:flutter/material.dart';
import '../services/auth_service.dart';

class RegisterScreen extends StatefulWidget {
  @override
  _RegisterScreenState createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _usernameController = TextEditingController();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  final _authService = AuthService();

  void _handleRegister() async {
    bool success = await _authService.register(
      _usernameController.text,
      _emailController.text,
      _passwordController.text,
    );

    if (success) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("¡Registrado en MySQL con éxito!")),
      );
      Navigator.pop(context); // Volver al Login (icono de volver automatico, icono chino ??)
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text("Error al registrar")),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Color(0xFFF0F2F5), //
      appBar: AppBar(title: Text("Registro"), backgroundColor: Color(0xFF00A884)),
      body: Padding(
        padding: EdgeInsets.all(20),
        child: Column(
          children: [
            TextField(controller: _usernameController, decoration: InputDecoration(labelText: "Usuario")),
            TextField(controller: _emailController, decoration: InputDecoration(labelText: "Email")),
            TextField(controller: _passwordController, decoration: InputDecoration(labelText: "Contraseña"), obscureText: true),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: _handleRegister,
              style: ElevatedButton.styleFrom(backgroundColor: Color(0xFF00A884)),
              child: Text("Registrarse", style: TextStyle(color: Colors.white)),
            )
          ],
        ),
      ),
    );
  }
}