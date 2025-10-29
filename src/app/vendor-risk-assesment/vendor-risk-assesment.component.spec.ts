import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorRiskAssesmentComponent } from './vendor-risk-assesment.component';

describe('VendorRiskAssesmentComponent', () => {
  let component: VendorRiskAssesmentComponent;
  let fixture: ComponentFixture<VendorRiskAssesmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorRiskAssesmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorRiskAssesmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
