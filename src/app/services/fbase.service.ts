import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { pipe, Observable } from 'rxjs'
import * as firebase from 'firebase';
import { map }        from 'rxjs/operators';

// const valueMap = pipe(map(itemList => itemList.map( i => i.$value)));

@Injectable()
export class FbaseService {
  constructor(private db: AngularFireDatabase) { }

  // returns an observable that just containst he list of values
  fetchList(itemType: string): Observable<any> {
    return this.db.list(`/${itemType}`).valueChanges();
  }

  // returns an observable with just a special object
  fetchItem(itemType: string): Observable<any> {
    return this.db.object(`/${itemType}`).valueChanges();
  }

  fetchFBList(itemType: string): Observable<any> {
    return this.db.list(itemType).valueChanges();
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
