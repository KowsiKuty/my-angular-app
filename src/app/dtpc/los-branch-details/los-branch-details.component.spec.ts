import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LosBranchDetailsComponent } from './los-branch-details.component';

describe('LosBranchDetailsComponent', () => {
  let component: LosBranchDetailsComponent;
  let fixture: ComponentFixture<LosBranchDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LosBranchDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LosBranchDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
