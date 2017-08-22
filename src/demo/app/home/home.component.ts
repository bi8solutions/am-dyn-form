import {Component, OnInit} from '@angular/core';
import {DynFormGroup, DynTextControl, DynSelectControl} from "@bi8/am-dyn-form";
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

    let countryOptions$ = Observable.of(countries).map((countries)=>{
      countries.forEach((country, index)=>{
        country.code = country.id;
        country.value = country.name;
      });
      return countries;
    });

    this.demoForm = new DynFormGroup({key: 'registration'},
      {
        firstName: new DynTextControl(
          {
            key: 'firstName',
            placeholder: 'First Name',
            maxlimit: 64,
            messages: [
              { key: 'required', value: 'First Name is required' }
            ]
          }, [Validators.required]),

        middleName: new DynTextControl(
          {
            key: 'middleName',
            placeholder: 'Middle Name',
            maxlimit: 64
          }),

        lastName: new DynTextControl(
          {
            key: 'lastName',
            placeholder: 'Last Name',
            maxlimit: 64,
            messages: [
              { key: 'required', value: 'Last Name is required' }
            ]
          }, [Validators.required]),

        country: new DynSelectControl(
          {
            key: 'country',
            placeholder: 'Country',
            selectOptions: countryOptions$
          }, [Validators.required])
      });

    this.demoForm.get('country').setValue(1);
  }

  getIdentity(){
  }

  logout(){
  }
}
