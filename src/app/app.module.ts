import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import {AmDynFormModule} from "./modules/am-dyn-form/am-dyn-form.module";
import {AmLoggerModule, LogConfig, LogLevel} from "@bi8/am-logger";
import {AmStorageModule} from "@bi8/am-storage";
import {AppRoutingModule} from "./app-routing.module";
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import {HomeModule} from "./home/home.module";
import {MatInputModule} from "@angular/material";

const logConfig : LogConfig = { level: LogLevel.debug };

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AmLoggerModule,
    AmStorageModule,
    AmDynFormModule,
    AppRoutingModule,
    HttpClientModule,
    RouterModule,
    HomeModule,
    MatInputModule,
  ],
  providers:    [
    { provide: 'LogConfig', useValue: logConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
