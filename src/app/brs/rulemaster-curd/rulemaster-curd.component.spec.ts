import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RulemasterCurdComponent } from './rulemaster-curd.component';

describe('RulemasterCurdComponent', () => {
  let component: RulemasterCurdComponent;
  let fixture: ComponentFixture<RulemasterCurdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RulemasterCurdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RulemasterCurdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
