import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiseOccupancyMappingFormComponent } from './premise-occupancy-mapping-form.component';

describe('PremiseOccupancyMappingFormComponent', () => {
  let component: PremiseOccupancyMappingFormComponent;
  let fixture: ComponentFixture<PremiseOccupancyMappingFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiseOccupancyMappingFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiseOccupancyMappingFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
