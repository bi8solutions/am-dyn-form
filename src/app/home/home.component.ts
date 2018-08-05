import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';

import {Validators} from "@angular/forms";

import {DynFormGroup} from "../modules/am-dyn-form/dyn-form-group";
import {DynTextControl} from "../modules/am-dyn-form/dyn-text-control";
import {DynTextareaControl} from "../modules/am-dyn-form/dyn-textarea-control";
import {DynSelectControl} from "../modules/am-dyn-form/dyn-select-control";
import {ArrayAutoCompleteLoader, DynAutoCompleteControl} from "../modules/am-dyn-form/dyn-auto-complete-control";
import {DynDateControl} from "../modules/am-dyn-form/dyn-date-control";

import {BehaviorSubject, EMPTY, Observable, ObservableLike, Subscriber, Subscription, SubscriptionLike} from "rxjs";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import {TimeValidator} from "../modules/am-dyn-form/dyn-validators";
import {DynAutoSelectControl} from "../modules/am-dyn-form/dyn-auto-select-control";
import {delay, filter, map, multicast, publish, tap} from "rxjs/operators";
import {AppKeys, AppService, avengers} from "./home.service";
import {Channel, ObservableDS} from "../modules/am-dyn-form/dyn-datasource";
import {of} from "rxjs/internal/observable/of";
import {Subject} from "rxjs";
import {interval} from "rxjs/internal/observable/interval";
import {ConnectableObservable} from "rxjs/internal/observable/ConnectableObservable";
import {AnonymousSubject} from "rxjs/internal-compatibility";
import {OperatorFunction} from "rxjs/interfaces";

import * as _ from 'lodash';
import {DynCheckboxControl} from "../modules/am-dyn-form/dyn-checkbox-field";


/*
let findUsers = new HotSubject((criteria)=>appService.searchUsers(criteria), new BehaviourSubject<any>());
findUsers.subscribe((items)=>{ console.log("=============> sub1: ", items); })  //. subscribes to the internal subject
findUsers.subscribe(()=>{ console.log("=============> sub2: ", items); })
findUsers.next(1); ->



let cold = new TriggerObserver(service.findUsers, (sub)=>{

})


let cold = new InputObserver((sub)=>{
})


let cold = new Observable((sub)=>{
  sub.next('hello');
  sub.complete();
});
*/

/*
export function toConnectable<T>(fn: ObservableFn<T>, ...ops: OperatorFunction<any, any>[]) : ConnectableObservable<T> {
 return fn().pipe(...ops, publish()) as ConnectableObservable<T>;
}*/


/*export class ParameterSubject<A extends any, T extends any> {
  private hotSub: Subscription;

  constructor(private fn: ObservableFn<T>, private hot: boolean = false, private subject?: Subject<T>){
    if (!subject){
      this.subject = new Subject<T>();
    }
  }

  next(value: any) {
    console.log('========> next... ', value);
    if (this.hot){
      this.hotSub = this.fn(value).pipe(tap((value)=>this.subject.next(value))).subscribe();
    } else {
      this.fn(value).pipe(tap((value)=>this.subject.next(value))).subscribe();
    }
  }

  bypass(value: T){
    this.subject.next(value);
  }

  error(err: any) {
    this.subject.error(err);
  }

  complete() {
    this.subject.complete();
  }

  subscribe(next?: (value: any) => void, error?: (error: any) => void, complete?: () => void): Subscription {
    return this.subject.subscribe(next, error, complete);
  }

  asObservable(): Observable<T> {
    return this.subject.asObservable();
  }
  
  asSubject(): Subject<T> {
    return this.subject;
  }

  unsubscribe(): void {
    this.subject.unsubscribe();
    if (this.hotSub){
      this.hotSub.unsubscribe();
    }
  }
}*/


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  /*providers: [
    {provide: MAT_DATE_FORMATS, useValue: MY_FORMATS},
  ]*/
})
export class HomeComponent implements OnInit {
  demoForm: DynFormGroup;
  @ViewChild('avengersLabel') avengerLabelTemplate : TemplateRef<any>;
  @ViewChild('avengersOption') avengerOptionTemplate : TemplateRef<any>;
  ods: ObservableDS;

  constructor(private appService: AppService) {
    this.ods = this.appService.asODS();
  }

  ngOnInit() {
/*
    let userPostsSearch = new ParameterSubject((userId: number)=>this.appService.findUserPosts(userId));
    userPostsSearch.subscribe((items)=>{ console.log("==============> posts: ", items) });

    let postCommentsSearch = new ParameterSubject<number, any>((postId: number)=>this.appService.findPostComments(postId));
    postCommentsSearch.subscribe((items)=>{ console.log("==============> comments: ", items) });

    let userValueChanges = new Subject();
    userValueChanges.subscribe(userPostsSearch);

    let postValueChanges = new Subject();*/
    //postValueChanges.pipe(filterPath('id'), ).subscribe(postCommentsSearch);




    //userSearch.pipe(map((items)=>items[0].id)).subscribe(postCommentsSearch);

    //userSearch.next(1);
    //userSearch.next(2);

    //valueChanges.next(1);

    /*let avengers = toConnectable(()=>this.appService.findAllAvengers());
    avengers.subscribe((items)=>console.log("==========> avengers1: ", items));
    avengers.subscribe((items)=>console.log("==========> avengers2: ", items));
    //avengers.connect();

    let paramConnectable = toConnectable(()=> {
      console.log("======> ", message);
      return this.appService.findAllAvengers();
    });*/

    /*

    (value)=>{
      service.search(criteria){
      }
    }

    userObservable()
    postsObservable()

    let userSelectionField = this.form.controls['userSelection'];
    let userPostsSelectionField = this.form.controls['userPosts'];

    let usersChannel = channel((criteria)=>{return appService.findUsers(criteria));     // returns a subject -> multiple people can connect (but they connect
    let userPostsChannel = channel((userId)=>{return appService.findPosts(userId));     // returns a subject

    userSelectionField.valueChanges.pipe(filterPath('id'), toggleEnabled(userPosts), userPosts)

    let subscription = userPostsChannel.subscribe(()=>{})
    usesPostsChannel.connect();

    userPosts.subscribe((nothing is going to happen until we get a next event))
    usersChannel.next();
    usersChannel.subscribe();

    userPosts.next(1)
    userPosts.disable();


    HotSubject extends Subject()
    _subscribe(){
    }


    Channel extends Subject {
      next()
    }

    ConnectableObservable



    hot(the subject to use that they subscribe to)

    hot(subject?: Subject) : ConnectableObservable;

    subscribe to it at any time



    hot(func: function, subject?: Subject) // returns a subject

    let channel = hot((criteria)=>return service.searchUsers(criteria), new BehaviorSubject([]))
    channel.subscribe()


    channel.next(2) -> internally will call the function to create the new observable and then pipe all the events

    let userPosts = new HotSubject(function, subjectToUse);

    userPosts.next(1);
    userPosts.subscribe();    // they subscribe to the internal subject
    userPosts.subscribe();
    userPosts.subscribe();
    */

    /*
    let cold = new Observable((sub)=>{
      sub.next('hello');
      sub.complete();
    });

    const otherHot: ConnectableObservable<any> = cold.pipe(publish()) as ConnectableObservable<any>;

    let array = of([1,2,3]);
    let subject = new Subject();
    const hot: ConnectableObservable<any> = subject.pipe(publish()) as ConnectableObservable<any>;



    hot.subscribe((item)=>{
      console.log("===========> hot: ", item);
    });

    subject.next(1);


    const source = interval(5000);
    const ggg = subject.pipe(publish());

    ggg.subscribe((item)=>{
      console.log("============> ", item);
    });

    console.log("stuff");
    (ggg as ConnectableObservable<any>).connect();

    subject.next(1);
    subject.next(2);

    ggg.subscribe((item)=>{
      console.log("============>later sub ", item);
    });

    subject.next('hello world');
    */
    

    //(ggg as ConnectableObservable<any>).connect();

/*

    const seconds = interval(1000);
    const m = multicast(new Subject<number>());

    let duff = bla.pipe(tap((item)=>console.log(item)));

    bla.subscribe((stuff)=>{
      console.log("stuff=======> ", stuff);
    });

    this.ods.observe(AppKeys.findUserPosts, 1).subscribe((response)=>{
      console.log("=====> user posts: ", response);
    });

    this.ods.observe(AppKeys.findAllAvengers, 1).subscribe((response)=>{
      console.log("=====> avengers:  ", response);
    });*/

    /*
    ok, so basically I want to start and stop the loader indicator - the loader indicator comes into play when we start
    loading as well as when we end loading.
    */


    this.ods.observe(AppKeys.findUserPosts, 1).subscribe((response)=>{
      //console.log("=====> user posts: ", response);
    });

    this.ods.observe(AppKeys.findAllAvengers, 1).subscribe((response)=>{
      //console.log("=====> avengers:  ", response);
    });


    let countries : any[] = [
      { id: 1, code: 'ZA', name: 'South Africa' },
      { id: 2, code: 'USA', name: 'United States of America'},
      { id: 3, code: 'UK', name: 'United Kingdom'}
    ];

    let heroes = [];
    for (let i = 0; i < 200; i++){
      heroes.push({ id: i+1, name: "Super Hero " + i })
    }

    let countryOptions$ = Observable.of(countries).map((countries)=>{
      countries.forEach((country, index)=>{
        country.code = country.id;
        country.value = country.name;
      });
      return countries;
    });

    //let avengers$ = this.appService.findUserPosts(1);
    let avengers$ = of(avengers).pipe(delay(3000));

    let users = [
      {id: 1, name: 'Piet', surname: 'Pompies'},
      {id: 2, name: 'Sannie', surname: 'van Wyk'},
      {id: 3, name: 'Jan', surname: 'Geldenhuys'},
      {id: 4, name: 'Duff', surname: 'Beer'}
    ];

    let avengersChannel = new Channel((term: string)=> {
        if (term){
          return of(_.filter(avengers, function(o) {
              return o.slug.toLowerCase().indexOf(term.toLowerCase()) > -1;
           }));
        } else {
          return of(avengers).pipe(delay(5000));
        }
      }, {
        name: 'avengers',
        debug: true,
        paramFn: (value: any)=>value
      }
    );

    let usersChannel = new Channel((term: string)=> {
      if (term){
        return of(_.filter(users, function(o) {
            return o.name.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
                   o.surname.toLowerCase().indexOf(term.toLowerCase()) > -1;
         }));
      } else {
        return of(users);
      }
    }, {
      name: 'users',
      debug: true,
      paramFn: (value: any)=>value
    });

    /*
    */

    let postsChannel = new Channel((params: any)=> {
      return params ? this.appService.searchUserPosts(params.userId) : EMPTY;
    }, {name: 'users', debug: true});

    this.demoForm = new DynFormGroup({key: 'registration'},
      {
        avengers: new DynAutoSelectControl({
          key: 'avengers',
          placeholder: 'Select your Avenger',
          bindValue: 'id',
          labelTemplate: this.avengerLabelTemplate,
          optionTemplate: this.avengerOptionTemplate,
          channel: avengersChannel.next(),
          useDefaultErrorMessages: true,
          searchable: true

        }, [Validators.required]),
        users: new DynAutoSelectControl({
          key: 'users',
          placeholder: 'Select a User',
          bindLabel: 'name',
          searchable: false,
          channel: usersChannel.next(),
          useDefaultErrorMessages: true
        }, [Validators.required]),
        posts: new DynAutoSelectControl({
          key: 'posts',
          defaultValue: 9,
          loadFn: (param)=> param ? this.appService.loadPost(param) : EMPTY,
          placeholder: 'Select a post',
          bindLabel: 'title',
          channel: postsChannel,
          useDefaultErrorMessages: true,
          disabled: true,
          searchable: false
        }, [Validators.required]),
        /*users: new DynAutoSelectControl({
          key: 'users',
          placeholder: 'Users',
          items: users,
          bindRef: 'id',
          bindLabel: 'name',
          multiple: false,
          useDefaultErrorMessages: true
        }, [Validators.required]),
        posts: new DynAutoSelectControl({
          key: 'posts',
          placeholder: 'Posts',
          dataSource: {
            ods: this.ods,
            key: AppKeys.findUserPosts
          },
          bindLabel: 'title',
          useDefaultErrorMessages: true,
          multiple: true
        }, [Validators.required]),
        superheroes: new DynAutoSelectControl({
          key: 'superheroes',
          placeholder: 'Super Heroes',
          items: avengers,
          bindRef: 'id',
          bindLabel: 'name',
          multiple: true,
          optionTemplate: this.autoTemplate
          //selectOptions: Observable.of(countries).pipe(tap((item)=>console.log(item)))
        }, [Validators.required]),*/

        active: new DynCheckboxControl({
          key: 'active',
          placeholder: 'Is Active?'
        }),

        firstName: new DynTextControl({
          key: 'firstName',
          placeholder: 'First Name',
          maxlimit: 64,
          messages: [
            { key: 'required', value: 'First Name is required' }
          ]
        }, [Validators.required]),

        middleName: new DynTextControl({
          key: 'middleName',
          placeholder: 'Middle Name',
          maxlimit: 64
        }),

        lastName: new DynTextControl({
          key: 'lastName',
          placeholder: 'Last Name',
          maxlimit: 64,
          messages: [
            { key: 'required', value: 'Last Name is required' }
          ]
        }, [Validators.required]),

        comments: new DynTextareaControl({
          key: 'comments',
          placeholder: 'Comments',
          maxlimit: 1024,
          minRows: 5,
          maxRows: 10,
          messages: [
            { key: 'required', value: 'Please provide Comments' }
          ]
        }, [Validators.required]),

        country: new DynSelectControl({
          key: 'country',
          placeholder: 'Country',
          selectOptions: countryOptions$,
          showNone: false,
          multiple: true
        }, [Validators.required]),

        heroes: new DynAutoCompleteControl({
          key: 'heroes',
          placeholder: 'Heroes',
          loader: new ArrayAutoCompleteLoader(heroes, (hero, value)=>{
            return value ? hero.name.toLocaleLowerCase().indexOf(value.toLowerCase()) > -1 : true;
          }, {size: 50, codeProperty: 'id', valueProperty: 'name'})
        }, [Validators.required]),

        fromDate: new DynDateControl({
          key: 'fromDate',
          placeholder: 'From Date',
          minDate: new Date(),
          messages: [
            { key: 'required', value: 'From Date is required' }
          ]
        }, [Validators.required]),
        toDate: new DynDateControl({
          defaultValue: new Date(),
          key: 'toDate',
          placeholder: 'To Date',
          minDate: new Date(),
          messages: [
            { key: 'required', value: 'To Date is required' }
          ]
        }, [Validators.required]),
        time: new DynTextControl({
          key: 'time',
          placeholder: "Start Time",
          messages: [
            { key: 'time', value: 'Please provide a valid time' },
            { key: 'required', value: 'Last Name is required' }
          ]
        },[Validators.required, TimeValidator()])
      });

    //this.demoForm.get('country').setValue(1);
    this.demoForm.get('heroes').setValue(
    { id: 3, name: "Super Hero 3" }
    );

    //this.demoForm.get('posts').setValue(3, {loadFn: (param)=>this.appService.loadPost(param)});

    //this.demoForm.get('posts').disable();

    postsChannel.link(this.demoForm.get('users').valueChanges,
      filter((value)=>{
        if (value && value.id){
          return true;
        } else {
          this.demoForm.get('posts').setValue(null);
          //this.demoForm.get('posts').reset();
          this.demoForm.get('posts').disable();
          return false;
        }
      }),
      tap((selection)=> {
        //this.demoForm.get('posts').enable();
      }),
      map((user: any)=>{
        return { userId: user.id }
      })
    );

    this.demoForm.get("heroes").updateValueAndValidity();
  }

  doStuff(){
    console.log("===========================> ", this.demoForm.value);
    console.log("======> ", this.demoForm.get('fromDate').value);
    let date = new Date();
    console.log("======> ", date);
    console.log("======>date.toLocaleTimeString() ", date.toLocaleTimeString());
    console.log("======>date.toJSON() ", date.toJSON());
    console.log("======>date.toDateString() ", date.toDateString());

    let jsonValue = date.toJSON();
    let parsedDate = JSON.parse(jsonValue);
    console.log("--> ", parsedDate);
  }

  getIdentity(){
  }

  logout(){
  }
}
