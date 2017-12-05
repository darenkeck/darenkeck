import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { BehaviorSubject } from 'rxjs/behaviorsubject';
import { combineLatest } from 'rxjs/observable/combinelatest';

import { FbaseService } from 'app/services/fbase.service';

interface _Album {
  title: string;
  image_url: string;
  track_list: number[];
}

// unflattened Album reference
export interface Album {
  title: string;
  image_url: string;
  track_list: Track[];
}

export interface Track {
  album: number;
  name: string;
  track_num: number;
  url: string;
  $key: string;
}

/**
 * This class is responsible for managing access to the list of
 * albums and tracks. It converts the flattened structure into a usuable
 * list
 */

const FB_ALBUM_PATH = 'album';
const FB_TRACK_PATH = 'track';

@Injectable()
export class AudioStoreService {
  _albumList$: BehaviorSubject<Album[]>;

  constructor(private fb: FbaseService) {
    this._albumList$ = new BehaviorSubject<Album[]>([]);

    const sub = combineLatest(
      this.fb.fetchFBList(FB_ALBUM_PATH),
      this.fb.fetchFBList(FB_TRACK_PATH)
    ).subscribe(([albumList, trackList]: [_Album[], Track[]]) => {
      const newAlbumList = [];
      // put together normal object list here
      albumList.map(album => {
        const newTrackList = [];     
        if (album.track_list) {
          album.track_list.map( track_id => {
            trackList.map( track => {
              if (track.$key === track_id.toString()) {
                newTrackList.push(track);
              }
            });
          });
        }

        const newAlbum: Album = {
          title: album.title,
          image_url: album.image_url,
          track_list: newTrackList
        }

        newAlbumList.push(newAlbum);
      });

      this._albumList$.next(newAlbumList);
    });

    // fetch max values - do only once during lifetime of website visit
    const sub1 = this.fb.fetchItem('num-audio-loop').subscribe(val => {
      console.log(val);
      sub1.unsubscribe();
    });
  }

  get albumList$() {
    return this._albumList$.asObservable();
  }
}
