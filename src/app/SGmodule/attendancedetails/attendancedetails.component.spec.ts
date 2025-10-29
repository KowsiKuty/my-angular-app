import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendancedetailsComponent } from './attendancedetails.component';

describe('AttendancedetailsComponent', () => {
  let component: AttendancedetailsComponent;
  let fixture: ComponentFixture<AttendancedetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendancedetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendancedetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
