import { Component, signal } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap'; import { Ithouse } from '../../../../ithouse/common/Ithouse';
import { CommonService } from '../../../../ithouse/common/common.service';
import { Service } from '../../../../ithouse/common/service';
import { ProductComponent } from '../../mshop/product/product.component';
import { CustomGridData } from '../../../../ithouse/common/CustomGridData';
import { IthouseGrid } from "../../../../ithouse/shard-componenrts/grid/it-grid/it-grid";
import { FieldType, Formatter } from 'angular-slickgrid';
import { ActionType } from '../../../../ithouse/constants/action-type.enum';
import { ContentType } from '../../../../ithouse/constants/content-type.enum';

@Component({
  selector: 'app-user',
  imports: [IthouseGrid],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})

export class UserComponent extends Ithouse implements Service {

  pageNumber: number = 1;
  pageSize: number = 1;
  dataset = signal<any[]>([]);
  constructor(private cs: CommonService, private model: NgbModal) {
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
    const rf = this.model.open(ProductComponent, { backdrop: 'static' });

    rf.result.then((res) => {
      console.log('Modal closed with:', res);
    })
      .catch((reason) => {
        console.error('Modal dismissed with reason:', reason);
      })
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
