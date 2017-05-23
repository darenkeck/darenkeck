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
  playerStateVal: PlayerState;
  playerSub:      Subscription;
  tempPlayerText: string = 'Load';

  constructor(private audioService: AudioService) {
    this.playerState = this.audioService.state;
    this.playerSub = this.playerState.subscribe( state => this.onPlayerStateChange(state) );
  }
  ngOnInit() {
  }

  onPlayerStateChange(state: PlayerState) {
    this.playerStateVal = state;

    switch(state) {
      case PlayerState.INIT:
        this.tempPlayerText = 'Load';
        break;
      case PlayerState.LOADING:
        this.tempPlayerText = 'Loading';
        break;
      case PlayerState.PAUSED:
        this.tempPlayerText = 'Paused';
        break;
      case PlayerState.PLAYING:
        this.tempPlayerText = 'Playing';
        break;
      default:
        break;
    }
  }

  onClick() {
    switch(this.playerStateVal) {
      case PlayerState.INIT:
        // set random track url and start load
        this.audioService.setRandomTrack();
        this.audioService.initMedia();
        break;
      case PlayerState.LOADING:
        break;
      case PlayerState.PAUSED:
        this.audioService.play();
        break;
      case PlayerState.PLAYING:
        this.audioService.pause();
        break;
      default:
        break;
    }
  }

  ngOnDestroy() {
    if (this.playerSub) {
      this.playerSub.unsubscribe();
    }
  }
}
