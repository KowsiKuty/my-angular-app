import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlydetailmodificationComponent } from './monthlydetailmodification.component';

describe('MonthlydetailmodificationComponent', () => {
  let component: MonthlydetailmodificationComponent;
  let fixture: ComponentFixture<MonthlydetailmodificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlydetailmodificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlydetailmodificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
