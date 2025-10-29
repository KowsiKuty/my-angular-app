import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendormarkupComponent } from './vendormarkup.component';

describe('VendormarkupComponent', () => {
  let component: VendormarkupComponent;
  let fixture: ComponentFixture<VendormarkupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendormarkupComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendormarkupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
