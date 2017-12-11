import { Component, OnInit } from '@angular/core';

import { Observable }        from 'rxjs/observable';

import { AudioService }      from '../services/audio.service';
import { AudioStoreService,
         Album, Track }      from '../services/audio-store.service';
import { JumbleStoreService,
         Jumble }            from 'app/services/jumble-store.service';

import { JumbleService }     from 'app/services/jumble.service';       
// for now, hardcode tracks. This should be added

const BASE_AUDIO_URL = 'assets/audio/loop';

const TEST_TRACK_LIST = [
  { title: '0', url: BASE_AUDIO_URL + '/0.mp3'},
  { title: '1', url: BASE_AUDIO_URL + '/1.mp3'},
  { title: '2', url: BASE_AUDIO_URL + '/2.mp3'},
];

@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.css']
})
export class MusicComponent implements OnInit {
  testTrackList = TEST_TRACK_LIST;
  topJumbleList: Observable<Jumble[]>;
  albumList: Observable<Album[]>;
  constructor( private audioService: AudioService,
               private audioStoreService: AudioStoreService,
               private jumbleService: JumbleService,
               private jumbleStoreService: JumbleStoreService ) 
  {
    this.albumList = this.audioStoreService.albumList$;
    this.topJumbleList = this.jumbleStoreService.jumbleList.map( (jumbleList: Jumble[]) => {
        return jumbleList.sort( (j1, j2) => {
          // if j1 has a higher score, give it a lower index so it is first
          return (j1.score > j2.score) ? -1 : 1;
        });
      }
    )
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
