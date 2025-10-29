import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CullingProcessedSummaryComponent } from './culling-processed-summary.component';

describe('CullingProcessedSummaryComponent', () => {
  let component: CullingProcessedSummaryComponent;
  let fixture: ComponentFixture<CullingProcessedSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CullingProcessedSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CullingProcessedSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
