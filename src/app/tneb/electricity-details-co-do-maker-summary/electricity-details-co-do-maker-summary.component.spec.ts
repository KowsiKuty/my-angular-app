import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricityDetailsCoDoMakerSummaryComponent } from './electricity-details-co-do-maker-summary.component';

describe('ElectricityDetailsCoDoMakerSummaryComponent', () => {
  let component: ElectricityDetailsCoDoMakerSummaryComponent;
  let fixture: ComponentFixture<ElectricityDetailsCoDoMakerSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectricityDetailsCoDoMakerSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricityDetailsCoDoMakerSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
