import { Component, OnInit, AfterContentInit } from '@angular/core';

import { Observable }   from 'rxjs/observable';
import { Subscription } from 'rxjs/subscription';

import { PlayerState }  from 'app/services/media-player.service';
import { JumbleService } from 'app/services/jumble.service';
import { AudioService } from 'app/services/audio.service';

@Component({
  selector: 'app-jumble',
  templateUrl: './jumble.component.html',
  styleUrls: ['./jumble.component.scss']
})
export class JumbleComponent implements OnInit {
  disableSlider: boolean;
  playerState:    Observable<PlayerState>;
  playerSub:      Subscription;
  showLoad    = false;
  showLoading = false;
  showPaused  = false;
  showPlaying = false;

  constructor(private jumbleService: JumbleService) {
    this.disableSlider = true;
    this.playerState = this.jumbleService.state;
    this.playerSub = this.playerState.subscribe( state => this.onPlayerStateChange(state));
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
        // this.audioService.setRandomTrack();
        break;
      default:
        break;
    }
  }

  onClick() {
    this.jumbleService.toggleState();
  }

  onVolumeChange(volume: number) {
    this.jumbleService.setVolume(volume);
  }

  ngOnDestroy() {
    if (this.playerSub) {
      this.playerSub.unsubscribe();
    }
  }
}
