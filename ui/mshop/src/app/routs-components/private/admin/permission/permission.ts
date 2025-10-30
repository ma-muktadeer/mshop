import { Component, computed, inject, signal } from '@angular/core';
import { ActionType } from 'src/app/ithouse/constants/action-type.enum';
import { CommonService } from 'src/app/services/common.service';
import { ContentType } from 'src/app/services/common/constants/content-type.enum';
import { Ithouse } from 'src/app/services/common/Ithouse';
import { PermissionStoreService } from 'src/app/services/permissioin-store.service';
import { Service } from 'src/app/services/service';
import { CdkDragDrop, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { Toast } from 'src/app/services/common/Toast';
import { NgScrollbar } from "ngx-scrollbar";
import { RequestBody } from 'src/app/services/common/constants/RequestBody';

@Component({
  selector: 'ithouse-permission',
  imports: [DragDropModule, FormsModule, NgScrollbar],
  templateUrl: './permission.html',
  styleUrl: './permission.scss'
})
export class Permission extends Ithouse implements Service {

  permissionList = signal<any[]>([]);
  errorMsg = signal<string>('');
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
  user: any;
  searchRoleText = signal<string>('');
  searchPermissionText = signal<string>('');

  unassignPermissionListAll = []

  unassignRoleList = computed(() => {
    return this.filterValue(this.unassignPermissionListAll, this.searchRoleText(), 'displayName');
  });

  filteredPermissionList = computed(() => {
    return this.filterValue(this.permissionList(), this.searchPermissionText(), 'permissionName');
  });

  constructor(public permissionStoreService: PermissionStoreService,
    private cs: CommonService
  ) {
    super();
  }
  ngOnInit(): void {

    this.onLoad();
  }

  onLoad() {
    this.cs.sendRequestAdmin(this, ActionType.SELECT, ContentType.AppPermission, 'FindAll', {});
  }

  filterValue(list: any[], searchText: string, key: string): any[] {
    if (!searchText) {
      return list;
    }
    return list.filter(x =>
      x[key].toUpperCase().includes(searchText.toUpperCase())
    );
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

  onResponse(service: Service, req: RequestBody<any>, res: any) {
    this.spinnerAddSave = false
    this.disableAddSave = false
    this.spinnerAssignSave = false
    this.permissionBtnDisabled = false
    debugger
    if (!super.isOK(res)) {
      this.errorMsg.update(() => super.getErrorMsg(res));
      return;
    }
    this.errorMsg.update(() => null);
    if (req.header.reference == 'FindAll') {
      this.permissionList.update(() => res.payload);
      // this.filteredPermissionList.set(res.payload);
      console.log(res);
    }
    else if (req.header.reference == 'SAVE') {
      Toast.show("Permission Saved");
      this.onLoad();
    }
    else if (req.header.reference == 'APPROVE') {
      Toast.show("Permission Approved");
      this.onLoad();
    }
    else if (req.header.reference == 'SELECT_PERMISSION_ROLE') {
      console.log(res);

      var roleGroup = res.payload
      this.assignRoleList = roleGroup.roleList;
      // this.unassignRoleList.set(roleGroup.unassignRoleList);
      // this.unassignRoleList = roleGroup.unassignRoleList;
      this.unassignPermissionListAll = roleGroup.unassignRoleList;

    } else if (res.header.referance == 'APPROVE_PERMISSION') {
      if (res.payload.length > 0) {
        Swal.fire({ title: "Successfully APPROVE PERMISSION", toast: true, timer: 1000 });
        this.user = res.payload[0];
        this.assignRoleList = this.user.roleList;
        // this.unassignRoleList.set(this.user.unassignRoleList);
        // this.unassignRoleList.set(this.unassignRoleList().filter(x => x.status == 'APPROVED'));
        // this.filteredUnassignRoleList = this.unassignRoleList
      }
    } else if (res.header.referance == 'APPROVE_DEASSIGN_PERMISSION') {
      if (res.payload.length > 0) {
        Swal.fire({ title: "Successfully De-Assigned Role", toast: true, timer: 1000 });
        this.user = res.payload[0];
        this.assignRoleList = this.user.roleList;
        // this.unassignRoleList.set(this.user.unassignRoleList);
        // this.unassignRoleList.set(this.unassignRoleList().filter(x => x.status == 'APPROVED'));
        // this.filteredUnassignRoleList = this.unassignRoleList
      }
    }

    else if (res.header.referance == 'MANAGE_APP_PERMISSION') {
      console.log(res)
      Toast.show("Permission Saved");
    }
  }
  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }
}
