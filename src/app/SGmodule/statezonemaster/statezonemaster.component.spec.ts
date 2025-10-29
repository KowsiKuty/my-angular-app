import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatezonemasterComponent } from './statezonemaster.component';

describe('StatezonemasterComponent', () => {
  let component: StatezonemasterComponent;
  let fixture: ComponentFixture<StatezonemasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StatezonemasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatezonemasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
