import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalNoticeFormComponent } from './legal-notice-form.component';

describe('LegalNoticeFormComponent', () => {
  let component: LegalNoticeFormComponent;
  let fixture: ComponentFixture<LegalNoticeFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegalNoticeFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalNoticeFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
