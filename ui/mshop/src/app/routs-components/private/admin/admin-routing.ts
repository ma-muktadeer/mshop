import { Routes } from "@angular/router";

export const adminRoutes: Routes = [
  {
    path: "permission",
    loadComponent: () =>
      import("./permission/permission").then((m) => m.Permission),
  }
]
