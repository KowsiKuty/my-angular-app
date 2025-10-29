import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeTaskComponent } from './employee-task.component';

describe('EmployeeTaskComponent', () => {
  let component: EmployeeTaskComponent;
  let fixture: ComponentFixture<EmployeeTaskComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeTaskComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeTaskComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
