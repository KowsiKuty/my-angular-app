import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElecDetailsTranSummaryComponent } from './elec-details-tran-summary.component';

describe('ElecDetailsTranSummaryComponent', () => {
  let component: ElecDetailsTranSummaryComponent;
  let fixture: ComponentFixture<ElecDetailsTranSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElecDetailsTranSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElecDetailsTranSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
