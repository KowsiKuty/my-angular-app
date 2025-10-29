import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RentScheduleLeasedComponent } from './rent-schedule-leased.component';

describe('RentScheduleLeasedComponent', () => {
  let component: RentScheduleLeasedComponent;
  let fixture: ComponentFixture<RentScheduleLeasedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RentScheduleLeasedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RentScheduleLeasedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
