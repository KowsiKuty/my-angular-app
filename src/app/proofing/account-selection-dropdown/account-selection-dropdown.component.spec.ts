import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountSelectionDropdownComponent } from './account-selection-dropdown.component';

describe('AccountSelectionDropdownComponent', () => {
  let component: AccountSelectionDropdownComponent;
  let fixture: ComponentFixture<AccountSelectionDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountSelectionDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountSelectionDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
