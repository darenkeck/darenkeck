import { Component, EventEmitter, Input, Output } from '@angular/core';

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
  @Input()  imgUrl:         string;
  @Input()  groupName:      string;
  @Input()  trackList:      TrackItem[];
  @Output() trackSelected = new EventEmitter<string>();

  constructor() { }

  onTrackSelect(trackUrl: string) {
    this.trackSelected.emit(trackUrl);
  }
}
