import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleoverallComponent } from './scheduleoverall.component';

describe('ScheduleoverallComponent', () => {
  let component: ScheduleoverallComponent;
  let fixture: ComponentFixture<ScheduleoverallComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScheduleoverallComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScheduleoverallComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
