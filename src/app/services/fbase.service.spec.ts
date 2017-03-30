/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FbaseService } from './fbase.service';

describe('FbaseService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FbaseService]
    });
  });

  it('should ...', inject([FbaseService], (service: FbaseService) => {
    expect(service).toBeTruthy();
  }));
});
