import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { RegisterComponent } from './register/register';
// Importa los nuevos componentes que crearemos
//import { ChatList } from './components/chat-list/chat-list';
//import { ChatScreen } from './components/chat-screen/chat-screen';
import { ChatMain } from './components/chat-main/chat-main';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'chat-list', component: ChatMain },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];