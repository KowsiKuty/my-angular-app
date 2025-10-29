import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BrsUnmatchedComponent } from './brs-unmatched.component';

describe('BrsUnmatchedComponent', () => {
  let component: BrsUnmatchedComponent;
  let fixture: ComponentFixture<BrsUnmatchedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BrsUnmatchedComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BrsUnmatchedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
