import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmpbranchviewComponent } from './empbranchview.component';

describe('EmpbranchviewComponent', () => {
  let component: EmpbranchviewComponent;
  let fixture: ComponentFixture<EmpbranchviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmpbranchviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmpbranchviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
