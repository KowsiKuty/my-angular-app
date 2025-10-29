import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JwApprovalviewComponent } from './jw-approvalview.component';

describe('JwApprovalviewComponent', () => {
  let component: JwApprovalviewComponent;
  let fixture: ComponentFixture<JwApprovalviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JwApprovalviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JwApprovalviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
