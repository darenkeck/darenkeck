import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/observable';
import { BehaviorSubject } from 'rxjs/behaviorsubject';

import { FbaseService } from 'app/services/fbase.service';
/**
 * This service is responsible for fetching reads from video, reads/writes 
 * for jumbles, providing the current list
 */

 // score can be a negative or positive
export interface Jumble {
  score: number;
  video_loop_key: string;
  audio_loop_key: string;
  $key?: string;
}

export interface VideoLoop {
  url: string;
  $key: string;
}

export interface AudioLoop {
  url: string;
  $key: string;
}

const FB_JUMBLE_PATH = 'jumble';
const FB_VIDEO_LIST  = 'video';
const FB_AUDIO_LOOPS = 'audio_loop';
const FB_VIDEO_LOOPS = 'video_loop';
const TOP_JUMBLE_LENGTH = 10;

@Injectable()
export class JumbleStoreService {
  _jumbleList$: BehaviorSubject<Jumble[]>;
  _audioLoopList$: BehaviorSubject<AudioLoop[]>;
  _videoLoopList$: BehaviorSubject<VideoLoop[]>;

  constructor(private fb: FbaseService) {
    this._jumbleList$ = new BehaviorSubject<Jumble[]>([]);
    this._videoLoopList$ = new BehaviorSubject<VideoLoop[]>([]);
    this._audioLoopList$ = new BehaviorSubject<AudioLoop[]>([]);

    this.fb.fetchFBList(FB_JUMBLE_PATH).subscribe( (jumbleList: Jumble[]) => {
      this._jumbleList$.next(jumbleList);
    });

    this.fb.fetchFBList(FB_VIDEO_LOOPS).subscribe( (videoList: VideoLoop[]) => {
      this._videoLoopList$.next(videoList);
    });

    this.fb.fetchFBList(FB_AUDIO_LOOPS).subscribe( (audioLoopList: AudioLoop[]) => {
      this._audioLoopList$.next(audioLoopList)
    });
  }

  getNewKey() {
    const highestJumble = this._jumbleList$.value.reduce( (curJ, acc) => {
      return (curJ.$key > acc.$key) ? curJ : acc;
    }, null)

   // increment by 1 to go one past the greatest value
   return highestJumble.$key + 1;
  }

  /**
   * Two URLs is enough to uniquely identify a jumble
   * 
   * This will return the jumble if it can be found
   */
  getJumbleWithUrls(audioUrl: string, videoUrl: string) {
    const audioLoop = this._audioLoopList$.value.find(aLoop => aLoop.url === audioLoop);
    const videoLoop = this._videoLoopList$.value.find(vLoop => vLoop.url === videoUrl);
    let foundJumble = null;
    if (audioLoop && videoLoop) {
      const potentialJumble = {
        audio_loop_key: audioLoop.$key,
        video_loop_key: videoLoop.$key,
        score: 0
      }
      foundJumble = this.lookupJumble(potentialJumble);   
    }

    return foundJumble;
  }

  get audioLoopList() {
    return this._audioLoopList$.asObservable();
  }

  get jumbleList() {
    return this._jumbleList$.asObservable();
  }

    /**
     * Return the top ten jumbles
     */
  get topJumbleList() {
    return this.jumbleList.map( jumbleList => {
      return jumbleList.sort( (j1, j2) => {
        // if j1 has a higher score, give it a lower index so it is first
        return (j1.score > j2.score) ? -1 : 1;
      }).slice(0, TOP_JUMBLE_LENGTH);
    });
  }

  get videoLoopList() {
    return this._videoLoopList$.asObservable();
  }

  // add a lookup by video and audio key
  // returns either the jumble or null if not found
  lookupJumble(jumbleVote: Jumble) {
    let jumble = null;

    this._jumbleList$.value.map(j => {
      if (j.audio_loop_key === jumbleVote.audio_loop_key &&
          j.video_loop_key === jumbleVote.video_loop_key) {
            jumble = j;
          }
    });

    return jumble;
  }

  // method to increment/decrement jumble combo
  updateJumble(jumbleVote: Jumble) {
    const foundJumble = this.lookupJumble(jumbleVote);
    // if we have a previous jumble, update score, otherwise create new jumble
    if (foundJumble) {
      foundJumble.score += jumbleVote.score;
      this.fb.updateItem(FB_JUMBLE_PATH, foundJumble.$key, foundJumble);
    } else {
      this.fb.createItem(FB_JUMBLE_PATH, jumbleVote);
    }
  }
}
