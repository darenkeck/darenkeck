import { TestBed, inject } from '@angular/core/testing';

import { AudioStoreService } from './audio-store.service';

describe('AudioStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AudioStoreService]
    });
  });

  it('should be created', inject([AudioStoreService], (service: AudioStoreService) => {
    expect(service).toBeTruthy();
  }));
});
