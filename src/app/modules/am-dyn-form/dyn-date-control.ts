import {FormControl, ValidatorFn, AsyncValidatorFn} from "@angular/forms";
import {DynFormControl} from "./dyn-form-control";

export class DynDateControl extends DynFormControl {
  type = 'date';
  minDate: Date;
  maxDate: Date;

  constructor(options: {} = {}, validator?: ValidatorFn | ValidatorFn[] | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(options, validator, asyncValidator);
    this.minDate = options['minDate'] || null;
    this.maxDate = options['maxDate'] || null;
  }
}
