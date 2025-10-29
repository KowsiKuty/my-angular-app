import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ElecQuerySummaryComponent } from './elec-query-summary.component';

describe('ElecQuerySummaryComponent', () => {
  let component: ElecQuerySummaryComponent;
  let fixture: ComponentFixture<ElecQuerySummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ElecQuerySummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ElecQuerySummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
