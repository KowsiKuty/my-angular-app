import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrievalSummaryComponent } from './retrieval-summary.component';

describe('RetrievalSummaryComponent', () => {
  let component: RetrievalSummaryComponent;
  let fixture: ComponentFixture<RetrievalSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetrievalSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrievalSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
