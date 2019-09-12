import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { FlexLayoutModule } from "@angular/flex-layout";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AmDynFormModule } from "../modules/am-dyn-form/am-dyn-form.module";
import {NgSelectModule} from "@ng-select/ng-select";
import {NgOptionHighlightModule} from '@ng-select/ng-option-highlight';

@NgModule({
  imports: [
    CommonModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule,
    HomeRoutingModule,
    FlexLayoutModule,
    AmDynFormModule,
    NgSelectModule,
    NgOptionHighlightModule
  ],
  declarations: [HomeComponent],
  exports: [HomeComponent]

})
export class HomeModule { }
