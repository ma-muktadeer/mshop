import { Routes } from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';

export const regRoutes: Routes = [
  { path: '', loadComponent: () => RegistrationComponent, pathMatch: 'full' },

];
