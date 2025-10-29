import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrsSummaryTemplateComponent } from './drs-summary-template.component';

describe('DrsSummaryTemplateComponent', () => {
  let component: DrsSummaryTemplateComponent;
  let fixture: ComponentFixture<DrsSummaryTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrsSummaryTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrsSummaryTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
