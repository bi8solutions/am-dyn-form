import {FormControl, ValidatorFn, AsyncValidatorFn} from "@angular/forms";
import {DynFormControl} from "./dyn-form-control";

export class DynSelectControl extends DynFormControl {
  type = 'select';
  selectOptions: {
    code: string,
    value: string

  }[] = [];

  constructor(options: {} = {}, validator?: ValidatorFn | ValidatorFn[] | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(options, validator, asyncValidator);
    this.selectOptions = options['selectOptions'] || [];
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
