import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManualScheduleComponent } from './manual-schedule.component';

describe('ManualScheduleComponent', () => {
  let component: ManualScheduleComponent;
  let fixture: ComponentFixture<ManualScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManualScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManualScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
