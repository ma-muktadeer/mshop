import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IthouseGridBody } from './ithouse-grid-body/ithouse-grid-body';
import { IthouseGridPagination } from './ithouse-grid-pagination/ithouse-grid-pagination';
import { IthouseGrid } from './ithouse-grid/ithouse-grid';

@NgModule({
  declarations: [IthouseGrid],
  imports: [
    CommonModule,
    IthouseGridBody,
    IthouseGridPagination
  ],
  exports: [IthouseGrid]
})
export class IthouseGridModule { }
