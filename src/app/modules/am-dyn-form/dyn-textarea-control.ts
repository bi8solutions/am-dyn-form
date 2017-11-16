import {FormControl, ValidatorFn, AsyncValidatorFn} from "@angular/forms";
import {DynFormControl} from "./dyn-form-control";

export class DynTextareaControl extends DynFormControl {
  type = 'textarea';

  constructor(options: {} = {}, validator?: ValidatorFn | ValidatorFn[] | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(options, validator, asyncValidator);
    this.config.minRows = options['minRows'] || null;
    this.config.maxRows = options['maxRows'] || null;
    this.config.maxlimit = options['maxlimit'];
  }
}
