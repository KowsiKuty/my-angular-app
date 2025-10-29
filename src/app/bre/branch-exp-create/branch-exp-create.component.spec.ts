import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchExpCreateComponent } from './branch-exp-create.component';

describe('BranchExpCreateComponent', () => {
  let component: BranchExpCreateComponent;
  let fixture: ComponentFixture<BranchExpCreateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchExpCreateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchExpCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
