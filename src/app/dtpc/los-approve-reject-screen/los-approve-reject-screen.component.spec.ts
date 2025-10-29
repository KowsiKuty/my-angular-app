import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LosApproveRejectScreenComponent } from './los-approve-reject-screen.component';

describe('LosApproveRejectScreenComponent', () => {
  let component: LosApproveRejectScreenComponent;
  let fixture: ComponentFixture<LosApproveRejectScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LosApproveRejectScreenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LosApproveRejectScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
