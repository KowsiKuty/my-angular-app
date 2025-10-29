import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IbaExpenseComponent } from './iba-expense.component';

describe('IbaExpenseComponent', () => {
  let component: IbaExpenseComponent;
  let fixture: ComponentFixture<IbaExpenseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IbaExpenseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IbaExpenseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
