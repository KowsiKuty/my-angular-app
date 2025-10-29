import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LosBranchSummaryComponent } from './los-branch-summary.component';

describe('LosBranchSummaryComponent', () => {
  let component: LosBranchSummaryComponent;
  let fixture: ComponentFixture<LosBranchSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LosBranchSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LosBranchSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
