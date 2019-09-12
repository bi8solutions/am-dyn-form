import {ValidatorFn, AsyncValidatorFn} from "@angular/forms";
import {DynFormControl} from "./dyn-form-control";
import {Observable} from "rxjs";

export class DynSelectControl extends DynFormControl {
  type = 'select';
  selectOptions$: Observable<any[]>;
  showNone: boolean;
  noneLabel: string;
  multiple: boolean;

  constructor(options: {} = {}, validator?: ValidatorFn | ValidatorFn[] | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(options, validator, asyncValidator);
    this.selectOptions$ = options['selectOptions'] || [];
    this.showNone = options['showNone'] || false;
    this.noneLabel = options['noneLabel'];
    this.multiple = options['multiple'] || false;
  }

  setValue(value: any, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
  }) : void {
    if (value == null){
      super.setValue('', options);
    } else {
      super.setValue(value, options);
    }
  }
}
