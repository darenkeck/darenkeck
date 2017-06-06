import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { PlayerState } from 'app/services/media-player.service';

export class VideoController {
    player: HTMLMediaElement;
    _url: string;
    _state: BehaviorSubject<PlayerState>;

    constructor(private htmlElement: HTMLMediaElement) {
        this.player = htmlElement;
        this.player.onloadstart = this.onLoadStart.bind(this);
        this.player.oncanplay   = this.onCanPlay.bind(this);
        this.player.onended     = this.onEnded.bind(this);
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
    }
    }

    onEnded(ev: Event) {
    this._state.next(PlayerState.ENDED);
    }

    initMedia() {
    this.player.load();
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

    /**
     * Given a previous media player state, move to the next logical one
     */
    toggleState() {
    switch(this._state.value) {
        case PlayerState.INIT:
        // set random track url and start load
        this.initMedia();
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
    // -------- end generic methods -----------
    get url() {
        return this._url;
    }

    set url(url: string) {
        this._url = url;
    }
}
