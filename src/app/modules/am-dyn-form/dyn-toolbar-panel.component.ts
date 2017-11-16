import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'dyn-toolbar-panel',
  templateUrl: './dyn-toolbar-panel.component.html',
  styleUrls: ['./dyn-toolbar-panel.component.scss']
})
export class DynToolbarPanelComponent implements OnInit {
  @Input() header: string;

  constructor() { }

  ngOnInit() {
  }
}
