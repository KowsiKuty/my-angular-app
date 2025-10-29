import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PremiseDocumentInfoComponent } from './premise-document-info.component';

describe('PremiseDocumentInfoComponent', () => {
  let component: PremiseDocumentInfoComponent;
  let fixture: ComponentFixture<PremiseDocumentInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PremiseDocumentInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PremiseDocumentInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
