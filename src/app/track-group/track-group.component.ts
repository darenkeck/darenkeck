import { Component, EventEmitter, Input, Output } from '@angular/core';

import { Album, Track } from '../services/audio-store.service';

interface TrackItem {
  title: string;
  url: string;
}

@Component({
  selector: 'app-track-group',
  templateUrl: './track-group.component.html',
  styleUrls: ['./track-group.component.scss']
})
export class TrackGroupComponent {
  @Input() album: Album;
  @Input() currentTrack: Track;
  @Output() trackSelected = new EventEmitter<Track>();

  constructor() { }

  onTrackSelect(track: Track) {
    this.trackSelected.emit(track);
  }
}
