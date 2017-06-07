import { Component, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';

import { VideoController } from 'app/classes/video-controller';
import { VideoService } from 'app/services/video.service';


@Component({
  selector: 'app-video-player',
  templateUrl: './video-player.component.html',
  styleUrls: ['./video-player.component.css']
})
export class VideoPlayerComponent implements AfterViewInit, OnDestroy {
  @ViewChild('videoPlayer') videoElement: any;
  videoController: VideoController;

  constructor(private videoService: VideoService) {

  }

  ngAfterViewInit() {
    this.videoController = this.videoService.createVideoController(this.videoElement);
  }

  ngOnDestroy() {
    this.videoService.removeVideoController(this.videoController);
  }
}
