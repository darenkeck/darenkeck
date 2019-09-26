import { Injectable } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { FbaseService } from 'app/services/fbase.service';
import { AudioStoreService,
         Track } from 'app/services/audio-store.service';
/**
 * This service is responsible for fetching reads from video, reads/writes 
 * for jumbles, providing the current list
 */

 // score can be a negative or positive
export interface Jumble {
  score: number;
  total_votes: number;
  video_url: string;
  audio_url: string;
  key?: string;
}

export interface VideoLoop {
  url: string;
  key: string;
}

export interface AudioLoop {
  url: string;
  key: string;
}

export type AudioSource = AudioLoop | Track;

const FB_JUMBLE_PATH = 'jumble';
const FB_VIDEO_LIST  = 'video';
const FB_AUDIO_LOOPS = 'audio_loop';
const FB_VIDEO_LOOPS = 'video_loop';
const TOP_JUMBLE_LENGTH = 40;

@Injectable()
export class JumbleStoreService {
  _jumbleList$: BehaviorSubject<Jumble[]>;
  _audioLoopList$: BehaviorSubject<AudioLoop[]>;
  _audioSourceList$: BehaviorSubject<AudioSource[]>;
  _videoLoopList$: BehaviorSubject<VideoLoop[]>;
  highestTotalVotes = 1;

  constructor(private fb: FbaseService,
              private audioStoreService: AudioStoreService ) {
    this._jumbleList$ = new BehaviorSubject<Jumble[]>([]);
    this._videoLoopList$ = new BehaviorSubject<VideoLoop[]>([]);
    this._audioLoopList$ = new BehaviorSubject<AudioLoop[]>([]);
    this._audioSourceList$ = new BehaviorSubject<AudioSource[]>([]);

    this.fb.fetchTopJumbleList(FB_JUMBLE_PATH, TOP_JUMBLE_LENGTH).subscribe( (jumbleList: Jumble[]) => {
      this._jumbleList$.next(jumbleList);
      // set highest total votes
      jumbleList.map(jumble => {
        if (jumble.total_votes > this.highestTotalVotes) {
          this.highestTotalVotes = jumble.total_votes;
        }
      })
    });

    this.fb.fetchFBList(FB_VIDEO_LOOPS).subscribe( (videoList: VideoLoop[]) => {
      this._videoLoopList$.next(videoList);
    });

    this.fb.fetchFBList(FB_AUDIO_LOOPS).subscribe( (audioLoopList: AudioLoop[]) => {
      this._audioLoopList$.next(audioLoopList)
    });

    combineLatest(
      this._audioLoopList$,
      this.audioStoreService.trackList
    ).subscribe( ([audioLoopList, trackList]) => {
      this._audioSourceList$.next([...audioLoopList, ...trackList])
    });
  }

  getJumbleUrl(audioUrl: string, videoUrl: string) {
    const _audioUrl = encodeURIComponent(audioUrl).replace('.', '_');
    const _videoUrl = encodeURIComponent(videoUrl).replace('.', '_');
    return `${_audioUrl}+${_videoUrl}`;
  }

  /**
   * Looks up a jumble in local memory (the top jumble list) using the
   * audio and video urls of the jumble.
   */
    lookupLocalJumbleWithUrl(audioUrl: string, videoUrl: string): Jumble {
      let jumble = null;

      for (const jKey in this._jumbleList$.value) {
        const j = this._jumbleList$.value[jKey]
        if (j.audio_url === audioUrl && j.video_url === videoUrl) {
          jumble = j;
          break;
        }
      }

      return jumble;
    }

  /**
   * Two URLs is enough to uniquely identify a jumble
   * 
   * This will return the jumble if it can be found or null
   */
  lookupJumbleWithUrls(audioUrl: string, videoUrl: string) {
    const jumbleUrlID = this.getJumbleUrl(audioUrl, videoUrl);
    return this.fb.fetchItem(`${FB_JUMBLE_PATH}/${jumbleUrlID}`);
  }

  get audioLoopList() {
    return this._audioLoopList$.asObservable();
  }

  get audioSourceList() {
    return this._audioSourceList$.asObservable();
  }

  get jumbleList() {
    return this._jumbleList$.asObservable();
  }

  /**
   * Algorithm for generating a jumble score
   * 
   * 80% of weight: the upvote percentage
   * 20%: the number of votes
   */
  jumbleScore(jumble: Jumble) {
    const ratio = jumble.score / jumble.total_votes;
    const score_total_ratio = jumble.total_votes / this.highestTotalVotes;
    const score = (0.8 * ratio) + (0.2 * score_total_ratio);

    return score;
  }

  /**
   * Return the top ten jumbles
   */
  get topJumbleList() {
    return this.jumbleList.pipe(
      map( jumbleList => {
        // sort and cut the list to the correct length
        return jumbleList
          .sort((j1, j2) =>  this.jumbleScore(j1) > this.jumbleScore(j2) ? -1 : 1)
          .slice(0, TOP_JUMBLE_LENGTH)
      })
    )
  }

  get videoLoopList() {
    return this._videoLoopList$.asObservable();
  }

  createJumble(jumble: Jumble) {
    const url = this.getJumbleUrl(jumble.audio_url, jumble.video_url);

    // post the item
    this.fb.createItemAtURL<Jumble>(`${FB_JUMBLE_PATH}/${url}`, jumble);
  }

  // add a lookup by video and audio key
  // returns either the jumble or null if not found
  lookupJumble(audioUrl, videoUrl) {
    return this.lookupJumbleWithUrls(audioUrl, videoUrl);
  }

  // method to increment/decrement jumble combo
  updateJumble(jumble: Jumble) {
    // if we have a previous jumble, update score, otherwise create new jumble
    if ('key' in jumble) {
      this.fb.updateItem(FB_JUMBLE_PATH, jumble.key, jumble);
    } else {
      this.fb.createItem(FB_JUMBLE_PATH, jumble);
    }
  }
}
