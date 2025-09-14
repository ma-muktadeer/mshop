import { Component, signal } from '@angular/core';
import { IthouseGridModule } from '../../../ithouse/common/ithouse-grid/ithouse-grid-module';
import { Column, FieldType, Filters } from 'angular-slickgrid';
import { CustomGridData } from '../../../services/common/CustomGridData';

@Component({
  selector: 'app-check',
  imports: [IthouseGridModule],
  templateUrl: './check.html',
  styleUrl: './check.scss'
})
export class Check {
  showGrid = signal<boolean>(false);

  ngOnInit() {
    setTimeout(() => {
      this.showGrid.set(true);
    }, 2000);
  }
  columnDefinitions: Column[] = [];

  contextMenu = {

    hideCloseButton: false,
    hideCopyCellValueCommand: true,
    commandItems: [
      {
        command: 'Active_Status',
        iconCssClass: 'fa fa-user',
        title: 'Active/Inactive user',
        // positionOrder: menuOrder++,
        action: (e, args) => { },
        disabled: false,
        itemUsabilityOverride: (args) => {
          debugger
          console.log(args);
          args.grid.getOptions().contextMenu.commandItems.forEach(element => {
            if (element['command'] == 'Active_Status') {
              element['title'] = 'GOOGLE';
            }
          });
          return true;
        },
        itemVisibilityOverride: (args) => {

          return true;
        }
      },

      {
        command: 'Manage_Role',
        iconCssClass: 'fa fa-cogs',
        title: 'Manage Role',
        // positionOrder: menuOrder++,
        action: (e, args) => { },
        disabled: false
      },
    ]
  }
  prepareGrid() {

    this.columnDefinitions = this.colDef;

  }
  actionColumnWidth = 10;
  colDef: Column[] = [
    {
      id: 'fullName', name: 'Full Name', field: 'fullName',
      sortable: true, type: FieldType.text, minWidth: 130,
      filterable: true, filter: { model: Filters['inputText'], },
    },
    {
      id: 'fullNamed', name: 'Full Name', field: 'fullName',
      sortable: true, type: FieldType.text, minWidth: 130,
      filterable: true, filter: { model: Filters['inputText'], },
    },
    {
      id: 'fullNasme', name: 'Full Name', field: 'fullName',
      sortable: true, type: FieldType.text, minWidth: 130,
      filterable: true, filter: { model: Filters['inputText'], },
    },
    {
      id: 'fullNadme', name: 'Full Name', field: 'fullName',
      sortable: true, type: FieldType.text, minWidth: 130,
      filterable: true, filter: { model: Filters['inputText'], },
    },
    {
      id: 'email', name: 'Email', field: 'email',
      sortable: true, type: FieldType.text, minWidth: 170,
      filterable: true, filter: { model: Filters['inputText'], },
    },
    {
      id: 'branch', name: 'Branch', field: 'branch',
      sortable: true, type: FieldType.text,
      filterable: true, filter: { model: Filters['inputText'], },
    },
    {
      id: 'email', name: 'Email', field: 'email',
      sortable: true, type: FieldType.text, minWidth: 170,
      filterable: true, filter: { model: Filters['inputText'], },
    },
    {
      id: 'branch', name: 'Branch', field: 'branch',
      sortable: true, type: FieldType.text,
      filterable: true, filter: { model: Filters['inputText'], },
    },
    {
      id: 'd', name: 'Email', field: 'email',
      sortable: true, type: FieldType.text, minWidth: 170,
      filterable: true, filter: { model: Filters['inputText'], },
    },
    {
      id: 'sds', name: 'Branch', field: 'branch',
      sortable: true, type: FieldType.text,
      filterable: true, filter: { model: Filters['inputText'], },
    },
    {
      id: 'emeail', name: 'Email', field: 'email',
      sortable: true, type: FieldType.text, minWidth: 170,
      filterable: true, filter: { model: Filters['inputText'], },
    },
    {
      id: 'branwch', name: 'Branch', field: 'branch',
      sortable: true, type: FieldType.text,
      filterable: true, filter: { model: Filters['inputText'], },
    },

    {
      id: 'loginName', name: 'Login Name', field: 'loginName',
      sortable: true, type: FieldType.text,
      filterable: true, filter: { model: Filters['inputText'], },
    },
    {
      id: 'userStatus', name: 'Status', field: 'userStatus',
      sortable: true, type: FieldType.text,
      filterable: true, filter: { model: Filters['inputText'], },
    },
    {
      id: 'allowLogin', name: 'Allow Login', field: 'allowLogin',
      sortable: true, type: FieldType.text,
      filterable: true, filter: { model: Filters['inputText'] },
      formatter: (row: number, cell: number, value: any, columnDef?: Column, dataContext?: any, grid?: any) => { return dataContext.allowLogin == 'Yes' ? "Yes" : "No" }
    },
    {
      id: 'logienName', name: 'Login Name', field: 'loginName',
      sortable: true, type: FieldType.text,
      filterable: true, filter: { model: Filters['inputText'], },
    },
    {
      id: 'userStaetus', name: 'Status', field: 'userStatus',
      sortable: true, type: FieldType.text,
      filterable: true, filter: { model: Filters['inputText'], },
    },
    {
      id: 'allowLqogin', name: 'Allow Login', field: 'allowLogin',
      sortable: true, type: FieldType.text,
      filterable: true, filter: { model: Filters['inputText'] },
      formatter: (row: number, cell: number, value: any, columnDef?: Column, dataContext?: any, grid?: any) => { return dataContext.allowLogin == 'Yes' ? "Yes" : "No" }
    },
  ];
  callPagination = false;
  pageSize = 10;
  dataset = signal<CustomGridData>(null);
  paginationChanged(event: any) {
    debugger
    if (this.callPagination) {
      return;
    }
    this.callPagination = true;
    console.log('pagenation ', event);
    // this.loadUser(event as Pagination);
  }


}
