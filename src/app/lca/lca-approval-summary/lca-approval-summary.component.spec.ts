import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcaApprovalSummaryComponent } from './lca-approval-summary.component';

describe('LcaApprovalSummaryComponent', () => {
  let component: LcaApprovalSummaryComponent;
  let fixture: ComponentFixture<LcaApprovalSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcaApprovalSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcaApprovalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
