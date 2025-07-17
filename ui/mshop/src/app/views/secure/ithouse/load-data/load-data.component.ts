import { Component, OnInit, signal } from '@angular/core';
import { Ithouse } from '../../../../ithouse/common/Ithouse';
import { CommonService } from '../../../../ithouse/common/common.service';
import { Service } from '../../../../ithouse/common/service';
import { ActionType } from '../../../../ithouse/constants/action-type.enum';
import { ContentType } from '../../../../ithouse/constants/content-type.enum';
import { CommonModule } from '@angular/common';
import { Pagination } from 'angular-slickgrid';

@Component({
  selector: 'ithouse-load-data',
  imports: [CommonModule,],
  templateUrl: './load-data.component.html',
  styleUrl: './load-data.component.scss'
})
export class LoadDataComponent extends Ithouse implements Service, OnInit {
isBrowser = signal<boolean>(false);
  slickGridComponent= signal<any>(null);
  constructor(private cs: CommonService) {
    super();
  }
  async ngOnInit(): Promise<void> {
    this.isBrowser.update(() => typeof window !== 'undefined');
    console.log('isBrowser: ', this.isBrowser());
    if (this.isBrowser()) {
      const { TestGrid } = await import('./test-grid/test-grid');
      this.slickGridComponent.update(()=>TestGrid);
    }
    this.loadUser(undefined);
  }

  loadUser(pageable: Pagination | undefined) {
    var payload = {
      pageNumber: pageable?.pageNumber ?? 1,
      pageSize: pageable?.pageSize ?? 1,
    };
    debugger
    // this.cs.sendRequest(this, ActionType.SELECT, ContentType.User, 'select', payload);
    this.cs.executeAdmin(ActionType.SELECT, ContentType.User, payload).subscribe(res => {
      this.getCustomerCallback(res);
    })
    // return res;
  }
  getCustomerCallback(res) {
    const response = res.payload;
    debugger
    console.info('response: ', response);
  }

  onResponse(service: Service, req: any, res: any) {
    debugger
    if (!super.isOK(res)) {
      alert(super.getErrorMsg(res));

    } else if (res.header.referance === 'select') {
      this.getCustomerCallback(res);
    }
  }
  onError(service: Service, req: any, res: any) {
    throw new Error('Method not implemented.');
  }

}
