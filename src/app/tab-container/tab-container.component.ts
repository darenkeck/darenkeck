import { Component, OnInit } from '@angular/core';

import 'rxjs/add/operator/debounceTime';

import { TabStateService }   from 'app/services/tab-state.service';

let _global_show_container = true;

@Component({
  selector: 'app-tab-container',
  templateUrl: './tab-container.component.html',
  styleUrls: ['./tab-container.component.scss']
})
export class TabContainerComponent implements OnInit {
  show: boolean = false;
  height        = 'auto';
  constructor(private tabStateService: TabStateService) {
    // if we get a tab change event, go ahead and set show to true
    this.tabStateService.currentTab
      .subscribe(
      tab => {
        this.show = (tab !== null);
      }
    )
  }

  ngOnInit() {
  }

  onExpand(show) {
    this.show = show;
  }
}
