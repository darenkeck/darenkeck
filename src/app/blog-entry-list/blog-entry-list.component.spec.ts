/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { BlogEntryListComponent } from './blog-entry-list.component';

describe('BlogEntryListComponent', () => {
  let component: BlogEntryListComponent;
  let fixture: ComponentFixture<BlogEntryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BlogEntryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BlogEntryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
