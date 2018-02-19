import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TopJumblesComponent } from './top-jumbles.component';

describe('TopJumblesComponent', () => {
  let component: TopJumblesComponent;
  let fixture: ComponentFixture<TopJumblesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TopJumblesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TopJumblesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
