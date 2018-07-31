import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AmDynFormModule} from "./modules/am-dyn-form/am-dyn-form.module";
import {AmStorageModule} from "@bi8/am-storage";
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import {HomeModule} from "./home/home.module";
import {MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatInputModule} from "@angular/material";

export const CUSTOM_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'LL',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MM'
  },
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AmStorageModule,
    AmDynFormModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    HomeModule,
    MatInputModule
  ],
  providers:    [
    //{ provide: MAT_DATE_LOCALE, useValue: 'en-ZA'},
    //{provide: MAT_DATE_FORMATS, useValue: CUSTOM_FORMATS}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
