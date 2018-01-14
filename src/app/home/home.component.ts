import {Component, OnInit} from '@angular/core';

import {Validators} from "@angular/forms";

import {DynFormGroup} from "../modules/am-dyn-form/dyn-form-group";
import {DynTextControl} from "../modules/am-dyn-form/dyn-text-control";
import {DynTextareaControl} from "../modules/am-dyn-form/dyn-textarea-control";
import {DynSelectControl} from "../modules/am-dyn-form/dyn-select-control";
import {ArrayAutoCompleteLoader, DynAutoCompleteControl} from "../modules/am-dyn-form/dyn-auto-complete-control";
import {DynDateControl} from "../modules/am-dyn-form/dyn-date-control";

import * as _ from 'lodash';

import {Observable} from "rxjs/Observable";
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';

import {MomentDateAdapter} from '@angular/material-moment-adapter';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import * as moment from 'moment';
import {DynTimeControl} from "../modules/am-dyn-form/dyn-time-control";
import {TimeValidator} from "../modules/am-dyn-form/dyn-validators";



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

  constructor() {
  }

  ngOnInit() {
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

    this.demoForm = new DynFormGroup({key: 'registration'},
      {
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
          showNone: true
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

    this.demoForm.get("heroes").updateValueAndValidity();
    this.demoForm.get('lastName').valueChanges.subscribe((value)=>{
      console.log(this.demoForm.get('country').value);
      this.demoForm.get('country').disable();
    });

    //this.demoForm.get('fromDate').setValue(new Date());
  }

  doStuff(){
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
