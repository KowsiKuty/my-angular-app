import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetMakerComponent } from './fleet-maker.component';

describe('FleetMakerComponent', () => {
  let component: FleetMakerComponent;
  let fixture: ComponentFixture<FleetMakerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetMakerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetMakerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
