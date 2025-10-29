import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VendordestroyComponent } from './vendordestroy.component';

describe('VendordestroyComponent', () => {
  let component: VendordestroyComponent;
  let fixture: ComponentFixture<VendordestroyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VendordestroyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VendordestroyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
