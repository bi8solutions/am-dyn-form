import {ValidatorFn, AsyncValidatorFn} from "@angular/forms";
import {DynFormControl, LoaderFn} from "./dyn-form-control";
import {concat, Observable, pipe} from "rxjs";
import {Channel, ChannelNotification, IObservableDS, NotificationType, ObservableDS} from "./dyn-datasource";
import {Subject} from "rxjs/Subject";
import {BehaviorSubject} from "rxjs/BehaviorSubject";
import {of} from "rxjs/internal/observable/of";
import {TemplateRef} from "@angular/core";
import {debounceTime, delay, distinctUntilChanged, filter, finalize, map, mergeMap, switchMap, tap} from "rxjs/operators";



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
      this.channel.observeNotifications().subscribe((notification: ChannelNotification)=>{
        switch(notification.type){
          case NotificationType.inputNext:
          case NotificationType.busy:
            this.loading = true;
            break;
          default:
            this.loading = false;
            break;
        }
      });

      if (this.searchable){
        this.typeahead$ = new Subject();
        this.channel.link(this.typeahead$, debounceTime(this.debounce), distinctUntilChanged());
      } else {
        this.typeahead$ = null;
      }

      this.items$ = this.channel.asObservable();
    }

    this.valueChanges.subscribe((value)=>{
      this.hasValue = !(!value);
    })

/*

    if (options['items']) {
      if (this.async) {
        if (this.autocomplete$) {
          console.log("======================> [observable:typeahead] items: ", options['items']);

          this.loading = true;
          this.items$ = (options['items'] as Observable<any>).pipe(tap(()=>this.loading = false));

          /!*this.items$ = concat(
            (options['items'] as Observable<any>).pipe(
              tap(() => this.loading = true),
              finalize(() => this.loading = false)
            ),
            this.autocomplete$.pipe(
              debounceTime(this.debounce),
              distinctUntilChanged(),
              tap(() => this.loading = true),
              finalize(() => this.loading = false)
            )
          );*!/
        } else {
          console.log("======================> [observable] items: ", options['items']);
          //this.loading = true;

          let subject = (options['items'] as ParameterSubject<any, any>);

          //let observable = (options['items'] as Observable<any>);
          //let paramSubject = options['items'] as ParameterSubject<any, any>;

          this.items$ = subject.asObservable();
          this.typeaheadInput$ = subject.asSubject();


          this.typeaheadInput$.pipe(tap((value)=>console.log("========> ......... ", value)));


          /!*
          I want to pass the same stuff in that is used for the observable
           *!/

          /!*this.items$ = new Observable((sub)=>{
            (options['items'] as Observable<any>).pipe(
              tap((value) => {this.loading = true; console.log("=============> tap: ", value)}),
            ).subscribe()
            sub.next()
          });



          = new Observable((sub)=>{
            subscribe

            sub.next()
          })

            tap((blaf) => {this.loading = true; console.log("TAP TAP")}),
            (options['items'] as Observable<any>)).pipe(finalize(() => this.loading = false))



            (options['items'] as Observable<any>).pipe(
            tap((blaf) => {this.loading = true; console.log("TAP TAP")}),
            finalize(() => this.loading = false)
          );*!/
        }
      } else {
        console.log("======================> [array] items: ", options['items']);
        this.items$ = of(options['items']);
      }
    }

*/


    /*

          debounceTime(this.debounce),
          distinctUntilChanged());


        let subject = new ParameterSubject(()=>{of(this.items[])});

        this.items$ = concat(
          [],
          this.autocomplete$.pipe()



        );
        this.items$ = ParameterSubject()
      }
    }*/

    /*
    if (this.autocomplete$){
      this.autocomplete$.pipe(
        debounceTime(this.debounce),
        distinctUntilChanged(),
        tap(()=>this.loading = true)).subscribe({
          next: (term)=>{
          },
          complete: ()=>{
            this.loading = false;
          }
      })
    }
    */


    /*
    this.ods.addPipe(this.typeaheadInput$, this.key,
            debounceTime(200),
            distinctUntilChanged(),
            showLoadTappet,
            delay(1000)
          );
          this.reload();
     */


    /*if (options['items']){
      this.key = 'auto';
      this.items = options['items'];

      this.ods = new ObservableDS({autoconnect: true, key: this.key, obs: (term)=> {
          if (term){
            let result = [];
            this.items.forEach((item)=>{
              if (item[this.bindLabel].toLowerCase().indexOf(term) > -1){
                result.push(item);
              }
            });
            return of(result);
          } else {
            return of(this.items).pipe(hideLoadTappet);
          }
        }
      });

      this.items$ = this.ods.observe(this.key).pipe(map((items: any[])=> {
        if (this.bindRef){
          items.forEach((item)=>{
            if (this.multiple && this.value instanceof Array){
              this.value.forEach((value)=>{
                if (value[this.bindRef] === this.value){
                  setTimeout(()=>{
                    this.setValue(value);
                  });
                  return;
                }
              })
            }
            if (item[this.bindRef] === this.value){
              setTimeout(()=>{
                this.setValue(item);
              });
              return;
            }
          });
          return items;
        }
      }));

      this.ods.addPipe(this.typeaheadInput$, this.key,
        debounceTime(200),
        distinctUntilChanged(),
        showLoadTappet,
        delay(1000)
      );
      this.reload();

    } else if (options['dataSource']){
      let dataSource = options['dataSource'];
      this.ods = dataSource.ods;
      this.key = dataSource.key;
      this.items$ = this.ods.observe(this.key).pipe(tap((items)=>hideLoadTappet));
      this.ods.addPipe(this.typeaheadInput$, this.key,
        debounceTime(200),
        distinctUntilChanged(),
        showLoadTappet,
        filter((value)=>{
          return value == null ? false : value.length > 0
        })
      );
    }

    */

    //console.log("============> optionTemplate: ", this.optionTemplate);
  }

  reload(param?: any){
    this.channel.next(param);
  }

  getCustomPlaceholder(){
    return this.isRequired() ? this.config.placeholder + ' *' : this.config.placeholder;
  }
}
