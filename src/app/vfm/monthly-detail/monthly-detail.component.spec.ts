import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MonthlyDetailComponent } from './monthly-detail.component';

describe('MonthlyDetailComponent', () => {
  let component: MonthlyDetailComponent;
  let fixture: ComponentFixture<MonthlyDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MonthlyDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MonthlyDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
