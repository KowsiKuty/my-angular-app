import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DssExceptionComponent } from './dss-exception.component';

describe('DssExceptionComponent', () => {
  let component: DssExceptionComponent;
  let fixture: ComponentFixture<DssExceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DssExceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DssExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
