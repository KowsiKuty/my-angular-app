import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrsTransactionComponent } from './frs-transaction.component';

describe('FrsTransactionComponent', () => {
  let component: FrsTransactionComponent;
  let fixture: ComponentFixture<FrsTransactionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrsTransactionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrsTransactionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
