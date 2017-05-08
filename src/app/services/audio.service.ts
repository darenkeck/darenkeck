import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';

import { MediaPlayerService } from 'app/services/media-player.service';

const DEFAULT_TRACK  = '1';
const MAX_TRACKS     = 1;
const BASE_AUDIO_URL = 'audio/loop';

/**
 * AudioService
 * 
 * Description: manages the html5 audio object. extends
 * the media player service, with the included behavior of selecting
 * a random track
 */
@Injectable()
export class AudioService extends MediaPlayerService {
  baseUrl:  string;
  trackNum: number;

  constructor() { 
    const audioPlayer = new Audio();
    super(audioPlayer); 
  }

  createUrl(num: number): string {
    let trackNum = DEFAULT_TRACK; //

    if (num < MAX_TRACKS) {
      trackNum = num.toString();
    }

    return `${BASE_AUDIO_URL}/${this.trackNum}.mp3`;
  }

  setTrack(num: number) {
    this.player.src = this.createUrl(num);
  }

  setRandomTrack() {
    const trackNum = Math.floor(Math.random() * MAX_TRACKS);

    this.setTrack(trackNum);
    this.initMedia();
  }
}
