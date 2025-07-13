import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AngularGridInstance, AngularSlickgridModule, Column, FieldType, GridOption, Metrics, Pagination } from 'angular-slickgrid';

import { Pageable } from '../../../../ithouse/common/CustomGridData';
import { Ithouse } from '../../../../ithouse/common/Ithouse';
import { CommonService } from '../../../../ithouse/common/common.service';
import { Service } from '../../../../ithouse/common/service';
import { ActionType } from '../../../../ithouse/constants/action-type.enum';
import { ContentType } from '../../../../ithouse/constants/content-type.enum';

@Component({
  selector: 'ithouse-load-data',
  standalone: true,
  imports: [AngularSlickgridModule],
  templateUrl: './load-data.component.html',
  styleUrl: './load-data.component.scss'
})
export class LoadDataComponent extends Ithouse implements Service, OnInit {


  columnDefinitions: Column[];
  columnDefinitionsMORE: Column[];
  columnDefinitionsLESS: Column[];
  gridOptions: GridOption;
  dataset: any[] = [];
  showMoreFields: boolean = true;
  angularGrid: AngularGridInstance;
  gridObj: any;
  isEnableCheckboxSelector: boolean = true;

  metrics!: Metrics;
  paginationOptions!: Pagination;
  pageSize: number = 1;
  pageNumber: number = 1;
  totalItem: number;

  constructor(private cs: CommonService, private cdr: ChangeDetectorRef) {
    super();
  }
  ngOnInit(): void {
    this.paginationOptions = {
      pageSizes: [1, 2, 5, 100, 500, 50000],
      pageSize: this.pageSize,
      pageNumber: this.pageNumber,
      totalItems: this.totalItem,
    };
    this.columnDefinitions = [
      {
        id: 'userId',
        name: 'User ID',
        field: 'userId',
        sortable: true,
        // type: FieldType.text,
        width: 20,
        filterable: true,
        minWidth: 65,
        filterSearchType: FieldType.text
      },
      {
        id: 'loginName',
        name: 'Login Name',
        field: 'loginName',
        sortable: true,
        // type: FieldType.text,
        width: 20,
        filterable: true,
        minWidth: 65,
        filterSearchType: FieldType.text
      },
      {
        id: 'fullName',
        name: 'Full Name',
        field: 'fullName',
        sortable: true,
        // type: FieldType.text,
        width: 20,
        filterable: true,
        minWidth: 65,
        filterSearchType: FieldType.text
      },
      // { id: 'symbol', name: 'Symbol', field: 'symbol', filterable: true, sortable: true, minWidth: 65, width: 65 },
      // {
      //   id: 'title',
      //   name: 'Title',
      //   field: 'title',
      //   sortable: true,
      //   type: FieldType.string,
      //   width: 70,
      // },
    ];
    this.gridOptions = {
      datasetIdPropertyName: 'userId',

      enableAutoResize: true,
      gridWidth: '100%',
      autoResize: {
        container: '#demo-container',
        rightPadding: 10
      },
      checkboxSelector: {
        hideInFilterHeaderRow: false,
        hideInColumnTitleRow: true
      },
      enableCellNavigation: true,
      enableFiltering: true,
      enableCheckboxSelector: true,
      enableRowSelection: true,
      enablePagination: true,
      // pagination: {
      //   pageSizes: [1, 2, 5, 100, 500, 50000],
      //   pageSize: this.pageSize,
      //   pageNumber: this.pageNumber,
      //   totalItems: this.totalItem,
      // },
      enableContextMenu: true,
      enableCellMenu: true,
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false,
      },
    };
    this.dataset = [{ userId: 1 }];
    this.loadUser(undefined);
  }

  angularGridReady(angularGrid: any) {
    this.angularGrid = angularGrid.detail;
    this.gridObj = angularGrid.slickGrid;
    debugger;

    this.angularGrid.paginationService.goToNextPage().then(v => {
      debugger
    })

    this.angularGrid.eventPubSubService.subscribe('onPaginationChanged', (data) => {
      this.paginationOptions.pageNumber = data.pageNumber;
      this.paginationOptions.pageSize = data.pageSize;
      debugger
      const pageable = data as Pageable;
      this.loadUser(pageable);
    })
    this.angularGrid.eventPubSubService.subscribe('onPaginationPresetsInitialized', (data) => {
      // this.paginationOptions.pageNumber = data.pageNumber;
      // this.paginationOptions.pageSize = data.pageSize;
      debugger
      // const pageable = data as Pageable;
      // this.loadUser(pageable);
    })

    // const event = angularGrid.detail.slickGrid.onClick;

    // if(event){

    //   this.angularGrid.gridEventService.eventHandler.subscribe(event, (r,e)=>{
    //     debugger
    //   })
    // }
    // this.angularGrid.detail.paginationService.onPaginationChanged.subscribe((paginationArgs) => {
    //   console.log('Pagination Changed:', paginationArgs);
    // });
  }

  isPaginationChangeInProgress = false;
  paginationChange(event: any) {
    event.preventDefault();
    event.stopImmediatePropagation();
    if (this.isPaginationChangeInProgress) {
      return;
    }

    this.isPaginationChangeInProgress = true;

    debugger
    const detail = event.detail;
    if (detail.change.type === 'pagination') {
      const pageable = event.detail.change.newValues as Pageable

      this.loadUser(pageable);
    }
  }


  loadUser(pageable: Pageable | undefined) {
    if (this.isPaginationChangeInProgress) {
      return;
    }

    this.isPaginationChangeInProgress = true;
    this.gridOptions.pagination = {
      ...pageable
    }

    var payload = {
      pageNumber: pageable?.pageNumber ?? 1,
      pageSize: pageable?.pageSize ?? 1,
    };
    debugger
    // this.cs.sendRequest(this, ActionType.SELECT, ContentType.User, 'select', payload);
    this.cs.executeAdmin(ActionType.SELECT, ContentType.User, payload).subscribe(res => {
      this.getCustomerCallback(res);
    })
    // return res;
  }
  getCustomerCallback(res) {
    const response = res.payload;
    debugger
    console.info('response: ', response);
    // once pagination totalItems is filled, we can update the dataset
    this.dataset = response.content;
    this.paginationOptions = {
      ...this.gridOptions.pagination,
      totalItems: response.totalElements,
    } as Pagination;
    this.cdr.detectChanges();
    this.isPaginationChangeInProgress = false;
  }

  onResponse(service: Service, req: any, res: any) {
    debugger
    if (!super.isOK(res)) {
      alert(super.getErrorMsg(res));

    } else if (res.header.referance === 'select') {
      this.dataset = res.payload.content;
      // this.totalItem = res.payload.total;
      this.getCustomerCallback(res);
    }
  }
  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }

}
