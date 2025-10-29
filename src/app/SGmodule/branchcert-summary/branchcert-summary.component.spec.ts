import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchcertSummaryComponent } from './branchcert-summary.component';

describe('BranchcertSummaryComponent', () => {
  let component: BranchcertSummaryComponent;
  let fixture: ComponentFixture<BranchcertSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchcertSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchcertSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
