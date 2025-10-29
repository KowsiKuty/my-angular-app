import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AttendenceDetailsComponent } from './attendence-details.component';

describe('AttendenceDetailsComponent', () => {
  let component: AttendenceDetailsComponent;
  let fixture: ComponentFixture<AttendenceDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AttendenceDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AttendenceDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
