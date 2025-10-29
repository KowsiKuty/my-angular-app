import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FleetcheckerSummaryComponent } from './fleetchecker-summary.component';

describe('FleetcheckerSummaryComponent', () => {
  let component: FleetcheckerSummaryComponent;
  let fixture: ComponentFixture<FleetcheckerSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FleetcheckerSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FleetcheckerSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
