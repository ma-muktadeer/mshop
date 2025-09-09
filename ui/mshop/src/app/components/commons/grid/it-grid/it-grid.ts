import { Component, effect, EventEmitter, Input, Output, Signal, ViewChild } from '@angular/core';
import { GridBody } from "../grid-body/grid-body";
import { GridPagination } from "../grid-pagination/grid-pagination";
import { Column, Pagination, ContextMenu } from 'angular-slickgrid';
import { CustomGridData } from '../../../common/CustomGridData';

@Component({
  selector: 'ithouse-grid',
  imports: [GridBody, GridPagination],
  templateUrl: './it-grid.html',
  styleUrl: './it-grid.scss'
})
export class IthouseGrid {
  @ViewChild('commonGrid', { static: true }) gridBody!: GridBody;
  @ViewChild('commonGridPag', { static: true }) commonGridPag!: GridPagination;

  @Input() datasetObs!: Signal<CustomGridData>;
  @Input({required: true}) columnDefinitions!: Column[];
  //it is a custom pagination
  @Input() enablePagination: boolean = false;
  @Input() customPagination?: Pagination;
  // if you need to context menu then enableContextMenu = true
  @Input() enableContextMenu?: boolean = false;
  // if enableContextMenu = true then need to pass contextMenu. default is {}
  @Input() contextMenu?: ContextMenu = {};
  @Output() onPaginationChanged: EventEmitter<any> = new EventEmitter<any>();
  gridDataValue: any[];

  constructor() {
    effect(() => {
      console.log('getting log commmn,', this.datasetObs());
      if (this.datasetObs()?.content) {
        this._subscribeToDatasetObs();
      }
    })
  }

  ngOnInit() {
    // Link pagination component into the current Grid
    if (this.commonGridPag) {
      this.gridBody.paginationComponent = this.commonGridPag;
    }

  }

  ngAfterViewInit() {
    setTimeout(() => {
      let metadata: any = { columns: { column: this.columnDefinitions } };
      this.gridBody.CustomGrid(metadata);
    }, 0);
    if (!this.datasetObs()) {
      return;
    }
    this._subscribeToDatasetObs();
  }

  _subscribeToDatasetObs() {
    this.gridDataValue = this.datasetObs().content;
    setTimeout(() => {
      // Init datagrid example:
      this.commonGridPag.processing.update(() => true);

      this.gridBody.gridData = { row: this.datasetObs().content };
      if (this.enableContextMenu) {
        this.gridBody.contextMenu = this.contextMenu;
      }
      this.commonGridPag.pageCount = this.datasetObs().totalPages;
      this.commonGridPag.totalItems = this.datasetObs().total;


      let pageOp: Pagination = {
        pageSize: this.datasetObs().pageSize,
        pageSizes: [1, 5, 10, 20, 50, 100],
      }
      // this.gridOptions.pagination = pageOp;
      this.commonGridPag.paginationOptions = this.customPagination ?? pageOp;
      this.commonGridPag.enablePagenation = this.enablePagination;

      this.commonGridPag.processing.update(() => false);
    }, 0);
  }

  filterChanged(_event: any) {
    this.commonGridPag.processing.update(() => true);
    // this.updateGridData();
  }

  paginationChanged(_event: any) {
    this.commonGridPag.processing.update(() => true);
    this.updateGridData(_event);
  }

  sortChanged(_event: any) {
    this.commonGridPag.processing.update(() => true);
    this.updateGridData();
  }

  updateGridData(_event?: any) {
    console.log('load data');
    this.onPaginationChanged.emit(_event);

  }
}
