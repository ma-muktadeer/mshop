import { Component, inject, signal } from '@angular/core';
import { ActionType } from 'src/app/ithouse/constants/action-type.enum';
import { CommonService } from 'src/app/services/common.service';
import { ContentType } from 'src/app/services/common/constants/content-type.enum';
import { Ithouse } from 'src/app/services/common/Ithouse';
import { PermissionStoreService } from 'src/app/services/permissioin-store.service';
import { Service } from 'src/app/services/service';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ithouse-permission',
  imports: [DragDropModule, FormsModule],
  templateUrl: './permission.html',
  styleUrl: './permission.scss'
})
export class Permission extends Ithouse implements Service {
  filteredPermissionList = signal<any[]>([]);
  unassignRoleList = signal<any[]>([]);

  permissionList: any[] = [];
  clickedItem: any;
  displayName: string;
  desc: string;
  permissionId: number;
  displayStyle: string = "none";
  assignRoleList: any;
  spinnerAssignSave: boolean = false;
  permissionBtnDisabled: boolean = false;
  disableAddSave: boolean = false;
  spinnerAddSave: boolean = false;

  constructor(public permissionStoreService: PermissionStoreService,
    private cs: CommonService
  ) {
    super();
  }

  unassignPermissionListAll = []
  onSearchPermission(e, terget) {
    debugger
    console.log(e)
    if (terget == 'UN') {
      if (!e.target.value) {
        // this.unassignRoleList = this.unassignPermissionListAll
        this.unassignRoleList.set(this.unassignPermissionListAll);
      }
      else {
        // this.unassignRoleList = this.unassignPermissionListAll.filter(x =>
        this.unassignRoleList.set(this.unassignPermissionListAll.filter(x =>
          x.displayName.toUpperCase().indexOf(e.target.value.toUpperCase()) > -1
        ));
      }
    }
  }
  onEdit(e, group) {
    debugger
    this.permissionId = group.permissionId
    this.displayName = group.displayName
    this.desc = group.desc
    e.stopPropagation();
    this.displayStyle = "block"
  }

  onSave() {
    if (this.spinnerAddSave) {
      return
    }
    var payload = {
      permissionId: this.permissionId,
      displayName: this.displayName,
      desc: this.desc
    }
    this.displayStyle = "none"
    this.spinnerAddSave = true
    this.disableAddSave = true
    return this.cs.sendRequestAdmin(this, ActionType.SAVE, ContentType.AppPermission, 'SAVE', payload)

  }

  onPermissionSearch(e) {
    console.log(e)
    if (!e.target.value) {
      // this.filteredPermissionList = this.permissionList
      this.filteredPermissionList.update(() => this.permissionList);
    }
    else {
      // this.filteredPermissionList = this.permissionList.filter(x => x.permissionName.indexOf(e.target.value.toUpperCase()) > -1)
      this.filteredPermissionList.update(() => this.permissionList.filter(x => x.permissionName.indexOf(e.target.value.toUpperCase()) > -1));
    }
  }

  drop(event: CdkDragDrop<string[]>) {
    debugger
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex);
    }
  }
    closePopup() {
    this.displayStyle = "none";
  }

  onRoleSave() {
    debugger
    if (this.spinnerAssignSave) {
      return;
    }
    var payload = {
      roleList: this.assignRoleList,
      unassignRoleList: this.unassignRoleList(),
      permissionId: this.clickedItem.permissionId

    }

    this.cs.sendRequestAdmin(this, ActionType.MANAGE_APP_PERMISSION, ContentType.AppPermission, 'MANAGE_APP_PERMISSION', payload);
    this.spinnerAssignSave = true
    this.permissionBtnDisabled = true
  }
  onClickPermissionItem(e, group) {
    debugger
    this.clickedItem = group;
    return this.cs.sendRequestAdmin(this, ActionType.SELECT_PERMISSION_ROLE, ContentType.AppPermission, 'SELECT_PERMISSION_ROLE', group);
  }

  onResponse(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }
  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }
}
