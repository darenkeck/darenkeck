import { TestBed, inject } from '@angular/core/testing';

import { JumbleStoreService } from './jumble-store.service';

describe('JumbleStoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JumbleStoreService]
    });
  });

  it('should be created', inject([JumbleStoreService], (service: JumbleStoreService) => {
    expect(service).toBeTruthy();
  }));
});
