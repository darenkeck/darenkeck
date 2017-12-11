import { Component, OnChanges, OnInit, Input, ViewChild } from '@angular/core';
import { Http, RequestOptionsArgs, URLSearchParams } from '@angular/http';

import { Observable }   from 'rxjs/observable';
import { Subscription } from 'rxjs/subscription';

import { combineLatest } from 'rxjs/observable/combinelatest';
import { PlayerState }  from 'app/services/media-player.service';
import { AudioService } from 'app/services/audio.service';
import { AudioStoreService, Track } from 'app/services/audio-store.service';
import { JumbleService } from 'app/services/jumble.service';
import { VideoService }   from 'app/services/video.service';

import { TabPage } from 'app/app.component';
import { ReCaptchaComponent } from 'angular2-recaptcha';

const _SLIDER_DISABLED_COLOR = '#78909C'; // Blue Gray 200
const _SLIDER_ENABLED_COLOR = '#BF360C';

export enum PlayerMode {
  'Jumble',
  'Normal'
}

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  @Input() tab = TabPage.HOME;
  
  @ViewChild(ReCaptchaComponent)captcha: ReCaptchaComponent; 

  allowVote:      boolean; // flag to show the thumbs up/down
  currentTrack:   Observable<Track>;
  disableSlider:  boolean;
  isHuman         = false;
  isJumble:       boolean;
  // TODO: 'firstClick' and 'forceVideo' are unnecessary once
  // I can figure out why the videoplayer 'onLoad' is immediately 
  // called. 'firstClick' allows the first click to set a jumble with the play button
  firstClick      = true;
  // flag to indicate we should force a video playing (not inited by jumble)
  forceVideo      = false;
  // used to indicate if jumble voting should show
  playerMode:     PlayerMode;
  playerState:    Observable<PlayerState>;
  playerSub:      Subscription;
  // TODO: switch these booleans to an enum
  // need to wait until I can use a switch in the template...
  _showJumbleInit = false;
  // only needed when a recaptcha round trip is required
  _cachedVote     = null;
  hasVoted        = false; // indicates if a current jumble has been voted on
  showLoad        = false;
  showLoading     = false;
  showPaused      = false;
  showPlaying     = false;
  showCheck       = false;
  sliderColor     = _SLIDER_DISABLED_COLOR;
  voteTimer: number;

  constructor(private jumbleService: JumbleService,
              private audioService: AudioService,
              private audioStoreService: AudioStoreService,
              private http: Http,
              private videoService: VideoService) {
    this.currentTrack = this.audioStoreService.currentTrack;
    this.disableSlider = true;
    this.playerSub = combineLatest(
      this.audioService.state,
      this.videoService.state,
      this.jumbleService.isJumble
    ).subscribe( ([aState, vState, isJumble]) =>
      {
        // If audio is playing, we want video playing as well
        if (!isJumble && aState === PlayerState.LOADING) {
          this.firstClick = false;
          // we want video playing anytime audio is playing, so
          // even though this is not a jumble, go ahead an load a random
          // video
          // Only do this once by checking if the vStat is init
          if (vState === PlayerState.LOADING) {
            this.forceVideo = true;
          }
        }

        if (aState === PlayerState.PAUSED && this.forceVideo) {
          this.jumbleService.initRandomVideo();
          this.forceVideo = false;
        }

        let state = (aState <= vState || aState === PlayerState.ENDED) 
          ? aState : vState;

        this.isJumble = isJumble;
        this.onPlayerStateChange(state);
      }
    );
    // by default, jumble is true for the player. This allows a first click
    // of the player to set a jumble
    this.isJumble = true;

    // set up subscription to keep allow vote up to date
    this.jumbleService.allowVote.subscribe( allow => {
      // only set allow vote if in jumble mode
      this.allowVote = (this.playerMode === PlayerMode.Jumble) ? allow : false;
    })
  }

  ngOnChanges() {
    // player mode is based on last set active track
    const isNavToHome = this.tab === TabPage.HOME;
    this.playerMode = isNavToHome ? PlayerMode.Jumble : PlayerMode.Normal;
    // make sure we immediate set allow vote to false
    if (this.playerMode === PlayerMode.Normal) {
      this.allowVote = false;
    }
  }

  verifyCaptcha(token) {
    this.jumbleService.verifyCaptcha(token).subscribe( isHuman => {
      this.isHuman = isHuman;
      if (this._cachedVote !== null) {
        this.onVote(this._cachedVote);
        this._cachedVote = null;        
      }
    });
  }

  ngOnInit() { }

  onPlayerStateChange(state: PlayerState) {
    this.showJumbleInit = false;
    this.showLoad       = false;
    this.showLoading    = false;
    this.showPaused     = false;
    this.showPlaying    = false;

    switch(state) {
      case PlayerState.INIT:
        this.disableSlider = true;
        this.showLoad = true;
        break;
      case PlayerState.LOADING:
        this.disableSlider = true;
        this.showLoading = true;
        break;
      case PlayerState.PAUSED:
        this.disableSlider = false;
        this.showPaused = true;
        break;
      case PlayerState.PLAYING:
        this.disableSlider = false;
        this.showPlaying = true;
        break;
      case PlayerState.ENDED:
        this.disableSlider = false;
        this.showPaused = true;
        break;
      default:
        break;
    }

    this.sliderColor = (this.disableSlider) ? _SLIDER_DISABLED_COLOR
                                            : _SLIDER_ENABLED_COLOR;
  }

  onClick() {
    if (this.isJumble || this.firstClick) {
      this.jumbleService.toggleState();
      this.firstClick = false;     
    } else {
      this.audioService.toggleState();
    }
  }

  /**
   * Thumbs up == true, down == false
   */
  onVote(vote: boolean) {
    if (this.isHuman) {
      this.jumbleService.onVote(vote);
      this.showCheck = true;
      setTimeout(() => {
        this.showCheck = false;
      }, 2000);  
    } else {
      // initiate a captcha check if it has not been done yet
      // a token will eventually be returned to the method 'verifyCaptcha'
      // that will then validate the token
      this.captcha.execute();
      // cache vote to eventually submit on captcha success
      this._cachedVote = vote;
    }
  }

  onVolumeChange(volume: number) {
    this.jumbleService.setVolume(volume);
  }

  ngOnDestroy() {
    if (this.playerSub) {
      this.playerSub.unsubscribe();
    }
  }

  get showJumbleInit() {
    return this._showJumbleInit;
  }

  set showJumbleInit(show: boolean) {
    this._showJumbleInit = (this.playerMode === PlayerMode.Jumble) ? show : false;
  }
}

