import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchrequestApproverComponent } from './branchrequest-approver.component';

describe('BranchrequestApproverComponent', () => {
  let component: BranchrequestApproverComponent;
  let fixture: ComponentFixture<BranchrequestApproverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchrequestApproverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchrequestApproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
