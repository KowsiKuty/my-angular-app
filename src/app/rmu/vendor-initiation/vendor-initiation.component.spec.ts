import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorInitiationComponent } from './vendor-initiation.component';

describe('VendorInitiationComponent', () => {
  let component: VendorInitiationComponent;
  let fixture: ComponentFixture<VendorInitiationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendorInitiationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendorInitiationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
