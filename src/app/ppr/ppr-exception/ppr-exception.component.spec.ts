import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PprExceptionComponent } from './ppr-exception.component';

describe('PprExceptionComponent', () => {
  let component: PprExceptionComponent;
  let fixture: ComponentFixture<PprExceptionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PprExceptionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PprExceptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
