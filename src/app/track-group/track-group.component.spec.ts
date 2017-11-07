import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrackGroupComponent } from './track-group.component';

describe('TrackGroupComponent', () => {
  let component: TrackGroupComponent;
  let fixture: ComponentFixture<TrackGroupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrackGroupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrackGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
