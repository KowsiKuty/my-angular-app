import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcadashboardreportComponent } from './pcadashboardreport.component';

describe('PcadashboardreportComponent', () => {
  let component: PcadashboardreportComponent;
  let fixture: ComponentFixture<PcadashboardreportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcadashboardreportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcadashboardreportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
