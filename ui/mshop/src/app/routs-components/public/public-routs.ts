import { Routes } from "@angular/router";
import { Check } from "./check/check";

export const publicRoutes: Routes = [
  {
    path: 'check', component: Check, pathMatch: 'full',
  },
];
