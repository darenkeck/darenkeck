import { Component, OnDestroy, OnInit }  from '@angular/core';

import { Observable }   from 'rxjs/observable';
import { Subscription } from 'rxjs/subscription';

import { PlayerState }  from 'app/services/media-player.service';
import { AudioService } from 'app/services/audio.service';

@Component({
  selector: 'app-footer-player',
  templateUrl: './footer-player.component.html',
  styleUrls: ['./footer-player.component.css']
})
export class FooterPlayerComponent implements OnDestroy, OnInit {
  playerState:    Observable<PlayerState>;
  playerSub:      Subscription;
  showLoad = false;
  showLoading = false;
  showPaused = false;
  showPlaying = false;

  constructor(private audioService: AudioService) {
    this.playerState = this.audioService.state;
    this.playerSub = this.playerState.subscribe( state => this.onPlayerStateChange(state));
  }
  ngOnInit() {
  }

  onPlayerStateChange(state: PlayerState) {
    this.showLoad     = false;
    this.showLoading  = false;
    this.showPaused   = false;
    this.showPlaying  = false;

    switch(state) {
      case PlayerState.INIT:
        this.showLoad = true;
        break;
      case PlayerState.LOADING:
        this.showLoading = true;
        break;
      case PlayerState.PAUSED:
        this.showLoading = true;
        break;
      case PlayerState.PLAYING:
        this.showPlaying = true;
        break;
      case PlayerState.ENDED:
        this.showPaused = true;
        this.audioService.setRandomTrack();
        break;
      default:
        break;
    }
  }

  onClick() {
    this.audioService.toggleState();
  }

  ngOnDestroy() {
    if (this.playerSub) {
      this.playerSub.unsubscribe();
    }
  }
}
