import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RetrievalAdminSummaryComponent } from './retrieval-admin-summary.component';

describe('RetrievalAdminSummaryComponent', () => {
  let component: RetrievalAdminSummaryComponent;
  let fixture: ComponentFixture<RetrievalAdminSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RetrievalAdminSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RetrievalAdminSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
