import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth';

@Component({
  selector: 'app-register',
  standalone: true, 
  imports: [CommonModule, FormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.css'] 
})
export class RegisterComponent {
  //
  nuevoUsuario = {
    nombre_usuario: '',
    email: '',
    contrasena: ''
  };

  constructor(private authService: AuthService) {}

  onSubmit() {
    this.authService.registrar(this.nuevoUsuario).subscribe({
      next: (res) => {
        console.log('Respuesta del servidor:', res);
        alert('¡Usuario registrado con éxito!');
      },
      error: (err) => {
        console.error('Error al conectar con el backend:', err);
        alert('Hubo un error al registrar el usuario.');
      }
    });
  }
}