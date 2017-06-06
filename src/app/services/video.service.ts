import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { FbaseService } from 'app/services/fbase.service';
import { PlayerState } from 'app/services/media-player.service';



const DEFAULT_TRACK  = '1';
const MAX_VIDEO_TRACK_STR = 'num-audio-loops'
const BASE_VIDEO_URL = 'assets/audio/loop';

// Video Service to be instantiated
export class VideoService {
  baseUrl: string;
  maxTracks: number;

  // ---- generic members ------
  player: HTMLMediaElement;
  _state: BehaviorSubject<PlayerState>;
  // ---- end generic members ---
  constructor(private fb: FbaseService) {
    // --- generic constructor settings ----
    // set up player event handlers
    this._state = new BehaviorSubject<PlayerState>(PlayerState.INIT);
    // --- end generic constructor settings --
  }


  // -------- end generic methods -----------
  createUrlString(num: number): string {
    let trackNum = DEFAULT_TRACK; //

    if (num < this.maxTracks) {
      trackNum = num.toString();
    }

    return `${BASE_VIDEO_URL}/${trackNum}.mp3`;
  }

  setTrack(num: number) {
    this.player.src = this.createUrlString(num);
  }

  setRandomTrack() {
    if (this.maxTracks) {
      const trackNum = Math.floor(Math.random() * this.maxTracks);
      this.setTrack(trackNum);
    }
  }
}
