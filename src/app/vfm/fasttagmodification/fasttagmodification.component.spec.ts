import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FasttagmodificationComponent } from './fasttagmodification.component';

describe('FasttagmodificationComponent', () => {
  let component: FasttagmodificationComponent;
  let fixture: ComponentFixture<FasttagmodificationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FasttagmodificationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FasttagmodificationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
