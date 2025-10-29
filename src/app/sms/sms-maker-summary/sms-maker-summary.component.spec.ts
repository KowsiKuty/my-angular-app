import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SmsMakerSummaryComponent } from './sms-maker-summary.component';

describe('SmsMakerSummaryComponent', () => {
  let component: SmsMakerSummaryComponent;
  let fixture: ComponentFixture<SmsMakerSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SmsMakerSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SmsMakerSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
