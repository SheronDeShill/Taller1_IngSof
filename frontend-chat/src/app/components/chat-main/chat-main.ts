import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatList } from '../chat-list/chat-list'; // Asegúrate que la ruta sea correcta
import { ChatScreen } from '../chat-screen/chat-screen';

@Component({
  selector: 'app-chat-main',
  standalone: true,
  imports: [CommonModule, ChatList, ChatScreen],
  templateUrl: './chat-main.html',
  styleUrl: './chat-main.css'
})
export class ChatMain {
  selectedGroupId: number | null = null;
  selectedGroupName: string = '';

  // Esta función se activa cuando haces clic en un grupo de la lista
  onGroupSelected(group: any) {
    this.selectedGroupId = group.idgrupo;
    this.selectedGroupName = group.nombre_grupo;
  }
}