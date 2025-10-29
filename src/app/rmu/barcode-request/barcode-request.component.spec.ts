import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BarcodeRequestComponent } from './barcode-request.component';

describe('BarcodeRequestComponent', () => {
  let component: BarcodeRequestComponent;
  let fixture: ComponentFixture<BarcodeRequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BarcodeRequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BarcodeRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
