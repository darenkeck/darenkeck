import { TestBed, inject } from '@angular/core/testing';

import { JumbleService } from './jumble.service';

describe('JumbleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JumbleService]
    });
  });

  it('should be created', inject([JumbleService], (service: JumbleService) => {
    expect(service).toBeTruthy();
  }));
});
