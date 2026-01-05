import { NgModule } from '@angular/core';
import { IthouseGridBody } from './ithouse-grid-body/ithouse-grid-body';
import { IthouseGridPagination } from './ithouse-grid-pagination/ithouse-grid-pagination';
import { IthouseGrid } from './ithouse-grid/ithouse-grid';

@NgModule({
  declarations: [IthouseGrid],
  imports: [
    IthouseGridBody,
    IthouseGridPagination
  ],
  exports: [IthouseGrid]
})
export class IthouseGridModule { }
