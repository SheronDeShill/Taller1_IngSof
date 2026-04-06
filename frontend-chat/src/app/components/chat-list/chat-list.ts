import { Component, OnInit, Output, EventEmitter, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatService } from '../../services/chat'; // Tu servicio de MySQL

@Component({
  selector: 'app-chat-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './chat-list.html',
  styleUrl: './chat-list.css'
})
export class ChatList implements OnInit {
  grupos = signal<any[]>([]);
  @Output() groupSelected = new EventEmitter<any>();

  constructor(private chatService: ChatService) {}

  ngOnInit() {
    // Cargamos los grupos al iniciar la web
    this.chatService.getGroups().subscribe({
      
      next: (data) => {
      console.log('Grupos cargados de MySQL:', data); // <--- Aquí va el log
      this.grupos.set(data);
    },
      error: (err) => console.error('Error cargando grupos de MySQL:', err)
    });
  }

  selectGroup(grupo: any) {
    this.groupSelected.emit(grupo);
  }

crearNuevoGrupo() {
  const nombre = prompt('Introduce el nombre del nuevo grupo:');
  
  if (nombre && nombre.trim()) {
    this.chatService.createGroup(nombre).subscribe({
      next: (res) => {
        alert('Grupo creado con éxito');
        // Refrescamos la lista para ver el nuevo grupo
        this.chatService.getGroups().subscribe(data => this.grupos.set(data));
      },
      error: (err) => {
        console.error('Error al crear grupo:', err);
        alert('No se pudo crear el grupo. Revisa la conexión con Node.js');
      }
    });
  }
}

}