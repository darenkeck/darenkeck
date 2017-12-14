import { Component, EventEmitter, Input, Output, OnChanges } from '@angular/core';

import { Album, Track } from '../services/audio-store.service';

interface TrackItem {
  title: string;
  url: string;
}

@Component({
  selector: 'app-track-group',
  templateUrl: './track-group.component.html',
  styleUrls: ['./track-group.component.css']
})
export class TrackGroupComponent {
  @Input() album: Album;
  @Input() currentTrack: Track;
  @Output() trackSelected = new EventEmitter<Track>();

  constructor() { }

  ngOnChanges() {
    if (this.album) {
      console.log(this.album);
    }
  }

  onTrackSelect(track: Track) {
    this.trackSelected.emit(track);
  }
}
