import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NonOwnedAssetApprovalSummaryComponent } from './non-owned-asset-approval-summary.component';

describe('NonOwnedAssetApprovalSummaryComponent', () => {
  let component: NonOwnedAssetApprovalSummaryComponent;
  let fixture: ComponentFixture<NonOwnedAssetApprovalSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NonOwnedAssetApprovalSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NonOwnedAssetApprovalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
