import {FormGroup, AbstractControl} from "@angular/forms";
import {OperatorFunction, Observable} from "rxjs";
import {filter, tap} from "rxjs/operators";
import {pipeFromArray} from 'rxjs/internal/util/pipe';

export interface FilterFn {
  (value: any) : boolean
}

export interface MapFn {
  (value: any) : any
}

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

  addSlaveObserver(master: string, slave: string, options?: {
    apply?: boolean,
    disable?: boolean,
    reset?: boolean,
    ops?: OperatorFunction<any, any>[]
  }) : Observable<any> {

    let masterField = this.get(master);
    let slaveField = this.get(slave);

    if (!options){
      options = { disable: true, reset: true, apply: true }
    } else {
      if (options.reset === undefined){
        options.reset = true;
      }

      if (options.disable === undefined){
        options.disable = true;
      }

      if (options.apply === undefined){
        options.apply = options.disable;
      }
    }

    let ops: OperatorFunction<any, any>[] = [];

    if (options.reset){
      ops.push(tap(()=>slaveField.reset()));
    }

    if (options.disable){
      ops.push(tap(()=>slaveField.disable()));
      if (options.apply){
        slaveField.disable({onlySelf: true});
      }
    }

    ops.push(filter((value)=>{
      if (!value){
        return false;
      } else {
        return value instanceof Array ? value.length > 0 : true
      }
    }));

    if (options.disable){
      ops.push(tap(()=>slaveField.enable()))
    }

    if (options.ops){
      ops.push(...options.ops);
    }

    return masterField.valueChanges.pipe(pipeFromArray([...ops]));
  }
}


