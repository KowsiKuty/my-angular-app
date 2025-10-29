import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadreportComponent } from './leadreport.component';

describe('LeadreportComponent', () => {
  let component: LeadreportComponent;
  let fixture: ComponentFixture<LeadreportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LeadreportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
