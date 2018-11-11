import { Component } from '@angular/core';
import { Http }      from '@angular/http';
import { Observable } from 'rxjs';

import { FbaseService }    from 'app/services/fbase.service';
import { JumbleService }   from 'app/services/jumble.service';
import { TabStateService, Tab } from 'app/services/tab-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  entryList: Observable<string[]>;
  show = true;
  showHelp = false;
  title = 'Daren Keck';

  constructor(private fbase: FbaseService, 
              private jumbleService: JumbleService,
              private tabStateService: TabStateService) {
    this.entryList = this.fbase.fetchList('blog-entries');
    this.tabStateService.currentTab.subscribe(
      (tab: Tab) => this.show = (tab !== null)
    )
  }

  expandTabContainer() {
    this.onExpand(true);
  }

  onShowHelp(show: boolean) {
    this.showHelp = show;
  }

  setTab(tabIndex: number) {
    this.tabStateService.setTab(tabIndex);
  }

  onExpand(show: boolean) {
    this.show = show;
    this.tabStateService.expandTabContainer(show);
  }
}
