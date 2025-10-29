import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulesummaryComponent } from './rulesummary.component';

describe('RulesummaryComponent', () => {
  let component: RulesummaryComponent;
  let fixture: ComponentFixture<RulesummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulesummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulesummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
