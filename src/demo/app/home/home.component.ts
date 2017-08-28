import {Component, OnInit} from '@angular/core';
import {DynFormGroup, DynTextControl, DynSelectControl, DynDateControl} from "@bi8/am-dyn-form";
import {Validators} from "@angular/forms";
import {Observable} from "rxjs/Observable";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
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

    let heroes : any[] = [
      { id: 1, code: 'SPIDERMAN', name: 'Spiderman' },
      { id: 2, code: 'SUPERMAN', name: 'Superman'},
      { id: 3, code: 'BATMAN', name: 'Batman'}
    ];

    let countryOptions$ = Observable.of(countries).map((countries)=>{
      countries.forEach((country, index)=>{
        country.code = country.id;
        country.value = country.name;
      });
      return countries;
    });

    let heroOptions$ = Observable.of(heroes).map((countries)=>{
      heroes.forEach((hero, index)=>{
        hero.code = hero.id;
        hero.value = hero.name;
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

        country: new DynSelectControl({
          key: 'country',
          placeholder: 'Country',
          selectOptions: countryOptions$
        }, [Validators.required]),

        heroes: new DynSelectControl({
          key: 'heroes',
          placeholder: 'Heroes',
          selectOptions: heroOptions$
        }, [Validators.required]),

        fromDate: new DynDateControl({
          key: 'fromDate',
          placeholder: 'From Date',
          minDate: new Date(),
          messages: [
            { key: 'required', value: 'From Date is required' }
          ]
        }, [Validators.required])
      });

    this.demoForm.get('country').setValue(1);
    this.demoForm.get('lastName').valueChanges.subscribe((value)=>{
      console.log(this.demoForm.get('country').value);
      this.demoForm.get('country').disable();
    });

    //this.demoForm.get('fromDate').setValue(new Date());
  }

  doStuff(){
    console.log(this.demoForm.getRawValue());
  }

  getIdentity(){
  }

  logout(){
  }
}
