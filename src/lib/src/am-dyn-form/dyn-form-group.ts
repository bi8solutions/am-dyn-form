import {FormControl, ValidatorFn, AsyncValidatorFn, FormGroup, AbstractControl} from "@angular/forms";
import {DynFormArray} from "./dyn-form-array";
import {DynFormControl} from "./dyn-form-control";

export class DynFormGroup extends FormGroup {
  key: string;
  dir: string;
  config: any = {};

  constructor(options: {
    key?: string,
    dir?: string,
  } = {}, controls: { [key: string]: AbstractControl; }) {
    super(controls);
    if (options){
      this.key = options.key || '';
      this.dir = options.dir || '';
    }
  }
}
