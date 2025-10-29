import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TaxRateComponent } from './tax-rate.component';

describe('TaxRateComponent', () => {
  let component: TaxRateComponent;
  let fixture: ComponentFixture<TaxRateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TaxRateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TaxRateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
