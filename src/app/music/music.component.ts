import { Component, OnInit } from '@angular/core';

import { Observable }        from 'rxjs/observable';

import { AudioService }      from '../services/audio.service';
import { AudioStoreService,
         Album, Track }      from '../services/audio-store.service';
import { JumbleStoreService,
         Jumble }            from 'app/services/jumble-store.service';

import { JumbleService }     from 'app/services/jumble.service';  
import { VideoService }      from 'app/services/video.service';     
import { PlayerState }       from 'app/services/media-player.service';

const BASE_AUDIO_URL = 'assets/audio/loop';

const TEST_TRACK_LIST = [
  { title: '0', url: BASE_AUDIO_URL + '/0.mp3'},
  { title: '1', url: BASE_AUDIO_URL + '/1.mp3'},
  { title: '2', url: BASE_AUDIO_URL + '/2.mp3'},
];

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss']
})
export class MusicComponent implements OnInit {
  testTrackList = TEST_TRACK_LIST;
  topJumbleList: Observable<Jumble[]>;
  albumList: Observable<Album[]>;
  currentJumble: Jumble;
  currentTrack: Track;
  constructor( private audioService: AudioService,
               private audioStoreService: AudioStoreService,
               private jumbleService: JumbleService,
               private jumbleStoreService: JumbleStoreService,
               private videoService: VideoService ) 
  {
    this.albumList     = this.audioStoreService.albumList$;
    this.topJumbleList = this.jumbleStoreService.topJumbleList;

    this.jumbleService.state.subscribe( state => {
      // help set the current playing track or jumble (or both!)
      if (state >= PlayerState.PAUSED) {
        this.currentJumble = 
          this.jumbleStoreService.
            lookupJumbleWithUrls(this.audioService.url, this.videoService.url);
        
        this.currentTrack = this.audioStoreService.getAudioWithUrl(this.audioService.url)
      }
    });
  }

  ngOnInit() {
  }

  onTrackSelected(track: Track) {
    this.audioService.initMedia(track.url).subscribe( didFinish => this.audioService.play() );
  }

  onJumbleSelected(jumble: Jumble) {
    this.jumbleService.setJumble(jumble)
  }
}
