import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CbdaReportComponent } from './cbda-report.component';

describe('CbdaReportComponent', () => {
  let component: CbdaReportComponent;
  let fixture: ComponentFixture<CbdaReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CbdaReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CbdaReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
