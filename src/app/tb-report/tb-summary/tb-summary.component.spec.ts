import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TBSummaryComponent } from './tb-summary.component';

describe('TBSummaryComponent', () => {
  let component: TBSummaryComponent;
  let fixture: ComponentFixture<TBSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TBSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TBSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
