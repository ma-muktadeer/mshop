import { Component, EventEmitter, HostListener, inject, Input, Output, signal, ViewChild } from '@angular/core';
import { AngularSlickgridComponent, ContextMenu, GridState, Column, BackendServiceOption, Pagination, FilterChangedArgs, AngularGridInstance, GridOption, OperatorType, SlickDataView, BackendService, AngularSlickgridModule } from 'angular-slickgrid';
import { ExcelExportService } from '@slickgrid-universal/excel-export';
import { TableFilterCriteria, TablePresets } from '../table-data';
import { TablePagination } from '../table-pagination/table-pagination';
import { CommonService } from 'src/app/ithouse/services/common.service';

let timer: any;
const DEFAULT_FILTER_TYPING_DEBOUNCE = 10;

@Component({
  selector: 'ithouse-table-body',
  imports: [AngularSlickgridModule],
  templateUrl: './table-body.html',
  styleUrl: './table-body.scss',
})
export class TableBody implements BackendService {
  private readonly _cs = inject(CommonService);
  @ViewChild('angularSlickGrid', { static: true }) angularSlickGrid!: AngularSlickgridComponent;

  @Input({ required: true }) gridDataValue: any[] = [];

  // if enableContextMenu = true then need to pass contextMenu. default is {}
  @Input() contextMenu?: ContextMenu = {};

  @Input() gridHeight = 100;
  @Input() gridWidth = 600;

  customPresets?: TablePresets;
  private presets?: GridState;
  gridHeightString!: string;
  gridWidthString!: string;

  columnDefinitions = signal<Column[]>([]);
  dataset = signal<any>(null);
  gridObj: any;
  dataviewObj: any;
  isAutoEdit = false;
  updatedObject: any;
  isMultiSelect = true;
  selectedObjects!: any[];
  selectedObject: any;

  metaData: any;
  columnData: any;
  rowsData: any;
  selects: any;
  id: any;
  options!: BackendServiceOption;
  pagination?: Pagination;
  enableCheckBoxSelector: boolean;
  isMultiselect: boolean;

  @Output() onFilterChanged: EventEmitter<FilterChangedArgs> = new EventEmitter<FilterChangedArgs>();
  @Output() onPaginationChanged: EventEmitter<Pagination> = new EventEmitter<Pagination>();
  @Output() onSortChanged: EventEmitter<any> = new EventEmitter<any>();
  @Output() onSelectedRowsChanged: EventEmitter<any> = new EventEmitter<any>();

  sortedGridColumn = '';
  currentPage = 1;
  filteredGridColumns = '';

  private LOCAL_STORAGE_KEY = 'LOCAL_STORAGE_KEY';
  private angularGrid: AngularGridInstance;

  private filterBy: Map<any, any> = new Map<any, any>();
  private sortBy: Map<string, boolean> = new Map<string, boolean>();
  customId = signal<string>(this.createUUID());

  gridOptions: GridOption = {
    asyncEditorLoading: true,
    autoEdit: this.isAutoEdit,
    autoResize: {
      container: '#common-grid-container',
      rightPadding: 10
    },
    // enableTranslate: true,
    enableExcelExport: true,
    excelExportOptions: {
      exportWithFormatter: true,
      customColumnWidth: 15,
      columnHeaderStyle: { font: { bold: true, italic: true } },
    },
    enableColumnPicker: true,
    enableCellNavigation: true,
    enableFiltering: true,
    syncColumnCellResize: true,
    rowHeight: 35,
    forceFitColumns: true,
    enableAutoTooltip: true,
    enableGridMenu: true,
    enableContextMenu: true,
    enableAutoResize: false,
    enableSorting: true,
    createPreHeaderPanel: false,
    showPreHeaderPanel: true,
    preHeaderPanelHeight: 28,
    explicitInitialization: true,
    gridMenu: {
      iconButtonContainer: 'preheader',
      hideClearFrozenColumnsCommand: false,
      hideExportCsvCommand: false
    },
    externalResources: [new ExcelExportService()],

    enableHeaderMenu: true,
    headerMenu: {
      hideFreezeColumnsCommand: false
    },
    columnPicker: {
      onColumnsChanged: (e, args) => {
        console.log(args);
      }
    },
    enableCellMenu: true,

  };

  handleSelectedRowsChanged(event: any) {
    const args = event.detail.args;
    const selectedRowIndexes = args.rows;
    const selectedItems = selectedRowIndexes.map((idx: number) => this.gridData[idx]);
    this.onSelectedRowsChanged.emit(selectedItems);
  }

  private _paginationComponent: any = {
    processing: false,
    realPagination: false
  };

  @Input()
  set paginationComponent(value: TablePagination) {
    if (value.realPagination) {
      this._paginationComponent = value;
      this.gridOptions.backendServiceApi = {
        service: this,
        preProcess: () => { },
        process: () => {
          return null;
        },
        postProcess: () => { },
        options: {
          enableCount: false,
          enableSelect: true,
          enableExpand: true,
          filterQueryOverride: ({ fieldName, columnDef, columnFilterOperator, searchValues }) => {
            if (columnFilterOperator === OperatorType.custom && columnDef?.id === 'name') {
              let matchesSearch = searchValues[0].replace(/\*/g, '.*');
              matchesSearch = matchesSearch.slice(0, 1) + matchesSearch.slice(1);
              matchesSearch = matchesSearch.slice(0, -1) + '$\'';

              return `matchesPattern(${fieldName}, ${matchesSearch})`;
            }
            return '';
          },
        },
      } as any;
      this._paginationComponent.gridPaginationOptions = this.gridOptions;

      this.angularSlickGrid?.createBackendApiInternalPostProcessCallback(this.gridOptions);
    }
  }

  get paginationComponent(): TablePagination {
    return this._paginationComponent;
  }

  ngOnInit() {
    setTimeout(() => {
      this.LOCAL_STORAGE_KEY = this.customPresets?.gridId;
      this.presets = this.customPresets?.presets;
      this.buildGridOptions();
      console.log('custom presets', this.customPresets);

    }, 0);
  }

  buildGridOptions() {
    this.gridOptions.contextMenu = this.contextMenu;

    this.gridOptions.enableCheckboxSelector = this.enableCheckBoxSelector;
    this.gridOptions.enableRowSelection = this.enableCheckBoxSelector;

    this.gridOptions.checkboxSelector = {
      // hideInColumnTitleRow: true,
      // hideInFilterHeaderRow: !this.isMultiselect,
      ...this.gridOptions.checkboxSelector,
      hideSelectAllCheckbox: !this.isMultiselect,
    };

    this.gridOptions.rowSelectionOptions = {
      ...this.gridOptions.rowSelectionOptions,
      selectActiveRow: !this.isMultiselect,
    };
    this.saveCurrentGridState();
  }

  onColumnsReordered(event: any) {
    const gridStateChanges = event.detail;

    if (gridStateChanges.change.type === 'columns') {
      this.presets = gridStateChanges.gridState;
    }
  }

  saveCurrentGridState() {
    if (!!this.presets) {
      this.presets = JSON.parse(this._cs.get4Session(this.LOCAL_STORAGE_KEY) || null) ?? this.presets;
      this.gridOptions.presets = this.presets;
      console.log('presets', this.presets);
    }
  }

  _onGridDesroy() {
    if (!!this.presets) {
      this._cs.store2Session(this.LOCAL_STORAGE_KEY, this.presets);
    }
  }

  ngAfterViewInit() {
    this.getWindowSize();
  }

  createUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }


  /**
  * CustomGrid constructor
  * @param columnData
  */
  CustomGrid(columnData: any) {
    setTimeout(() => {
      this.id = 'grid' + Math.floor(Math.random() * Math.floor(100));
      this.metaData = columnData;

      const rowData: any = [];

      if (this.metaData.columns.column) {

        this.columnData = this.metaData.columns.column;

        for (const colData of this.columnData) {
          const col = colData;
          this.columnDefinitions.update((value: Column[]) => [...value, col]);
          rowData[col.id] = '';
        }

        // this.gridObj.setColumns(this.columnDefinitions);
        // this.columnDefinitions = columnData;
        // this.angularSlickGrid.showPagination = false;

        // this.gridObj.setHeaderRowVisibility(false);
        // this.gridObj.setTopPanelVisibility(false);
      }
      // this.dataset.update(() => rowData);

    }, 0);
  }

  /**
   * CommonGrid constructor
   * @param _columnsData
   * @param _lockedColumnCount
   * @param _uniqueColumn
   * @param _baseURL
   * @param _programId
   * @param _componentId
   * @param _enableRenders
   * @param _colValidationMap
   * @param _checkHeader
   * @param _cboLinked
   */
  CommonGrid(_columnsData: any, _lockedColumnCount: number, _uniqueColumn: string, _baseURL: string, _programId: string, _componentId: string, _enableRenders = true, _colValidationMap = null, _checkHeader = false, _cboLinked = false) {
  }

  set gridData(rawData: any) {
    if (!rawData?.row?.length) {
      this.dataset.update(() => []);
      this.paginationComponent.processing.update(() => false);
      return;
    }

    const dataProvider = rawData.row.map((row: any, index: number) => ({
      ...row,
      id: index
    }));

    this.dataset.update(() => dataProvider);
    this.paginationComponent.processing.update(() => false);

  }

  get gridData(): any {
    return this.dataset();
  }

  gridReady(instance: any) {
    this.angularGrid = instance.detail as AngularGridInstance;
    this.gridObj = instance.detail.slickGrid as AngularGridInstance;
    this.dataviewObj = instance.dataView;

  }

  dataviewReady(dataview: SlickDataView) {
    this.dataviewObj = dataview;
  }


  /********************************************************/
  /******** Pagination+Sot+Filter service : START *********/
  /********************************************************/
  buildQuery(): string {
    return 'buildQuery...';
  }

  init(serviceOptions: BackendServiceOption, pagination?: Pagination): void {
    this.options = serviceOptions;
    this.pagination = pagination;
  }


  resetPaginationOptions() {

  }

  updateOptions(serviceOptions?: Partial<BackendServiceOption>) {
    this.options = { ...this.options, ...serviceOptions };
  }


  /**
   * FILTERING EMIT EVENT
   * @param event
   * @param args
   */
  processOnFilterChanged(event: Event | undefined, args: FilterChangedArgs): string {
    this.paginationComponent.processing.update(() => true);
    this.filteredGridColumns = '';
    let timing = 0;
    if (event && (event.type === 'keyup' || event.type === 'keydown')) {
      timing = DEFAULT_FILTER_TYPING_DEBOUNCE;
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      this.filteredGridColumns = '';
      for (const column of this.columnDefinitions()) {
        // if(!column?.filterable) return;
        if (column.field in args.columnFilters) {
          // this.filteredGridColumns += args.columnFilters[column.field].searchTerms[0] + '|';
          this.filterBy.set(column.field, args.columnFilters[column.field].searchTerms[0]);
        } else if (this.filterBy.get(column.field)) {
          this.filterBy.delete(column.field);

        }

        //  else {
        //   this.filteredGridColumns += 'All|';
        // }
      }
      if (this.filterBy.size) {
        this.filterGridDate();
      } else {
        this.gridData = { row: this.gridDataValue };
      }

    }, timing);
    this.onFilterChanged.emit(args);

    return 'onFilterChanged';
  }

  /**
   * SORT EMIT EVENT
   * @param _event
   * @param args
   */
  processOnSortChanged(_event: Event | undefined, args: any) {
    let timer: any;
    const timing = DEFAULT_FILTER_TYPING_DEBOUNCE;

    if (timer) {
      clearTimeout(timer);
    }

    this.paginationComponent.processing.update(() => true);

    timer = setTimeout(() => {
      if (!args?.sortCols?.length) {
        this.paginationComponent.processing.update(() => false);
        return;
      }

      const sortCol = args.sortCols[0];
      const sortField = sortCol.sortCol.field;
      const sortAsc = sortCol.sortAsc;

      const colIndex = this.columnDefinitions().findIndex(col => col.field === sortField);
      this.sortedGridColumn = `${colIndex}|${sortAsc}|`;

      const sortedData = [...this.dataset()].sort((a, b) => {
        const aVal = a[sortField];
        const bVal = b[sortField];

        if (aVal == null && bVal != null) return sortAsc ? -1 : 1;
        if (aVal != null && bVal == null) return sortAsc ? 1 : -1;
        if (aVal == null && bVal == null) return 0;

        if (typeof aVal === 'number' && typeof bVal === 'number') {
          return sortAsc ? aVal - bVal : bVal - aVal;
        } else {
          return sortAsc
            ? String(aVal).localeCompare(String(bVal))
            : String(bVal).localeCompare(String(aVal));
        }
      });

      this.dataset.update(() => sortedData);
      this.paginationComponent.processing.update(() => false);
    }, timing);
    this.onSortChanged.emit(args);

    return 'onSortChanged';
  }
  filterGridDate() {
    const fitterValueBy = this.convertMapToFilterCriteria();
    this.filterItems(this.gridDataValue, fitterValueBy);
  }

  convertMapToFilterCriteria(): TableFilterCriteria[] {
    const criteriaArray: TableFilterCriteria[] = [];
    this.filterBy.forEach((value, key) => {
      criteriaArray.push({ id: key, value: value });
    });
    return criteriaArray;
  }

  filterItems(
    items: any[],
    criteria: TableFilterCriteria[]
  ) {
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

    // this.dataset.update(() => filteredItems);
    this.gridData = { row: filteredItems };

    // const result = {
    //   payload: {
    //     content: filteredItems,
    //     total: filteredItems.length,
    //   }
    // };

    // return of(result);
  }


  /**
   * PAGINATION EMIT EVENT
   * @param _event
   * @param args
   */
  processOnPaginationChanged(_event: Event | undefined, args: Pagination) {
    this.currentPage = args.pageNumber;
    this.onPaginationChanged.emit(args);
    return 'onPaginationChanged';
  }

  getFilteredGridColumns() {
    return this.filteredGridColumns;
  }

  getSortedGridColumn() {
    return this.sortedGridColumn;
  }

  /******** Pagination+Sot+Filter service: END *****************/

  @HostListener('window:resize')
  getWindowSize() {
    const width = document.getElementById('id')?.offsetWidth;
    let grid = document.getElementById(this.customId());
    if (grid) {
      grid.style.width = width + 'px';
      this.gridObj?.slickGrid?.resizeCanvas();
    }
  }
}
