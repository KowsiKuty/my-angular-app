import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EcfApprovalViewComponent } from './ecf-approval-view.component';

describe('EcfApprovalViewComponent', () => {
  let component: EcfApprovalViewComponent;
  let fixture: ComponentFixture<EcfApprovalViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EcfApprovalViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EcfApprovalViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
