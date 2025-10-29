import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupancyEditComponent } from './occupancy-edit.component';

describe('OccupancyEditComponent', () => {
  let component: OccupancyEditComponent;
  let fixture: ComponentFixture<OccupancyEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OccupancyEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OccupancyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
