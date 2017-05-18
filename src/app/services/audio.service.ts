import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { PlayerState } from 'app/services/media-player.service';

const DEFAULT_TRACK  = '1';
const MAX_TRACKS     = 1;
const BASE_AUDIO_URL = 'assets/audio/loop';

// TODO: refactor generic methods into media-player service

/**
 * AudioService
 * 
 * Description: manages the html5 audio object. extends
 * the media player service, with the included behavior of selecting
 * a random track
 */

@Injectable()
export class AudioService {
  baseUrl:  string;
  trackNum: number;

  // ---- generic members ------
  player: HTMLMediaElement;
  _state: BehaviorSubject<PlayerState>;
  // ---- end generic members ---

  constructor() { 
    this.player = new Audio();

    // --- generic constructor settings ----
    // set up player event handlers
    this._state = new BehaviorSubject<PlayerState>(PlayerState.INIT);
    this.player.onloadstart = this.onLoadStart.bind(this);
    this.player.oncanplay   = this.onCanPlay.bind(this);
    // --- end generic constructor settings --
  }

  // -------- start generic methods -----------
  // Event Handlers
  onLoadStart(ev: Event) {
    this._state.next(PlayerState.LOADING);
  }

  onCanPlay(ev: Event) {
    this._state.next(PlayerState.PAUSED);
  }

  initMedia() {
    this.player.load();
  }

  play() {
    // a paused player means a 'play' is possible
    if (this._state.value === PlayerState.PAUSED) {
      this.player.play();
      this._state.next(PlayerState.PLAYING);
    }
  }

  pause() {
    if (this._state.value === PlayerState.PLAYING) {
      this.player.pause();
      this._state.next(PlayerState.PAUSED);
    }
  }

  get state() {
    return this._state.asObservable();
  }
  // -------- end generic methods -----------

  createUrl(num: number): string {
    let trackNum = DEFAULT_TRACK; //

    if (num < MAX_TRACKS) {
      trackNum = num.toString();
    }

    return `${BASE_AUDIO_URL}/${trackNum}.mp3`;
  }

  setTrack(num: number) {
    this.player.src = this.createUrl(num);
  }

  setRandomTrack() {
    const trackNum = Math.floor(Math.random() * MAX_TRACKS);
    this.setTrack(trackNum);
    this.initMedia();
  }
}
