import {FormControl, ValidatorFn, AsyncValidatorFn} from "@angular/forms";
import {DynFormControl} from "./dyn-form-control";

export class DynTextControl extends DynFormControl {
  type = 'text';

  constructor(options: {} = {}, validator?: ValidatorFn | ValidatorFn[] | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(options, validator, asyncValidator);
    this.config.format = options['format'] || 'text';
    this.config.counter = options['counter'] != undefined ? options['counter'] : true;
    this.config.maxlimit = options['maxlimit'];
  }
}
