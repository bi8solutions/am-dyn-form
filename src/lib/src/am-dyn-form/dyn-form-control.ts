import {FormControl, ValidatorFn, AsyncValidatorFn, Validators} from "@angular/forms";

export abstract class DynFormControl extends FormControl {
  key: string;
  type: string;
  path: string;
  config: any = {};

  logicalErrorMessage: string;

  vCache: ValidatorFn | ValidatorFn[];

  constructor(options: {
    key?: string,           // the key of this field (used as reference and to lookup language labels, etc)
    required?: boolean,     // if this field is required or not
    dir? : string,          // the field direction (rtl, ltr)
    hint? : string,
    placeholder? : string,
    messages? : any[]

  } = {}, validator?: ValidatorFn | ValidatorFn[] | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super('', validator, asyncValidator);
    this.key = options.key || '';
    if (options){
      this.config.required = options.required != undefined ? options.required : false;
      this.config.hint = options.hint;
      this.config.placeholder = options.placeholder;
      this.config.dir = options.dir || null;
      this.config.messages = options.messages || [];

      if (validator){
        if (validator instanceof Array){
          for (let v of validator){
            if (v == Validators.required){
              this.config.required = true;
              break;
            }
          }
        } else if (validator == Validators.required){
          this.config.required = true;
        }
      }
    }
  }

  removeRequired(){
    this.config.required = false;
    this.removeValidator(Validators.required);
    this.updateValueAndValidity();
  }

  addRequired(){
    this.config.required = true;
    this.setValidator(Validators.required);
    this.updateValueAndValidity();
  }

  isRequired(){
    return this.isValidator(Validators.required);
  }

  isValidator(validator: ValidatorFn){
    if (!this.validator){
      return false;
    }

    if (this.validator instanceof Array){
      return this.validator.find(v => v == validator) != undefined;
    } else {
      return this.validator = validator;
    }
  }

  setValidator(validator: ValidatorFn){
    if (!this.isValidator(validator)){
      if (this.validator instanceof Array){
        return this.validator.push(validator);
      } else {
        return this.validator = validator;
      }
    }
  }

  removeValidator(validator: ValidatorFn){
    if (this.isValidator(validator)){
      if (this.validator instanceof Array) {
        this.setValidators(this.validator.filter(v => v != validator));
      } else {
        this.setValidators([]);
      }
    }
  }

  setLogicalError(message: string){
    this.logicalErrorMessage = message;
    this.markAsTouched();

    let errors = this.errors;
    if (!errors){
      errors = {}
    }
    errors.logical = true;
    this.setErrors(errors);
  }

  clearLogicalError(){
    this.logicalErrorMessage = null;
    if (this.errors){
      this.errors.logical = false;
      this.setErrors(this.errors);
    }
  }

  activateValidators(){
  }
}
