import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { FormValue } from 'src/app/ithouse/classes/FormValue';
import { ActionType } from 'src/app/ithouse/constants/action-type.enum';
import { CommonService } from 'src/app/ithouse/services/common.service';
import { ContentType } from 'src/app/ithouse/constants/content-type.enum';
import { Ithouse } from 'src/app/ithouse/services/Ithouse';
import { Service } from 'src/app/ithouse/services/service';
import Swal from 'sweetalert2';
import { DynamicForm } from "src/app/ithouse/common/components/dynamic-form/dynamic-form";
import { RequestBody } from 'src/app/ithouse/constants/RequestBody';

@Component({
  selector: 'app-edit-profile',
  imports: [DynamicForm],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.scss'
})
export class EditProfile extends Ithouse implements Service {
  @Input() userDetails: any;
  loading: boolean;
  // profileForm: FormGroup;


  constructor(private activeModal: NgbActiveModal, private cs: CommonService,) {
    super();
  }

  ngOnInit(): void {

    if (!this.userDetails) {
      this.closeModal('User information is not found');
    }
  }

  formDataInfo: FormValue[] = [
    { id: 'firstName', name: 'firstName', label: 'First Name', placeholder: 'Enter Your First Name', faIcon: 'fa-beat-fade fa-user-circle', type: 'text', validations: { required: true }, validationMessages: { required: 'First name is required.' } },
    { id: 'lastName', name: 'lastName', label: 'Last Name', placeholder: 'Enter Your Last Name', faIcon: 'fa-beat-fade fa-user-plus', type: 'text', validations: { required: true }, validationMessages: { required: 'Last name is required.' } },
    { id: 'middleName', name: 'middleName', label: 'Middle Name', placeholder: 'Enter Your Middle Name', faIcon: 'fa-beat-fade fa-user', type: 'text' },
    { id: 'dob', name: 'dob', label: 'Birthday', placeholder: 'Enter Your Birthday', faIcon: 'fa-beat-fade fa-birthday-cake', type: 'date', validations: { required: true }, validationMessages: { required: 'Birthday is required.' } },
    { id: 'email', name: 'email', label: 'Email', placeholder: 'Enter Your Email', faIcon: 'fa-beat-fade fa-envelope-open', type: 'email', validations: { required: true, email: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$' }, validationMessages: { required: 'Email is required.', email: 'Invalid email' } },
    { id: 'phoneNumber', name: 'phoneNumber', label: 'Phone', placeholder: 'Enter Your Phone', faIcon: 'fa-beat-fade fa-phone-square', type: 'text', validations: { required: true, minLength: 11 }, validationMessages: { required: 'Phone is required.', minLength: 'Length musb be 11 characters long.' } },
    { id: 'address', name: 'address', label: 'Address', placeholder: 'Enter Your Address', faIcon: 'fa-beat-fade fa-address-card', type: 'textarea', validations: { required: true }, validationMessages: { required: 'Address is required.' } },
    {
      id: 'country', name: 'country', label: 'Country', placeholder: 'Enter Your Country', faIcon: 'fa-beat-fade fa-globe', type: 'select', validations: { required: true }, validationMessages: { required: 'Address is required.' }, selectOption: [
        { id: 1, name: 'Bangladesh', value: 'Bangladesh' },
        { id: 2, name: 'Chaina', value: 'Chaina' },
      ]
    },
  ]

  onButtonClick(event: any) {
    debugger
    console.log('form value', event);
    if (typeof event === 'string' || event instanceof String) {
      this.closeModal(event.toString());
    } else {
      const payload = event;
      payload.fullName = `${payload['firstName'].trim()} ${payload['lastName'].trim()}`
      this.cs.sendRequest(this, ActionType.UPDATE, ContentType.User, 'UPDATE', payload);
    }
  }

  onResponse(service: Service, req: RequestBody<any>, res: any) {
    this.loading = false;
    if (!super.isOK(res)) {
      Swal.fire(super.getErrorMsg(res));
      return;
    } else if (req.header.reference === 'UPDATE') {
      const user = res.payload;
      if (user) {
        this.userDetails = user;
        this.cs.storeLoginUser(this.userDetails);
        this.closeModal(this.userDetails);
      }
      else {
        this.closeModal(null)
      }
    }
  }
  onError(service: Service, req: any, res: any) {
    this.loading = false;
    Swal.fire(`${res?.statusText} with error code:${res?.status}`, 'error');
    throw new Error('Method not implemented.');
  }

  onCancel(ref: string) {
    this.closeModal(ref);
  }
  closeModal(ref?: any) {
    this.activeModal.close(ref);
  }
}
