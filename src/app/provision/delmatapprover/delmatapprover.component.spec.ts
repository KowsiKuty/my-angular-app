import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DelmatapproverComponent } from './delmatapprover.component';

describe('DelmatapproverComponent', () => {
  let component: DelmatapproverComponent;
  let fixture: ComponentFixture<DelmatapproverComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DelmatapproverComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DelmatapproverComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
