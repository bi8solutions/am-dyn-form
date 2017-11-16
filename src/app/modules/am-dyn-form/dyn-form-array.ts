import {AbstractControl, FormArray} from "@angular/forms";

export class DynFormArray extends FormArray {
  key: string;
  dir: string;
  config: any = {};

  constructor(options: {
    key?: string,
    dir?: string,
  } = {}, controls: AbstractControl[]) {
    super(controls);
    if (options){
      this.key = options.key || '';
      this.dir = options.dir || '';
    }
  }

  add(values?: any){
  }
}
