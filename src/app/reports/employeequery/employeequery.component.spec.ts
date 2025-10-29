import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeequeryComponent } from './employeequery.component';

describe('EmployeequeryComponent', () => {
  let component: EmployeequeryComponent;
  let fixture: ComponentFixture<EmployeequeryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeequeryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeequeryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
