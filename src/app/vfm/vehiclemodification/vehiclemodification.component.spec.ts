import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VehiclemodificationComponent } from './vehiclemodification.component';

describe('VehiclemodificationComponent', () => {
  let component: VehiclemodificationComponent;
  let fixture: ComponentFixture<VehiclemodificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VehiclemodificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VehiclemodificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
