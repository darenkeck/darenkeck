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
  state: BehaviorSubject<PlayerState>;

  constructor(player: HTMLMediaElement) {
    this.player = player;
    this.state = new BehaviorSubject<PlayerState>(PlayerState.INIT);

    // set up player event handlers
    this.player.onloadstart = this.onLoadStart;
    this.player.oncanplay   = this.onCanPlay;
  }

  // Event Handlers
  onLoadStart(ev: Event) {
    this.state.next(PlayerState.LOADING);
  }

  onCanPlay(ev: Event) {
    this.state.next(PlayerState.PAUSED);
  }

  // public methods
  initMedia() {
    this.player.load();
  }

  play(ev: Event) {
    // a paused player means a 'play' is possible
    if (this.state.value === PlayerState.PAUSED) {
      this.player.play();
      this.state.next(PlayerState.PLAYING);
    }
  }

  pause(ev: Event) {
    if (this.state.value === PlayerState.PLAYING) {
      this.player.pause();
      this.state.next(PlayerState.PAUSED);
    }
  }
}
