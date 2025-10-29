import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsurancemodificationComponent } from './insurancemodification.component';

describe('InsurancemodificationComponent', () => {
  let component: InsurancemodificationComponent;
  let fixture: ComponentFixture<InsurancemodificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsurancemodificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsurancemodificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
