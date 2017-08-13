import {Component, ViewEncapsulation} from '@angular/core';
import { Logger, LogService} from '@bi8/am-logger';

@Component({
  selector: 'demo-app',
  templateUrl: './app.component.html' ,
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
  logger: Logger;

  constructor(logService: LogService) {
    this.logger = logService.getLogger(this.constructor.name);
  }
}
