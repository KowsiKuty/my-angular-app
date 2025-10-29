import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VowSummaryComponent } from './vow-summary.component';

describe('VowSummaryComponent', () => {
  let component: VowSummaryComponent;
  let fixture: ComponentFixture<VowSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VowSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VowSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
