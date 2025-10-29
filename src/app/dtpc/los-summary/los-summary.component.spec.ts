import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LosSummaryComponent } from './los-summary.component';

describe('LosSummaryComponent', () => {
  let component: LosSummaryComponent;
  let fixture: ComponentFixture<LosSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LosSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LosSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
