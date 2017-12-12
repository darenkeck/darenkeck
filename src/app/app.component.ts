import { Component } from '@angular/core';
import { Http }      from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { FbaseService }    from 'app/services/fbase.service';
import { JumbleService }   from 'app/services/jumble.service';
import { TabStateService } from 'app/services/tab-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  entryList: Observable<string[]>;
  title = 'Daren Keck';

  constructor(private fbase: FbaseService, 
              private jumbleService: JumbleService,
              private tabStateService: TabStateService) {
    this.entryList = this.fbase.fetchList('blog-entries');
  }

  newJumble() {
    this.jumbleService.setRandomJumble();
  }

  setTab(tabIndex: number) {
    this.tabStateService.setTab(tabIndex);
  }
}
