import {Component, OnInit} from '@angular/core';
import {DynFormGroup, DynTextControl} from "@bi8/am-dyn-form";
import {Validators} from "@angular/forms";

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
        }, [Validators.required])
      });
  }

  getIdentity(){
  }

  logout(){
  }
}
