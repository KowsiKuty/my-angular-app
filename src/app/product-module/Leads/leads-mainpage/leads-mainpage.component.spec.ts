import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadsMainpageComponent } from './leads-mainpage.component';

describe('LeadsMainpageComponent', () => {
  let component: LeadsMainpageComponent;
  let fixture: ComponentFixture<LeadsMainpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadsMainpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadsMainpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
