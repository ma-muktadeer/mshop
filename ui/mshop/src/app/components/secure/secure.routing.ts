import { Routes } from "@angular/router";
import { User } from "./user/user";

export const secureRoutes: Routes = [
  {
    path: 'userr',
    loadComponent: () => User,
    pathMatch: 'full'
  }
]
