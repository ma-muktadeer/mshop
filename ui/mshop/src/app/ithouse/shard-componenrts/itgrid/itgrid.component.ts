import { ChangeDetectorRef, Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges } from '@angular/core';
import { AngularGridInstance, AngularSlickgridModule, Column, ContextMenu, GridOption, Pagination, PaginationService } from 'angular-slickgrid';
import { Observable } from 'rxjs';
import { CustomGridData, Pageable } from '../../common/CustomGridData';

@Component({
  selector: 'ithouse-itgrid',
  standalone: true,
  imports: [AngularSlickgridModule],
  templateUrl: './itgrid.component.html',
  styleUrl: './itgrid.component.scss'
})
export class ItgridComponent implements OnInit, OnDestroy, OnChanges {

  @Output() onPaginationChanged: EventEmitter<any> = new EventEmitter<any>();

  // showGrid = true;
  public paginationService: PaginationService;

  // columnDefinitions can not be null. it must be send
  @Input() columnDefinitions!: Column[];
  // datasetObs can not be null. it must be send. it is a CustomGridData object.
  @Input() datasetObs!: Observable<CustomGridData>;
  // pageNumber?: number = 1;
  @Input() pageSize?: number = 20;
  // datasetIdPropertyName can not be null. it must be send. it is a grid unic id. 
  @Input() datasetIdPropertyName?: string = 'gridId';
  // if you need to context menu then enableContextMenu = true
  @Input() enableContextMenu?: boolean = false;
  // if enableContextMenu = true then need to pass contextMenu. default is {}
  @Input() contextMenu?: ContextMenu = {};
  //default pagination is true. if you not need then enablePagination = false
  @Input() enablePagination?: boolean = true;
  //it is a custom pagination 
  @Input() customPagination?: Pagination;
  
  total!: number;
  // @Input()
  gridOptions?: GridOption;
  angularGrid: AngularGridInstance;
  gridObj;
  dataViewObj: import("angular-slickgrid").SlickDataView<any>;
  height: number;
  width: number;
  dataset: any[];
  // private datasetDiffer: KeyValueDiffer<string, any> | null = null;
  constructor(private cdf: ChangeDetectorRef,
  ) {
    this.gridOptions = this.buildGridOption();
  }

  ngOnInit(): void {
    // this.subscribeToDatasetObs();
    this.getWindowSize();
    if (this.gridOptions) {
      debugger
      this.gridOptions.datasetIdPropertyName = this.datasetIdPropertyName;
      this.gridOptions.enableContextMenu = this.enableContextMenu;
      this.gridOptions.contextMenu = this.contextMenu;
      this.gridOptions.enablePagination = this.enablePagination;
      if (this.customPagination) {
        this.gridOptions.pagination = this.customPagination;
      }
    }
  }
  ngOnChanges(changes: SimpleChanges): void {
    debugger
    if (changes['datasetObs']) {
      if (changes['datasetObs'].currentValue && !changes['datasetObs'].firstChange) {
        this.subscribeToDatasetObs();
      }
    }
  }

  ngOnDestroy(): void {
    this.paginationService ? this.paginationService.dispose() : '';
  }

  private subscribeToDatasetObs(): void {
    debugger
    if (this.datasetObs) {
      this.datasetObs.subscribe(data => {
        // this.dataset = data;
        this.dataset = data.content.map(item => ({ ...item }));
        this.total = data.total;
        console.log('Dataset updated:', this.dataset);
        this.handleDatasetChange(data?.pageable)
      });
    }
  }
  private handleDatasetChange(pageable?:Pageable): void {
    // Add additional logic to handle the change if needed
    setTimeout(() => {
      if (this.paginationService) {

        // Simulate user going to previous page (workaround)
        this.dataViewObj.setPagingOptions({ pageSize: pageable?.pageSize ?? this.paginationService.itemsPerPage, pageNum: pageable?.pageNumber ?? this.paginationService.pageNumber });
        this.paginationService.refreshPagination(false, false);
        // Update total items
        this.paginationService.updateTotalItems(this.total ?? this.dataset.length);

        // If necessary, trigger pagination change explicitly:
        // This ensures proper grid updates based on the new total
        this.paginationService.refreshPagination();
      }
    }, 100);
    this.cdf.detectChanges();
  }

  angularGridReady(event: Event) {
    this.angularGrid = (event as CustomEvent).detail as AngularGridInstance;
    this.gridObj = this.angularGrid.slickGrid;

    this.dataViewObj = this.angularGrid.dataView;

    // it also exposes all the Services
    this.paginationService = this.angularGrid.paginationService;

    this.angularGrid.eventPubSubService.subscribe('onGridStateChanged', (data) => {
      // this.handleGridStateChanged(data);
      debugger
    });
    this.angularGrid.eventPubSubService.subscribe('onPaginationChanged', (data) => {
      // this.handleGridStateChanged(data);
      // debugger
      // this.handleGridStateChanged(data);
    });

  }

  buildGridOption(): GridOption {

    let option: GridOption = {
      datasetIdPropertyName: this.datasetIdPropertyName,
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
      enablePagination: this.enablePagination,
      pagination: this.enablePagination ? this.customPagination ?? {
        // pageNumber: this.pageNumber,
        pageSizes: [1, 10, 20, 50, 80, 150],
        pageSize: this.pageSize,
        totalItems: 0,
      } : { pageSize: 20, pageSizes: [1, 10, 20, 50, 80, 150] },
      enableCellMenu: true,
      enableContextMenu: this.enableContextMenu,
      contextMenu: this.contextMenu ?? {},
      
      presets: {},
      enableHeaderMenu: true,
      headerMenu: {
        hideFreezeColumnsCommand: false
      },
      columnPicker: {
        onColumnsChanged: (e, args) => {
          console.log(args);
        }
      },
      gridMenu: {
        hideClearFrozenColumnsCommand: false,
        hideExportCsvCommand: false
      }
    }
    return option;
  }


  handleGridStateChanged(change: any) {
    console.log(change);
    debugger
    // if (change.change.type == GridStateType.filter) {
    // } else if (change.change.type == GridStateType.pagination) {
    //   this.onPaginationChanged.emit(change.gridState.pagination);

    // }
    // else if (change.change.type == GridStateType.rowSelection) {
    //   this.handleRowSelection(change);
    // }

    this.onPaginationChanged.emit(change.detail);

  }


  @HostListener('window:resize', ['$event'])
  getWindowSize(event?: Event) {
    this.height = window.innerHeight * 0.7;
    this.width = document.getElementById('id')?.offsetWidth;
    debugger
    let grid = document.getElementById('userGridId');
    if (grid) {
      grid.style.width = this.width + 'px';
      this.angularGrid?.slickGrid?.resizeCanvas();
    }
  }

}
