import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FlexLayoutModule} from "@angular/flex-layout";

import {
  MdButtonModule, MdCardModule, MdCheckboxModule, MdDatepickerModule, MdDialogModule, MdIconModule, MdInputModule, MdListModule, MdMenuModule,
  MdOptionModule, MdSelectionModule, MdSelectModule, MdSidenavModule, MdTableModule, MdToolbarModule
} from "@angular/material";

import {RouterModule} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {DynFieldComponent} from "./am-dyn-form/dyn-field.component";
import {DynFieldSetComponent} from "./am-dyn-form/dyn-field-set.component";
import {DynToolbarPanelComponent} from "./am-dyn-form/dyn-toolbar-panel.component";
import {DynFormService} from "./am-dyn-form/dyn-form.service";

@NgModule({
    exports: [
      DynFieldComponent,
      DynFieldSetComponent,
      DynToolbarPanelComponent
    ],
    declarations: [
      DynFieldComponent,
      DynFieldSetComponent,
      DynToolbarPanelComponent
    ],
    imports: [
      CommonModule,
      RouterModule,
      BrowserAnimationsModule,
      FlexLayoutModule,
      FormsModule,
      ReactiveFormsModule,
      MdCardModule,
      MdButtonModule,
      MdCheckboxModule,
      MdDatepickerModule,
      MdInputModule,
      MdSelectModule,
      MdSelectionModule,
      MdOptionModule,
      MdDialogModule,
      MdToolbarModule,
      MdIconModule,
      MdSidenavModule,
      MdMenuModule,
      MdTableModule,
      MdListModule
    ],
    providers: [DynFormService]
})
export class DynFormModule {
}
