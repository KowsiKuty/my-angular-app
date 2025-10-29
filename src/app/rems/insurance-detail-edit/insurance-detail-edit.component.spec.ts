import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InsuranceDetailEditComponent } from './insurance-detail-edit.component';

describe('InsuranceDetailEditComponent', () => {
  let component: InsuranceDetailEditComponent;
  let fixture: ComponentFixture<InsuranceDetailEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InsuranceDetailEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InsuranceDetailEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 