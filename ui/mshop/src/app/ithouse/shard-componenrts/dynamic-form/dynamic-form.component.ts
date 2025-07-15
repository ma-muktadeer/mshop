import { NgClass } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormValue } from '../../classes/FormValue';
import { DateConvertService } from '../../common/date-convert.service';

@Component({
  selector: 'ithouse-dynamic-form',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass],
  templateUrl: './dynamic-form.component.html',
  styleUrl: './dynamic-form.component.scss'
})
export class DynamicFormComponent implements OnInit {

  @Input()
  public formDataInfo: FormValue[];

  @Input()
  formValue?: any;

  @Output()
  onButtonClick?: EventEmitter<any> = new EventEmitter<any>();
  form: FormGroup<any>;

  constructor(private fb: FormBuilder, private dateservice: DateConvertService) {

  }

  ngOnInit(): void {
    console.log('user info is', this.formValue);
    debugger
    this.form = this.fb.group({});
    this.formDataInfo.forEach(field => {
      let value: any;
      if (this.formValue) {
        if (field.type === 'date') {
          value = value = this.formValue[field.name] ? this.dateservice.convertDb2Date(this.formValue[field.name]) : '';
        } else {
          value = this.formValue[field.name];
        }
      }
      const control = this.fb.control(
        value, // initial value
        this.buildValidators(field.validations)
      );
      this.form.addControl(field.name, control);
    });
  }

  buildValidators(validations?: { [key: string]: any }) {
    const validatorFns = [];
    if (validations) {
      if (validations['required']) {
        validatorFns.push(Validators.required);
      }
      if (validations['email']) {
        if (typeof validations['email'] == 'boolean') {
          validatorFns.push(Validators.email);
        } else {
          validatorFns.push(Validators.pattern(validations['email']));
        }
      }
      if (validations['minLength']) {
        validatorFns.push(Validators.minLength(validations['minLength']));
      }
      if (validations['maxLength']) {
        validatorFns.push(Validators.maxLength(validations['maxLength']));
      }
      // Add other validators here as needed
    }
    return validatorFns;
  }

  isFieldInvalid(fieldName: string): boolean {
    const control = this.form.get(fieldName);
    return control && control.invalid && control.touched;
  }

  getFieldErrors(fieldName: string): string[] {
    const control = this.form.get(fieldName);
    return control ? Object.keys(control.errors || {}) : [];
  }

  getValidationMessage(fieldName: string, errorKey: string): string {
    const field = this.formDataInfo.find(f => f.name === fieldName);
    return field?.validationMessages?.[errorKey] || 'Invalid value';
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form Submitted:', this.form.value);
      this.onCancel(this.form.value);
    }
  }

  onCancel(ref: any) {
    this.onButtonClick.emit(ref);
  }
}
