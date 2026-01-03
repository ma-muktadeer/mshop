import { Routes } from "@angular/router";
import { User } from "./user/user";
import { PageNotFound } from "../public/page-not-found/page-not-found";
import { Permission } from "./admin/permission/permission";
import { Role } from "./admin/role/role";

export const adminRoutes: Routes = [
  {
    path: 'users',
    loadComponent: () => User,
    pathMatch: 'full'
  },
  {
    path: "permission",
    loadComponent: () => Permission,
    pathMatch: "full"
  },
  {
    path: 'roles', component: Role, pathMatch: 'full',
  },
  {
    path: 'page-not-found',
    loadComponent: () => PageNotFound,
    pathMatch: 'full'
  },
]
