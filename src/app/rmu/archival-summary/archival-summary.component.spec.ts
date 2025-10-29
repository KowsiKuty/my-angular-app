import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivalSummaryComponent } from './archival-summary.component';

describe('ArchivalSummaryComponent', () => {
  let component: ArchivalSummaryComponent;
  let fixture: ComponentFixture<ArchivalSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArchivalSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArchivalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
