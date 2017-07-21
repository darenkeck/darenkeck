import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map';

@Injectable()
export class FbaseService {

  constructor(private af: AngularFire) { }

  fetchList(itemType: string): Observable<any> {
    return this.af.database.list(`/${itemType}`).map(itemList => itemList.map(item => item.$value)); 
  }

  fetchItem(itemType: string): Observable<any> {
    return this.af.database.object(`/${itemType}`).map(item => {
      return item.$value;
    });
  }
}
