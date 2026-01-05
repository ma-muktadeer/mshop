import { NgModule } from '@angular/core';
import { Table } from './table';
import { TableBody } from './table-body/table-body';
import { TablePagination } from './table-pagination/table-pagination';

@NgModule({
  declarations: [],
  imports: [
    TableBody,
    TablePagination
  ],
  exports: [

  ]
})
export class TableModule { }
