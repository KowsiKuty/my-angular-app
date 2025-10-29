import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VertReportComponent } from './vert-report.component';

describe('VertReportComponent', () => {
  let component: VertReportComponent;
  let fixture: ComponentFixture<VertReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VertReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VertReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
