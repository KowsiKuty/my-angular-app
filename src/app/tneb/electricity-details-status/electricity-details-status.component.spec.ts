import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectricityDetailsStatusComponent } from './electricity-details-status.component';

describe('ElectricityDetailsStatusComponent', () => {
  let component: ElectricityDetailsStatusComponent;
  let fixture: ComponentFixture<ElectricityDetailsStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElectricityDetailsStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElectricityDetailsStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
