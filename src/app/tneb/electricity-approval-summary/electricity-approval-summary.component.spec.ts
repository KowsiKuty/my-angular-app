import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricityApprovalSummaryComponent } from './electricity-approval-summary.component';

describe('ElectricityApprovalSummaryComponent', () => {
  let component: ElectricityApprovalSummaryComponent;
  let fixture: ComponentFixture<ElectricityApprovalSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectricityApprovalSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricityApprovalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
