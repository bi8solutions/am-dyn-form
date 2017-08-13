import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'dyn-field-set',
  templateUrl: './dyn-field-set.component.html',
  styleUrls: ['./dyn-field-set.component.scss']
})
export class DynFieldSetComponent implements OnInit {
  @Input() header: string;

  constructor() { }

  ngOnInit() {
  }
}
