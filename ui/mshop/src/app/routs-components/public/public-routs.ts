import { Routes } from "@angular/router";
import { Check } from "./check/check";
import { PageNotFound } from "./page-not-found/page-not-found";

export const publicRoutes: Routes = [
  {
    path: 'check', component: Check, pathMatch: 'full',
  },
  {
    path: 'page-not-found', component: PageNotFound, pathMatch: 'full',
  }
];
