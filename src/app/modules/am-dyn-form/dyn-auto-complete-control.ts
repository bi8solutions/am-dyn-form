
import {of as observableOf, Subject, Observable} from 'rxjs';

import {map} from 'rxjs/operators';
import {FormControl, ValidatorFn, AsyncValidatorFn} from "@angular/forms";
import {DynFormControl} from "./dyn-form-control";

import * as _ from 'lodash';



export class DynAutoCompleteControl extends DynFormControl {
  type = 'auto-complete';
  loader: AutoCompleteCriteriaLoader;
  selectOptions$ = new Subject<any[]>();
  total: number = 0;
  items: any[] = [];

  constructor(options: {} = {}, validator?: ValidatorFn | ValidatorFn[] | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(options, validator, asyncValidator);
    this.loader = options['loader'];

    // load the initial values after the first tick
    setTimeout(()=>{
      this.loadValues(null);
    }, 0);

    this.valueChanges.subscribe((value: any) =>{
      this.loadValues(value);
    });
  }

  loadValues(value){
    //console.log("loading values: ", value);
    this.loader.prepare({
            value: value
    }).subscribe((result: any)=>{
      this.total = result.total;
      this.items = result.items;
      this.selectOptions$.next(this.items);
    });
  }

  displayFn(item) {
    return _.get(item, this.loader.valueProperty) as any;
  }

  /*
  @TODO
  1) Should be able to specify a template for rendering the options display HTML
  2) Should be able to specify my own "selected item display" function - by default it should use the display value
  */

  /*setValue(value: any, options?: {
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
  }*/
}

export interface AutoCompleteLoadFn {
  (criteria: any): Observable<Object>;
}

export interface ArrayAutoCompleteFilterLoadFn {
  (item: any, value: any): boolean;
}

export interface AutoCompleteCriteriaLoader {
  codeProperty: string;
  valueProperty: string;
  prepare(criteria: any) : Observable<Object>;
  processResponse(response: any) : any;
}

export class ArrayAutoCompleteLoader implements AutoCompleteCriteriaLoader {
  size: number;
  page: number;
  codeProperty: string;
  valueProperty: string;

  constructor(public items: any[], public filterFn: ArrayAutoCompleteFilterLoadFn, options: any){
    this.size = !_.isNil(options.size) ? options.size : 15;
    this.page = !_.isNil(options.page) ? options.page : 0;
    this.codeProperty = !_.isNil(options.codeProperty) ? options.codeProperty : 'code';
    this.valueProperty = !_.isNil(options.valueProperty) ? options.valueProperty : 'value';
  }

  prepare(value: any) : Observable<Object> {
    return observableOf(this.items).pipe(map((items: any)=>{
      let filteredList = [];

      // note that when the actual selection takes place, the value will be the actual selected object
      // and not the string that we expect.  If it is an object, there is no reason for loading the list
      let isObject = _.isObject(value);

      items.forEach((item, index) => {
        let itemValue = _.get(item, this.valueProperty);
        if (isObject || this.filterFn(item, value.value)){
          filteredList.push(item);
        }
      });

      return this.processResponse({
        total: filteredList.length,
        items: filteredList.length > 0 ? _.chunk(filteredList, this.size)[this.page] : filteredList
      });
    }));
  }

  processResponse(response){
    return response;
  }
}

export class ObservableAutoCompleteLoader implements AutoCompleteCriteriaLoader {
  size: number;
  page: number;
  codeProperty: string;
  valueProperty: string;

  constructor(public loadFn: AutoCompleteLoadFn, options?: any){
    if (options){
      this.size = _.isNil(options.size) ? options.size : 15;
      this.page = _.isNil(options.page) ? options.page : 0;
    }
  }

  prepare(value: any) : Observable<Object> {
    let ctx = {
      size: this.size,
      page: this.page,
      value: value
    };

    return this.loadFn(ctx).pipe(map((response : any)=>{
      return this.processResponse(response);
    }));
  }

  processResponse(response){
    return {
      total: response.total,
      items: response.results
    }
  }
}

export class KeywordAutoCompleteCriteriaLoader implements AutoCompleteCriteriaLoader {
  size: number;
  page: number;
  inclusive: boolean;
  keywordProperty: string;
  codeProperty: string;
  valueProperty: string;

  constructor(public loadFn: AutoCompleteLoadFn, options?: any){
    if (options){
      this.size = _.isNil(options.size) ? options.size : 50;
      this.page = _.isNil(options.page) ? options.page : 0;
      this.inclusive = _.isNil(options.inclusive) ? options.inclusive : true;
      this.keywordProperty = options.keywordProperty;
      this.codeProperty = !_.isNil(options.codeProperty) ? options.codeProperty : 'code';
      this.valueProperty = !_.isNil(options.valueProperty) ? options.valueProperty : 'value';
    }
  }

  resolveContext(value: any){
    let ctx = {
      size: this.size,
      page: this.page,
      inclusive: this.inclusive,
      criteria: []
    };

    if (this.keywordProperty && !_.isObject(value)){
      ctx[this.keywordProperty] = value;
    }

    return ctx;
  }

  prepare(value: any) : Observable<Object> {
    let ctx = this.resolveContext(value);
    return this.loadFn(ctx).pipe(map((response : any)=>{
      return this.processResponse(response);
    }));
  }

  processResponse(response){
    return {
      total: response.total,
      items: response.results
    }
  }
}

