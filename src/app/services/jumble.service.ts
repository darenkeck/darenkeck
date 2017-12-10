import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs/behaviorsubject';
import { Observable } from 'rxjs/observable';
import { Subscription } from 'rxjs/subscription';
import { combineLatest } from 'rxjs/observable/combinelatest';
import 'rxjs/add/operator/take';
import 'rxjs/add/operator/withLatestFrom';

import { AudioService } from 'app/services/audio.service';
import { FbaseService } from 'app/services/fbase.service';
import { JumbleStoreService,
         AudioLoop,
         VideoLoop }    from 'app/services/jumble-store.service';
import { VideoService } from 'app/services/video.service';
import { PlayerState }  from 'app/services/media-player.service';

import { VideoController } from 'app/classes/video-controller';

const MAX_AUDIO_TRACK_STR = 'num-audio-loops';
const MAX_VIDEO_TRACK_STR = 'num-video-loops';
const MAX_RANDOM_ATTEMPTS = 3;
const BASE_VIDEO_URL = 'assets/video/loop';
const BASE_AUDIO_URL = 'assets/audio/loop';

// This class is designed to coordinate the video and audio player
// and help load random tracks for each
// This contains knowledge of how to interact with the 'loop' video and audio tracks
// This manages the state between both video and audio player
@Injectable()
export class JumbleService {
  state: Observable<PlayerState>;
  _state: PlayerState;
  _jumbleInitiated: boolean;
  _isJumble: BehaviorSubject<boolean>;
  isJumble: Observable<boolean>;
  audioLoopList: AudioLoop[] = [];
  videoLoopList: VideoLoop[] = [];
  // buffers to attempt to not play the same thing...
  _prevVideo: number[] = [];
  _prevAudio: number[] = [];
  _voteTimer: number;

  constructor(private audioService: AudioService,
              private fb: FbaseService,
              private jumbleStoreService: JumbleStoreService,
              private videoService: VideoService) {
    // only emit event when a _isJumble event is emitted
    this._isJumble = new BehaviorSubject(false);

    // set up how PlayerState is generated from audio and video service
    this.state = combineLatest(
      this.audioService.state,
      this.videoService.state,
      (aState, vState) => {
        let state = (aState <= vState) ? aState : vState;
        // audio state is more important and takes precedence in a few situations
        // on audio initialization, see if the _jumbleInitiated flag is set
        if (aState === PlayerState.LOADING) {
          this._isJumble.next(this._jumbleInitiated);
          this._jumbleInitiated = false;
        }
        // if audio state finishes, set state as finished.
        // video loops and will never emit a 'finish' event
        state = (aState === PlayerState.ENDED) ? PlayerState.ENDED : state;
        this._state = state;
        
        return state
      }
    );
    // A combined observable that uses _jumbleReady as the primary
    // trigger
    this.isJumble = this._isJumble.asObservable().withLatestFrom(
      this.state,
      (jumbleReady, state) => {
        return jumbleReady
      }
    );

    // fetch audioLoopList and videoLoopList
    this.jumbleStoreService.audioLoopList.subscribe( 
      audioLoopList => this.audioLoopList = audioLoopList
    );
    this.jumbleStoreService.videoLoopList.subscribe(
      videoLoopList => this.videoLoopList = videoLoopList
    );
  }

  play() {
    this.videoService.play();
    this.audioService.play();
  }

  pause() {
    this.videoService.pause();
    this.audioService.pause();
  }

  /**
   * Make a weak attempt to not play the same thing
   * 
   * Returns a video loop instance or null;
   */
  getRandomVideoLoop() {
    let videoLoop = null;
    let videoTrackIndex = 0;
    for(let i = 0; i < MAX_RANDOM_ATTEMPTS; ++i) {
      videoTrackIndex = Math.floor(Math.random() * this.videoLoopList.length);

      if(this._prevVideo.indexOf(videoTrackIndex) < 0) {
        break;
      }
    }
    // update previous buffer
    this._prevVideo.pop();
    this._prevVideo.push(videoTrackIndex);

    videoLoop = this.videoLoopList[videoTrackIndex];

    return videoLoop;
  }

    /**
   * Make a weak attempt to not play the same thing
   * 
   * returns an audioLoop
   */
  getRandomAudioLoop() {
    let audioLoop = null;
    let audioLoopIndex = 0;
    for(let i = 0; i < MAX_RANDOM_ATTEMPTS; ++i) {
      audioLoopIndex = Math.floor(Math.random() * this.audioLoopList.length);

      if(this._prevAudio.indexOf(audioLoopIndex) < 0) {
        break;
      }
    }
    this.updatePrevBuffer(this._prevAudio, audioLoopIndex);

    audioLoop = this.audioLoopList[audioLoopIndex];
    return audioLoop;
  }

  /**
   * Maintain correct length and add new value to buffer holding prev values
   */
  updatePrevBuffer(buffer: number[], newVal: number) {
    if (buffer.length > 3) {
      buffer.shift();
    }
    buffer.push(newVal);
  }

  onVote(good: boolean) {
    /**
     * TODO: send vote here
     */
    console.log(`Vote: ${good}`);
  }

  /**
   * Helper method if just initializing a random video
   */
  initRandomVideo() {
    const videoLoop = this.getRandomVideoLoop();
    if (videoLoop) {
      this.videoService.url = videoLoop.url;
      this.videoService.initMedia().subscribe( didFinish => {
        this.videoService.play();
      });
    }
  }

  /**
   * Sets a random track number and starts download for both video and audio
   */
  setJumble() {
    const videoLoop  = this.getRandomVideoLoop();
    const audioLoop  = this.getRandomAudioLoop();

    if (videoLoop && audioLoop) {
        // set urls for both video and audio
      this.audioService.url = audioLoop.url;
      this.videoService.url = videoLoop.url;
      // start load, after audio finishes load video
      this.audioService.initMedia().subscribe( didFinish => {
        if (didFinish) {
          this.videoService.initMedia().subscribe( (didFinish) => {
              this.audioService.play();
              this.videoService.play();        
            }
          );
        }
      });
      this._jumbleInitiated = true;      
        
    } else {
      // error condition! invalid index lookup or something else
    }
  }

  setVolume(volume: number) {
    this.audioService.setVolume(volume);
  }

  toggleState() {
    switch(this._state) {
      case PlayerState.INIT:
        // set random track url and start load
        this.setJumble();
        // on load of a new track make sure vote is hidden
        break;
      case PlayerState.LOADING:
        break;
      case PlayerState.PAUSED:
        this.play();
        break;
      case PlayerState.PLAYING:
        // after first play, start vote timer
        this.pause();
        break;
      case PlayerState.ENDED:
        if (this._isJumble) {
          this.setJumble();          
        }
        break;
      default:
        break;
    }
  }
}
