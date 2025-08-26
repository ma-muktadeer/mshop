import { Component } from '@angular/core';
import { Column, Pagination } from 'angular-slickgrid';
import { IthouseGrid } from "../../../../../ithouse/shard-componenrts/grid/it-grid/it-grid";
@Component({
  selector: 'app-test-grid',
  imports: [IthouseGrid],
  templateUrl: './test-grid.html',
  styleUrl: './test-grid.scss'
})
export class TestGrid {
columnDefinitions: Column[]=[];
gridOptions: any;
dataset: any[];

}
