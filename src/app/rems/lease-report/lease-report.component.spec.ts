import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeaseReportComponent } from './lease-report.component';

describe('LeaseReportComponent', () => {
  let component: LeaseReportComponent;
  let fixture: ComponentFixture<LeaseReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeaseReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeaseReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
