import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendancecreateComponent } from './attendancecreate.component';

describe('AttendancecreateComponent', () => {
  let component: AttendancecreateComponent;
  let fixture: ComponentFixture<AttendancecreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendancecreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendancecreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
