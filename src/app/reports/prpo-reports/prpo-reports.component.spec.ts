import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PrpoReportsComponent } from './prpo-reports.component';

describe('PrpoReportsComponent', () => {
  let component: PrpoReportsComponent;
  let fixture: ComponentFixture<PrpoReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PrpoReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PrpoReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
