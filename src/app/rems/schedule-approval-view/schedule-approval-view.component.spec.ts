import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleApprovalViewComponent } from './schedule-approval-view.component';

describe('ScheduleApprovalViewComponent', () => {
  let component: ScheduleApprovalViewComponent;
  let fixture: ComponentFixture<ScheduleApprovalViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleApprovalViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleApprovalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
