import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionReportScreenViewComponent } from './provision-report-screen-view.component';

describe('ProvisionReportScreenViewComponent', () => {
  let component: ProvisionReportScreenViewComponent;
  let fixture: ComponentFixture<ProvisionReportScreenViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvisionReportScreenViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisionReportScreenViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
