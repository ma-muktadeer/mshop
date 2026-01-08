import { Component, signal, computed } from '@angular/core';
import { Formatter, FieldType, Column, Filters } from 'angular-slickgrid';
import { ActionType } from 'src/app/ithouse/constants/action-type.enum';
import { CommonService } from 'src/app/ithouse/services/common.service';
import { ContentType } from 'src/app/ithouse/constants/content-type.enum';
import { CustomGridData } from 'src/app/ithouse/constants/CustomGridData';
import { Ithouse } from 'src/app/ithouse/services/Ithouse';
import { Service } from 'src/app/ithouse/services/service';
import { ContentLoader } from "src/app/components/content-loader/content-loader";
import Swal from 'sweetalert2';
import { AppPermission, PermissionStoreService } from 'src/app/ithouse/services/permissioin-store.service';
import { Table } from 'src/app/ithouse/common/table/table';

@Component({
  selector: 'ithouse-user',
  imports: [ContentLoader, Table],
  templateUrl: './user.html',
  styleUrl: './user.scss'
})
export class User extends Ithouse implements Service {
  pageNumber: number = 1;
  pageSize: number = 10;
  dataset = signal<any[]>([]);
  userList = computed<CustomGridData>(() => {
    const data = this.dataset();
    return data ? this.buildGridData(data) : null;
  });

  showGrid = signal<boolean>(false);
  readonly appPermission = AppPermission;

  viewIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<i title="view"  style="font-size:14px;"  class="bi bi-eye pointer" aria-hidden="true"></i>'
  };
  deleteIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<i title="delete"  style="font-size:14px;"  class="bi bi-trash pointer" aria-hidden="true"></i>'
  };
  editIcon: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<i title="edit"  style="font-size:14px;"  class="bi bi-pencil pointer" aria-hidden="true"></i>'
  };
  roleManage: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<i title="role manage"  style="font-size:14px;"  class="fa fa-cogs pointer" aria-hidden="true"></i>'
  };
  approveBtn: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<button type="button" title="Approve" class="btn-success pointer"><i class="bi bi-check" aria-hidden="true"></i></button>'
    // if (dataContext.userStatus === 'PEND_APPROVE' && this.permissioinStoreService.hasAnyPermission([AppPermission.USER_APPROVER])) {
    //   return '<button type="button" title="Approve" class="btn-success pointer"><i class="fa fa-check-square-o" aria-hidden="true"></i></button>';
    // }
    // else {
    //   return '';
    // }
  };
  makerBtn: Formatter = (row: number, cell: number, value: any, columnDef: Column, dataContext: any, grid?: any) => {
    return '<button type="button" class="btn-primary pointer"><i title="Submit" class="bi bi-check2-square" aria-hidden="true"></i></button>'
    // if (this.makerAction.includes(dataContext.userStatus) && this.permissioinStoreService.hasPermission(AppPermission.USER_MAKER)) {
    //   return '<button type="button" class="btn-primary pointer"><i title="Submit" class="fa fa-check-square-o" aria-hidden="true"></i></button>';
    // }
    // else {
    //   return '';
    // }
  };

  contextMenu = {

    hideCloseButton: false,
    hideCopyCellValueCommand: true,
    commandItems: [
      {
        command: 'Active_Status',
        iconCssClass: 'fa fa-user',
        title: 'Active/Inactive user',
        action: (e, args) => { this.toggleActivation(e, args) },
        disabled: false,
        itemUsabilityOverride: (args) => {
          console.log(args);
          args.grid.getOptions().contextMenu.commandItems.forEach(element => {
            if (element['command'] == 'Active_Status') {
              element['title'] = this.checkStatus(args.dataContext.userStatus, args.dataContext.allowLogin);
            }
          });
          return this.checkActiveRole(args.dataContext);
        },
        itemVisibilityOverride: (args) => {
          return this.checkUserActionVisibility(args.dataContext);
        }
      },

      {
        command: 'Manage_Role',
        iconCssClass: 'fa fa-cogs',
        title: 'Manage Role',
        action: (e, args) => {
          // this.manageUserRole(args.dataContext)
        },
        disabled: false
      },
    ]
  }

  serialFormmater: Formatter = (index, a, v, c) => {
    return index + 1 + "";
  };
  columnDefinitions = [
    {
      id: "serialKey",
      name: "Sl.",
      field: "serialKey",
      excludeFromColumnPicker: true,
      excludeFromExport: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      resizable: true,
      focusable: false,
      selectable: false,
      formatter: this.serialFormmater,
    },
    {
      id: 'delete', name: '', field: 'delete', formatter: this.deleteIcon,
      minWidth: 20, maxWidth: 25, toolTip: "Delete User",
      onCellClick: (e, args) => {
        // this.onDelete(e, args)
      },
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      excludeFromExport: true,
      resizable: false,
      focusable: false,
      selectable: false
    },
    {
      id: 'edit', name: '', field: 'edit', formatter: this.editIcon, minWidth: 20, maxWidth: 25,
      onCellClick: (e, args) => {
        // this.onEditUser(e, args)
      },
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      excludeFromExport: true,
      resizable: false,
      focusable: false,
      selectable: false
    },
    {
      id: 'view', name: '', field: 'view', formatter: this.viewIcon,
      minWidth: 20, maxWidth: 25,
      onCellClick: (e, args) => {
        // this.onViewUser(e, args)
      },
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      excludeFromExport: true,
      resizable: false,
      focusable: false,
      selectable: false
    },
    {
      id: 'role', name: '', field: 'role', formatter: this.roleManage,
      minWidth: 20, maxWidth: 25,
      toolTip: "Manage Role",
      cssClass: "manage-role-icon",
      onCellClick: (e, args) => {
        // this.manageRole(e, args)
      },
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      excludeFromExport: true,
      resizable: false,
      focusable: false,
      selectable: false
    },
    {
      id: 'submit', name: '', field: 'submit', formatter: this.makerBtn,
      minWidth: 20,
      maxWidth: 35,
      toolTip: "Submit User",
      // cssClass: "manage-role-icon",
      onCellClick: (e, args) => {
        // if (this.makerAction.includes(args.dataContext?.userStatus)) {
        //   this.submitUser(e, args);
        // }
      },
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      excludeFromExport: true,
      resizable: false,
      focusable: false,
      selectable: false
    },
    {
      id: 'approve', name: '', field: 'approve', formatter: this.approveBtn,
      minWidth: 20,
      maxWidth: 35,
      toolTip: "Approve User",
      // cssClass: "manage-role-icon",
      onCellClick: (e, args) => {
        if (args.dataContext?.userStatus === 'PEND_APPROVE') {
          // this.approveUser(e, args);
        }
      },
      excludeFromColumnPicker: true,
      excludeFromGridMenu: true,
      excludeFromHeaderMenu: true,
      excludeFromExport: true,
      resizable: false,
      focusable: false,
      selectable: false
    },
    {
      id: 'fullName', name: 'Full Name', field: 'fullName',
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
      id: 'loginName', name: 'Login Name', field: 'loginName',
      sortable: true, type: FieldType.text,
      filterable: true, filter: { model: Filters['inputText'], },
    },
    {
      id: 'userStatus', name: 'Status', field: 'userStatus',
      sortable: true, type: FieldType.text,
      formatter: (row, cell, value, columnDef, dataContext, grid) => this.blockToCamel(dataContext?.userStatus),
      filterable: true, filter: { model: Filters['inputText'], },
    },
    {
      id: 'allowLogin', name: 'Allow Login', field: 'allowLogin',
      sortable: true, type: FieldType.text,
      filterable: true, filter: { model: Filters['inputText'] },
      formatter: (row: number, cell: number, value: any, columnDef?: Column, dataContext?: any, grid?: any) => { return dataContext.allowLogin == 'Yes' ? "Yes" : "No" }
    }
  ]
  constructor(
    private cs: CommonService,
    private permissioinStoreService: PermissionStoreService,
  ) {
    super();
  }
  ngOnInit(): void {
    this.loadUserList();
  }
  loadUserList() {
    const payload = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
    };
    // this.cs.sendRequest(this, ActionType.SELECT, ContentType.User, 'select', payload);

    this.cs.sendGetRequest(this, ActionType.SELECT, ContentType.User, 'select', 1, 10, '/getRequest');
  }

  checkActiveRole(data) {
    return this.permissioinStoreService.hasAnyPermission([this.appPermission.USER_MAKER, this.appPermission.USER_APPROVER])
      && (this.cs.forceAllow() || data.creatorId != this.cs.getUserId());
  }
  toggleActivation(e, arge) {
    debugger
    var payload = {
      userId: arge.dataContext.userId,
      userStatus: '',
      allowLogin: 0,
      pageNumber: this.pageNumber,
      pageSize: this.pageSize
    };

    const currentStatus = arge.dataContext.userStatus;
    const currentAllowLogin = arge.dataContext.allowLogin;
    const status = this.checkStatus(currentStatus, currentAllowLogin);
    console.log(arge.dataContext.allowLogin);
    payload.userStatus = status == 'Approve Inactive User'
      ? 'INACTIVE' : status == 'Inactive User'
        ? 'PEND_INACTIVE' : status == 'Approve Active User'
          ? 'ACTIVE' : 'PEND_ACTIVE';
    payload.allowLogin = arge.dataContext.allowLogin == 'No' ? 0 : 1;
    debugger
    Swal.fire({
      icon: 'question',
      title: `Want to Submit?`,
      showCancelButton: true,
      confirmButtonText: "Confirm",
      cancelButtonText: 'No',
    }).then((r) => {
      if (r.isConfirmed) {
        this.cs.sendRequestAdmin(this, ActionType.USER_ACTIVATION, ContentType.User, 'select', payload);
      }
    })
  }

  checkStatus(userStatus: string, allowLogin: string): string {
    let status = '';
    if (allowLogin == 'Yes') {
      if (userStatus == 'PEND_INACTIVE') {
        status = 'Approve Inactive User';
      }
      else {
        status = 'Inactive User'
      }
    } else if (allowLogin == 'No') {
      if (userStatus == 'PEND_ACTIVE') {
        status = 'Approve Active User';
      }
      else {
        status = 'Active User'
      }
    }
    return status;
  }
  checkUserActionVisibility(data) {
    return this.checkActiveRole(data)
      && (data?.userStatus === 'ACTIVE' || data?.userStatus === 'PEND_ACTIVE' || data?.userStatus === 'INACTIVE' || data?.userStatus === 'PEND_INACTIVE');
  }

  paginationChanged($event: any) {
    this.pageNumber = $event.page;
    this.pageSize = $event.pageSize;
    // this.totalItem=$event.totalItem;
    this.loadUserList();
  }

  buildGridData(payload: any) {
    console.log('user list', payload);
    return {
      content: payload.content,
      total: payload.totalElements,
      totalPages: payload.totalPages,
      pageSize: payload.size,
    };
  }
  blockToCamel(value: string) {

    if (value && (value != null && value != 'null')) {
      try {
        const words = value.split(/_| /g);
        const camelCaseWords = words.map((word, index) => index < 0 ? word : word.charAt(0) + word.slice(1).toLowerCase());
        const sts = camelCaseWords.join(' ');
        return sts == 'In Active' ? 'Inactive' : sts;;
      } catch (error) {
        console.log('can not convert: ', value);
        return value;
      }
    } else {
      return '';
    }

  }

  onResponse(service: Service, req: any, res: any) {
    debugger
    if (!super.isOK(res)) {
      alert(super.getErrorMsg(res));

    } else if (res.header.reference === 'select') {
      this.showGrid.update(() => true);
      this.dataset.update(() => res.payload);
      // this.totalItem = res.payload.total;
      // this.pageSize = this.dataset.length;
      // this.updatePaginationTotal(this.totalItem);
      this.buildGridData(res.payload);
    }
  }
  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }
}
