import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VfmSummaryComponent } from './vfm-summary.component';

describe('VfmSummaryComponent', () => {
  let component: VfmSummaryComponent;
  let fixture: ComponentFixture<VfmSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VfmSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VfmSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
