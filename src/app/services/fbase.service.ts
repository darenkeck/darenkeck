import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { pipe, Observable } from 'rxjs'
import * as firebase from 'firebase';
import { map }        from 'rxjs/operators';

const valueMap = pipe(map(itemList => itemList.map(item => item.$value)));

@Injectable()
export class FbaseService {
  constructor(private af: AngularFire) { }

  fetchList(itemType: string): Observable<any> {
    return valueMap(this.af.database.list(`/${itemType}`));
  }

  fetchItem(itemType: string): Observable<any> {
    return valueMap(this.af.database.object(`/${itemType}`));
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
