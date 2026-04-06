import 'package:flutter/material.dart';
import '../services/group_service.dart';
import 'chat_screen.dart';

class ChatListScreen extends StatefulWidget {
  @override
  _ChatListScreenState createState() => _ChatListScreenState();
}

class _ChatListScreenState extends State<ChatListScreen> {
  // Función para refrescar la lista
  void _refresh() {
    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("Lista de chats"),
        backgroundColor: const Color(0xFF075E54),
        actions: [IconButton(icon: const Icon(Icons.search), onPressed: () {})],
      ),
      body: FutureBuilder(
        future: GroupService().getGroups(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (snapshot.hasError) {
            return const Center(child: Text("Error al cargar los grupos"));
          }

          final groups = snapshot.data as List;

          return ListView.builder(
            itemCount: groups.length,
            itemBuilder: (context, index) {
              return ListTile(
                leading: const CircleAvatar(
                  backgroundColor: Color(0xFF128C7E),
                  child: Icon(Icons.group, color: Colors.white),
                ),
                // 
                title: Text(groups[index].nombre, style: const TextStyle(fontWeight: FontWeight.bold)),
                subtitle: Text(groups[index].esPrivado ? "Grupo Privado" : "Grupo Público"),
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => ChatScreen(
                        groupId: groups[index].id,
                        groupName: groups[index].nombre,
                      ),
                    ),
                  ).then((_) => _refresh()); //
                },
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        backgroundColor: const Color(0xFF075E54),
        child: const Icon(Icons.add, color: Colors.white),
        onPressed: () => _showCreateGroupDialog(context),
      ),
    );
  }

  // FUNCIÓN DIÁLOGO
  void _showCreateGroupDialog(BuildContext context) {
    final TextEditingController _nameController = TextEditingController();

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text("Nuevo Grupo"),
        content: TextField(
          controller: _nameController,
          decoration: const InputDecoration(hintText: "Nombre del grupo"),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("Cancelar"),
          ),
          ElevatedButton(
            onPressed: () async {
    final nombre = _nameController.text.trim();
    if (nombre.isNotEmpty) {
      // 1. Llamamos al servicio y esperamos el ID de MySQL
      final int? newId = await GroupService().createNewGroup(nombre);
      
      if (newId != null) {
        // 2. Cerramos el diálogo en el Samsung
        Navigator.of(context, rootNavigator: true).pop(); 
        
        // 3. Saltamos directo al chat recién creado
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (context) => ChatScreen(
              groupId: newId,
              groupName: nombre,
            ),
          ),
        ).then((_) => _refresh()); // Refresca la lista al volver
      } else {
        // Opcional: Mostrar un error si el ID no llegó
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text("Error al obtener ID del nuevo grupo")),
        );
      }
    }
  },
            child: const Text("Crear"),
          ),
        ],
      ),
    );
  }
}