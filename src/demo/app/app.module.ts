import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent }  from './app.component';

import {LogConfig, LogLevel, LogModule} from '@bi8/am-logger';
//import {UaaConfig, UaaModule} from "@bi8/am-uaa";
import {StorageModule} from "@bi8/am-storage";
import {MdCardModule, MdToolbarModule} from "@angular/material";
import {HttpModule} from "@angular/http";
import {RouterModule} from "@angular/router";
import {AppRoutingModule} from "./app-routing.module";
import {HomeModule} from "./home/home.module";
import {HttpClientModule} from "@angular/common/http";
import {DynFormModule} from "@bi8/am-dyn-form";

const logConfig : LogConfig = { level: LogLevel.debug };

@NgModule({
  imports:      [
    BrowserModule,
    AppRoutingModule,
    LogModule,
    StorageModule,
    DynFormModule,
    HttpModule,
    HttpClientModule,
    RouterModule,
    HomeModule
  ],
  declarations: [ AppComponent ],
  bootstrap:    [ AppComponent ],
  providers:    [
      { provide: 'LogConfig', useValue: logConfig }
  ]
})
export class AppModule { }
