import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchExpenseViewComponent } from './branch-expense-view.component';

describe('BranchExpenseViewComponent', () => {
  let component: BranchExpenseViewComponent;
  let fixture: ComponentFixture<BranchExpenseViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchExpenseViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchExpenseViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
