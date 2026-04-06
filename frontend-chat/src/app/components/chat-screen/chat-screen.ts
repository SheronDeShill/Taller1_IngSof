import { Component, Input, OnInit, OnChanges, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common'; // Cambiado a @angular/common
import { FormsModule } from '@angular/forms'; // Mantenido para el [(ngModel)]
import { ChatService } from '../../services/chat';
import { SocketService } from '../../services/socket.service';

@Component({
  selector: 'app-chat-screen',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-screen.html',
  styleUrl: './chat-screen.css'
})
export class ChatScreen implements OnInit, OnChanges {
  @Input() groupId!: number;
  mensajes = signal<any[]>([]); // Usamos signals para consistencia
  nuevoMensaje: string = '';
  usuarioId = localStorage.getItem('usuario_id'); // Identificador del emisor

  constructor(private chatService: ChatService, private socketService: SocketService) {}

  ngOnInit() {
    this.cargarChat();
    // Escuchar mensajes nuevos por Sockets
    this.socketService.onNewMessage().subscribe((msg) => {
      if (msg.id_grupo === this.groupId || msg.idgrupo === this.groupId) {
        this.mensajes.update(prev => [...prev, msg]);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['groupId'] && !changes['groupId'].firstChange) {
      this.cargarChat();
    }
  }

  cargarChat() {
    this.chatService.getMessages(this.groupId).subscribe(data => {
      this.mensajes.set(data); // Cargar historial de MySQL
      this.socketService.joinGroup(this.groupId); // Unirse a la sala
    });
  }

  enviar() {
    if (this.nuevoMensaje.trim()) {
      this.socketService.sendMessage(this.groupId, this.nuevoMensaje);
      this.nuevoMensaje = ''; // Limpiar input
    }
  }
}