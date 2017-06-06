import { Component, OnInit, ViewChild } from '@angular/core';

import { VideoService } from 'app/services/video.service';

@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements OnInit {
  @ViewChild('videoPlayer') videoplayer: any;
  constructor(private videoService: VideoService) {
    
  }

  ngOnInit() {
  }

}
