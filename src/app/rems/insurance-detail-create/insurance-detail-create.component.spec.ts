import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceDetailCreateComponent } from './insurance-detail-create.component';

describe('InsuranceDetailCreateComponent', () => {
  let component: InsuranceDetailCreateComponent;
  let fixture: ComponentFixture<InsuranceDetailCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceDetailCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceDetailCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 