import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RepairAndMaintenanceEditComponent } from './repair-and-maintenance-edit.component';

describe('RepairAndMaintenanceEditComponent', () => {
  let component: RepairAndMaintenanceEditComponent;
  let fixture: ComponentFixture<RepairAndMaintenanceEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RepairAndMaintenanceEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RepairAndMaintenanceEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
