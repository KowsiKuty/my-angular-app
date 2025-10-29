import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DefineRuleEngineComponent } from './define-rule-engine.component';

describe('DefineRuleEngineComponent', () => {
  let component: DefineRuleEngineComponent;
  let fixture: ComponentFixture<DefineRuleEngineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DefineRuleEngineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefineRuleEngineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
