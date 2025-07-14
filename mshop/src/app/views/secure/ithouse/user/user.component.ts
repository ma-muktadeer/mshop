import { Component, OnInit, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularGridInstance, AngularSlickgridModule, Column, FieldType, GridOption, Metrics, Pagination } from 'angular-slickgrid';
import { Observable, of } from 'rxjs';
import { FilterCriteria, GridAction, GridConfig, GridFillter, Item, Pageable } from '../../../../ithouse/common/CustomGridData';
import { Ithouse } from '../../../../ithouse/common/Ithouse';
import { CommonService } from '../../../../ithouse/common/common.service';
import { Service } from '../../../../ithouse/common/service';
import { ActionType } from '../../../../ithouse/constants/action-type.enum';
import { ContentType } from '../../../../ithouse/constants/content-type.enum';
import { ProductComponent } from '../../mshop/product/product.component';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [AngularSlickgridModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})

export class UserComponent extends Ithouse implements Service, OnInit {
 
  pageNumber: number = 1;
  pageSize: number = 1;
  columnDefinitions: Column[];

  gridOptions: GridOption;
  angularGrid: AngularGridInstance;
  gridObj: any;
  dataset=signal<any[]>([]);
  metrics!: Metrics;
  paginationOptions!: Pagination;
  gridValue: any[];

  constructor(private cs: CommonService, private model: NgbModal) {
    super();
  }
  ngOnInit(): void {
    this.buildGrid();
  }

  check() {
    // const pay = {
    //   loginName: 'surey8',
    //   email: 'surey8',
    // }
    // debugger
    // this.cs.check("/check", pay).subscribe({

    //   next: (res: any) => {

    //     console.log(res);
    //   },
    //   error: (err: any) => {
    //     console.log(err());

    //   }
    // })
    debugger
    const rf = this.model.open(ProductComponent, {backdrop: 'static'});

    rf.result.then((res) => {
      console.log('Modal closed with:', res);
    })
    .catch((reason) => {
      console.error('Modal dismissed with reason:', reason);
    })
  }

  buildGrid() {
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
      pagination: {
        pageSizes: [1, 2, 5, 100, 500, 50000],
        pageSize: this.pageSize,
        pageNumber: this.pageNumber,
        // totalItems: this.totalItem,
      },
      enableContextMenu: true,
      enableCellMenu: true,
      // checkboxSelector: {
      //   hideInFilterHeaderRow: true,
      //   hideInColumnTitleRow: false,
      // },
      rowSelectionOptions: {
        // True (Single Selection), False (Multiple Selections)
        selectActiveRow: false,
      },
      backendServiceApi: {
        service: this,
        // service: new GridOdataService(),
        // define all the on Event callbacks
        options: {
          enableCount: true,
          top: 5,
        },
        preProcess: () => { },
        process: (query) => this.getCustomerApiCall(query),
        postProcess: (response) => {
          this.getCustomerCallback(response);
        },
      },
    };

    this.dataset.set([]);
    // this.loaddataService.getGridData(50).subscribe((e) => {
    //   debugger
    //   this.dataset = e;
    // });
  }
  filterBy: Map<string, string> = new Map<string, string>();
  sortBy: Map<string, boolean> = new Map<string, boolean>();
  getCustomerApiCall(odataQuery) {
    debugger
    console.info('odataQuery', odataQuery);
    const gridConfig: GridConfig = JSON.parse(odataQuery ?? '') as GridConfig;

    if (gridConfig.gridAction === GridAction.Pegeable) {
      const pageable: Pageable = gridConfig.actionValue as Pageable;
      return this.loadUser(pageable);
    }
    else if (gridConfig.gridAction === GridAction.Filter) {
      // this.gridValue = JSON.parse(JSON.stringify(this.dataset));
      const gridFillter: GridFillter = gridConfig.actionValue as GridFillter;
      this.filterBy.set(gridFillter.columnId, gridFillter.searchTerm);
      const fitterValueBy = this.convertMapToFilterCriteria();
      // return this.filterItems(this.gridValue, { id: gridFillter.columnId, value: gridFillter.searchTerm });
      return this.filterItems(this.gridValue, fitterValueBy);
    }
    else if (gridConfig.gridAction === GridAction.Sort) {
      const gridFillter: GridFillter = gridConfig.actionValue as GridFillter;
      this.sortBy.set(gridFillter.columnId, gridFillter.searchTerm);
      const fitterValueBy = this.convertMapToSortCriteria();
      return this.sortItems(this.dataset(), fitterValueBy);
    }
    else {
      return of([]);
    }
  }
  sortItems(dataset: any[], sortCriterias: FilterCriteria[])
    : Observable<{ payload: { content: Item[]; total: number } }> {

    const sortedDataset = dataset.slice().sort((a, b) => {
      for (const { id, value } of sortCriterias) {
        const aValue = a[id];
        const bValue = b[id];

        if (aValue == null && bValue == null) {
          continue;
        }
        if (aValue == null) {
          return value ? 1 : -1;
        }
        if (bValue == null) {
          return value ? -1 : 1;
        }

        if (aValue < bValue) {
          return value ? -1 : 1;
        }
        if (aValue > bValue) {
          return value ? 1 : -1;
        }
      }
      return 0;
    });
    const result = {
      payload: {
        content: sortedDataset,
        total: sortedDataset.length,
      }
    };

    return of(result);
  }

  filterItems(
    items: any[],
    criteria: FilterCriteria[]
  ): Observable<{ payload: { content: Item[]; total: number } }> {
    const filteredItems = items.filter(item => {
      return criteria.every(criterion => {
        const itemValue = item[criterion.id];
        if (!criterion.value) {
          return true;
        }
        if (itemValue == null) {
          return false;
        }

        // Convert both itemValue and criterion value to strings for comparison
        const itemValueStr = itemValue.toString().toUpperCase();
        const cr = criterion.value as string;
        const criterionValueStr = cr.toUpperCase();

        return itemValueStr.includes(criterionValueStr);
      });
    });

    const result = {
      payload: {
        content: filteredItems,
        total: filteredItems.length,
      }
    };

    return of(result);
  }

  convertMapToFilterCriteria(): FilterCriteria[] {
    const criteriaArray: FilterCriteria[] = [];
    this.filterBy.forEach((value, key) => {
      criteriaArray.push({ id: key, value: value });
    });
    return criteriaArray;
  }
  convertMapToSortCriteria(): FilterCriteria[] {
    const criteriaArray: FilterCriteria[] = [];
    this.sortBy.forEach((value, key) => {
      criteriaArray.push({ id: key, value: value });
    });
    return criteriaArray;
  }

  getCustomerCallback(res) {
    const response = res.payload;
    debugger
    console.info('response: ', response);
    // once pagination totalItems is filled, we can update the dataset
    this.paginationOptions = {
      ...this.gridOptions.pagination,
      totalItems: response.totalElements,
    } as Pagination;
    this.dataset.set(response.content);

  }

  angularGridReady(angularGrid: any) {
    this.angularGrid = angularGrid;
    this.gridObj = angularGrid.slickGrid;
  }

  toggleColumns() { }

  addColumns() { }

  deleteColumns() { }

  enableCheckboxSelector() { }


  loadUser(pageable: Pageable | undefined) {
    var payload = {
      pageNumber: pageable?.pageNumber ?? 1,
      pageSize: pageable?.pageSize ?? 1,
    };
    debugger
    // return this.cs.executeAdmin(ActionType.SELECT, ContentType.User, payload);
    const res = this.cs.executeAdmin(ActionType.SELECT, ContentType.User, payload);
    res.subscribe((r: any) => this.gridValue = JSON.parse(JSON.stringify(r.payload.content)));
    return res;
  }

  onResponse(service: Service, req: any, res: any) {
    if (!super.isOK(res)) {
      alert(super.getErrorMsg(res));

    } else if (res.header.referance === 'select') {
      this.dataset = res.payload.content;
      // this.totalItem = res.payload.total;
      this.pageSize = this.dataset.length;
      // this.updatePaginationTotal(this.totalItem);
    }
  }
  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }
}
