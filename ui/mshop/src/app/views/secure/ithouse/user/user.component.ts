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
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})

export class UserComponent extends Ithouse implements Service {

  pageNumber: number = 1;
  pageSize: number = 1;
  dataset=signal<any[]>([]);
  constructor(private cs: CommonService, private model: NgbModal) {
    super();
  }
  ngOnInit(): void {
  }

  check() {
    debugger
    const rf = this.model.open(ProductComponent, {backdrop: 'static'});

    rf.result.then((res) => {
      console.log('Modal closed with:', res);
    })
    .catch((reason) => {
      console.error('Modal dismissed with reason:', reason);
    })
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
