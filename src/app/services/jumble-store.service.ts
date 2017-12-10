import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { BehaviorSubject } from 'rxjs/behaviorsubject';

import { FbaseService } from 'app/services/fbase.service';
/**
 * This service is responsible for fetching reads from video, reads/writes 
 * for jumbles, providing the current list
 */

 // score can be a negative or positive
export interface Jumble {
  score: number;
  video_loop_key: number;
  audio_loop_key: number;
  $key?: string;
}

export interface VideoLoop {
  url: string;
  $key: string;
}

export interface AudioLoop {
  url: string;
  $key: string;
}

const FB_JUMBLE_PATH = 'jumble';
const FB_VIDEO_LIST  = 'video';
const FB_AUDIO_LOOPS = 'audio_loop';
const FB_VIDEO_LOOPS = 'video_loop';

@Injectable()
export class JumbleStoreService {
  _jumbleList$: BehaviorSubject<Jumble[]>;
  _audioLoopList$: BehaviorSubject<AudioLoop[]>;
  _videoLoopList$: BehaviorSubject<VideoLoop[]>;

  constructor(private fb: FbaseService) {
    this._jumbleList$ = new BehaviorSubject<Jumble[]>([]);
    this._videoLoopList$ = new BehaviorSubject<VideoLoop[]>([]);
    this._audioLoopList$ = new BehaviorSubject<AudioLoop[]>([]);

    this.fb.fetchFBList(FB_JUMBLE_PATH).subscribe( (jumbleList: Jumble[]) => {
      this._jumbleList$.next(jumbleList);
    });

    this.fb.fetchFBList(FB_VIDEO_LOOPS).subscribe( (videoList: VideoLoop[]) => {
      this._videoLoopList$.next(videoList);
    });

    this.fb.fetchFBList(FB_AUDIO_LOOPS).subscribe( (audioLoopList: AudioLoop[]) => {
      this._audioLoopList$.next(audioLoopList)
    });
  }

  getNewKey() {
    const highestJumble = this._jumbleList$.value.reduce( (curJ, acc) => {
      return (curJ.$key > acc.$key) ? curJ : acc;
    }, null)

   // increment by 1 to go one past the greatest value
   return highestJumble.$key + 1;
  }

  get audioLoopList() {
    return this._audioLoopList$.asObservable();
  }

  get videoLoopList() {
    return this._videoLoopList$.asObservable();
  }

  // add a lookup by video and audio key
  lookupJumble(jumbleVote: Jumble) {
    let jumble = null;

    this._jumbleList$.value.map(j => {
      if (j.audio_loop_key === jumbleVote.audio_loop_key &&
          j.video_loop_key === jumbleVote.video_loop_key) {
            jumble = j;
          }
    });

    if (!jumble) {
      // the Jumble vote is itself a jumble - it will just not have an assigned key
      jumble = jumbleVote;
      // set the $key by finding the current highest key and incrementing
    }

    return jumble;
  }

  // method to increment/decrement jumble combo
  updateJumble(jumble: Jumble) {
    if (!jumble.$key) {
      // let firebase generate the key
      this.fb.createItem(FB_JUMBLE_PATH, jumble);
    } else {
      this.fb.updateItem(FB_JUMBLE_PATH, jumble.$key, jumble);
    }
  }
}
