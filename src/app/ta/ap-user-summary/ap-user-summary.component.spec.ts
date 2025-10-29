import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ApUserSummaryComponent } from './ap-user-summary.component';

describe('ApUserSummaryComponent', () => {
  let component: ApUserSummaryComponent;
  let fixture: ComponentFixture<ApUserSummaryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ApUserSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ApUserSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
