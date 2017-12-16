import { Injectable } from '@angular/core';
import { Http }       from '@angular/http';

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
         Jumble,
         VideoLoop }    from 'app/services/jumble-store.service';
import { VideoService } from 'app/services/video.service';
import { PlayerState }  from 'app/services/media-player.service';

import { VideoController } from 'app/classes/video-controller';

const MAX_PREVBUFFER_LENGTH = 5;
const MAX_RANDOM_ATTEMPTS = 3;
const BASE_VIDEO_URL = 'assets/video/loop';
const BASE_AUDIO_URL = 'assets/audio/loop';
const CORS_PROXY_URL = 'https://cors-anywhere.herokuapp.com/'
const CAPTCHA_VERIFY_URL = 'https://us-central1-darenkeck-adb27.cloudfunctions.net/checkRecaptcha'
const VOTE_TIMER_LENGTH = 5; // in seconds

// This class is designed to coordinate the video and audio player
// and help load random tracks for each
// This contains knowledge of how to interact with the 'loop' video and audio tracks
// This manages the state between both video and audio player
@Injectable()
export class JumbleService {
  state: Observable<PlayerState>;
  _state: PlayerState;
  _randomJumbleInitiated: boolean;
  _isRandomJumble: BehaviorSubject<boolean>;
  isJumble: Observable<boolean>;
  _allowVote: BehaviorSubject<boolean>;
  audioLoopList: AudioLoop[] = [];
  videoLoopList: VideoLoop[] = [];
  topJumbleList: Jumble[];
  voteTimer: number;  

  // buffers to attempt to not play the same thing
  _prevGoodJumble: number[] = [];
  _prevVideo: number[] = [];
  _prevAudio: number[] = [];
  _voteTimer: number;

  constructor(private audioService: AudioService,
              private fb: FbaseService,
              private http: Http,
              private jumbleStoreService: JumbleStoreService,
              private videoService: VideoService) {
    // only emit event when a _isJumble event is emitted
    this._isRandomJumble = new BehaviorSubject(false);
    this._allowVote = new BehaviorSubject(false);
    // set up how PlayerState is generated from audio and video service
    this.state = combineLatest(
      this.audioService.state,
      this.videoService.state,
      (aState, vState) => {
        let state = (aState <= vState) ? aState : vState;
        // audio state is more important and takes precedence in a few situations
        // on audio initialization, see if the _jumbleInitiated flag is set
        if (aState === PlayerState.LOADING) {
          this._isRandomJumble.next(this._randomJumbleInitiated);
          this._randomJumbleInitiated = false;
          this._allowVote.next(false);          
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
    this.isJumble = this._isRandomJumble.asObservable().withLatestFrom(
      this.state,
      (isJumble, state) => isJumble
    );

    // fetch audioLoopList and videoLoopList
    this.jumbleStoreService.audioLoopList.subscribe( 
      audioLoopList => this.audioLoopList = audioLoopList
    );
    this.jumbleStoreService.videoLoopList.subscribe(
      videoLoopList => this.videoLoopList = videoLoopList
    );

    // keep a list of the top jumbles
    this.jumbleStoreService.topJumbleList.subscribe(
      topList => this.topJumbleList = topList
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

  /** attempts to avoid duplicate selections
   * on random indexs. You have to provide the cached
   * list of previous selections
   */
  avoidDupRandom(length: number, prevIdxBuffer: number[]): number {
    let idx = null;

    for(let i = 0; i < MAX_RANDOM_ATTEMPTS; ++i) {
      idx = Math.floor(Math.random() * length);

      if (prevIdxBuffer.indexOf(idx) < 0) {
        break;
      }
    }

    prevIdxBuffer.push(idx);
    // clean up prev buffer
    while (prevIdxBuffer.length > MAX_PREVBUFFER_LENGTH) {
      prevIdxBuffer.shift();
    }

    return idx;
  }

  /**
   * Make a weak attempt to not play the same thing
   * 
   * Returns a video loop instance or null;
   */
  getRandomVideoLoop() {
    let videoLoop = null;
    let videoLoopIndex = this.avoidDupRandom(this.videoLoopList.length, this._prevVideo);
    videoLoop = this.videoLoopList[videoLoopIndex];

    return videoLoop;
  }

    /**
   * Make a weak attempt to not play the same thing
   * 
   * returns an audioLoop
   */
  getRandomAudioLoop() {
    let audioLoop = null;
    let audioLoopIndex = this.avoidDupRandom(this.audioLoopList.length, this._prevAudio);
    audioLoop = this.audioLoopList[audioLoopIndex];

    return audioLoop;
  }

  onVote(good: boolean) {
    if (this._allowVote.value) {
      const audioUrl = this.audioService.url;
      const videoUrl = this.videoService.url;
      // We really should have a url if we are allowing votes... but just in case
      if (audioUrl && videoUrl) {
        const currentJumble = this.jumbleStoreService.initJumble(
          audioUrl,
          videoUrl
        );
        currentJumble.score += (good) ? 1 : -1;
        this.jumbleStoreService.updateJumble(currentJumble);
        
        // this gets set to true when setJumble is called
        this._allowVote.next(false);
      }
    }
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
   * Selects from the top ten jumble list
   */
  getGoodJumble() {
    const length = this.topJumbleList.length;
    const index  = this.avoidDupRandom(this.topJumbleList.length, this._prevGoodJumble);
    
    return this.topJumbleList[index];
  }

  /**
   * Gives 1 in 3 odds of picking one of the top 10 jumbles
   */
  pickGoodJumble() {
    const val = Math.floor(Math.random() * 3);

    return val < 1;
  }

  /**
   * Sets a random track number and starts download for both video and audio
   */
  setRandomJumble() {
    let videoLoop = null;
    let audioLoop = null;

    if (this.pickGoodJumble()) {
      const jumble = this.getGoodJumble();
      this.setJumble(jumble);
    } else {
      videoLoop  = this.getRandomVideoLoop();
      audioLoop  = this.getRandomAudioLoop();
      this._setJumble(audioLoop.url, videoLoop.url);      
    }
  }

  setJumble(jumble: Jumble) {
    this._setJumble(jumble.audio_url, jumble.video_url);
  }

  /**
   * Starts a jumble using a audioLoop and videoLoop
   */
  _setJumble(audioUrl: string, videoUrl: string) {
    if (videoUrl && audioUrl) {
      // set urls for both video and audio
    this.audioService.url = audioUrl;
    this.videoService.url = videoUrl;
    // start load, after audio finishes load video
    this.audioService.initMedia().subscribe( didFinish => {
      if (didFinish) {
        this.videoService.initMedia().subscribe( (didFinish) => {
            this.audioService.play();
            this.videoService.play();    
            this._randomJumbleInitiated = true;            
            this.startVoteTimer();    
            }
          );
        }
      });
    } else {
      // error condition! invalid index lookup or something else
    }
  }

  get allowVote() {
    return this._allowVote.asObservable();
  }

  startVoteTimer() {
    // make sure vote timer is restarted
    if (this.voteTimer) {
      window.clearTimeout(this.voteTimer);
      this.voteTimer = null;
    }
    if (!this.voteTimer) {
      this.voteTimer = window.setTimeout(() => {
        this._allowVote.next(true);          
        this.voteTimer  = null;
      }, VOTE_TIMER_LENGTH  * 1000); // in milliseconds
    }
  }

  /**
   * We do not bother looking for the a previous jumble as it may or may not exist
   * 
   * The jumble store deals with updating or creating a new instance
   */
  initJumble(audioLoop: AudioLoop, videoLoop: VideoLoop) {
    return {
      audio_loop_key: audioLoop.$key,
      video_loop_key: videoLoop.$key,
      score: 0 
    }
  }

  setVolume(volume: number) {
    this.audioService.setVolume(volume);
  }

  toggleState() {
    switch(this._state) {
      case PlayerState.INIT:
        // set random track url and start load
        this.setRandomJumble();
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
        if (this._isRandomJumble) {
          this.setRandomJumble();          
        }
        break;
      default:
        break;
    }
  }

  /**
   * 
   * @param token: the captcha token
   */
  verifyCaptcha(token): Observable<boolean> {
    const query = '?response=' + token;
    const captcha_url = CORS_PROXY_URL + CAPTCHA_VERIFY_URL + query;
    return this.http.post(captcha_url, event)
      .map((response: any) => (response._body === 'Ok'));//.subscribe( resp => console.log(resp));
  }
}
