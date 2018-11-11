import { Component, OnDestroy, OnInit } from '@angular/core';

import { Observable }        from 'rxjs';
import { combineLatest }     from 'rxjs';
import { Subscription }      from 'rxjs';
import { AudioService }      from '../services/audio.service';
import { AudioStoreService,
         Album, Track }      from '../services/audio-store.service';
import { JumbleStoreService,
         Jumble }            from 'app/services/jumble-store.service';

import { JumbleService }     from 'app/services/jumble.service';  
import { VideoService }      from 'app/services/video.service';     
import { PlayerState }       from 'app/services/media-player.service';

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss']
})
export class MusicComponent implements OnDestroy, OnInit {
  topJumbleList: Observable<Jumble[]>;
  albumList: Observable<Album[]>;
  currentJumble: Jumble;
  currentTrack: Track;
  subscriptions: Subscription;
  constructor( private audioService: AudioService,
               private audioStoreService: AudioStoreService,
               private jumbleService: JumbleService,
               private jumbleStoreService: JumbleStoreService,
               private videoService: VideoService ) 
  {
    this.albumList     = this.audioStoreService.albumList$;
    this.topJumbleList = this.jumbleStoreService.topJumbleList;

    this.subscriptions = combineLatest(
      this.topJumbleList,
      this.jumbleService.state
    ).subscribe( ([topJumbleList, state]: [Jumble[], PlayerState]) => {
      // help set the current playing track or jumble (or both!)
      if (state >= PlayerState.PAUSED) {
        this.currentJumble = 
          this.jumbleStoreService.
            lookupJumbleWithUrls(this.audioService.url, this.videoService.url);
        
        this.currentTrack = this.audioStoreService.getAudioWithUrl(this.audioService.url)
      }
    });
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
  }

  ngOnInit() {
  }

  onTrackSelected(track: Track) {
    this.audioService.initMedia(track.url).subscribe( didFinish => {
      this.audioService.play();
      // allowing voting on select audio as well
      this.jumbleService.startVoteTimer();
    });
  }
}
