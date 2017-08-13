import {FormControl, ValidatorFn, AsyncValidatorFn} from "@angular/forms";
import {DynFormControl} from "./dyn-form-control";

export class DynCheckboxControl extends DynFormControl {
  type = 'checkbox';
  leadingLabel: boolean;

  constructor(options: {} = {}, validator?: ValidatorFn | ValidatorFn[] | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(options, validator, asyncValidator);
    this.config.leadingLabel = options['leadingLabel'];
  }
}
