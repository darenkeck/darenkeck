import { Component, OnInit, AfterContentInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { Observable }   from 'rxjs/observable';
import { Subscription } from 'rxjs/subscription';

import { PlayerState }  from 'app/services/media-player.service';
import { JumbleService } from 'app/services/jumble.service';
import { AudioService } from 'app/services/audio.service';

const _SLIDER_DISABLED_COLOR = '#78909C'; // Blue Gray 200
const _SLIDER_ENABLED_COLOR = '#BF360C';

export enum PlayerMode {
  'Jumble',
  'Normal'
}

const VOTE_TIMER_LENGTH = 5; // in seconds

@Component({
  selector: 'app-player',
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.scss']
})
export class PlayerComponent implements OnInit {
  disableSlider: boolean;
  playerMode: PlayerMode;
  playerState:    Observable<PlayerState>;
  playerSub:      Subscription;
  // TODO: switch these booleans to an enum
  // need to wait until I can use a switch in the template...
  showLoad    = false;
  showLoading = false;
  showPaused  = false;
  showPlaying = false;
  _showVoting  = false;
  sliderColor = _SLIDER_DISABLED_COLOR;
  voteTimer: number;

  constructor(private jumbleService: JumbleService, private router: Router) {
    this.disableSlider = true;
    this.playerState = this.jumbleService.state;
    this.playerSub = this.playerState.subscribe( state => this.onPlayerStateChange(state));

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (event.url === 'home') {
          this.playerMode = PlayerMode.Jumble;
        } else {
          this.playerMode = PlayerMode.Normal;
          this._showVoting = false;
        }
      }
    });
  }
  ngOnInit() { }

  ngAfterContentinit() {
    // on init set initial jumble
    this.jumbleService.setJumble();
  }

  onPlayerStateChange(state: PlayerState) {
    this.showLoad     = false;
    this.showLoading  = false;
    this.showPaused   = false;
    this.showPlaying  = false;

    switch(state) {
      case PlayerState.INIT:
        this.disableSlider = true;
        this.showLoad = true;
        this.showVoting = false;
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
        this.startVoteTimer();
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
    this.jumbleService.toggleState();
  }

  onVote(good: boolean) {
    this.jumbleService.onVote(good);
  }

  onVolumeChange(volume: number) {
    this.jumbleService.setVolume(volume);
  }

  ngOnDestroy() {
    if (this.playerSub) {
      this.playerSub.unsubscribe();
    }
  }

  get showVoting() {
    return this._showVoting;
  }

  set showVoting(show: boolean) {
    this._showVoting = (this.playerMode === PlayerMode.Jumble) ? show : false;
  }

  /**
   * Small timer to wait a certain amount of time and then
   * make voting visible.
   */
  startVoteTimer() {
    if (!this.voteTimer) {
      this.voteTimer = window.setTimeout(() => {
        this.showVoting = true;
        this.voteTimer  = null;
      }, VOTE_TIMER_LENGTH * 60 * 1000); // in milliseconds
    }
  }
}

