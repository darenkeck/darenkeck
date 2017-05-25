/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { MediaPlayerService } from './media-player.service';

describe('MediaPlayerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MediaPlayerService]
    });
  });

  it('should ...', inject([MediaPlayerService], (service: MediaPlayerService) => {
    expect(service).toBeTruthy();
  }));
});
