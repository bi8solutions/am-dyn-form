import {Component, OnInit, SkipSelf, Host, Optional, Input} from '@angular/core';
import {ControlContainer, AbstractControl} from "@angular/forms";
import {DynFormControl} from "./dyn-form-control";
import {DynFormGroup} from "./dyn-form-group";
import {DynFormArray} from "./dyn-form-array";
//import {LogService, Logger} from "@bi8/am-logger";

@Component({
  selector: 'dyn-field',
  templateUrl: './dyn-field.component.html',
  styleUrls: ['./dyn-field.component.scss']
})
export class DynFieldComponent implements OnInit {

  @Input() name;

  //logger: Logger;
  dfc: any;
  path: string;
  paths: string[] = [];

  placeholder : string;
  hint : string;
  messages : Map<string, string> = new Map();

  constructor(@Optional() @Host() @SkipSelf() public controlContainer: ControlContainer) {
  }

  ngOnInit() {
    this.dfc = <DynFormControl> this.controlContainer.control.get(this.name);
    this.placeholder = this.dfc.config.placeholder;
    this.hint = this.dfc.config.hint;

    for (let entry of this.dfc.config.messages){
      this.messages.set(entry.key, entry.value);
    }

    this.path = this.resolvePath();


    /*
    If this is an autocomplete, then I need to register for values changes and call the filter function on the form control
    */
  }

  private resolvePath() : string {
    let paths: string[] = [this.dfc.key];
    this.resolveParentPath(this.dfc.parent, paths);

    let resolvedPath = '';

    paths.reverse().forEach((path, index)=>{
      if (path) {
        if (resolvedPath){
          resolvedPath += '.';
        }
        resolvedPath += path;
        this.paths.push(resolvedPath);
      }
    });

    return resolvedPath;
  }

  private resolveParentPath(control: AbstractControl, paths: string[]){
    if (control instanceof DynFormGroup){
      paths.push((control as DynFormGroup).key);

    } else if (control instanceof DynFormArray){
      paths.push((control as DynFormArray).key);
    }

    if (control.parent) {
      this.resolveParentPath(control.parent, paths);
    }
  }

  resolveValidationMessage(type){
    return this.messages.get(type) || "";
  }
}
