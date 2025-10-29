import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsDashboardComponent } from './leads-dashboard.component';

describe('LeadsDashboardComponent', () => {
  let component: LeadsDashboardComponent;
  let fixture: ComponentFixture<LeadsDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadsDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
