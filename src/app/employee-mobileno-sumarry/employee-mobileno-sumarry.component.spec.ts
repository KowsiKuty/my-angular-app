import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmployeeMobilenoSumarryComponent } from './employee-mobileno-sumarry.component';

describe('EmployeeMobilenoSumarryComponent', () => {
  let component: EmployeeMobilenoSumarryComponent;
  let fixture: ComponentFixture<EmployeeMobilenoSumarryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmployeeMobilenoSumarryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmployeeMobilenoSumarryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
