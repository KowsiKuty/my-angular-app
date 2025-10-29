import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TBGlReportComponent } from './tb-gl-report.component';

describe('TBGlReportComponent', () => {
  let component: TBGlReportComponent;
  let fixture: ComponentFixture<TBGlReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TBGlReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TBGlReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
