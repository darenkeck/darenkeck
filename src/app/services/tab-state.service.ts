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
  constructor() {
    this._currentTab = new BehaviorSubject<Tab>(Tab.HOME);
  }

  get currentTab() {
    return this._currentTab.asObservable();
  }

  setTab(tab: Tab) {
    this._currentTab.next(tab);
  }
}
