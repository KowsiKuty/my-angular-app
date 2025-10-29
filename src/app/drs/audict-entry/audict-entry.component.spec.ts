import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudictEntryComponent } from './audict-entry.component';

describe('AudictEntryComponent', () => {
  let component: AudictEntryComponent;
  let fixture: ComponentFixture<AudictEntryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudictEntryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudictEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
