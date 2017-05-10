import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export enum PlayerState {
  INIT,
  LOADING,
  PAUSED,
  PLAYING
}

/**
 * MediaPlayerService
 * 
 * General service for managing an HTML5 HTMLMediaElement
 */
@Injectable()
export class MediaPlayerService {
  player: HTMLMediaElement;
  _state: BehaviorSubject<PlayerState>;

  constructor(player: HTMLMediaElement) {
    this.player = player;
    this._state = new BehaviorSubject<PlayerState>(PlayerState.INIT);

    // set up player event handlers
    this.player.onloadstart = this.onLoadStart;
    this.player.oncanplay   = this.onCanPlay;
  }

  // Event Handlers
  onLoadStart(ev: Event) {
    this._state.next(PlayerState.LOADING);
  }

  onCanPlay(ev: Event) {
    this._state.next(PlayerState.PAUSED);
  }

  // public methods
  initMedia() {
    this.player.load();
  }

  play(ev: Event) {
    // a paused player means a 'play' is possible
    if (this._state.value === PlayerState.PAUSED) {
      this.player.play();
      this._state.next(PlayerState.PLAYING);
    }
  }

  pause(ev: Event) {
    if (this._state.value === PlayerState.PLAYING) {
      this.player.pause();
      this._state.next(PlayerState.PAUSED);
    }
  }

  get state() {
    return this._state.asObservable();
  }
}
