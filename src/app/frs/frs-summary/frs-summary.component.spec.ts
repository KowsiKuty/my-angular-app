import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrsSummaryComponent } from './frs-summary.component';

describe('FrsSummaryComponent', () => {
  let component: FrsSummaryComponent;
  let fixture: ComponentFixture<FrsSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrsSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrsSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
