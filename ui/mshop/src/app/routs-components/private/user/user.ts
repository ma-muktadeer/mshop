import { Component, signal } from '@angular/core';
import { Formatter, FieldType } from 'angular-slickgrid';
import { IthouseGridModule } from 'src/app/ithouse/common/ithouse-grid/ithouse-grid-module';
import { ActionType } from 'src/app/ithouse/constants/action-type.enum';
import { CommonService } from 'src/app/ithouse/services/common.service';
import { ContentType } from 'src/app/ithouse/constants/content-type.enum';
import { CustomGridData } from 'src/app/ithouse/constants/CustomGridData';
import { Ithouse } from 'src/app/ithouse/services/Ithouse';
import { Service } from 'src/app/ithouse/services/service';

@Component({
  selector: 'ithouse-user',
  imports: [IthouseGridModule],
  templateUrl: './user.html',
  styleUrl: './user.scss'
})
export class User extends Ithouse implements Service {
  pageNumber: number = 1;
  pageSize: number = 1;
  dataset = signal<any[]>([]);
  constructor(
    private cs: CommonService,
  ) {
    super();
  }
  ngOnInit(): void {
    this.loadUse();
  }
  loadUse() {
    const payload = {
      pageNumber: 1,
      pageSize: this.pageSize,
    };
    this.cs.sendRequest(this, ActionType.SELECT, ContentType.User, 'select', payload);
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
      id: "personName",
      name: "Applicant Name",
      field: "personName",
      sortable: true,
      type: FieldType.text,
      filterable: true,
      minWidth: 180,
    },
    {
      id: "personName",
      name: "Co-Applicant Name",
      field: "personName",
      sortable: true,
      type: FieldType.text,
      filterable: true,
      minWidth: 180,
    },
  ]
  check() {
    debugger
    // const rf = this.model.open(Product, { backdrop: 'static' });

    // rf.result.then((res) => {
    //   console.log('Modal closed with:', res);
    // })
    //   .catch((reason) => {
    //     console.error('Modal dismissed with reason:', reason);
    //   })
  }

  paginationChanged($event: any) {
    throw new Error('Method not implemented.');
  }

  userList = signal<CustomGridData>(null);
  buildGridData(payload: any) {
    const gridData: CustomGridData = {
      content: payload.content,
      total: payload.totalElements,
      totalPages: payload.totalPages,
      pageSize: payload.size,
    };
    this.userList.update(() => gridData);
  }

  onResponse(service: Service, req: any, res: any) {
    if (!super.isOK(res)) {
      alert(super.getErrorMsg(res));

    } else if (res.header.referance === 'select') {
      this.dataset = res.payload.content;
      // this.totalItem = res.payload.total;
      this.pageSize = this.dataset.length;
      // this.updatePaginationTotal(this.totalItem);
      this.buildGridData(res.payload);
    }
  }
  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }
}
