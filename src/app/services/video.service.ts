import { ElementRef, Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/behaviorsubject';
import { Observable } from 'rxjs/observable';
import { Subscription } from 'rxjs/subscription';
import { Subject }      from 'rxjs/subject';
import { combineLatest }   from 'rxjs/observable/combinelatest';
import 'rxjs/add/operator/reduce';
import 'rxjs/add/operator/mergemap';

import { FbaseService } from 'app/services/fbase.service';
import { PlayerState } from 'app/services/media-player.service';

import { VideoController } from 'app/classes/video-controller';

const DEFAULT_TRACK  = '1';
const MAX_VIDEO_TRACK_STR = 'num-video-loops'
const BASE_VIDEO_URL = 'assets/video/loop';

// Video Service to be instantiated
@Injectable()
export class VideoService {
  baseUrl: string;
  maxTracks: number;
  _vc: VideoController;
  _vcId: number;
  // ---- generic members ------
  _accState: Observable<PlayerState>;
  _accStateSub: Subscription;
  _state: BehaviorSubject<PlayerState>;
  _loadFinished: Subject<boolean>;
  // ---- end generic members ---

  constructor(private fb: FbaseService) {
    this._state = new BehaviorSubject<PlayerState>(PlayerState.INIT);
  }

  createVideoController(videoElement: ElementRef) {
    const vc = new VideoController(videoElement);
    this._vc = vc;
    this.updateStateObservable();

    return this._vc;
  }

  initMedia() {
    return this._vc.initMedia();
  }

  play() {
    this._vc.play();
  }

  pause() {
    this._vc.pause();
  }

  removeVideoController(vc: VideoController) {
    this._vc = undefined;
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

  /**
   * Resets the video subscription
   */
  updateStateObservable() {
    if (this._accStateSub) {
      this._accStateSub.unsubscribe();
    }

    // set up subscription to state of each player, return the 'least prepared' state
    this._accState = this._vc.state;

    // update subscription for overal video state
    this._accStateSub = this._accState.subscribe(state => {
      this._state.next(state);
    })
  }

  get state() {
    return this._state.asObservable();
  }
  get url() {
    return this._vc.url;
  }

  set url(url: string) {
    this._vc.url = url;
  }
}
