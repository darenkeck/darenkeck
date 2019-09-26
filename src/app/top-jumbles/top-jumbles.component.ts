import { Component, OnInit } from '@angular/core';
import { AudioService }      from '../services/audio.service';
import { AudioStoreService,
         Album }             from '../services/audio-store.service';
import { VideoService }      from 'app/services/video.service';     
import { JumbleService }     from 'app/services/jumble.service';  
import { JumbleStoreService,
         Jumble }            from 'app/services/jumble-store.service';
import { Observable }        from 'rxjs';
import { PlayerState }       from 'app/services/media-player.service';
import { combineLatest }     from 'rxjs';
import { Subscription }      from 'rxjs';

@Component({
  selector: 'app-top-jumbles',
  templateUrl: './top-jumbles.component.html',
  styleUrls: ['./top-jumbles.component.scss']
})
export class TopJumblesComponent implements OnInit {
  currentJumble: Jumble;
  subscription: Subscription;
  topJumbleList: Observable<Jumble[]>;

  constructor(private audioService:       AudioService,
              private audioStoreService:  AudioStoreService,
              private videoService:       VideoService,
              private jumbleService:      JumbleService,
              private jumbleStoreService: JumbleStoreService) {
    this.topJumbleList = this.jumbleStoreService.topJumbleList;

      combineLatest(
        this.topJumbleList,
        this.jumbleService.state
    ).subscribe( ([_, state]: [Jumble[], PlayerState]) => {
      // help set the current playing track or jumble (or both!)
      if (state >= PlayerState.PAUSED) {
        this.currentJumble =
          this.jumbleStoreService.lookupLocalJumbleWithUrl(this.audioService.url, this.videoService.url);
      }
    });
  }

  ngOnInit() {
  }


  onJumbleSelected(jumble: Jumble) {
    this.jumbleService.setJumble(jumble)
  }
}
