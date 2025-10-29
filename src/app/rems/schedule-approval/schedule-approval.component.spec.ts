import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleApprovalComponent } from './schedule-approval.component';

describe('ScheduleApprovalComponent', () => {
  let component: ScheduleApprovalComponent;
  let fixture: ComponentFixture<ScheduleApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
