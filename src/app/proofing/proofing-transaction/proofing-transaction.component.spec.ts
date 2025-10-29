import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProofingTransactionComponent } from './proofing-transaction.component';

describe('ProofingTransactionComponent', () => {
  let component: ProofingTransactionComponent;
  let fixture: ComponentFixture<ProofingTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProofingTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProofingTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
