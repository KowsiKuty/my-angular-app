import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FaReportsComponent } from './fa-reports.component';

describe('FaReportsComponent', () => {
  let component: FaReportsComponent;
  let fixture: ComponentFixture<FaReportsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FaReportsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FaReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
