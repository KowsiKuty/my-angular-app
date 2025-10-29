import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairAndMaintenanceCreateComponent } from './repair-and-maintenance-create.component';

describe('RepairAndMaintenanceCreateComponent', () => {
  let component: RepairAndMaintenanceCreateComponent;
  let fixture: ComponentFixture<RepairAndMaintenanceCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairAndMaintenanceCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairAndMaintenanceCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
