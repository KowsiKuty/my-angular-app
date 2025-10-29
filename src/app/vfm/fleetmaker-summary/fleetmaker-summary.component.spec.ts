import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetmakerSummaryComponent } from './fleetmaker-summary.component';

describe('FleetmakerSummaryComponent', () => {
  let component: FleetmakerSummaryComponent;
  let fixture: ComponentFixture<FleetmakerSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetmakerSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetmakerSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
