import { Component, Input, signal } from '@angular/core';
import { Pagination, GridOption } from 'angular-slickgrid';
import { GridBody } from '../grid-body/grid-body';
import { NgClass } from '@angular/common';

@Component({
  selector: 'ithouse-grid-pagination',
  imports: [NgClass],
  templateUrl: './grid-pagination.html',
  styleUrl: './grid-pagination.scss'
})
export class GridPagination {
 pageCount: number = 1;
  pageNumber: number = 1;

  _pageSize!: number;
  _paginationOptions: Pagination;
  _enableCustomPagenation = signal<boolean>(false);

  totalItems = 0;
  processing = signal<boolean>(false);

  // Reference to the real pagination component
  realPagination = true;
  _gridPaginationOptions!: GridOption;
  commonGrid!: GridBody;

  @Input()
  set gridPaginationOptions(gridPaginationOptions: GridOption) {
    this._gridPaginationOptions = gridPaginationOptions;

    this.commonGrid = this.gridPaginationOptions!.backendServiceApi!.service as GridBody;
  }
  get gridPaginationOptions(): GridOption {
    return this._gridPaginationOptions;
  }

  @Input()
  set paginationOptions(pagenation: Pagination) {
    this._paginationOptions = pagenation;
    this._pageSize = this._paginationOptions?.pageSize ?? this._pageSize;
    this.pageNumber = this._paginationOptions.pageNumber??this.pageNumber;

    // The backendServiceApi is itself the SoftGridCommonComponent (This is a hack)
    // this.gridPaginationOptions!.pagination = this._paginationOptions;
  }
  get paginationOptions(): Pagination {
    return this._paginationOptions;
  }
  @Input()
  set enablePagenation(pagenation: boolean) {
    this._enableCustomPagenation.update(()=>pagenation);

    // The backendServiceApi is itself the SoftGridCommonComponent (This is a hack)
    // this.gridPaginationOptions!.pagination = this._paginationOptions;
  }
  get enablePagenation(): boolean {
    return this._enableCustomPagenation();
  }



  constructor() {
    // this.logger.info('method [constructor] - START/END');
  }


  ngOnInit() {
    // this.logger.info('init: ');
  }



  changeToFirstPage(event: any) {
    // this.logger.info('method [changeToFirstPage] - START/END');
    this.pageNumber = 1;
    this.onPageChanged(event, this.pageNumber);
  }

  changeToLastPage(event: any) {
    // this.logger.info('method [changeToLastPage] - START/END');
    this.pageNumber = this.pageCount;
    this.onPageChanged(event, this.pageNumber);
  }

  changeToNextPage(event: any) {
    // this.logger.info('method [changeToNextPage] - START/END');
    if (this.pageNumber < this.pageCount) {
      this.pageNumber++;
      this.onPageChanged(event, this.pageNumber);
    }
  }

  changeToPreviousPage(event: any) {
    // this.logger.info('method [changeToNextPage] - START/END');
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.onPageChanged(event, this.pageNumber);
    }
  }


  changeToCurrentPage(event: any) {
    // this.logger.info('method [changeToCurrentPage] - START/END');
    this.pageNumber = event.currentTarget.value;
    if (this.pageNumber < 1) {
      this.pageNumber = 1;
    } else if (this.pageNumber > this.pageCount) {
      this.pageNumber = this.pageCount;
    }

    this.onPageChanged(event, this.pageNumber);
  }
  changeToCurrentPageSize(event: any) {

    this._pageSize = event.target.value as number;

    this.onPageChanged(event, this.pageNumber);
  }

  onPageChanged(event?: Event, pageNumber?: number) {
    this.commonGrid.processOnPaginationChanged(event, { pageNumber: pageNumber as number, pageSize: this._pageSize });
  }

}
