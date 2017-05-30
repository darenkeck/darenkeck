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
  constructor(private fb: FbaseService, videoElement: HTMLMediaElement) {
    this.player = videoElement;

    // --- generic constructor settings ----
    // set up player event handlers
    this._state = new BehaviorSubject<PlayerState>(PlayerState.INIT);
    this.player.onloadstart = this.onLoadStart.bind(this);
    this.player.oncanplay   = this.onCanPlay.bind(this);
    this.player.onended     = this.onEnded.bind(this);
    // --- end generic constructor settings --
  }

  // -------- start generic methods -----------
  // Event Handlers
  onLoadStart(ev: Event) {
    this._state.next(PlayerState.LOADING);
  }

  onCanPlay(ev: Event) {
    // only if previous event is loading fire this event
    if(this._state.value === PlayerState.LOADING) {
      this._state.next(PlayerState.PAUSED);
    }
  }

  onEnded(ev: Event) {
    this._state.next(PlayerState.ENDED);
  }

  initMedia() {
    this.player.load();
  }


  play() {
    // a paused player means a 'play' is possible
    if (this._state.value === PlayerState.PAUSED 
        || this._state.value === PlayerState.ENDED) {
      this.player.play();
      this._state.next(PlayerState.PLAYING);
    }
  }

  pause() {
    if (this._state.value === PlayerState.PLAYING
        || this._state.value === PlayerState.ENDED) {
      this.player.pause();
      this._state.next(PlayerState.PAUSED);
    }
  }

  get state() {
    return this._state.asObservable();
  }

  /**
   * Given a previous media player state, move to the next logical one
   */
  toggleState() {
    switch(this._state.value) {
      case PlayerState.INIT:
        // set random track url and start load
        this.setRandomTrack();
        this.initMedia();
        break;
      case PlayerState.LOADING:
        break;
      case PlayerState.PAUSED:
        this.play();
        break;
      case PlayerState.PLAYING:
        this.pause();
        break;
      case PlayerState.ENDED:
        this.play();
        break;
      default:
        break;
    }
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
      this.initMedia();
    }
  }
}
