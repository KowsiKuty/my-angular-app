import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FrsDocumentComponent } from './frs-document.component';

describe('FrsDocumentComponent', () => {
  let component: FrsDocumentComponent;
  let fixture: ComponentFixture<FrsDocumentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FrsDocumentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FrsDocumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
