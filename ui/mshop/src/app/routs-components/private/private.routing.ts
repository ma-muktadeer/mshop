import { Routes } from "@angular/router";
import { User } from "./user/user";

export const privateRoutes: Routes = [
  {
    path: 'userr',
    loadComponent: () => User,
    pathMatch: 'full'
  }
]
