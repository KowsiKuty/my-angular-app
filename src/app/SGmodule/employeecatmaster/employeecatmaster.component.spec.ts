import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeecatmasterComponent } from './employeecatmaster.component';

describe('EmployeecatmasterComponent', () => {
  let component: EmployeecatmasterComponent;
  let fixture: ComponentFixture<EmployeecatmasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeecatmasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeecatmasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
