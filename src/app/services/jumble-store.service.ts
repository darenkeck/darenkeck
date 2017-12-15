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
  video_url: string;
  audio_url: string;
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
   * This will return the jumble if it can be found or null
   */
  lookupJumbleWithUrls(audioUrl: string, videoUrl: string) {
    let jumble = null;

    for (const jKey in this._jumbleList$.value) {
      const j = this._jumbleList$.value[jKey]
      if (j.audio_url === audioUrl) {
        if (j.video_url === videoUrl) {
          jumble = j;
          break;
        }
      }
    }
    // if not found, just return a new one
    if (!jumble) {
      jumble = {
        audio_url: audioUrl,
        video_url: videoUrl,
        score: 0,
      }
    }

    return jumble;
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

  /**
   * Returns either a new jumble (without a key) or finds
   * the previous one and returns it
   */
  initJumble(audioUrl: string, videoUrl: string) {
    let jumble = this.lookupJumbleWithUrls(audioUrl, videoUrl);
  }

  // add a lookup by video and audio key
  // returns either the jumble or null if not found
  lookupJumble(jumbleVote: Jumble) {
    let jumble = this.lookupJumbleWithUrls(jumbleVote.audio_url, jumbleVote.video_url);

    return jumble;
  }

  // method to increment/decrement jumble combo
  updateJumble(jumble: Jumble) {
    // if we have a previous jumble, update score, otherwise create new jumble
    if ('$key' in jumble) {
      this.fb.updateItem(FB_JUMBLE_PATH, jumble.$key, jumble);
    } else {
      this.fb.createItem(FB_JUMBLE_PATH, jumble);
    }
  }
}
