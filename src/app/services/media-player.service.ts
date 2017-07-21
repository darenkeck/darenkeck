import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/behaviorsubject';

export enum PlayerState {
  INIT,
  LOADING,
  PAUSED,
  PLAYING,
  ENDED
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
    this.player.onloadstart = this.onLoadStart.bind(this);
    this.player.oncanplay   = this.onCanPlay.bind(this);
    this.player.onended     = this.onEnded.bind(this);
  }

  // Event Handlers
  onLoadStart(ev: Event) {
    this._state.next(PlayerState.LOADING);
  }

  onCanPlay(ev: Event) {
    this._state.next(PlayerState.PAUSED);
  }

  onEnded(ev: Event) {
    this._state.next(PlayerState.ENDED);
  }

  // public methods
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
}
