import { Injectable } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { Observable } from 'rxjs/Observable'

@Injectable()
export class FbaseService {

  constructor(private af: AngularFire) { }

  fetchList(itemType: string): Observable<any> {
    return this.af.database.list(`/${itemType}`);
  }
}
