import {of as observableOf, EMPTY, Observable, Subject} from 'rxjs';

import {map, delay} from 'rxjs/operators';
import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';

import {Validators} from '@angular/forms';

import {DynFormGroup} from '../modules/am-dyn-form/dyn-form-group';
import {DynTextControl} from '../modules/am-dyn-form/dyn-text-control';
import {DynTextareaControl} from '../modules/am-dyn-form/dyn-textarea-control';
import {DynSelectControl} from '../modules/am-dyn-form/dyn-select-control';
import {ArrayAutoCompleteLoader, DynAutoCompleteControl} from '../modules/am-dyn-form/dyn-auto-complete-control';
import {DynDateControl} from '../modules/am-dyn-form/dyn-date-control';


import {TimeValidator} from '../modules/am-dyn-form/dyn-validators';
import {DynAutoSelectControl} from '../modules/am-dyn-form/dyn-auto-select-control';
import {AppService, avengers} from './home.service';
import {of} from 'rxjs/internal/observable/of';
import {interval} from 'rxjs/internal/observable/interval';

import * as _ from 'lodash';
import {DynCheckboxControl} from '../modules/am-dyn-form/dyn-checkbox-field';
import {Channel} from '@bi8/am-io';

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
  @ViewChild('avengersLabel', {static: false}) avengerLabelTemplate: TemplateRef<any>;
  @ViewChild('avengersOption', {static: false}) avengerOptionTemplate: TemplateRef<any>;

  percentage = 0;
  percentageSubject = new Subject<any>();

  constructor(private appService: AppService) {
  }

  ngOnInit() {
    interval(500).subscribe(() => {
      this.percentageSubject.next(this.percentage);
      this.percentage += 1;
    });

    const countries: any[] = [
      {id: 1, code: 'ZA', name: 'South Africa'},
      {id: 2, code: 'USA', name: 'United States of America'},
      {id: 3, code: 'UK', name: 'United Kingdom'}
    ];

    const heroes = [];
    for (let i = 0; i < 200; i++) {
      heroes.push({id: i + 1, name: 'Super Hero ' + i});
    }

    const countryOptions$ = observableOf(countries).pipe(map((countries) => {
      countries.forEach((country, index) => {
        country.code = country.id;
        country.value = country.name;
      });
      return countries;
    }));

    // let avengers$ = this.appService.findUserPosts(1);
    const avengers$ = of(avengers).pipe(delay(3000))

    const users = [
      {id: 1, name: 'Piet', surname: 'Pompies'},
      {id: 2, name: 'Sannie', surname: 'van Wyk'},
      {id: 3, name: 'Jan', surname: 'Geldenhuys'},
      {id: 4, name: 'Duff', surname: 'Beer'}
    ];

    const avengersChannel = new Channel({
      key: 'avengers',
      debug: {verbose: true},
      create: {
        new: (term: any) => {
          console.log(term);
          if (term) {
            return of(_.filter(avengers$, function (o) {
              return o.slug.toLowerCase().indexOf(term.toLowerCase()) > -1;
            }));
          } else {
            return of(avengers).pipe(delay(500));
          }
        }
      }
    });

    const usersChannel = new Channel({
      key: 'users',
      debug: {verbose: true},
      create: {
        new: (term: any) => {
          if (term) {
            return of(_.filter(users, function (o) {
              return o.name.toLowerCase().indexOf(term.toLowerCase()) > -1 ||
                o.surname.toLowerCase().indexOf(term.toLowerCase()) > -1;
            }));
          } else {
            return of(users);
          }
        }
      }
    });

    const postsChannel = new Channel({
      key: 'posts',
      debug: {verbose: true},
      create: {
        new: (params: any) => {
          return params ? this.appService.searchUserPosts(params.userId) : EMPTY;
        }
      }
    });

    this.demoForm = new DynFormGroup({key: 'registration'},
      {
        avengers: new DynAutoSelectControl({
          key: 'avengers',
          placeholder: 'Select your Avenger',
          // bindValue: 'id',
          // labelTemplate: this.avengerLabelTemplate,
          // optionTemplate: this.avengerOptionTemplate,
          channel: avengersChannel,
          useDefaultErrorMessages: true,
          searchable: true,
          multiple: true

        }, [Validators.required]),
        users: new DynAutoSelectControl({
          key: 'users',
          placeholder: 'Select a User',
          bindLabel: 'name',
          searchable: false,
          channel: usersChannel,
          useDefaultErrorMessages: true
        }, [Validators.required]),
        posts: new DynAutoSelectControl({
          key: 'posts',
          // defaultValue: 9,
          // loadFn: (param)=> param ? this.appService.loadPost(param) : EMPTY,
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
            {key: 'required', value: 'First Name is required'}
          ]
        }, [Validators.required]),

        middleName: new DynTextControl({
          disable: true,
          key: 'middleName',
          placeholder: 'Middle Name',
          maxlimit: 64
        }),

        lastName: new DynTextControl({
          key: 'lastName',
          placeholder: 'Last Name',
          maxlimit: 64,
          messages: [
            {key: 'required', value: 'Last Name is required'}
          ]
        }, [Validators.required]),

        comments: new DynTextareaControl({
          key: 'comments',
          placeholder: 'Comments',
          maxlimit: 1024,
          minRows: 5,
          maxRows: 10,
          messages: [
            {key: 'required', value: 'Please provide Comments'}
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
          loader: new ArrayAutoCompleteLoader(heroes, (hero, value) => {
            return value ? hero.name.toLocaleLowerCase().indexOf(value.toLowerCase()) > -1 : true;
          }, {size: 50, codeProperty: 'id', valueProperty: 'name'})
        }, [Validators.required]),

        fromDate: new DynDateControl({
          key: 'fromDate',
          placeholder: 'From Date',
          minDate: new Date(),
          messages: [
            {key: 'required', value: 'From Date is required'}
          ]
        }, [Validators.required]),
        toDate: new DynDateControl({
          defaultValue: new Date(),
          key: 'toDate',
          placeholder: 'To Date',
          minDate: new Date(),
          messages: [
            {key: 'required', value: 'To Date is required'}
          ]
        }, [Validators.required]),
        time: new DynTextControl({
          key: 'time',
          placeholder: 'Start Time',
          messages: [
            {key: 'time', value: 'Please provide a valid time'},
            {key: 'required', value: 'Last Name is required'}
          ]
        }, [Validators.required, TimeValidator()])
      });

    avengersChannel.enable().next();
    usersChannel.enable().next();
    postsChannel.enable().next();

    // this.demoForm.get('country').setValue(1);
    this.demoForm.get('heroes').setValue(
      {id: 3, name: 'Super Hero 3'}
    );

    this.demoForm.patchValue({avengers: null});

    ///////// this.demoForm.get('posts').setValue(3, {loadFn: (param)=>this.appService.loadPost(param)});

    this.demoForm.addSlaveObserver('users', 'posts', {
      ops: [map((user: any) => {
        return {userId: user.id};
      })]
    }).subscribe(postsChannel);

    this.demoForm.get('heroes').updateValueAndValidity();
  }

  doStuff() {
    console.log('===========================> ', this.demoForm.value);
    console.log('======> ', this.demoForm.get('fromDate').value);
    const date = new Date();
    console.log('======> ', date);
    console.log('======>date.toLocaleTimeString() ', date.toLocaleTimeString());
    console.log('======>date.toJSON() ', date.toJSON());
    console.log('======>date.toDateString() ', date.toDateString());

    const jsonValue = date.toJSON();
    const parsedDate = JSON.parse(jsonValue);
    console.log('--> ', parsedDate);
  }

  getIdentity() {
  }

  logout() {
  }
}
