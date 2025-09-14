import { NgClass } from '@angular/common';
import { Component, Input, signal } from '@angular/core';
import { GridOption, Pagination } from 'angular-slickgrid';
import { IthouseGridBody } from '../ithouse-grid-body/ithouse-grid-body';

@Component({
  selector: 'app-ithouse-grid-pagination',
  imports: [NgClass],
  templateUrl: './ithouse-grid-pagination.html',
  styleUrl: './ithouse-grid-pagination.scss'
})
export class IthouseGridPagination {
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
  commonGrid!: IthouseGridBody;

  @Input()
  set gridPaginationOptions(gridPaginationOptions: GridOption) {
    this._gridPaginationOptions = gridPaginationOptions;

    this.commonGrid = this.gridPaginationOptions!.backendServiceApi!.service as IthouseGridBody;
  }
  get gridPaginationOptions(): GridOption {
    return this._gridPaginationOptions;
  }

  @Input()
  set paginationOptions(pagenation: Pagination) {
    this._paginationOptions = pagenation;
    this._pageSize = this._paginationOptions?.pageSize ?? this._pageSize;
    this.pageNumber = this._paginationOptions.pageNumber ?? this.pageNumber;

    // The backendServiceApi is itself the SoftGridCommonComponent (This is a hack)
    // this.gridPaginationOptions!.pagination = this._paginationOptions;
  }
  get paginationOptions(): Pagination {
    return this._paginationOptions;
  }
  @Input()
  set enablePagenation(pagenation: boolean) {
    this._enableCustomPagenation.update(() => pagenation);

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
