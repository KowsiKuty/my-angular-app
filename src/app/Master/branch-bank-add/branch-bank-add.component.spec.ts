import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchBankAddComponent } from './branch-bank-add.component';

describe('BranchBankAddComponent', () => {
  let component: BranchBankAddComponent;
  let fixture: ComponentFixture<BranchBankAddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchBankAddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchBankAddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
