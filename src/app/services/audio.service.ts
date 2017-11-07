import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/behaviorsubject';
import { Subject }      from 'rxjs/Subject';
import 'rxjs/add/operator/take';


import { FbaseService } from 'app/services/fbase.service';
import { PlayerState } from 'app/services/media-player.service';

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
  // ---- generic members ------
  player: HTMLMediaElement;
  _state: BehaviorSubject<PlayerState>;
  _loadFinished: Subject<boolean>;

  // ---- end generic members ---

  constructor(private fb: FbaseService) { 
    this.player = new Audio();
    // --- generic constructor settings ----
    // set up player event handlers
    this._loadFinished = new Subject();
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
    if (this._state.value === PlayerState.LOADING) {
      this._state.next(PlayerState.PAUSED);
      this._loadFinished.next(true);
    }
  }

  onEnded(ev: Event) {
    this._state.next(PlayerState.ENDED);
  }

  initMedia(url = null) {
    if (url) {
      // if a url is provided, set it
      this.url = url;
    }

    if (this.player && this.player.src) {
      this.player.load();

      return this._loadFinished.asObservable().take(1);
    } else {
      throw Error('Player or player src not set')
    }
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

  /**
   * Sets audio volume - min value: 0 max value: 100
   */
  setVolume(volume: number) {
    // incoming value is between 0 - 100
    // player takes a value between 0 - 1.0
    this.player.volume = volume * 0.01;
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
        break;
      case PlayerState.LOADING:
        // set random track url and start load
        this.initMedia();        
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

  set url(path: string) {
    this.player.src = path;
  }
}
