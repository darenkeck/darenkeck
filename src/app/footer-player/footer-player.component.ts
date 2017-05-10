import { Component, OnDestory, OnInit }  from '@angular/core';

import { Observable }   from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { PlayerState }  from 'app/services/media-player.service';
import { AudioService } from 'app/services/audio.service';

@Component({
  selector: 'app-footer-player',
  templateUrl: './footer-player.component.html',
  styleUrls: ['./footer-player.component.css']
})
export class FooterPlayerComponent implements OnDestroy, OnInit {
  playerState:  Observable<PlayerState>;
  playerSub:    Subscription;
  tempPlayerText: string = 'paused';

  constructor(private audioService: AudioService) {
    this.playerState = this.audioService.state;
    this.playerSub = this.playerState.subscribe( state => this.onPlayerStateChange(state) );
  }


  ngOnInit() {
  }

  onPlayerStateChange(state: PlayerState) {
    switch(state) {
      case PlayerState.INIT:
      case PlayerState.LOADING:
      case PlayerState.PAUSED:
        this.tempPlayerText = 'paused';
        break;
      case PlayerState.PLAYING:
        this.tempPlayerText = 'playing';
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
