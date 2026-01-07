import { Component, inject, Input, input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormValue } from 'src/app/ithouse/classes/FormValue';
import { DynamicForm } from "src/app/ithouse/common/components/dynamic-form/dynamic-form";
import { ActionType } from 'src/app/ithouse/constants/action-type.enum';
import { ContentType } from 'src/app/ithouse/constants/content-type.enum';
import { RequestBody } from 'src/app/ithouse/constants/RequestBody';
import { AlertService } from 'src/app/ithouse/services/alert.service';
import { CommonService } from 'src/app/ithouse/services/common.service';
import { Ithouse } from 'src/app/ithouse/services/Ithouse';
import { Service } from 'src/app/ithouse/services/service';

@Component({
  selector: 'ithouse-role-form',
  imports: [DynamicForm],
  templateUrl: './role-form.html',
  styleUrl: './role-form.scss',
})
export class RoleForm extends Ithouse implements Service {
  private readonly activeModal = inject(NgbActiveModal);
  private readonly alert = inject(AlertService);
  @Input() formDataInfo: FormValue[] = [];
  @Input() formValue: any;

  private readonly cs = inject(CommonService);

  onButtonClick(event: any) {
    debugger
    console.log('form value', event);
    if (typeof event === 'string' || event instanceof String) {
      this.closeModal(event.toString());
    } else {
      const payload = event;
      this.cs.sendRequestAdmin(this, ActionType.SAVE, ContentType.Role, 'SAVE', payload);
    }
  }
  onCancel(ref: string) {
    this.closeModal(ref);
  }
  closeModal(ref?: any) {
    this.activeModal.close(ref);
  }

  onResponse(service: Service, req: RequestBody<any>, res: any) {
    // this.loading = false;
    if (!super.isOK(res)) {
      this.alert.showAlert('Error', `${super.getErrorMsg(res)}`, 'error');
      return;
    } else if (req.header.reference === 'SAVE') {
      const response = res.payload;
      if (response) {
        this.closeModal(response);
      }
      else {
        this.closeModal(null)
      }
    }
  }
  onError(service: Service, req: any, res: any) {
    // this.loading = false;
    console.log('getting error', res);
    this.alert.showAlert('Error', `${super.getErrorMsg(res)}`, 'error');
  }
}
