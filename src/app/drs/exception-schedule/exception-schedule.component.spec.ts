import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExceptionScheduleComponent } from './exception-schedule.component';

describe('ExceptionScheduleComponent', () => {
  let component: ExceptionScheduleComponent;
  let fixture: ComponentFixture<ExceptionScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExceptionScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExceptionScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
