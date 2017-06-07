import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest }   from 'rxjs/Observable/combineLatest';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/mergemap';

import { FbaseService } from 'app/services/fbase.service';
import { PlayerState } from 'app/services/media-player.service';

import { VideoController } from 'app/classes/video-controller';

const DEFAULT_TRACK  = '1';
const MAX_VIDEO_TRACK_STR = 'num-audio-loops'
const BASE_VIDEO_URL = 'assets/audio/loop';

// Video Service to be instantiated
export class VideoService {
  baseUrl: string;
  maxTracks: number;
  _vcList: VideoController[];
  _vcId: number;
  // ---- generic members ------
  _accState: Observable<PlayerState>;
  _accStateSub: Subscription;
  _state: BehaviorSubject<PlayerState>;
  // ---- end generic members ---

  constructor(private fb: FbaseService) {
    this._state = new BehaviorSubject<PlayerState>(PlayerState.INIT);
  }

  createVideoController(videoElement: HTMLMediaElement) {
    const vC = new VideoController(videoElement);
    this._vcList = [...this._vcList, vC];

    
    return vC;
  }

  removeVideoController(vc: VideoController) {
    this._vcList = this._vcList.filter(vc => vc.id !== vc.id);
  }

  createUrlString(num: number): string {
    let trackNum = DEFAULT_TRACK; //

    if (num < this.maxTracks) {
      trackNum = num.toString();
    }

    return `${BASE_VIDEO_URL}/${trackNum}.mp3`;
  }

  setRandomTrack(vc: VideoController) {
    if (this.maxTracks) {
      const trackNum = Math.floor(Math.random() * this.maxTracks);
      vc.url = this.createUrlString(trackNum);
    }
  }

  updateStateObservable() {
    if (this._accStateSub) {
      this._accStateSub.unsubscribe();
    }

    // get state of each player
    this._accState = combineLatest(
      this._vcList.map(vc => vc.state), 
    ).map(stateList => stateList.reduce((acc, state) => (acc >= state) ? acc : state));

    // update subscription for overal video state
    this._accStateSub = this._accState.subscribe(state => {
      this._state.next(state);
    })
  }
}
