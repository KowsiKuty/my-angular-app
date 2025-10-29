import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProvisionReportComponent } from './provision-report.component';

describe('ProvisionReportComponent', () => {
  let component: ProvisionReportComponent;
  let fixture: ComponentFixture<ProvisionReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProvisionReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProvisionReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
