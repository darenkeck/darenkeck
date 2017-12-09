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

export interface Video {
  url: string;
  $key: string;
}

const FB_JUMBLE_PATH = 'jumble';
const FB_VIDEO_LIST  = 'video';

@Injectable()
export class JumbleStoreService {
  _jumbleList$: BehaviorSubject<Jumble[]>;
  _videoList$: BehaviorSubject<Video[]>;

  constructor(private fb: FbaseService) {
    this.fb.fetchFBList(FB_JUMBLE_PATH).subscribe( (jumbleList: Jumble[]) => {
      this._jumbleList$.next(jumbleList);
    });

    this.fb.fetchFBList(FB_VIDEO_LIST).subscribe( (videoList: Video[]) => {
      this._videoList$.next(videoList);
    });
  }

  getNewKey() {
    const highestJumble = this._jumbleList$.value.reduce( (curJ, acc) => {
      return (curJ.$key > acc.$key) ? curJ : acc;
    }, null)

   // increment by 1 to go one past the greatest value
   return highestJumble.$key + 1;
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
