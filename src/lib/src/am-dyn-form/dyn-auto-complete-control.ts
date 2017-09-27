import {FormControl, ValidatorFn, AsyncValidatorFn} from "@angular/forms";
import {DynFormControl} from "./dyn-form-control";
import {Subject} from "rxjs/Subject";

import * as _ from 'lodash';
import {AsyncSubject} from "rxjs/AsyncSubject";
import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';

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
    this.loader.prepare({
            value: value
    }).subscribe((result: any)=>{
      this.total = result.total;
      this.items = result.items;
      this.selectOptions$.next(this.items);
    });
  }

  displayFn(code) {
    let item = _.find(this.items, (item)=>{
      return item.code == code;
    });
    
    return !_.isEmpty(item) ? item.value : null;
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

export interface AutoCompleteLoadFn {
  (criteria: any): Observable<Object>;
}

export interface AutoCompleteCriteriaLoader {
  prepare(criteria: any) : Observable<Object>;
  processResponse(response: any) : any;
}

export class ArrayAutoCompleteLoader implements AutoCompleteCriteriaLoader {
  size: number;
  page: number;
  codeProperty: string;
  valueProperty: string;

  constructor(public items: any[], options: any){
    this.size = !_.isNil(options.size) ? options.size : 15;
    this.page = !_.isNil(options.page) ? options.page : 0;
    this.codeProperty = !_.isNil(options.codeProperty) ? options.codeProperty : 'code';
    this.valueProperty = !_.isNil(options.valueProperty) ? options.valueProperty : 'value';
  }

  prepare(value: any) : Observable<Object> {
    return Observable.of(this.items).map((items: any)=>{
      let filteredList = [];

      items.forEach((item, index) => {
        let itemValue = _.get(item, this.valueProperty) as String;
        if (!_.isEmpty(value.value)){
          if (itemValue.indexOf(value.value) > -1) {
            filteredList.push({
              code: _.get(item, this.codeProperty),
              value: itemValue
            });
          }
        } else {
          filteredList.push({
            code: _.get(item, this.codeProperty),
            value: itemValue
          });
        }
      });

      return this.processResponse({
        total: filteredList.length,
        items: filteredList.length > 0 ? _.chunk(filteredList, this.size)[this.page] : filteredList
      });
    });
  }

  processResponse(response){
    return response;
  }
}

export class ObservableAutoCompleteLoader implements AutoCompleteCriteriaLoader {
  size: number;
  page: number;

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

    return this.loadFn(ctx).map((response : any)=>{
      return this.processResponse(response);
    });
  }

  processResponse(response){
    return {
      total: response.total,
      items: response.results
    }
  }
}

export class BasicAutoCompleteCriteriaLoader implements AutoCompleteCriteriaLoader {
  size: number;
  page: number;
  inclusive: boolean;
  keywordProperty: string;

  constructor(public loadFn: AutoCompleteLoadFn, options?: any){
    if (options){
      this.size = _.isNil(options.size) ? options.size : 50;
      this.page = _.isNil(options.page) ? options.page : 0;
      this.inclusive = _.isNil(options.inclusive) ? options.inclusive : true;
      this.keywordProperty = options.keywordProperty;
    }
  }

  resolveContext(){
    return {
      size: this.size,
      page: this.page,
      inclusive: this.inclusive,
      criteria: []
    };
  }

  resolveFilters(value){
    let filters = [];
    if (this.keywordProperty){
      filters.push({
        operation: 'ilike',
        value: value,
        path: this.keywordProperty
      });
    }
    return filters;
  }

  prepare(value: any) : Observable<Object> {
    let ctx = this.resolveContext();
    ctx.criteria = this.resolveFilters(value);

    return this.loadFn(ctx).map((response : any)=>{
      return this.processResponse(response);
    });
  }

  processResponse(response){
    return {
      total: response.total,
      items: response.results
    }
  }
}

