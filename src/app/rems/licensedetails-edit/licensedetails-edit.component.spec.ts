import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LicensedetailsEditComponent } from './licensedetails-edit.component';

describe('LicensedetailsEditComponent', () => {
  let component: LicensedetailsEditComponent;
  let fixture: ComponentFixture<LicensedetailsEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LicensedetailsEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LicensedetailsEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
 