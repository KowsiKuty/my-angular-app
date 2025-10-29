import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupancyccbsComponent } from './occupancyccbs.component';

describe('OccupancyccbsComponent', () => {
  let component: OccupancyccbsComponent;
  let fixture: ComponentFixture<OccupancyccbsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccupancyccbsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OccupancyccbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
