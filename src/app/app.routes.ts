import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { AppointmentComponent } from './pages/appointment/appointment.component';


export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Login | The Editorial Barber'
  },
  {
    path: 'appointment',
    component: AppointmentComponent,
    title: 'Appointment | The Editorial Barber'
  }
];
