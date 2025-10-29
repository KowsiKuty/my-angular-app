import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTaskEditComponent } from './employee-task-edit.component';

describe('EmployeeTaskEditComponent', () => {
  let component: EmployeeTaskEditComponent;
  let fixture: ComponentFixture<EmployeeTaskEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeTaskEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTaskEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
