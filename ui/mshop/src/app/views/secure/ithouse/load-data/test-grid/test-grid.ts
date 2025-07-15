import { Component } from '@angular/core';
import { AngularGridInstance, AngularSlickgridModule, Column, FieldType, GridOption, Metrics, Pagination } from 'angular-slickgrid';

@Component({
  selector: 'app-test-grid',
  imports: [AngularSlickgridModule],
  templateUrl: './test-grid.html',
  styleUrl: './test-grid.scss'
})
export class TestGrid {
angularGridReady($event: Event) {
throw new Error('Method not implemented.');
}
columnDefinitions: Column[]=[];
gridOptions: any;
dataset: any[];
paginationOptions: Pagination;

}
