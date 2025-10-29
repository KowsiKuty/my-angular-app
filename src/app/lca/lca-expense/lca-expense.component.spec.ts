import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LcaExpenseComponent } from './lca-expense.component';

describe('LcaExpenseComponent', () => {
  let component: LcaExpenseComponent;
  let fixture: ComponentFixture<LcaExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LcaExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LcaExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
