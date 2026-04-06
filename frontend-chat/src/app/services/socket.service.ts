import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SocketService {
  private socket: Socket;

  constructor() {
    // Usamos la IP de tu PC que configuramos en el Samsung
    const token = localStorage.getItem('token');
    this.socket = io('http://192.168.1.81:3000', {
      auth: { token },
    transports: ['websocket']
    });
  }

  joinGroup(groupId: number) {
    this.socket.emit('leave_group', { groupId }); // Limpieza previa
    this.socket.emit('join_group', { groupId });
  }

  sendMessage(groupId: number, contenido: string) {
    this.socket.emit('send_message', { groupId, contenido });
  }

  onNewMessage(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('new_message', (data) => {
      console.log('¡Mensaje recibido por Socket!:', data); // <--- DEBUG
      observer.next(data);
    });
  });
}
}