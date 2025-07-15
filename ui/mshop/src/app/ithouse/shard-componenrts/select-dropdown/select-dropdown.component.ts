import { Component, forwardRef, Input, input, OnInit } from '@angular/core';
import { ControlValueAccessor, FormsModule, NG_VALUE_ACCESSOR, NgSelectOption } from '@angular/forms';
import { debounceTime, Subject } from 'rxjs';
import { NgSelectComponent } from '@ng-select/ng-select';

@Component({
  selector: 'ithouse-select-dropdown',
  standalone: true,
  imports: [NgSelectComponent, FormsModule],
  templateUrl: './select-dropdown.component.html',
  styleUrl: './select-dropdown.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SelectDropdownComponent),
      multi: true
    }
  ]
})
export class SelectDropdownComponent implements OnInit, ControlValueAccessor {

  id: any = input.required<any>();
  @Input('value') value!: any;
  @Input('label') label: string = 'Label';
  @Input('multi') multi: boolean = true;
  displayKey: any = input.required<any>();

  // @Input('config') config?: any = {
  //   placeholder: 'Select',
  //   moreText: 'more options selected.',
  //   noResultsFound: 'On options found',
  //   search: true,
  //   height: 'auto',
  // }

  // @Output() submit: any = new EventEmitter<any>();
  selected: any;

  constructor() {

  }

  ngOnInit(): void {
    debugger
    this.selectionChanged.pipe(
      debounceTime(1000)
    ).subscribe(res => {
      this.onChange(res.value);
    });
  }


  private selectionChanged = new Subject<any>();
  selectedValue(event: any) {
    this.selectionChanged.next(event);
  }


  onChange: any = () => { };
  onTouched: any = () => { };

  // This will be called by Angular when you write a value via [(ngModel)]
  writeValue(value: any): void {
    this.selected = value ?? [];
  }

  // Registers a callback function that Angular will call when the value changes
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  // Registers a callback function that Angular will call when the component is touched
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  // Optionally disable the control (ngModel)
  setDisabledState?(isDisabled: boolean): void {
    // Handle disabled state here, if needed
  }

}
