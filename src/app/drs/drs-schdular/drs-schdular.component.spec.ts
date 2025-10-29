import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DrsSchdularComponent } from './drs-schdular.component';

describe('DrsSchdularComponent', () => {
  let component: DrsSchdularComponent;
  let fixture: ComponentFixture<DrsSchdularComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DrsSchdularComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DrsSchdularComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
