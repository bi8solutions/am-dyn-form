import {FormControl, ValidatorFn, AsyncValidatorFn, Validators} from "@angular/forms";
import {Observable} from "rxjs";

export interface LoaderFn<A, T> {
  (value: A) : Observable<T>
}

export abstract class DynFormControl extends FormControl {
  key: string;
  type: string;
  path: string;
  config: any = {};

  logicalErrorMessage: string;

  vCache: ValidatorFn | ValidatorFn[];

  constructor(options: {
    defaultValue?: any,
    key?: string,           // the key of this field (used as reference and to lookup language labels, etc)
    required?: boolean,     // if this field is required or not
    dir? : string,          // the field direction (rtl, ltr)
    hint? : string,
    placeholder? : string,
    messages? : any[],
    useDefaultErrorMessages?: boolean,
    loadFn?: LoaderFn<any, any>,
    disable?: boolean,

  } = {}, validator?: ValidatorFn | ValidatorFn[] | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(options.defaultValue != undefined ? options.defaultValue : null, validator, asyncValidator);
    this.key = options.key || '';
    if (options){
      this.config.required = options.required != undefined ? options.required : false;
      this.config.hint = options.hint;
      this.config.placeholder = options.placeholder;
      this.config.dir = options.dir || 'ltr';
      this.config.messages = options.messages || [];
      this.config.useDefaultErrorMessages = options.useDefaultErrorMessages || false;
      this.config.loadFn = options.loadFn || null;
      this.config.disable = options.disable || false;

      if (this.config.loadFn){
        this.loadValue(options.defaultValue, this.config.loadFn, {onlySelf: true});
      }

      if (this.config.disable){
        this.disable({onlySelf: true})
      }

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

  setValue(value: any, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
    loadFn?: LoaderFn<any, any>;
  }) : void {

    if (options && options.loadFn){
      options.loadFn(value).subscribe((result)=>{
        super.setValue(result, options);
      });
    } else {
      if (value == null) {
        super.setValue('', options);
      } else {
        super.setValue(value, options);
      }
    }
  }

  loadValue(param: any, loadFn: LoaderFn<any, any>, options?: {
    onlySelf?: boolean;
    emitEvent?: boolean;
    emitModelToViewChange?: boolean;
    emitViewToModelChange?: boolean;
  }){
    loadFn(param).subscribe((result)=>{
      super.setValue(result, options);
    });
  }
}
