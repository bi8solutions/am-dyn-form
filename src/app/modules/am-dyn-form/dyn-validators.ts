import {FormControl} from "@angular/forms";
import {DynFormControl} from "./dyn-form-control";

export function DynMatchValidator (otherControlName: string) {

  let thisControl: FormControl;
  let otherControl: FormControl;

  return function matchOtherValidate (control: FormControl) {

    if (!control.parent) {
      return null;
    }

    // Initializing the validator.
    if (!thisControl) {
      thisControl = control;
      otherControl = control.parent.get(otherControlName) as FormControl;
      if (!otherControl) {
        throw new Error('matchOtherValidator(): other control is not found in parent group');
      }
      otherControl.valueChanges.subscribe(() => {
        thisControl.updateValueAndValidity();
      });
    }

    if (!otherControl) {
      return null;
    }

    if (otherControl.value !== thisControl.value) {
      return {
        match: true
      };
    }
    return null;
  }
}

export function BusinessLogicValidator () {
  return function matchOtherValidate (control: FormControl) {
    if (!control.parent) {
      return null;
    }

    /*if (control instanceof DynFormControl){
      if (control.key == 'middleName'){
        control.markAsTouched();
        return {
          logical: true
        };
      }
    }*/

    return null;
  }
}
