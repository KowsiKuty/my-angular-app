import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InvDetailApproveComponent } from './inv-detail-approve.component';

describe('InvDetailApproveComponent', () => {
  let component: InvDetailApproveComponent;
  let fixture: ComponentFixture<InvDetailApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InvDetailApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InvDetailApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
