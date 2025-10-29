import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DssActiveComponent } from './dss-active.component';

describe('DssActiveComponent', () => {
  let component: DssActiveComponent;
  let fixture: ComponentFixture<DssActiveComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DssActiveComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DssActiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
