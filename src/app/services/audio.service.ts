import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

export enum AudioState {
  INIT,
  LOADING,
  PAUSED,
  PLAYING
}

// This is a hard coded value. 
const MAX_TRACKS = 1;
/**
 * Audio AudioService
 * 
 * Description: manages the html5 audio object. Assumes 
 * there is only ever one track playing
 */
@Injectable()
export class AudioService {
  canPlay: boolean;
  player: HTMLAudioElement;
  trackNum: number;
  state: BehaviorSubject<AudioState>;

  constructor() { 
    this.player = new Audio();
    this.state  = new BehaviorSubject<AudioState>(AudioState.INIT); 

    // set up event handlers
    this.player.onloadstart = this.onLoadStart;
    this.player.oncanplay = this.onCanPlay; 
  }

  // Event Handlers

  onLoadStart(ev: Event) {
    this.canPlay = false;
    this.state.next(AudioState.LOADING);
  }

  onCanPlay(ev: Event) {
    this.canPlay = true;
    this.state.next(AudioState.PAUSED);
  }

  // 'Public' Methods

  getRandomTrackUrl() {
    this.trackNum = Math.floor(Math.random() * MAX_TRACKS);
    const url = `audio/loop/${this.trackNum}.mp3`
    return url;
  }

  initTrack() {
    this.player.src = this.getRandomTrackUrl();
    this.player.load();
  }

  play() {
    if (this.canPlay) {
      this.player.play();
      this.state.next(AudioState.PLAYING);
    }
  }

  pause() {
    if (this.state.value === AudioState.PLAYING) {
      this.player.pause();
      this.state.next(AudioState.PAUSED);
    }
  }
}
