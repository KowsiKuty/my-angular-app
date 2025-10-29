import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoaReportComponent } from './roa-report.component';

describe('RoaReportComponent', () => {
  let component: RoaReportComponent;
  let fixture: ComponentFixture<RoaReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RoaReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RoaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
