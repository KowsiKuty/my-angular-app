import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApproverInvDetailViewComponent } from './approver-inv-detail-view.component';

describe('ApproverInvDetailViewComponent', () => {
  let component: ApproverInvDetailViewComponent;
  let fixture: ComponentFixture<ApproverInvDetailViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApproverInvDetailViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApproverInvDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
