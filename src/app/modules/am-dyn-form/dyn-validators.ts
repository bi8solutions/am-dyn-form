import {FormControl, ValidatorFn} from "@angular/forms";
import {DynFormControl} from "./dyn-form-control";

import * as moment_ from 'moment';
const moment = moment_;

import index from "@angular/cli/lib/cli";
import {Moment} from "moment";

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
    return null;
  }
}

export interface TimeData {
  hours: number,
  minutes: number,
  is24Hour: boolean
}

export class TimeUtils {

  static parseTime(value: string) : TimeData  {
    if (!value){
      return null;
    }

    let formats = [ 'HH:mm', 'H:mm'];
    for (let format of formats) {
      let dt = moment(value, format, true);
      if (dt.isValid()){
        return {
          hours: dt.hours(),
          minutes: dt.minutes(),
          is24Hour: true
        };
      }
    }

    formats = [ 'hh:mm a', 'hh:mma', 'h:mm a', 'h:mma', 'h:m a', 'h:ma' ];
    for (let format of formats) {
      let dt = moment(value, format, true);
      if (dt.isValid()){
        return {
          hours: dt.hours(),
          minutes: dt.minutes(),
          is24Hour: false
        };
      }
    }

    return null;
  }


  static formatTime(date : Date | Moment) : string {
    if (<Moment> date){
      return (<Moment>date).format('hh:mm a');

    } else if (<Date> date){
      return moment(date).format('hh:mm a');
    }
  }

  static applyTime(date: Date | Moment, time: TimeData) {
    if (<Date> date){
      let md : Moment = <Moment> date;
      md.hours(time.hours);
      md.minutes(time.minutes);

    } else if (<Date> date){
      let md : Moment = moment(<Date> date);
      md.hours(time.hours);
      md.minutes(time.minutes);
    }
  }

}

export function TimeValidator () : ValidatorFn {
  return (control: FormControl) =>{
    let value = control.value;

    if (value){
      let td : TimeData = TimeUtils.parseTime(value);
      if (td != null){
        return null;
      } else {
        return { time: true };
      }

    } else {
      return null;
    }
  }
}
