import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/observable';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { FbaseService } from 'app/services/fbase.service';

export interface Album {
  title: string;
  image_url: string;
}

export interface Track {
  album: number;
  name: string;
  track_num: number;
  url: string;
}

@Injectable()
export class AudioStoreService {
  albumList$: Observable<any>;
  trackList$: Observable<any>;

  constructor(private fb: FbaseService) {

  }

}
