import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendancesummaryComponent } from './attendancesummary.component';

describe('AttendancesummaryComponent', () => {
  let component: AttendancesummaryComponent;
  let fixture: ComponentFixture<AttendancesummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendancesummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendancesummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
