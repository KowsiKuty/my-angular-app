import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiseIdentificationSummaryComponent } from './premise-identification-summary.component';

describe('PremiseIdentificationSummaryComponent', () => {
  let component: PremiseIdentificationSummaryComponent;
  let fixture: ComponentFixture<PremiseIdentificationSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiseIdentificationSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiseIdentificationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
