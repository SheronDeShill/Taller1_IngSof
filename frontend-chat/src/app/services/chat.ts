import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  //CAMBIAR POR IP DEL COMPUTADOR A USAR
  private apiUrl = 'http://192.168.1.81:3000/api/chat';

  constructor(private http: HttpClient) { }

  // 1. Método privado para generar las cabeceras de seguridad
  private getHeaders() {
    // En la web, el token se suele guardar en localStorage al hacer login
    const token = localStorage.getItem('token'); 
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // La "llave" para entrar a MySQL
      })
    };
  }

  // 2. Obtener grupos (Copia fiel de lo que hicimos en Flutter)
  getGroups(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/grupos`, this.getHeaders());
  }

  // 3. Crear grupo enviando 'nombre_grupo'
  createGroup(nombre: string): Observable<any> {
    const body = { nombre_grupo: nombre, es_privado: 0 };
    return this.http.post(`${this.apiUrl}/grupos`, body, this.getHeaders());
  }

  // 4. Traer mensajes de un grupo específico
  getMessages(groupId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/grupos/${groupId}/mensajes`, this.getHeaders());
  }
}