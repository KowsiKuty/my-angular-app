import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadslandingpageComponent } from './leadslandingpage.component';

describe('LeadslandingpageComponent', () => {
  let component: LeadslandingpageComponent;
  let fixture: ComponentFixture<LeadslandingpageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadslandingpageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadslandingpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
