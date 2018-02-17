import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/behaviorsubject';
import { Observable }      from 'rxjs/observable';

export enum Tab {
  'HOME',
  'MUSIC',
  'BIO'
}

@Injectable()
export class TabStateService {
  _currentTab: BehaviorSubject<Tab>;
  _previousTab: Tab = Tab.MUSIC;
  constructor() {
    this._currentTab = new BehaviorSubject<Tab>(null);
  }

  get currentTab() {
    return this._currentTab.asObservable();
  }

  setTab(tab: Tab) {
    if (tab) {
      // keep a cache of the previous tab so I can show hide by setting null
      this._previousTab = tab;
    }
    this._currentTab.next(tab);
  }

  expandTabContainer(show: boolean) {
    const newTab = (show) ? this._previousTab : null;
    this.setTab(newTab);
  }
}
