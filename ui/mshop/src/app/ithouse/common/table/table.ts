import { Component, effect, EventEmitter, Input, Output, Signal, signal, ViewChild } from '@angular/core';
import { Column, Pagination, ContextMenu } from 'angular-slickgrid';
import { TableBody } from './table-body/table-body';
import { TablePagination } from './table-pagination/table-pagination';
import { TableData, TablePresets } from './table-data';

@Component({
  selector: 'ithouse-table',
  standalone: false,
  templateUrl: './table.html',
  styleUrl: './table.scss',
})
export class Table {
  @ViewChild('commonGrid', { static: true }) readonly commonGrid!: TableBody;
  @ViewChild('commonGridPag', { static: true }) readonly commonGridPag!: TablePagination;

  @Input({ required: true }) datasetObs!: Signal<TableData>;
  @Input({ required: true }) columnDefinitions!: Column[];
  //it is a custom pagination 
  @Input() enablePagination: boolean = false;
  @Input() enableCheckBoxSelector: boolean = false;
  @Input() enableMultiselect: boolean = false;
  @Input() customPagination?: Pagination;
  // if you need to context menu then enableContextMenu = true
  @Input() enableContextMenu?: boolean = false;

  @Input() contextMenu?: ContextMenu = {};
  @Input() customPresets?: TablePresets;

  @Output() onPaginationChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelectedRowsChanged: EventEmitter<any> = new EventEmitter<any>();

  gridDataValue: any[];

  viewGrid = signal<boolean>(false);
  constructor() {
    effect(() => {
      console.log('getting log commmn,', this.datasetObs());
      if (this.datasetObs()?.content) {
        this.viewGrid.update(() => true);
        this._subscribeToDatasetObs();
      }
    })
  }

  ngOnInit() {
    if (this.commonGridPag) {
      this.commonGrid.paginationComponent = this.commonGridPag;
      this.commonGrid.enableCheckBoxSelector = this.enableCheckBoxSelector;
      this.commonGrid.isMultiselect = this.enableMultiselect;
      this.commonGrid.customPresets = this.customPresets;
    }

  }

  ngAfterViewInit() {

    setTimeout(() => {
      let metadata: any = { columns: { column: this.columnDefinitions } };
      this.commonGrid.CustomGrid(metadata);
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

      // Real HTTP call
      // this.currentUrl.update(() => this.testurl + '&currentPage=1');

      this.commonGrid.gridData = { row: this.datasetObs().content };
      if (this.enableContextMenu) {
        // this.commonGrid.contextManue = this.contextMenu;
      }
      this.commonGridPag.pageCount = this.datasetObs().totalPages;
      this.commonGridPag.totalItems = this.datasetObs().total;

      // this.commonGridPag.pageCount = data_sample.pagination_samples.grid.rows.maxpage;

      let pageOp: Pagination = {
        pageSize: this.datasetObs().pageSize,
        // pageNumber: pa,
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

  handleSelectedRowsChanged(event: any) {
    this.onSelectedRowsChanged.emit(event);
  }
}
