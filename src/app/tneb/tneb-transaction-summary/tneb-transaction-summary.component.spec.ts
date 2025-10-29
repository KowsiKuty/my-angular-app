import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TnebTransactionSummaryComponent } from './tneb-transaction-summary.component';

describe('TnebTransactionSummaryComponent', () => {
  let component: TnebTransactionSummaryComponent;
  let fixture: ComponentFixture<TnebTransactionSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TnebTransactionSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TnebTransactionSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
