import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EledetStatusSummaryComponent } from './eledet-status-summary.component';

describe('EledetStatusSummaryComponent', () => {
  let component: EledetStatusSummaryComponent;
  let fixture: ComponentFixture<EledetStatusSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EledetStatusSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EledetStatusSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
