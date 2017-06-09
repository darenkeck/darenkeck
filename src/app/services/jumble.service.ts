import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/observable';
import { Subscription } from 'rxjs/subscription';
import { combineLatest }   from 'rxjs/observable/combinelatest';

import { AudioService } from 'app/services/audio.service';
import { FbaseService } from 'app/services/fbase.service';
import { VideoService } from 'app/services/video.service';
import { PlayerState } from 'app/services/media-player.service';

import { VideoController } from 'app/classes/video-controller';

const MAX_AUDIO_TRACK_STR = 'num-audio-loops';
const MAX_VIDEO_TRACK_STR = 'num-video-loops'
const BASE_VIDEO_URL = 'assets/video/loop';
const BASE_AUDIO_URL = 'assets/audio/loop';

// This class is designed to coordinate the video and audio player
// and help load random tracks for each
@Injectable()
export class JumbleService {
  state: Observable<PlayerState>;
  _state: PlayerState;
  maxAudioTracks: number;
  maxVideoTracks: number;
  constructor(private audioService: AudioService,
              private fb: FbaseService,
              private videoService: VideoService) {
    this.state = combineLatest(
      this.audioService.state,
      this.videoService.state,
      (aState, vState) => {
        const state = (aState <= vState) ? aState : vState;
        this._state = state;
        
        return state;
    });

    // fetch max values - do only once during lifetime of website visit
    const sub1 = this.fb.fetchItem(MAX_AUDIO_TRACK_STR).subscribe(val => {
      if (val) {
        this.maxAudioTracks = val;
      }
      sub1.unsubscribe();
    });

    const sub2 = this.fb.fetchItem(MAX_VIDEO_TRACK_STR).subscribe(val => {
      if (val) {
        this.maxVideoTracks = val;
      }

      sub2.unsubscribe();
    });
  }

  createVideoUrlString(num: number): string {
    let trackNum = '0'; //

    if (num < this.maxVideoTracks) {
      trackNum = num.toString();
    }

    return `${BASE_VIDEO_URL}/${trackNum}.mp3`;
  }

  createAudioUrlString(num: number): string {
    let trackNum = '0'; //

    if (num < this.maxAudioTracks) {
      trackNum = num.toString();
    }

    return `${BASE_AUDIO_URL}/${trackNum}.mp3`;
  }

  play() {

  }

  pause() {

  }

  /**
   * @description Sets a random track number and starts download for both video and audio
   */
  setJumble() {
    if (this.maxAudioTracks && this.maxVideoTracks) {
      const videoTrackNum = Math.floor(Math.random() * this.maxVideoTracks);
      const audioTrackNum = Math.floor(Math.random() * this.maxAudioTracks);
      
      // set urls for both video and audio
      this.audioService.url = this.createAudioUrlString(audioTrackNum);
      this.videoService.url = this.createVideoUrlString(videoTrackNum);

      // start load
      this.audioService.initMedia();
      this.videoService.initMedia();
    }
  }

  toggleState() {
    switch(this._state) {
      case PlayerState.INIT:
        // set random track url and start load
        this.setJumble();
        break;
      case PlayerState.LOADING:
        break;
      case PlayerState.PAUSED:
        this.play();
        break;
      case PlayerState.PLAYING:
        this.pause();
        break;
      case PlayerState.ENDED:
        this.play();
        break;
      default:
        break;
    }
  }
}
