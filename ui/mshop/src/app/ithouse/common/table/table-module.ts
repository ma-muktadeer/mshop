import { NgModule } from '@angular/core';
import { Table } from './table';
import { TableBody } from './table-body/table-body';
import { TablePagination } from './table-pagination/table-pagination';

@NgModule({
  declarations: [Table],
  imports: [
    TableBody,
    TablePagination
  ],
  exports: [
    Table
  ]
})
export class TableModule { }
