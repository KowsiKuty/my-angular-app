import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReturnrequestComponent } from './returnrequest.component';

describe('ReturnrequestComponent', () => {
  let component: ReturnrequestComponent;
  let fixture: ComponentFixture<ReturnrequestComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReturnrequestComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReturnrequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
