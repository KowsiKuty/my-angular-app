import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparePaymentComponent } from './prepare-payment.component';

describe('PreparePaymentComponent', () => {
  let component: PreparePaymentComponent;
  let fixture: ComponentFixture<PreparePaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreparePaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreparePaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
