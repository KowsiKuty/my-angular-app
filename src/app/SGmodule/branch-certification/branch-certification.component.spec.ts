import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BranchCertificationComponent } from './branch-certification.component';

describe('BranchCertificationComponent', () => {
  let component: BranchCertificationComponent;
  let fixture: ComponentFixture<BranchCertificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BranchCertificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BranchCertificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
