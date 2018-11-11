import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs'
import * as firebase from 'firebase';
import 'rxjs/add/operator/map';

@Injectable()
export class FbaseService {
  constructor(private af: AngularFire) { }

  fetchList(itemType: string): Observable<any> {
    return this.af.database.list(`/${itemType}`).map(itemList => {
      return itemList.map(item => item.$value)
    }); 
  }

  fetchItem(itemType: string): Observable<any> {
    return this.af.database.object(`/${itemType}`).map(item => {
      return item.$value;
    });
  }

  fetchFBList(itemType: string): FirebaseListObservable<any> {
    return this.af.database.list(itemType);
  }

  updateItem<T>(path: string, key: string, value: T) {
    const listRef = this.af.database.list(path);
    listRef.update(key, value);
  }

  createItem<T>(path: string, value: T) {
    const listRef = this.af.database.list(path);
    listRef.push(value);
  }
 }
