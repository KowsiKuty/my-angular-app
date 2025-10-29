import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LosLogSummaryComponent } from './los-log-summary.component';

describe('LosLogSummaryComponent', () => {
  let component: LosLogSummaryComponent;
  let fixture: ComponentFixture<LosLogSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LosLogSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LosLogSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
