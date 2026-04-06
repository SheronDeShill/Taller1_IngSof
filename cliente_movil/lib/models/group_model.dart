class Group {
  final int id;
  final String nombre;
  final bool esPrivado;

  Group({required this.id, required this.nombre, required this.esPrivado});

  factory Group.fromJson(Map<String, dynamic> json) {
    return Group(
      id: json['idgrupo'], 
      nombre: json['nombre_grupo'], 
      esPrivado: json['es_privado'] == 1, 
    );
  }
}
