import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { pipe, Observable } from 'rxjs'
import * as firebase from 'firebase';
import { map }        from 'rxjs/operators';
import { ChangeDetectorStatus } from '@angular/core/src/change_detection/constants';

// const valueMap = pipe(map(itemList => itemList.map( i => i.$value)));

function mapWithKey(c) {
  return { key: c.payload.key, ...c.payload.val()});
}

@Injectable()
export class FbaseService {
  constructor(private db: AngularFireDatabase) { }

  // returns an observable that just containst he list of values
  fetchList(itemType: string): Observable<any> {
    return this.db.list(`/${itemType}`).snapshotChanges().pipe(
      map(changes => changes.map(c => mapWithKey(c)))
    );
  }

  // returns an observable with just a special object
  fetchItem(itemType: string): Observable<any> {
    return this.db.object(`/${itemType}`).snapshotChanges().pipe(
      map(c => mapWithKey(c))
    );
  }

  fetchFBList(itemType: string): Observable<any> {
    return this.db.list(itemType).snapshotChanges().pipe(
      map(changes => changes.map(c => mapWithKey(c)))
    );
  }

  updateItem<T>(path: string, key: string, value: T) {
    const listRef = this.db.list(path);
    listRef.update(key, value);
  }

  createItem<T>(path: string, value: T) {
    const listRef = this.db.list(path);
    listRef.push(value);
  }
 }
