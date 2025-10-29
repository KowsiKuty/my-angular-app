import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchCertifyEditComponent } from './branch-certify-edit.component';

describe('BranchCertifyEditComponent', () => {
  let component: BranchCertifyEditComponent;
  let fixture: ComponentFixture<BranchCertifyEditComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchCertifyEditComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchCertifyEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
