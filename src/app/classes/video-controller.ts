import { ElementRef }       from '@angular/core';

import { BehaviorSubject }  from 'rxjs/behaviorsubject';
import { PlayerState }      from 'app/services/media-player.service';
import { Subject }          from 'rxjs/Subject';
import 'rxjs/add/operator/take';

export class VideoController {
    static vcID = 0;

    player: HTMLVideoElement;
    mp4:    string = null; // setting to null helps with template parsing prior to url being set
    webm:   string = null; // setting to null helps with template parsing prior to url being set
    _url:   string;
    _state: BehaviorSubject<PlayerState>;
    _id:    number;
    _loadFinished: Subject<boolean>;

    static getID() {
        return VideoController.vcID += 1;
    }

    constructor(private elementRef: ElementRef) {
        this._id                = VideoController.getID();
        this._loadFinished      = new Subject();
        this.player             = elementRef.nativeElement;
        this.player.onloadstart = this.onLoadStart.bind(this);
        this.player.oncanplay   = this.onCanPlay.bind(this);
        this.player.onended     = this.onEnded.bind(this);
        this._state = new BehaviorSubject<PlayerState>(PlayerState.INIT);
        this.player.style.zIndex = "-100";
    }

    // -------- start generic methods -----------
    // Event Handlers
    onLoadStart(ev: Event) {
        this._state.next(PlayerState.LOADING);
    }

    onCanPlay(ev: Event) {
        // only if previous event is loading fire this event
        if(this._state.value === PlayerState.LOADING) {
            this._state.next(PlayerState.PAUSED);
            this._loadFinished.next(true);
        }
    }

    onEnded(ev: Event) {
        this._state.next(PlayerState.ENDED);
    }

    initMedia() {
        this.player.load();
        // return a one shot observable
        return this._loadFinished.asObservable().take(1);
    }


    play() {
        // a paused player means a 'play' is possible
        if (this._state.value === PlayerState.PAUSED 
            || this._state.value === PlayerState.ENDED) {
            this.player.play();
            this._state.next(PlayerState.PLAYING);
        }
    }

    pause() {
    if (this._state.value === PlayerState.PLAYING
        || this._state.value === PlayerState.ENDED) {
        this.player.pause();
        this._state.next(PlayerState.PAUSED);
    }
    }

    get state() {
        return this._state.asObservable();
    }

    get id() {
        return this._id;
    }

    /**
     * Given a previous media player state, move to the next logical one
     */
    toggleState() {
    switch(this._state.value) {
        case PlayerState.INIT:
            // set random track url and start load
            break;
        case PlayerState.LOADING:
            this.initMedia();
            break;
        case PlayerState.PAUSED:
            this.play();
            break;
        case PlayerState.PLAYING:
            this.pause();
            break;
        case PlayerState.ENDED:
            this.initMedia();
            break;
        default:
            break;
        }
    }
    // -------- end generic methods -----------
    get url() {
        return this._url;
    }

    set url(url: string) {
        if (this.player) {
            this._url = url;
            this.mp4  = `${url}.mp4`;
            this.webm = `${url}.webm`; 
        } else {
            throw Error('Video player undefined');
        }
    }
}
