import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { BehaviorSubject } from 'rxjs/behaviorsubject';
import { combineLatest } from 'rxjs/observable/combinelatest';

import { PlayerState } from 'app/services/media-player.service';
import { AudioService } from 'app/services/audio.service';
import { FbaseService } from 'app/services/fbase.service';

// unflattened Album reference
export interface Album {
  title: string;
  image_url: string;
  track_list: Track[];
  purchase_url: string;
}

export interface Track {
  album: number;
  name: string;
  track_num: number;
  url: string;
  $key: string;
}

interface _Album {
  title: string;
  image_url: string;
  track_list: number[];
  purchase_url: string;
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
  _currentTrack$: BehaviorSubject<Track>;
  _trackList: Track[] = [];

  constructor(private fb: FbaseService, private audioService: AudioService) {
    this._albumList$ = new BehaviorSubject<Album[]>([]);
    this._currentTrack$ = new BehaviorSubject<Track>(null);

    // constructs the albums
    const sub = combineLatest(
      this.fb.fetchFBList(FB_ALBUM_PATH),
      this.fb.fetchFBList(FB_TRACK_PATH)
    ).subscribe(([albumList, trackList]: [_Album[], Track[]]) => {
      const newAlbumList = this.createAlbumList(albumList, trackList);
      // keep a local reference for convenience
      this._trackList = trackList;
      this._albumList$.next(newAlbumList);
    });

    const sub2 = this.audioService.state.subscribe( (aState: PlayerState) => {
      // only on load attempt to set url
      if (aState === PlayerState.LOADING) {
        this.setCurrentTrack(this.audioService.url);
      }
    });
  }

  get albumList$() {
    return this._albumList$.asObservable();
  }

  get currentTrack() {
    return this._currentTrack$.asObservable();
  }

  /**
   * Description: Takes two related flat types and creates a usable nested
   * structure
   * @param albumList: _Album[]
   * @param trackList: Track[]
   */
  createAlbumList(albumList: _Album[], trackList: Track[]): Album[] {
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
        track_list: newTrackList,
        purchase_url: album.purchase_url
      }

      newAlbumList.push(newAlbum);
    });

    return newAlbumList;
  }

  // using the url, finds the Track object with the given url
  setCurrentTrack(url: string) {
    console.log(url);
    const track = this._trackList.find(t => t.url === url);
    this._currentTrack$.next(track);
  }
}
