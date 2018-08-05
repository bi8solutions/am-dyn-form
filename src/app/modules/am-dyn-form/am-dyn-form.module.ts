import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule} from "@angular/router";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";

import {
  MatAutocompleteModule,
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatDialogModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatOptionModule,
  MatSelectModule,
  MatSidenavModule,
  MatTableModule,
  MatToolbarModule,
  MatTooltipModule
} from "@angular/material";

import {DynFormService} from "./dyn-form.service";
import {DynFieldComponent} from "./dyn-field.component";
import {DynToolbarPanelComponent} from "./dyn-toolbar-panel.component";
import {DynFieldSetComponent} from "./dyn-field-set.component";
import {AmTimepickerComponent} from "./timepicker/timepicker.component";
import {NgSelectModule} from "@ng-select/ng-select";
import {FlexLayoutModule} from "@angular/flex-layout";

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    FlexLayoutModule,
    MatAutocompleteModule,
    MatCardModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatInputModule,
    MatSelectModule,
    MatOptionModule,
    MatDialogModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatMenuModule,
    MatTableModule,
    MatListModule,
    NgSelectModule
  ],
  exports: [
    DynFieldComponent,
    DynFieldSetComponent,
    DynToolbarPanelComponent,
    AmTimepickerComponent
  ],
  declarations: [
    DynFieldComponent,
    DynFieldSetComponent,
    DynToolbarPanelComponent,
    AmTimepickerComponent
  ],
  providers: [DynFormService]
})
export class AmDynFormModule { }
