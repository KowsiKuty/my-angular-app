import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricityDetailSummaryComponent } from './electricity-detail-summary.component';

describe('ElectricityDetailSummaryComponent', () => {
  let component: ElectricityDetailSummaryComponent;
  let fixture: ComponentFixture<ElectricityDetailSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectricityDetailSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricityDetailSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
