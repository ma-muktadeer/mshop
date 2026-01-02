import { Routes } from "@angular/router";
import { User } from "./user/user";
import { PageNotFound } from "../public/page-not-found/page-not-found";

export const adminRoutes: Routes = [
  {
    path: 'users',
    loadComponent: () => User,
    pathMatch: 'full'
  },
  {
    path: 'page-not-found',
    loadComponent: () => PageNotFound,
    pathMatch: 'full'
  },
]
