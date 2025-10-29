import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrencyFormatComponent } from './currency-format.component';

describe('CurrencyFormatComponent', () => {
  let component: CurrencyFormatComponent;
  let fixture: ComponentFixture<CurrencyFormatComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CurrencyFormatComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CurrencyFormatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
