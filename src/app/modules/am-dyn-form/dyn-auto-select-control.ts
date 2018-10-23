import {ValidatorFn, AsyncValidatorFn} from "@angular/forms";
import {DynFormControl} from "./dyn-form-control";
import {Observable} from "rxjs";
import {Subject} from "rxjs/Subject";
import {TemplateRef} from "@angular/core";
import {debounceTime, distinctUntilChanged, tap} from "rxjs/operators";
import {NgSelectComponent} from "@ng-select/ng-select";
import {Channel, EventType} from "@bi8/am-io";

export class DynAutoSelectControl extends DynFormControl {
  type = 'autoselect';
  channel: Channel<string, any>;
  typeahead$: Subject<any>;
  items$: Observable<any>;
  showNone: boolean;
  noneLabel: string;
  labelTemplate: TemplateRef<any>;
  optionTemplate: TemplateRef<any>;
  bindValue: string;
  bindRef: string;
  hasValue: boolean = false;

  bindLabel: string;
  loading: boolean = false;
  multiple: boolean = false;
  debounce: number;
  searchable: boolean = true;

  selectedValue: any;
  ngSelectComponent: NgSelectComponent;
  element: Element;

  clearToggle: boolean = false;

  constructor(options: {} = {}, validator?: ValidatorFn | ValidatorFn[] | null, asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null) {
    super(options, validator, asyncValidator);

    this.showNone = options['showNone'] || false;
    this.noneLabel = options['noneLabel'];
    this.multiple = options['multiple'] || false;
    this.debounce = options['debounce'] || 500;
    this.searchable = options['searchable'] || false;

    let debounceOp = debounceTime(200);
    let showTappet = tap(()=>this.loading = true);
    let hideTappet = tap(()=>this.loading = false);

    if (options['bindLabel']){
      this.bindLabel = options['bindLabel'];

    } else {
      this.bindLabel = 'name';
    }

    if (options['bindValue']){
      this.bindValue = options['bindValue'];
    }

    this.labelTemplate = options['labelTemplate'];
    this.optionTemplate = options['optionTemplate'];

    if (options['channel']) {
      this.channel = options['channel'];
      this.channel.asEventObservable().subscribe((event: any)=>{
        switch(event.observeType){
          case EventType.on_next:
            this.loading = true;
            break;
          default:
            this.loading = false;
            break;
        }
      });

      if (this.searchable){
        this.typeahead$ = new Subject();
        this.typeahead$.pipe(debounceTime(this.debounce), distinctUntilChanged()).subscribe(this.channel);
      } else {
        this.typeahead$ = null;
      }

      this.items$ = this.channel.asObservable();
    }

    this.valueChanges.subscribe((value)=>{
      this.checkHasValue(value);
      this.hasValue = !(!value);
    });

    this.channel.next();
  }

  checkHasValue(value?: any){
    setTimeout(()=>{
      if (this.element){
        if (!value || value.length === 0) {
          this.element.classList.remove("ng-has-value");
        } else {
          this.element.classList.add("ng-has-value");
        }
      }
    });
  }

  reload(param?: any){
    this.channel.next(param);
  }

  getCustomPlaceholder(){
    return this.isRequired() ? this.config.placeholder + ' *' : this.config.placeholder;
  }
}
