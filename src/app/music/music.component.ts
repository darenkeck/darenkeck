import { Component, OnInit } from '@angular/core';

import { AudioService }      from '../services/audio.service';

// for now, hardcode tracks. This should be added

const BASE_AUDIO_URL = 'assets/audio/loop';

const TEST_TRACK_LIST = [
  { title: '00', url: BASE_AUDIO_URL + '/00.mp3'},
  { title: '01', url: BASE_AUDIO_URL + '/01.mp3'},
  { title: '02', url: BASE_AUDIO_URL + '/02.mp3'},
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
