import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LegitimateComponent } from './legitimate.component';

describe('LegitimateComponent', () => {
  let component: LegitimateComponent;
  let fixture: ComponentFixture<LegitimateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LegitimateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LegitimateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
