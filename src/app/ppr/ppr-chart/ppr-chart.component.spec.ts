import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PprChartComponent } from './ppr-chart.component';

describe('PprChartComponent', () => {
  let component: PprChartComponent;
  let fixture: ComponentFixture<PprChartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PprChartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PprChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
