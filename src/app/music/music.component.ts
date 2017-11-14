import { Component, OnInit } from '@angular/core';

import { AudioService }      from '../services/audio.service';

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

  constructor(private audioService: AudioService) { }

  ngOnInit() {
  }

  onTrackSelected(trackUrl: string) {
    this.audioService.initMedia(trackUrl);
  }
}
