import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoadDataComponent } from './load-data/load-data.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  // { path: 'user', component: UserComponent, pathMatch: 'full' },
  { path: 'user', component: UserComponent, pathMatch: 'full' },
  { path: 'userr', component: LoadDataComponent, pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class IthouseRoutingModule { }
