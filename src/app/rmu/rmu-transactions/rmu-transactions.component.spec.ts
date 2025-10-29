import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RmuTransactionsComponent } from './rmu-transactions.component';

describe('RmuTransactionsComponent', () => {
  let component: RmuTransactionsComponent;
  let fixture: ComponentFixture<RmuTransactionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RmuTransactionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RmuTransactionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
