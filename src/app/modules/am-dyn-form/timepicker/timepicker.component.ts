import {coerceBooleanProperty} from '@angular/cdk/coercion';

import {
  AfterContentInit, Component,
  Directive,
  ElementRef,
  forwardRef,
  Input,
  OnDestroy
} from '@angular/core';

import {
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  FormControl,
  FormGroup
} from '@angular/forms';
import {TimeData} from "../dyn-validators";

@Component({
  selector: 'am-timepicker',
  templateUrl: './timepicker.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AmTimepickerComponent),
      multi: true
    }
  ]
})
export class AmTimepickerComponent implements AfterContentInit, ControlValueAccessor, OnDestroy {

  private _disabled: boolean;
  private _data: TimeData | null;
  private _minHours: number;
  private _maxHours: number;

  private _cvaOnChange: (value: any) => void = () => {};
  private _validatorOnChange = () => {};
  private _onTouched = () => {};

  timeForm: FormGroup;

  @Input()
  set minHours(minHours: number){
    this._minHours = minHours;
  }

  @Input()
  set maxHours(maxHours: number){
    this._maxHours = maxHours;
  }

  @Input()
  get disabled() { return !!this._disabled; }
  set disabled(value: any) {
    const newValue = coerceBooleanProperty(value);

    if (this._disabled !== newValue) {
      this._disabled = newValue;
    }
  }

  constructor(private _elementRef: ElementRef) {
    this.timeForm = new FormGroup ({
      hours: new FormControl(),
      minutes: new FormControl(),
      amPm: new FormControl()
    });
  }

  ngAfterContentInit() {
  }

  ngOnDestroy() {
  }

  writeValue(value: TimeData): void {
    this._data = value;
    console.log("writeValue: ", value);
  }

  registerOnChange(fn: (value: any) => void): void {
    this._cvaOnChange = fn;
    console.log("registerOnChange:", fn);
  }

  registerOnTouched(fn: () => void): void {
    this._onTouched = fn;
    console.log("registerOnTouch: ", fn);
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
    console.log("setDisabled: ", disabled);
  }
}
