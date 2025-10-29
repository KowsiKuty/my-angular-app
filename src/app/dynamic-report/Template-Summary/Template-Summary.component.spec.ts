import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateSummaryComponent } from './Template-Summary.component';

describe('TemplateSummaryComponent', () => {
  let component: TemplateSummaryComponent;
  let fixture: ComponentFixture<TemplateSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(v);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
