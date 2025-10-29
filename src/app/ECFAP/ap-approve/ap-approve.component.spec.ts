import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApApproveComponent } from './ap-approve.component';

describe('ApApproveComponent', () => {
  let component: ApApproveComponent;
  let fixture: ComponentFixture<ApApproveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApApproveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApApproveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
