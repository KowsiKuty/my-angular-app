import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricityDetailsCoDoApptovalSummaryComponent } from './electricity-details-co-do-apptoval-summary.component';

describe('ElectricityDetailsCoDoApptovalSummaryComponent', () => {
  let component: ElectricityDetailsCoDoApptovalSummaryComponent;
  let fixture: ComponentFixture<ElectricityDetailsCoDoApptovalSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectricityDetailsCoDoApptovalSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricityDetailsCoDoApptovalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
