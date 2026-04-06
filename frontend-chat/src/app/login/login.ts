import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent {
  credenciales = {
    email: '',
    contrasena: ''
  };

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.credenciales).subscribe({
      next: (res) => {
        console.log('Login exitoso:', res);

        localStorage.setItem('token', res.token);
        localStorage.setItem('usuario_id', res.id); 

        alert('¡Bienvenido al Chat!');
        this.router.navigate(['/chat-list']); // Redirigir a la lista de chats
      },
      error: (err) => {
        console.error('Error en login:', err);
        alert('Credenciales incorrectas.');
      }
    });
  }
}