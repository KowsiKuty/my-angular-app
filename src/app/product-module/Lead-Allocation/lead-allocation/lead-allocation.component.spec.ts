import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadAllocationComponent } from './lead-allocation.component';

describe('LeadAllocationComponent', () => {
  let component: LeadAllocationComponent;
  let fixture: ComponentFixture<LeadAllocationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadAllocationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadAllocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
