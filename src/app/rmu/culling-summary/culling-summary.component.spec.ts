import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CullingSummaryComponent } from './culling-summary.component';

describe('CullingSummaryComponent', () => {
  let component: CullingSummaryComponent;
  let fixture: ComponentFixture<CullingSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CullingSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CullingSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
