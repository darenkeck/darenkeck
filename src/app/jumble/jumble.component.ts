import { Component, OnInit } from '@angular/core';

import { Observable }   from 'rxjs/observable';
import { Subscription } from 'rxjs/subscription';

import { PlayerState }  from 'app/services/media-player.service';
import { JumbleService } from 'app/services/jumble.service';
import { AudioService } from 'app/services/audio.service';

@Component({
  selector: 'app-jumble',
  templateUrl: './jumble.component.html',
  styleUrls: ['./jumble.component.css']
})
export class JumbleComponent implements OnInit {
  playerState:    Observable<PlayerState>;
  playerSub:      Subscription;
  showLoad    = false;
  showLoading = false;
  showPaused  = false;
  showPlaying = false;

  constructor(private jumbleService: JumbleService) {
    this.playerState = this.jumbleService.state;
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
        // this.audioService.setRandomTrack();
        break;
      default:
        break;
    }
  }

  onClick() {
    this.jumbleService.toggleState();
  }

  ngOnDestroy() {
    if (this.playerSub) {
      this.playerSub.unsubscribe();
    }
  }
}
