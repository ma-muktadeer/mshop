import { Component, Input, signal } from '@angular/core';
import { TableBody } from '../table-body/table-body';
import { GridOption, Pagination } from 'angular-slickgrid';

@Component({
  selector: 'ithouse-table-pagination',
  imports: [],
  templateUrl: './table-pagination.html',
  styleUrl: './table-pagination.scss',
})
export class TablePagination {
  pageCount: number = 1;
  pageNumber: number = 1;

  _pageSize!: number;
  _paginationOptions: Pagination;
  _enableCustomPagenation = signal<boolean>(false);

  totalItems = 0;
  processing = signal<boolean>(false);
  realPagination = true;
  _gridPaginationOptions!: GridOption;
  commonGrid!: TableBody;

  @Input()
  set gridPaginationOptions(gridPaginationOptions: GridOption) {
    this._gridPaginationOptions = gridPaginationOptions;
    this.commonGrid = this.gridPaginationOptions!.backendServiceApi!.service as TableBody;
  }
  get gridPaginationOptions(): GridOption {
    return this._gridPaginationOptions;
  }

  @Input()
  set paginationOptions(pagenation: Pagination) {
    this._paginationOptions = pagenation;
    this._pageSize = this._paginationOptions?.pageSize ?? this._pageSize;
    this.pageNumber = this._paginationOptions.pageNumber ?? this.pageNumber;

    this.gridPaginationOptions!.pagination = this._paginationOptions;
  }
  get paginationOptions(): Pagination {
    return this._paginationOptions;
  }
  @Input()
  set enablePagenation(pagenation: boolean) {
    this._enableCustomPagenation.update(() => pagenation);
  }
  get enablePagenation(): boolean {
    return this._enableCustomPagenation();
  }



  constructor() {
  }


  ngOnInit() {
  }



  changeToFirstPage(event: any) {
    this.pageNumber = 1;
    this.onPageChanged(event, this.pageNumber);
  }

  changeToLastPage(event: any) {
    this.pageNumber = this.pageCount;
    this.onPageChanged(event, this.pageNumber);
  }

  changeToNextPage(event: any) {
    if (this.pageNumber < this.pageCount) {
      this.pageNumber++;
      this.onPageChanged(event, this.pageNumber);
    }
  }

  changeToPreviousPage(event: any) {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.onPageChanged(event, this.pageNumber);
    }
  }


  changeToCurrentPage(event: any) {
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
